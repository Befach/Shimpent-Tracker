import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ClientOnlyAdmin from '../../../../components/ClientOnlyAdmin';
import { supabase } from '../../../../lib/supabase';
import { useAuth } from '../../../../contexts/AuthContext';
import Link from 'next/link';

// Define an interface for the stage
interface ShipmentStage {
  id: string;
  name: string;
  order_number: number;
}

export default function EditShipment() {
  const router = useRouter();
  const { id } = router.query;
  const { user, isAdmin } = useAuth();
  
  // Predefined stages as a constant
const SHIPMENT_STAGES = [
  'Product Insurance',
  'Supplier Payment',
  'Packaging Approval from Customer',
  'Pickup at Origin',
  'In Transit to India',
  'Customs Clearance',
  'Dispatch to Befach Warehouse',
  'Dispatch to Customer Warehouse'
];

  const [formData, setFormData] = useState({
    tracking_id: '',
    origin_country: '',
    origin_city: '',
    destination_country: '',
    destination_city: '',
    current_city: '',
    current_country: '',
    status: '',
    transport_mode: '',
    estimated_delivery: '',
    package_count: 1,
    package_type: '',
    weight: '',
    dimensions: '',
    contents: '',
    pickup_dispatched_through: '',
    transit_dispatched_through: '',
    customer_dispatched_through: '',
    hs_code: '',
    shipment_name: '',
    customer_delivery_address: '',
    shipment_notes: '',
    shipper_name: '',
    shipper_address: '',
    buyer_name: '',
    buyer_address: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<{[key: string]: string}>({});
  const [existingFiles, setExistingFiles] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchShipment();
      fetchExistingFiles();
    }
  }, [id]);

  const fetchShipment = async () => {
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

        setFormData({
          tracking_id: data.tracking_id || '',
          origin_city: data.origin_city || '',
        origin_country: data.origin_country || '',
          destination_city: data.destination_city || '',
        destination_country: data.destination_country || '',
        current_city: data.current_location_city || '',
        current_country: data.current_location_country || '',
        status: data.status || 'Product Insurance',
        transport_mode: data.transport_mode || 'Air',
          estimated_delivery: data.estimated_delivery || '',
          package_count: data.package_count || 1,
          package_type: data.package_type || '',
          weight: data.weight || '',
          dimensions: data.dimensions || '',
          contents: data.contents || '',
        pickup_dispatched_through: data.pickup_dispatched_through || '',
        transit_dispatched_through: data.transit_dispatched_through || '',
        customer_dispatched_through: data.customer_dispatched_through || '',
        hs_code: data.hs_code || '',
        shipment_name: data.shipment_name || '',
        customer_delivery_address: data.customer_delivery_address || '',
        shipment_notes: data.shipment_notes || '',
        shipper_name: data.shipper_name || '',
        shipper_address: data.shipper_address || '',
        buyer_name: data.buyer_name || '',
        buyer_address: data.buyer_address || '',
      });
    } catch (error) {
      console.error('Error fetching shipment:', error);
      setError('Failed to load shipment data');
    }
  };

  const fetchExistingFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('shipment_documents')
        .select('*')
        .eq('shipment_id', id);

      if (error) throw error;
      setExistingFiles(data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const removeExistingFile = async (fileId: string, filePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('shipment_files')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('shipment_documents')
        .delete()
        .eq('id', fileId);

      if (dbError) throw dbError;

      // Update file list
      setExistingFiles(prev => prev.filter(file => file.id !== fileId));
      setSuccess('File removed successfully');
    } catch (error) {
      console.error('Error removing file:', error);
      setError('Failed to remove file');
    }
  };

  // Function to create preview URLs for files
  const createFilePreview = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setFilePreviews(prev => ({
      ...prev,
      [file.name]: previewUrl
    }));
  };

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      Object.values(filePreviews).forEach(url => URL.revokeObjectURL(url));
    };
  }, [filePreviews]);

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

  // Update file selection handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
      // Create previews for new files
      newFiles.forEach(file => createFilePreview(file));
    }
  };

  // Function to remove a file
  const removeFile = (fileName: string) => {
    setSelectedFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
    // Cleanup preview URL
    if (filePreviews[fileName]) {
      URL.revokeObjectURL(filePreviews[fileName]);
      setFilePreviews(prev => {
        const newPreviews = { ...prev };
        delete newPreviews[fileName];
        return newPreviews;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Prepare update data with proper type handling
      const updateData = {
        tracking_id: formData.tracking_id,
        origin_country: formData.origin_country,
        origin_city: formData.origin_city,
        destination_country: formData.destination_country,
        destination_city: formData.destination_city,
        current_location_country: formData.current_country,
        current_location_city: formData.current_city,
        status: formData.status,
        transport_mode: formData.transport_mode,
        estimated_delivery: formData.estimated_delivery || null,
        package_count: formData.package_count ? parseInt(formData.package_count) : 1,
        package_type: formData.package_type || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        dimensions: formData.dimensions || null,
        contents: formData.contents || null,
        pickup_dispatched_through: formData.pickup_dispatched_through || null,
        transit_dispatched_through: formData.transit_dispatched_through || null,
        customer_dispatched_through: formData.customer_dispatched_through || null,
        hs_code: formData.hs_code || null,
        shipment_name: formData.shipment_name || null,
        customer_delivery_address: formData.customer_delivery_address || null,
        shipment_notes: formData.shipment_notes || null,
        shipper_name: formData.shipper_name || null,
        shipper_address: formData.shipper_address || null,
        buyer_name: formData.buyer_name || null,
        buyer_address: formData.buyer_address || null,
      };

      const { error } = await supabase
        .from('shipments')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;

      // Handle file upload if files are selected
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          try {
      const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `shipment_documents/${id}/${fileName}`;

            console.log('Uploading file:', {
              fileName,
              filePath,
              fileType: file.type,
              fileSize: file.size
            });

            // Upload to storage
            const { error: uploadError } = await supabase.storage
              .from('shipment_files')
              .upload(filePath, file);
      
      if (uploadError) {
              console.error('Storage upload error:', uploadError);
              continue;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
              .from('shipment_files')
        .getPublicUrl(filePath);
      
            // Save to database
      const { error: dbError } = await supabase
        .from('shipment_documents')
        .insert({
          shipment_id: id,
                file_path: filePath,
          file_type: file.type,
                file_name: file.name,
          file_size: file.size,
                stage_name: formData.status,
          public_url: publicUrl
        });
      
      if (dbError) {
        console.error('Database error:', dbError);
              // Try to delete the uploaded file
              await supabase.storage
                .from('shipment_files')
        .remove([filePath]);
            }
          } catch (err) {
            console.error('Error processing file:', err);
          }
        }
      }

      // Refresh files list
      await fetchExistingFiles();
      
      // Show success message
      setSuccess('Shipment updated successfully');
      
      // Clear selected files
      setSelectedFiles([]);
      setFilePreviews({});

      // Redirect to shipments page after a short delay
      setTimeout(() => {
        router.push('/admin/shipments');
      }, 1500);
    } catch (err) {
      console.error('Shipment update error:', err);
      setError(err.message || 'Failed to update shipment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ClientOnlyAdmin title="Edit Shipment">
      <div className="space-y-6">
            <h1 className="text-2xl font-bold">Edit Shipment</h1>
          
          {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
              <p>{error}</p>
            </div>
          )}
          
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
            <p>{success}</p>
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
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-gray-100 cursor-not-allowed"
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
            <h3 className="text-lg font-medium mb-3">Shipment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                <label htmlFor="pickup_dispatched_through" className="block text-gray-700 font-medium mb-2">
                  Pickup Dispatched Through
                  </label>
                  <input
                    type="text"
                  id="pickup_dispatched_through"
                  name="pickup_dispatched_through"
                  value={formData.pickup_dispatched_through || ''}
                    onChange={handleChange}
                  placeholder="e.g. Blue Dart, FedEx, DHL"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                <label htmlFor="transit_dispatched_through" className="block text-gray-700 font-medium mb-2">
                  Transit Dispatched Through
                  </label>
                  <input
                    type="text"
                  id="transit_dispatched_through"
                  name="transit_dispatched_through"
                  value={formData.transit_dispatched_through || ''}
                    onChange={handleChange}
                  placeholder="e.g. Blue Dart, FedEx, DHL"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                <label htmlFor="customer_dispatched_through" className="block text-gray-700 font-medium mb-2">
                  Customer Warehouse Dispatched Through
                  </label>
                  <input
                    type="text"
                  id="customer_dispatched_through"
                  name="customer_dispatched_through"
                  value={formData.customer_dispatched_through || ''}
                    onChange={handleChange}
                  placeholder="e.g. Blue Dart, FedEx, DHL"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
            </div>
                
            {isAdmin && (
              <div className="mb-6">
                <label htmlFor="shipment_name" className="block text-gray-700 font-medium mb-2">
                  Shipment Name (Admin Only)
                  </label>
                  <input
                    type="text"
                  id="shipment_name"
                  name="shipment_name"
                  value={formData.shipment_name || ''}
                    onChange={handleChange}
                  placeholder="Enter shipment name"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
            )}

            <div className="mb-6">
              <label htmlFor="customer_delivery_address" className="block text-gray-700 font-medium mb-2">
                Customer Delivery Address
              </label>
              <textarea
                id="customer_delivery_address"
                name="customer_delivery_address"
                rows={3}
                value={formData.customer_delivery_address || ''}
                onChange={handleChange}
                placeholder="Enter customer delivery address"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div className="mb-6">
              <label htmlFor="shipment_notes" className="block text-gray-700 font-medium mb-2">
                Shipment Notes
              </label>
              <textarea
                id="shipment_notes"
                name="shipment_notes"
                rows={3}
                value={formData.shipment_notes || ''}
                onChange={handleChange}
                placeholder="Enter any delay information or other notes"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-6">
            <h3 className="text-lg font-medium mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                <label htmlFor="shipper_name" className="block text-gray-700 font-medium mb-2">
                  Shipper Name
                  </label>
                  <input
                    type="text"
                  id="shipper_name"
                  name="shipper_name"
                  value={formData.shipper_name || ''}
                    onChange={handleChange}
                  placeholder="Enter shipper name"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                <label htmlFor="shipper_address" className="block text-gray-700 font-medium mb-2">
                  Shipper Address
                  </label>
                <textarea
                  id="shipper_address"
                  name="shipper_address"
                  rows={3}
                  value={formData.shipper_address || ''}
                    onChange={handleChange}
                  placeholder="Enter shipper address"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
                </div>
                
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                <label htmlFor="buyer_name" className="block text-gray-700 font-medium mb-2">
                  Buyer Name
                  </label>
                  <input
                    type="text"
                  id="buyer_name"
                  name="buyer_name"
                  value={formData.buyer_name || ''}
                    onChange={handleChange}
                  placeholder="Enter buyer name"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                <label htmlFor="buyer_address" className="block text-gray-700 font-medium mb-2">
                  Buyer Address
                  </label>
                <textarea
                  id="buyer_address"
                  name="buyer_address"
                  rows={3}
                  value={formData.buyer_address || ''}
                  onChange={handleChange}
                  placeholder="Enter buyer address"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                </div>
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
            <h3 className="text-lg font-medium mb-3">Shipment Files</h3>
            
            {/* Existing Files */}
            {existingFiles.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Existing Files:</h4>
                <ul className="space-y-2">
                  {existingFiles.map((file) => (
                    <li key={file.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{file.file_name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.file_size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <a
                          href={file.public_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View
                        </a>
              <button
                          onClick={() => removeExistingFile(file.id, file.file_path)}
                          className="text-red-600 hover:text-red-800 text-sm"
              >
                          Remove
              </button>
            </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Upload New Files */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Upload New Files:</h4>
              <div className="flex items-center space-x-2">
                <label className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700">
                  <span>Select Files</span>
                            <input 
                              type="file" 
                              className="hidden" 
                    multiple
                    onChange={handleFileSelect}
                            />
                          </label>
                <span className="text-sm text-gray-600">
                  {selectedFiles.length > 0 
                    ? `${selectedFiles.length} file(s) selected` 
                    : 'No files selected'}
                          </span>
                      </div>
                      
              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h5>
                  <ul className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                  </span>
                                </div>
                        <div className="flex items-center space-x-2">
                          {file.type.startsWith('image/') ? (
                                  <a 
                              href={filePreviews[file.name]}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              View
                            </a>
                          ) : (
                            <a
                              href={filePreviews[file.name]}
                              download={file.name}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Download
                            </a>
                          )}
                            <button
                            onClick={() => removeFile(file.name)}
                            className="text-red-600 hover:text-red-800 text-sm"
                            >
                            Remove
                            </button>
                          </div>
                      </li>
                    ))}
                  </ul>
                      </div>
              )}
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
              {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
          </form>
      </div>
    </ClientOnlyAdmin>
  );
} 