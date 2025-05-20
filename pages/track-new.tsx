import { useState, useEffect, useRef } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { supabase } from '../lib/supabase';
import MainNav from '../components/MainNav';
import { FaShip, FaPlane, FaTruck, FaTrain, FaFileAlt, FaDownload, FaBox, FaCube, FaImage, FaFile, FaFilePdf, FaFileWord, FaFileExcel, FaSearch, FaArrowLeft, FaChevronUp, FaChevronDown, FaEye } from 'react-icons/fa';

const styles = `
  @keyframes scroll {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  .marquee-wrapper {
    width: 100%;
    overflow: hidden;
    background: #FEF2F2;
    border: 1px solid #FECACA;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .marquee {
    display: inline-block;
    white-space: nowrap;
    padding: 0.75rem 0;
    animation: marquee 20s linear infinite;
  }

  @keyframes marquee {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(-100%);
    }
  }
`;

const TrackNewPage: NextPage = () => {
  const [trackingId, setTrackingId] = useState('');
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stageMedia, setStageMedia] = useState([]);
  const [shipmentDocuments, setShipmentDocuments] = useState([]);
  const [showFullTimeline, setShowFullTimeline] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const timelineRef = useRef(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    
    if (!trackingId.trim()) {
      setError('Please enter a tracking number');
      return;
    }
    
    setLoading(true);
    setError('');
    setShipment(null);
    
    try {
      console.log('Searching for tracking ID:', trackingId);
      
      // Use maybeSingle() instead of single() to handle no results gracefully
      const { data, error: shipmentError } = await supabase
        .from('shipments')
        .select('*')
        .eq('tracking_id', trackingId)
        .maybeSingle();
      
      console.log('Query result:', { data, error: shipmentError });
      
      if (shipmentError) {
        console.error('Error fetching shipment:', shipmentError);
        setError('Failed to track shipment. Please try again.');
        return;
      }
      
      if (!data) {
        setError('No shipment found with this tracking number');
        return;
      }
      
      console.log('Shipment found:', data);
      setShipment(data);
      
    } catch (err) {
      console.error('Tracking error:', err);
      setError('Failed to track shipment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset the search and go back to the search form
  const handleReset = () => {
    setShipment(null);
    setError('');
    setTrackingId('');
  };

  // Get transport mode icon
  const getTransportIcon = (mode) => {
    if (!mode) return <FaTruck size={20} />;
    
    const modeLC = mode.toLowerCase();
    if (modeLC.includes('air') || modeLC.includes('plane')) {
      return <FaPlane size={20} />;
    } else if (modeLC.includes('sea') || modeLC.includes('ship')) {
      return <FaShip size={20} />;
    } else if (modeLC.includes('rail') || modeLC.includes('train')) {
      return <FaTrain size={20} />;
    } else {
      return <FaTruck size={20} />;
    }
  };

  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (!shipment) return 0;
    
    // Simple calculation based on current date between created_at and estimated delivery
    const createdDate = new Date(shipment.created_at).getTime();
    const estimatedDeliveryDate = new Date(getEstimatedDeliveryDate()).getTime();
    const currentDate = new Date().getTime();
    
    if (currentDate >= estimatedDeliveryDate) return 100;
    
    const totalDuration = estimatedDeliveryDate - createdDate;
    const elapsedDuration = currentDate - createdDate;
    
    return Math.min(Math.round((elapsedDuration / totalDuration) * 100), 100);
  };

  // Get estimated delivery date (5 days from creation for demo)
  const getEstimatedDeliveryDate = (): Date => {
    if (!shipment) return new Date();
    
    // Use the actual estimated_delivery if available
    if (shipment.estimated_delivery) {
      return new Date(shipment.estimated_delivery);
    }
    
    // Fallback to the old calculation if estimated_delivery is not set
    const createdDate = new Date(shipment.created_at);
    const estimatedDate = new Date(createdDate);
    
    // Set ETA based on transport mode
    if (shipment.transport_mode && shipment.transport_mode.toLowerCase().includes('air')) {
      estimatedDate.setDate(createdDate.getDate() + 15);
    } else if (shipment.transport_mode && shipment.transport_mode.toLowerCase().includes('sea')) {
      estimatedDate.setDate(createdDate.getDate() + 45);
    } else {
      estimatedDate.setDate(createdDate.getDate() + 30);
    }
    
    return estimatedDate;
  };
  
  // Format the estimated delivery date as a string
  const getEstimatedDeliveryString = (): string => {
    if (!shipment) return 'N/A';
    const estimatedDate = getEstimatedDeliveryDate();
    
    return estimatedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return <FaImage className="text-blue-600 mr-3" />;
    } else if (fileType.includes('pdf')) {
      return <FaFilePdf className="text-red-600 mr-3" />;
    } else if (fileType.includes('word') || fileType.includes('doc')) {
      return <FaFileWord className="text-blue-800 mr-3" />;
    } else if (fileType.includes('excel') || fileType.includes('sheet') || fileType.includes('xls')) {
      return <FaFileExcel className="text-green-600 mr-3" />;
    } else {
      return <FaFile className="text-gray-600 mr-3" />;
    }
  };

  const fetchStageMedia = async (shipmentId, stage) => {
    try {
      // First check if the table and column exist
      const { error: checkError } = await supabase
        .from('shipment_media')
        .select('id')
        .limit(1);
      
      if (checkError && checkError.message.includes('does not exist')) {
        console.log('shipment_media table does not exist yet');
        setStageMedia([]);
        return;
      }
      
      const { data, error } = await supabase
        .from('shipment_media')
        .select('*')
        .eq('shipment_id', shipmentId);
      
      if (error) {
        if (error.message.includes('does not exist')) {
          console.log('Stage column may not exist in shipment_media table');
          setStageMedia([]);
        } else {
          throw error;
        }
      } else {
        // If we have data but no stage column, we'll just show all media
        setStageMedia(data || []);
      }
    } catch (err) {
      console.error('Error fetching stage media:', err);
      setStageMedia([]);
    }
  };

  const fetchShipmentDocuments = async (shipmentId) => {
    try {
      // First check if the table exists
      const { error: checkError } = await supabase
        .from('shipment_documents')
        .select('id')
        .limit(1);
      
      if (checkError && checkError.message.includes('does not exist')) {
        console.log('shipment_documents table does not exist yet');
        setShipmentDocuments([]);
        return;
      }
      
      const { data, error } = await supabase
        .from('shipment_documents')
        .select('*')
        .eq('shipment_id', shipmentId);
      
      if (error) throw error;
      setShipmentDocuments(data || []);
    } catch (err) {
      console.error('Error fetching shipment documents:', err);
      setShipmentDocuments([]);
    }
  };

  const determineCurrentStageIndex = () => {
    if (!shipment) return 0;
    
    const stages = SHIPMENT_STAGES;
    const currentStage = shipment.status;
    const index = stages.findIndex(stage => stage === currentStage);
    return index >= 0 ? index : 0;
  };

  useEffect(() => {
    if (shipment) {
      fetchStageMedia(shipment.id, shipment.status);
      fetchShipmentDocuments(shipment.id);
      setCurrentStageIndex(determineCurrentStageIndex());
    }
  }, [shipment]);

  // Define shipment stages
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

  return (
    <>
      <Head>
        <title>Track Your Shipment | ShipTrack</title>
        <style jsx global>{styles}</style>
      </Head>
      
      <MainNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!shipment ? (
          // Show search form when no shipment is found
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Shipment</h1>
              <p className="text-gray-600">Enter your tracking number to get real-time updates on your shipment.</p>
            </div>
            
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter tracking number"
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#F39C12] text-white px-6 py-2 rounded-md hover:bg-[#E67E22] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? 'Tracking...' : 'Track'}
                </button>
              </form>
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
                  {error}
                </div>
              )}
            </div>
          </>
        ) : (
          // Show shipment details when a shipment is found
          <>
            {shipment.shipment_notes && (
              <div className="mb-6 bg-red-50 border-2 border-red-500 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-red-600 font-medium text-lg">Important Note: </span>
                  <span className="text-red-500 text-lg ml-2">{shipment.shipment_notes}</span>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Shipment #{shipment.tracking_id}</h1>
                <p className="text-gray-600">Current Status: <span className="font-medium">{shipment.status}</span></p>
              </div>
              <button 
                onClick={handleReset}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaArrowLeft className="mr-2" />
                <span>Track Another Shipment</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Shipment Summary */}
              <div className="space-y-6">
                {/* Shipment Summary Card */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-medium mb-4">Shipment Summary</h3>
                    
                    <div className="flex items-center text-gray-600 mb-4">
                      {getTransportIcon(shipment.transport_mode)}
                      <span className="ml-2">{shipment.transport_mode || 'Standard Shipping'}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">From</p>
                        <p className="font-medium">{shipment.origin_city}, {shipment.origin_country}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">To</p>
                        <p className="font-medium">{shipment.destination_city}, {shipment.destination_country}</p>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{formatDate(shipment.created_at)}</span>
                        <span>{String(getEstimatedDeliveryString())}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-[#F39C12] h-2.5 rounded-full" 
                          style={{ width: `${getProgressPercentage()}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Shipped</span>
                        <span>Estimated Delivery</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Shipment Details Card */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <FaCube className="text-blue-600 mr-3" size={20} />
                      <h3 className="text-lg font-medium">Shipment Details</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm text-gray-600">Package Count</h4>
                        <p className="font-medium">{shipment.package_count || '1 Package'}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-gray-600">Package Type</h4>
                        <p className="font-medium">{shipment.package_type || 'Standard'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm text-gray-600">Weight</h4>
                        <p className="font-medium">{shipment.weight ? `${shipment.weight} kg` : 'N/A'}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-gray-600">Dimensions</h4>
                        <p className="font-medium">{shipment.dimensions || 'N/A'}</p>
                      </div>

                      <div>
                        <h4 className="text-sm text-gray-600">HS Code</h4>
                        <p className="font-medium">{shipment.hs_code || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm text-gray-600">Package Contents</h4>
                      <p className="font-medium">{shipment.contents}</p>
                    </div>

                    {/* Contact Information */}
                    <div className="border-t pt-4 mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h5 className="text-sm text-gray-600">Shipper</h5>
                          <p className="font-medium">{shipment.shipper_name || 'N/A'}</p>
                          <p className="text-sm text-gray-500">{shipment.shipper_address || 'N/A'}</p>
                        </div>
                        
                        <div>
                          <h5 className="text-sm text-gray-600">Buyer</h5>
                          <p className="font-medium">{shipment.buyer_name || 'N/A'}</p>
                          <p className="text-sm text-gray-500">{shipment.buyer_address || 'N/A'}</p>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm text-gray-600">Delivery Address</h5>
                        <p className="text-sm text-gray-500">{shipment.customer_delivery_address || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Timeline and Documents */}
              <div className="lg:col-span-2 space-y-6">
                {/* Timeline Card */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-lg font-medium">Shipment Timeline</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Progress: {Math.round((currentStageIndex / (SHIPMENT_STAGES.length - 1)) * 100)}% Complete
                        </p>
                      </div>
                      <button 
                        onClick={() => setShowFullTimeline(!showFullTimeline)}
                        className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                      >
                        <FaEye className="mr-1" />
                        {showFullTimeline ? 'Show Less' : 'View Full Timeline'}
                      </button>
                    </div>
                    
                    <div className="mb-6">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-[#F39C12] h-2.5 rounded-full transition-all duration-500" 
                          style={{ width: `${(currentStageIndex / (SHIPMENT_STAGES.length - 1)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-6" ref={timelineRef}>
                      {SHIPMENT_STAGES.map((stage, index) => {
                        // Determine if this stage should be shown
                        const isCurrentStage = index === currentStageIndex;
                        const isPreviousStage = index === currentStageIndex - 1;
                        const isNextStage = index === currentStageIndex + 1;
                        const shouldShow = showFullTimeline || isCurrentStage || isPreviousStage || isNextStage;
                        
                        // Skip rendering if not showing
                        if (!shouldShow) return null;
                        
                        // Determine stage status
                        const isCompleted = index < currentStageIndex;
                        const isInProgress = index === currentStageIndex;
                        const isPending = index > currentStageIndex;
                        
                        // Get stage dates (dummy data for now)
                        const getDummyDate = (offset) => {
                          const date = new Date();
                          date.setDate(date.getDate() + offset);
                          return date.toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true
                          });
                        };
                        
                        const stageDate = isCompleted ? getDummyDate(-5 + index) : 
                                          isInProgress ? getDummyDate(0) : 
                                          `Estimated: ${getDummyDate(index - currentStageIndex + 2)}`;
                        
                        // Determine location to display
                        const locationText = isCurrentStage ? 
                          `${shipment.current_location_city || 'Unknown'}, ${shipment.current_location_country || 'Unknown'}` : 
                          stage.includes('Origin') ? 
                            `${shipment.origin_city || 'Unknown'}, ${shipment.origin_country || 'Unknown'}` :
                            stage.includes('Transit') ?
                              'In Transit' :
                              `${shipment.current_location_city || 'Unknown'}, ${shipment.current_location_country || 'Unknown'}`;
                        
                        return (
                          <div key={index} className="flex justify-between">
                            <div className="flex">
                              <div className="flex flex-col items-center mr-4">
                                <div className={`w-3 h-3 rounded-full ${
                                  isCompleted ? 'bg-green-500' : 
                                  isInProgress ? 'bg-blue-500' : 
                                  'bg-gray-300'
                                }`}></div>
                                {index < SHIPMENT_STAGES.length - 1 && (
                                  <div className="h-full w-0.5 bg-gray-200"></div>
                                )}
                              </div>
                              <div>
                                <div className={`px-3 py-1 rounded-md inline-block mb-1 ${
                                  isCompleted ? 'bg-green-50 text-green-800' : 
                                  isInProgress ? 'bg-blue-50 text-blue-800' : 
                                  'bg-gray-50 text-gray-500'
                                }`}>
                                  <span className="text-sm font-medium">
                                    {isCompleted ? 'Completed' : 
                                     isInProgress ? 'In Progress' : 
                                     'Pending'}
                                  </span>
                                </div>
                                <h4 className={`font-medium ${
                                  isPending ? 'text-gray-400' : 'text-gray-800'
                                }`}>{stage}</h4>
                                <p className={`text-sm ${
                                  isPending ? 'text-gray-400' : 'text-gray-500'
                                }`}>{stageDate}</p>
                                {/* Show dispatched through info for each relevant stage */}
                                {stage === 'Pickup at Origin' && shipment.pickup_dispatched_through && (
                                  <p className="text-sm text-blue-600 mt-1">
                                    Dispatched through: {shipment.pickup_dispatched_through}
                                  </p>
                                )}
                                {stage === 'In Transit to India' && shipment.transit_dispatched_through && (
                                  <p className="text-sm text-blue-600 mt-1">
                                    Dispatched through: {shipment.transit_dispatched_through}
                                  </p>
                                )}
                                {stage === 'Dispatch to Befach Warehouse' && shipment.befach_dispatched_through && (
                                  <p className="text-sm text-blue-600 mt-1">
                                    Dispatched through: {shipment.befach_dispatched_through}
                                  </p>
                                )}
                                {stage === 'Dispatch to Customer Warehouse' && shipment.customer_dispatched_through && (
                                  <p className="text-sm text-blue-600 mt-1">
                                    Dispatched through: {shipment.customer_dispatched_through}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            {/* Show location on the right side */}
                            {(isCompleted || isInProgress) && locationText && (
                              <div className="flex items-center">
                                <div className="text-right">
                                  <span className="inline-block w-4 h-4 mr-1 text-blue-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                  </span>
                                  <span className={`font-medium ${isCurrentStage ? 'text-blue-600' : 'text-gray-700'}`}>
                                    {locationText}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    {!showFullTimeline && SHIPMENT_STAGES.length > 3 && (
                      <div className="flex justify-center mt-4">
                        <button 
                          onClick={() => setShowFullTimeline(true)}
                          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                        >
                          <FaChevronDown className="mr-1" />
                          Show All {SHIPMENT_STAGES.length} Stages
                        </button>
                      </div>
                    )}
                    
                    {showFullTimeline && (
                      <div className="flex justify-center mt-4">
                        <button 
                          onClick={() => setShowFullTimeline(false)}
                          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                        >
                          <FaChevronUp className="mr-1" />
                          Show Less
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Documents Card */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-medium mb-4">Shipment Documents</h3>
                    
                    <div className="space-y-4">
                      {shipmentDocuments.length > 0 ? (
                        shipmentDocuments.map(doc => (
                          <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              {getFileIcon(doc.file_type)}
                              <span>{doc.document_type === 'commercial_invoice' ? 'Commercial Invoice' : 
                                     doc.document_type === 'bill_of_lading' ? 'Bill of Lading' : 
                                     doc.document_type === 'packing_list' ? 'Packing List' : 
                                     doc.file_name}</span>
                            </div>
                            <a 
                              href={doc.public_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              <span className="mr-1">Download</span>
                              <FaDownload />
                            </a>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center">No documents available for this shipment</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TrackNewPage;