import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ClientOnlyAdmin from '../../../../components/ClientOnlyAdmin';
import supabase from '../../../../lib/supabaseInstance';
import Link from 'next/link';
import { FaUpload, FaTrash, FaEye, FaFileAlt } from 'react-icons/fa';
import DocumentUpload from '../../../../components/DocumentUpload';

// Define the stages
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

// Add these document types
const DOCUMENT_TYPES = [
  { id: 'commercial_invoice', name: 'Commercial Invoice', required: true },
  { id: 'bill_of_lading', name: 'Bill of Lading', required: true },
  { id: 'packing_list', name: 'Packing List', required: true },
  { id: 'other_documents', name: 'Other Documents', required: false }
];

export default function EditShipment() {
  const router = useRouter();
  const { id } = router.query;
  
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formData, setFormData] = useState({
    tracking_id: '',
    origin_country: '',
    origin_city: '',
    destination_country: '',
    destination_city: '',
    current_location_country: '',
    current_location_city: '',
    transport_mode: '',
    status: '',
    estimated_delivery: '',
    package_count: 1,
    package_type: '',
    weight: '',
    dimensions: '',
    declared_value: '',
    contents: '',
  });
  const [error, setError] = useState('');
  
  // Media related states
  const [stageMedia, setStageMedia] = useState({});
  const [uploadingStage, setUploadingStage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showMediaSection, setShowMediaSection] = useState(false);

  // Add to state declarations
  const [documents, setDocuments] = useState([]);
  const [uploadingDoc, setUploadingDoc] = useState('');

  useEffect(() => {
    if (id) {
      fetchShipment();
      fetchMedia();
      fetchDocuments();
    }
  }, [id]);

  const fetchShipment = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setFormData({
          tracking_id: data.tracking_id || '',
          origin_country: data.origin_country || '',
          origin_city: data.origin_city || '',
          destination_country: data.destination_country || '',
          destination_city: data.destination_city || '',
          current_location_country: data.current_location_country || '',
          current_location_city: data.current_location_city || '',
          transport_mode: data.transport_mode || '',
          status: data.status || '',
          estimated_delivery: data.estimated_delivery || '',
          package_count: data.package_count || 1,
          package_type: data.package_type || '',
          weight: data.weight || '',
          dimensions: data.dimensions || '',
          declared_value: data.declared_value || '',
          contents: data.contents || '',
        });
      }
    } catch (error) {
      console.error('Error fetching shipment:', error);
      setError('Failed to load shipment data');
    } finally {
      setLoading(false);
    }
  };

  const fetchMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('shipment_media')
        .select('*')
        .eq('shipment_id', id);

      if (error) throw error;
      
      // Organize media by stage
      const mediaByStage = {};
      data.forEach(item => {
        if (!mediaByStage[item.stage]) {
          mediaByStage[item.stage] = [];
        }
        mediaByStage[item.stage].push(item);
      });
      
      setStageMedia(mediaByStage);
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('shipment_documents')
        .select('*')
        .eq('shipment_id', id);

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'transport_mode') {
      recalculateETA();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setError('');
    
    try {
      // Create update object with only the fields we know exist
      interface ShipmentUpdateData {
        tracking_id: string;
        origin_country: string;
        origin_city: string;
        destination_country: string;
        destination_city: string;
        current_location_country: string;
        current_location_city: string;
        transport_mode: string;
        status: string;
        estimated_delivery: string;
        updated_at: Date;
        package_count?: number;
        package_type?: string;
        weight?: string;
        dimensions?: string;
        declared_value?: string;
        contents?: string;
      }
      
      const updateData: ShipmentUpdateData = {
        tracking_id: formData.tracking_id,
        origin_country: formData.origin_country,
        origin_city: formData.origin_city,
        destination_country: formData.destination_country,
        destination_city: formData.destination_city,
        current_location_country: formData.current_location_country,
        current_location_city: formData.current_location_city,
        transport_mode: formData.transport_mode,
        status: formData.status,
        estimated_delivery: formData.estimated_delivery,
        updated_at: new Date()
      };
      
      // Only add package fields if they're not empty
      if (formData.package_count) updateData.package_count = formData.package_count;
      if (formData.package_type) updateData.package_type = formData.package_type;
      if (formData.weight) updateData.weight = formData.weight;
      if (formData.dimensions) updateData.dimensions = formData.dimensions;
      if (formData.declared_value) updateData.declared_value = formData.declared_value;
      if (formData.contents) updateData.contents = formData.contents;
      
      const { error } = await supabase
        .from('shipments')
        .update(updateData)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      router.push('/admin/shipments');
    } catch (error) {
      console.error('Error updating shipment:', error);
      setError('Failed to update shipment');
    } finally {
      setSaveLoading(false);
    }
  };

  // Handle file upload for a specific stage
  const handleFileChange = async (e, stage) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setUploadingStage(stage);
      setUploadProgress(0);
      
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `shipments/${id}/${stage}/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('shipment-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      // Set upload to 100% after upload completion
      setUploadProgress(100);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('shipment-media')
        .getPublicUrl(filePath);
      
      // Save media reference to database
      const { error: dbError } = await supabase
        .from('shipment_media')
        .insert({
          shipment_id: id,
          stage: stage,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          file_path: filePath,
          public_url: publicUrl
        });
      
      if (dbError) throw dbError;
      
      // Refresh media list
      fetchMedia();
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload file');
    } finally {
      setUploadingStage('');
      setUploadProgress(0);
    }
  };

  // Handle media deletion
  const handleDeleteMedia = async (mediaId, filePath) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('shipment-media')
        .remove([filePath]);
      
      if (storageError) throw storageError;
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('shipment_media')
        .delete()
        .eq('id', mediaId);
      
      if (dbError) throw dbError;
      
      // Refresh media list
      fetchMedia();
      
    } catch (error) {
      console.error('Error deleting media:', error);
      setError('Failed to delete media');
    }
  };

  // Fix for document upload
  const handleDocumentUpload = async (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setUploadingDoc(docType);
      setUploadProgress(0);
      
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `documents/${id}/${docType}/${fileName}`;
      
      // Try with a common bucket name (don't create a new one)
      const bucketName = 'shipment-document';
      
      console.log(`Attempting upload to bucket: ${bucketName}`);
      
      // Try the upload
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      // Set upload to 100% after upload
      setUploadProgress(100);
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        
        // If the error is about the bucket not existing, try with other common bucket names
        if (uploadError.message.includes('bucket') || uploadError.message.includes('not found')) {
          const alternateBuckets = ['shipment-documents', 'shipment_documents', 'documents', 'media'];
          let uploadSuccessful = false;
          let successBucket = '';
          
          for (const altBucket of alternateBuckets) {
            if (altBucket === bucketName) continue; // Skip if we already tried this bucket
            
            console.log(`Trying alternate bucket: ${altBucket}`);
            
            const { data: altUploadData, error: altUploadError } = await supabase.storage
              .from(altBucket)
              .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
              });
            
            // Set upload to 100% after successful upload
            setUploadProgress(100);
            
            if (!altUploadError) {
              console.log(`Upload successful to alternate bucket: ${altBucket}`);
              uploadSuccessful = true;
              successBucket = altBucket;
              break;
            }
          }
          
          if (!uploadSuccessful) {
            throw new Error(`Upload failed. Please contact your administrator to set up proper storage permissions.`);
          }
          
          // Use the successful bucket for the public URL
          const { data: { publicUrl } } = supabase.storage
            .from(successBucket)
            .getPublicUrl(filePath);
          
          // Save document reference to database - without bucket_name field
          const { error: dbError } = await supabase
            .from('shipment_documents')
            .insert({
              shipment_id: id,
              document_type: docType,
              file_name: file.name,
              file_type: file.type,
              file_size: file.size,
              file_path: filePath,
              public_url: publicUrl
              // Remove the bucket_name field that doesn't exist in the schema
            });
          
          if (dbError) {
            console.error('Database error:', dbError);
            throw dbError;
          }
          
          // Refresh documents list
          fetchDocuments();
          return;
        }
        
        throw uploadError;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      // Save document reference to database - without bucket_name field
      const { error: dbError } = await supabase
        .from('shipment_documents')
        .insert({
          shipment_id: id,
          document_type: docType,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          file_path: filePath,
          public_url: publicUrl
          // Remove the bucket_name field that doesn't exist in the schema
        });
      
      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }
      
      // Refresh documents list
      fetchDocuments();
      
    } catch (error) {
      console.error('Error uploading document:', error);
      alert(`Failed to upload document: ${error.message}`);
    } finally {
      setUploadingDoc('');
    }
  };

  // Update the handleDeleteDocument function - don't rely on bucket_name
  const handleDeleteDocument = async (docId, filePath) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      // Use the default bucket name
      const bucketName = 'shipment-document';
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);
      
      if (storageError) {
        console.error('Error deleting from storage:', storageError);
        // If the default bucket fails, try alternates
        const alternateBuckets = ['shipment-documents', 'shipment_documents', 'documents', 'media'];
        let deleteSuccessful = false;
        
        for (const altBucket of alternateBuckets) {
          if (altBucket === bucketName) continue;
          
          const { error: altError } = await supabase.storage
            .from(altBucket)
            .remove([filePath]);
          
          if (!altError) {
            deleteSuccessful = true;
            break;
          }
        }
        
        if (!deleteSuccessful) {
          console.warn('Could not delete file from any storage bucket');
          // Continue with database deletion even if storage deletion fails
        }
      }
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('shipment_documents')
        .delete()
        .eq('id', docId);
      
      if (dbError) throw dbError;
      
      // Refresh documents list
      fetchDocuments();
      
    } catch (error) {
      console.error('Error deleting document:', error);
      alert(`Failed to delete document: ${error.message}`);
    }
  };

  // Add a function to recalculate ETA based on transport mode
  const recalculateETA = () => {
    const today = new Date();
    let estimatedDelivery = new Date(today);
    
    if (formData.transport_mode.toLowerCase().includes('air')) {
      // Add 15 days for air transport
      estimatedDelivery.setDate(today.getDate() + 15);
    } else if (formData.transport_mode.toLowerCase().includes('sea') || formData.transport_mode.toLowerCase().includes('ship')) {
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

  // Add this function to handle status change
  const handleStatusChange = (e) => {
    const { value } = e.target;
    
    // Update the status
    setFormData(prev => ({
      ...prev,
      status: value
    }));
    
    try {
      // Show a prompt to update the current location
      const shouldUpdateLocation = confirm(
        `Would you like to update the current location for this status change to "${value}"?`
      );
      
      if (shouldUpdateLocation) {
        // You could show a modal here, but for simplicity we'll use prompts
        const city = prompt("Enter the current city:", formData.current_location_city || '');
        const country = prompt("Enter the current country:", formData.current_location_country || '');
        
        if (city && country) {
          setFormData(prev => ({
            ...prev,
            current_location_city: city,
            current_location_country: country
          }));
        }
      }
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  // Add this function to the EditShipment component
  const handleDeleteShipment = async () => {
    if (!confirm('Are you sure you want to delete this shipment? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      
      // First delete all related media
      const { error: mediaError } = await supabase
        .from('shipment_media')
        .delete()
        .eq('shipment_id', id);
        
      if (mediaError) throw mediaError;
      
      // Delete all related documents
      const { error: docsError } = await supabase
        .from('shipment_documents')
        .delete()
        .eq('shipment_id', id);
        
      if (docsError) throw docsError;
      
      // Finally delete the shipment
      const { error } = await supabase
        .from('shipments')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Redirect to shipments list
      router.push('/admin/shipments');
      
    } catch (error) {
      console.error('Error deleting shipment:', error);
      setError('Failed to delete shipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClientOnlyAdmin title="Edit Shipment">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Edit Shipment</h1>
            <Link href="/admin/shipments" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md">
              Back to Shipments
            </Link>
          </div>
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="tracking_id" className="block text-gray-700 font-medium mb-2">
                    Tracking ID
                  </label>
                  <input
                    type="text"
                    id="tracking_id"
                    name="tracking_id"
                    value={formData.tracking_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="transport_mode" className="block text-gray-700 font-medium mb-2">
                      Transport Mode
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
                    <div className="flex">
                      <input
                        type="date"
                        id="estimated_delivery"
                        name="estimated_delivery"
                        value={formData.estimated_delivery || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={recalculateETA}
                        className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-md"
                        title="Recalculate based on transport mode"
                      >
                        Reset
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.transport_mode.toLowerCase().includes('air') ? '15 days from today (Air)' : 
                       formData.transport_mode.toLowerCase().includes('sea') ? '45 days from today (Sea)' : 
                       '30 days from today (Default)'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="origin_country" className="block text-gray-700 font-medium mb-2">
                    Origin Country
                  </label>
                  <input
                    type="text"
                    id="origin_country"
                    name="origin_country"
                    value={formData.origin_country}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="origin_city" className="block text-gray-700 font-medium mb-2">
                    Origin City
                  </label>
                  <input
                    type="text"
                    id="origin_city"
                    name="origin_city"
                    value={formData.origin_city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="destination_country" className="block text-gray-700 font-medium mb-2">
                    Destination Country
                  </label>
                  <input
                    type="text"
                    id="destination_country"
                    name="destination_country"
                    value={formData.destination_country}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="destination_city" className="block text-gray-700 font-medium mb-2">
                    Destination City
                  </label>
                  <input
                    type="text"
                    id="destination_city"
                    name="destination_city"
                    value={formData.destination_city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="current_location_country" className="block text-gray-700 font-medium mb-2">
                    Current Location Country
                  </label>
                  <input
                    type="text"
                    id="current_location_country"
                    name="current_location_country"
                    value={formData.current_location_country}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="current_location_city" className="block text-gray-700 font-medium mb-2">
                    Current Location City
                  </label>
                  <input
                    type="text"
                    id="current_location_city"
                    name="current_location_city"
                    value={formData.current_location_city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-gray-700 font-medium mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleStatusChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select status</option>
                    {SHIPMENT_STAGES.map((stage, index) => (
                      <option key={index} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Package Details</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
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
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
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
            
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowMediaSection(!showMediaSection)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {showMediaSection ? 'Hide Media Upload Section' : 'Show Media Upload Section'}
              </button>
            </div>
            
            {showMediaSection && (
              <div className="p-6 border-t border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Upload Media for Shipment Stages</h2>
                <p className="text-gray-600 mb-4">
                  You can upload media for each stage of the shipment. Media will only be visible when the shipment is at that specific stage.
                </p>
                
                <div className="space-y-6">
                  {SHIPMENT_STAGES.map(stage => (
                    <div key={stage} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                      <h3 className="font-medium text-gray-800 mb-3">
                        {stage} {stage === formData.status && '(Current Stage)'}
                      </h3>
                      
                      <div className="mb-4">
                        <div className="flex items-center">
                          <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer">
                            <span className="flex items-center">
                              <FaUpload className="mr-2" /> Select File
                            </span>
                            <input 
                              type="file" 
                              className="hidden" 
                              onChange={(e) => handleFileChange(e, stage)}
                              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                            />
                          </label>
                          <span className="ml-3 text-gray-500">
                            {uploadingStage === stage 
                              ? `Uploading... ${uploadProgress}%` 
                              : 'No file selected'}
                          </span>
                        </div>
                      </div>
                      
                      {stageMedia[stage]?.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-600 mb-2">Uploaded Files</h4>
                          <div className="space-y-2">
                            {stageMedia[stage].map(media => (
                              <div key={media.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                  <span className="text-gray-800">{media.file_name}</span>
                                  <span className="ml-2 text-xs text-gray-500">
                                    ({(media.file_size / 1024).toFixed(2)} KB)
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <a 
                                    href={media.public_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 mr-3"
                                  >
                                    <FaEye />
                                  </a>
                                  <button 
                                    type="button"
                                    onClick={() => handleDeleteMedia(media.id, media.file_path)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Documents Section */}
            <div className="p-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Shipment Documents</h2>
              <div className="space-y-6">
                {DOCUMENT_TYPES.map(docType => {
                  const existingDoc = documents.find(d => d.document_type === docType.id);
                  
                  return (
                    <div key={docType.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-gray-800">
                          {docType.name}
                          {docType.required && <span className="text-red-500 ml-1">*</span>}
                        </h3>
                        {existingDoc && (
                          <div className="flex items-center">
                            <a 
                              href={existingDoc.public_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 mr-3"
                            >
                              <FaEye />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDeleteDocument(existingDoc.id, existingDoc.file_path)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {existingDoc ? (
                        <div className="flex items-center text-sm text-gray-600">
                          <FaFileAlt className="mr-2" />
                          <span>{existingDoc.file_name}</span>
                          <span className="ml-2 text-xs text-gray-500">
                            ({(existingDoc.file_size / 1024).toFixed(2)} KB)
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer">
                            <span className="flex items-center">
                              <FaUpload className="mr-2" /> Upload {docType.name}
                            </span>
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => handleDocumentUpload(e, docType.id)}
                              accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
                            />
                          </label>
                          {uploadingDoc === docType.id && (
                            <span className="ml-3 text-sm text-gray-600">
                              Uploading... {uploadProgress}%
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md mt-2">
              <h4 className="font-medium text-blue-800 mb-2">Current Location</h4>
              <p className="text-sm text-blue-700 mb-3">
                Please update the current location whenever you change the shipment status.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="current_location_city" className="block text-sm font-medium text-gray-700 mb-1">
                    Current City*
                  </label>
                  <input
                    type="text"
                    id="current_location_city"
                    name="current_location_city"
                    value={formData.current_location_city}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="current_location_country" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Country*
                  </label>
                  <input
                    type="text"
                    id="current_location_country"
                    name="current_location_country"
                    value={formData.current_location_country}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                type="button"
                onClick={handleDeleteShipment}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg mb-3 sm:mb-0"
              >
                Delete Shipment
              </button>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0">
                <Link
                  href="/admin/shipments"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg sm:mr-2 text-center"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50"
                >
                  {saveLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </ClientOnlyAdmin>
  );
} 