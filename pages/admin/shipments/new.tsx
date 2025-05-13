import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ClientOnlyAdmin from '../../../components/ClientOnlyAdmin';
import supabase from '../../../lib/supabaseInstance';
import { useAuth } from '../../../contexts/AuthContext';
import Link from 'next/link';

// Define an interface for the stage
interface ShipmentStage {
  id: string;
  name: string;
  order_number: number;
}

export default function NewShipment() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  
  // Predefined stages as a constant
  const SHIPMENT_STAGES = [
    'Product Insurance Completed',
    'Supplier Payment Processed',
    'Awaiting Packaging Approval from Customer',
    'Pickup Completed at Origin',
    'In Transit to India',
    'Pending Customer Clearance',
    'Customs Clearance Completed',
    'Dispatched to Befach Warehouse',
    'Dispatched to Customer Warehouse'
  ];

  const [formData, setFormData] = useState({
    tracking_id: '',
    origin_city: '',
    origin_country: '',
    destination_city: '',
    destination_country: '',
    current_city: '',
    current_country: '',
    status: 'Product Insurance Completed', // Use 'status' instead of 'shipment_status'
    transport_mode: 'Air',
    estimated_delivery: '',
    package_count: 1,
    package_type: '',
    weight: '',
    dimensions: '',
    declared_value: '',
    contents: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Test database connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log("Testing database connection...");
        const { data, error } = await supabase
          .from('shipments')
          .select('*')
          .limit(1);
        
        if (error) {
          console.error("Database test error:", error);
        } else {
          console.log("Database connection successful:", data);
        }
      } catch (err) {
        console.error("Database connection test failed:", err);
      }
    };
    
    testConnection();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update the form data
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If transport mode changes, update the estimated delivery date
    if (name === 'transport_mode') {
      recalculateETA(value);
    }
  };

  const recalculateETA = (transportMode) => {
    const today = new Date();
    let estimatedDelivery = new Date(today);
    
    if (transportMode.toLowerCase().includes('air')) {
      // Add 15 days for air transport
      estimatedDelivery.setDate(today.getDate() + 15);
    } else if (transportMode.toLowerCase().includes('sea')) {
      // Add 45 days for sea transport
      estimatedDelivery.setDate(today.getDate() + 45);
    } else {
      // Default to 30 days for other transport modes
      estimatedDelivery.setDate(today.getDate() + 30);
    }
    
    setFormData(prev => ({
      ...prev,
      estimated_delivery: estimatedDelivery.toISOString().split('T')[0] // Format as YYYY-MM-DD
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Create shipment object with only the fields we know exist in the database
      interface ShipmentInsertData {
        tracking_id: string;
        origin_country: string;
        origin_city: string;
        destination_country: string;
        destination_city: string;
        current_location_country: string;
        current_location_city: string;
        status: string;
        transport_mode: string;
        estimated_delivery: string;
        package_count?: number;
        package_type?: string;
        weight?: string;
        dimensions?: string;
        declared_value?: string;
        contents?: string;
      }
      
      const shipmentToInsert: ShipmentInsertData = {
        tracking_id: formData.tracking_id,
        origin_country: formData.origin_country,
        origin_city: formData.origin_city,
        destination_country: formData.destination_country,
        destination_city: formData.destination_city,
        current_location_country: formData.current_country,
        current_location_city: formData.current_city,
        status: formData.status,
        transport_mode: formData.transport_mode,
        estimated_delivery: formData.estimated_delivery,
      };
      
      // Only add package fields if they're not empty
      // This way if the schema doesn't have these fields, we won't try to insert them
      if (formData.package_count) shipmentToInsert.package_count = formData.package_count;
      if (formData.package_type) shipmentToInsert.package_type = formData.package_type;
      if (formData.weight) shipmentToInsert.weight = formData.weight;
      if (formData.dimensions) shipmentToInsert.dimensions = formData.dimensions;
      if (formData.declared_value) shipmentToInsert.declared_value = formData.declared_value;
      if (formData.contents) shipmentToInsert.contents = formData.contents;
      
      console.log("Inserting shipment:", shipmentToInsert);

      // Insert shipment
      const { data: shipmentData, error: shipmentError } = await supabase
        .from('shipments')
        .insert([shipmentToInsert])
        .select();

      if (shipmentError) {
        console.error("Shipment creation error details:", {
          message: shipmentError.message,
          details: shipmentError.details,
          hint: shipmentError.hint,
          code: shipmentError.code
        });
        throw shipmentError;
      }

      console.log("Shipment created successfully:", shipmentData);

      // Handle file upload if a file is selected
      if (selectedFile && shipmentData && shipmentData[0]?.id) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${shipmentData[0].id}_${Math.random()}.${fileExt}`;
        const filePath = `${shipmentData[0].id}/${fileName}`;

        console.log("Uploading file:", filePath);

        const { error: uploadError } = await supabase.storage
          .from('shipment-media')
          .upload(filePath, selectedFile);

        if (uploadError) {
          console.error('File upload error:', uploadError);
        } else {
          // Insert media record
          await supabase
            .from('shipment_media')
            .insert({
              shipment_id: shipmentData[0].id,
              stage_name: formData.status,
              file_path: filePath,
              file_type: selectedFile.type
            });
        }
      }

      // Redirect to shipments list
      router.push('/admin/shipments');
    } catch (err) {
      console.error('Shipment creation error:', err);
      
      // More detailed error logging
      if (err instanceof Error) {
        console.error('Error details:', {
          message: err.message,
          name: err.name,
          stack: err.stack
        });
      }
      
      setError(err.message || 'Failed to create shipment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ClientOnlyAdmin title="Add Shipment">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Add New Shipment</h1>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="tracking_id" className="block text-sm font-medium text-gray-700">
              Tracking Number *
            </label>
            <input
              type="text"
              id="tracking_id"
              name="tracking_id"
              required
              value={formData.tracking_id}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="origin_city" className="block text-sm font-medium text-gray-700">
                Origin City *
              </label>
              <input
                type="text"
                id="origin_city"
                name="origin_city"
                required
                value={formData.origin_city}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            
            <div>
              <label htmlFor="origin_country" className="block text-sm font-medium text-gray-700">
                Origin Country *
              </label>
              <input
                type="text"
                id="origin_country"
                name="origin_country"
                required
                value={formData.origin_country}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="destination_city" className="block text-sm font-medium text-gray-700">
                Destination City *
              </label>
              <input
                type="text"
                id="destination_city"
                name="destination_city"
                required
                value={formData.destination_city}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            
            <div>
              <label htmlFor="destination_country" className="block text-sm font-medium text-gray-700">
                Destination Country *
              </label>
              <input
                type="text"
                id="destination_country"
                name="destination_country"
                required
                value={formData.destination_country}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="current_city" className="block text-sm font-medium text-gray-700">
                Current City *
              </label>
              <input
                type="text"
                id="current_city"
                name="current_city"
                required
                value={formData.current_city}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            
            <div>
              <label htmlFor="current_country" className="block text-sm font-medium text-gray-700">
                Current Country *
              </label>
              <input
                type="text"
                id="current_country"
                name="current_country"
                required
                value={formData.current_country}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Current Stage *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              required
            >
              <option value="">Select a stage</option>
              {SHIPMENT_STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="transport_mode" className="block text-gray-700 font-medium mb-2">
                Transport Mode*
              </label>
              <select
                id="transport_mode"
                name="transport_mode"
                value={formData.transport_mode}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select transport mode</option>
                <option value="Air Freight">Air Freight</option>
                <option value="Sea Freight">Sea Freight</option>
                <option value="Road Freight">Road Freight</option>
                <option value="Rail Freight">Rail Freight</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="estimated_delivery" className="block text-gray-700 font-medium mb-2">
                Estimated Delivery Date
              </label>
              <input
                type="date"
                id="estimated_delivery"
                name="estimated_delivery"
                value={formData.estimated_delivery || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.transport_mode.toLowerCase().includes('air') ? '15 days from today (Air)' : 
                 formData.transport_mode.toLowerCase().includes('sea') ? '45 days from today (Sea)' : 
                 formData.transport_mode ? '30 days from today (Default)' : 'Select a transport mode'}
              </p>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-6">
            <h3 className="text-lg font-medium mb-3">Package Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="package_count" className="block text-gray-700 font-medium mb-2">
                  Package Count
                </label>
                <input
                  type="number"
                  id="package_count"
                  name="package_count"
                  min="1"
                  value={formData.package_count || 1}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="package_type" className="block text-gray-700 font-medium mb-2">
                  Package Type
                </label>
                <select
                  id="package_type"
                  name="package_type"
                  value={formData.package_type || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select package type</option>
                  <option value="Box">Box</option>
                  <option value="Pallet">Pallet</option>
                  <option value="Crate">Crate</option>
                  <option value="Container">Container</option>
                  <option value="Envelope">Envelope</option>
                  <option value="Tube">Tube</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label htmlFor="weight" className="block text-gray-700 font-medium mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  step="0.01"
                  min="0"
                  value={formData.weight || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="dimensions" className="block text-gray-700 font-medium mb-2">
                  Dimensions (L×W×H cm)
                </label>
                <input
                  type="text"
                  id="dimensions"
                  name="dimensions"
                  placeholder="e.g. 30×20×15"
                  value={formData.dimensions || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="declared_value" className="block text-gray-700 font-medium mb-2">
                  Declared Value (USD)
                </label>
                <input
                  type="number"
                  id="declared_value"
                  name="declared_value"
                  step="0.01"
                  min="0"
                  value={formData.declared_value || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="contents" className="block text-gray-700 font-medium mb-2">
                Package Contents
              </label>
              <textarea
                id="contents"
                name="contents"
                rows={3}
                value={formData.contents || ''}
                onChange={handleChange}
                placeholder="Describe the contents of the package"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-6">
            <h3 className="text-lg font-medium mb-3">Upload Media for Shipment Stages</h3>
            <p className="text-sm text-gray-600 mb-4">
              You can upload media for each stage of the shipment. Media will only be visible when the shipment is at that specific stage.
            </p>
            
            <div className="border rounded-md p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">{formData.status} (Current Stage)</h4>
                <span className="transform transition-transform">▲</span>
              </div>
              
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Document or Image
                </label>
                <div className="flex items-center space-x-2">
                  <label className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700">
                    <span>Select Image</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          setSelectedFile(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                  <span className="text-sm text-gray-600">
                    {selectedFile ? selectedFile.name : 'No file selected'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4 cursor-pointer">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Upload Media for Other Stages</h4>
                <span className="transform transition-transform">▼</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t mt-6">
            <Link
              href="/admin/shipments"
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Shipment'}
            </button>
          </div>
        </form>
      </div>
    </ClientOnlyAdmin>
  );
} 