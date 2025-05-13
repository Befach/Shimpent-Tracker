import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ClientOnlyAdmin from '../../../../components/ClientOnlyAdmin';
import supabase from '../../../../lib/supabaseInstance';
import Link from 'next/link';
import { FaUpload, FaTrash, FaArrowLeft } from 'react-icons/fa';

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

export default function ShipmentMedia() {
  const router = useRouter();
  const { id } = router.query;
  
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadingStage, setUploadingStage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [stageMedia, setStageMedia] = useState({});
  const [expandedStage, setExpandedStage] = useState('');

  useEffect(() => {
    if (id) {
      fetchShipment();
      fetchMedia();
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
      setShipment(data);
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
      setError('Failed to load media data');
    }
  };

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
      
      // Set upload to 100% after upload completes
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

  const toggleStageExpansion = (stage) => {
    if (expandedStage === stage) {
      setExpandedStage('');
    } else {
      setExpandedStage(stage);
    }
  };

  return (
    <ClientOnlyAdmin title="Shipment Media">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center">
              <Link href={`/admin/shipments/${id}`} className="mr-2 text-gray-600 hover:text-gray-900">
                <FaArrowLeft />
              </Link>
              <h1 className="text-2xl font-bold">Upload Media for Shipment</h1>
            </div>
            <div className="space-x-2">
              <Link href={`/admin/shipments/${id}`} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md">
                Back to Shipment
              </Link>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
              <p>{error}</p>
            </div>
          )}
          
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Tracking ID: {shipment?.tracking_id}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Current Status: {shipment?.status}
              </p>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                You can upload media for each stage of the shipment. Media will only be visible when the shipment is at that specific stage.
              </p>
              
              {/* Current Stage Upload Section */}
              <div className="border border-gray-200 rounded-lg mb-6">
                <div 
                  className="flex justify-between items-center p-4 cursor-pointer bg-gray-50"
                  onClick={() => toggleStageExpansion(shipment?.status)}
                >
                  <h3 className="text-lg font-medium">{shipment?.status} (Current Stage)</h3>
                  <span className="text-gray-500">
                    {expandedStage === shipment?.status ? '▲' : '▼'}
                  </span>
                </div>
                
                {expandedStage === shipment?.status && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">
                        Upload Document or Image
                      </label>
                      <div className="flex items-center">
                        <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer">
                          <span className="flex items-center">
                            <FaUpload className="mr-2" /> Select File
                          </span>
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => handleFileChange(e, shipment?.status)}
                            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                          />
                        </label>
                        <span className="ml-3 text-gray-500">
                          {uploadingStage === shipment?.status 
                            ? `Uploading... ${uploadProgress}%` 
                            : 'No file selected'}
                        </span>
                      </div>
                    </div>
                    
                    {stageMedia[shipment?.status]?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Uploaded Files</h4>
                        <div className="space-y-2">
                          {stageMedia[shipment?.status].map(media => (
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
                                  View
                                </a>
                                <button 
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
                )}
              </div>
              
              {/* Other Stages Upload Section */}
              <div className="border border-gray-200 rounded-lg">
                <div 
                  className="flex justify-between items-center p-4 cursor-pointer bg-gray-50"
                  onClick={() => toggleStageExpansion('other')}
                >
                  <h3 className="text-lg font-medium">Upload Media for Other Stages</h3>
                  <span className="text-gray-500">
                    {expandedStage === 'other' ? '▲' : '▼'}
                  </span>
                </div>
                
                {expandedStage === 'other' && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="space-y-6">
                      {SHIPMENT_STAGES.filter(stage => stage !== shipment?.status).map(stage => (
                        <div key={stage} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                          <h4 className="font-medium text-gray-700 mb-3">{stage}</h4>
                          
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
                              <h5 className="font-medium text-gray-600 mb-2">Uploaded Files</h5>
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
                                        View
                                      </a>
                                      <button 
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
              </div>
            </div>
          </div>
        </>
      )}
    </ClientOnlyAdmin>
  );
} 