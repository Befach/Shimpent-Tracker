import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import supabase from '../lib/supabaseInstance';
import { FaCheckCircle, FaCircle, FaPhone, FaComment, FaTruck, FaPlane, FaShip, FaTrain } from 'react-icons/fa';
import MainNav from '../components/MainNav';

// Define the stages in order
const SHIPMENT_STAGES = [
  'Product Insurance',
  'Supplier Payment',
  'Packaging Approval from Customer',
  'Pickup at Origin',
  'In Transit to India',
  'Pending Customer Clearance',
  'Customs Clearance',
  'Dispatch to Befach Warehouse',
  'Dispatch to Customer Warehouse'
];

const TrackEnhancedPage: NextPage = () => {
  const [trackingId, setTrackingId] = useState('');
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStageIndex, setCurrentStageIndex] = useState(-1);

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
      
      // Simple query with no joins
      const { data, error: shipmentError } = await supabase
        .from('shipments')
        .select('*')
        .eq('tracking_id', trackingId)
        .single();
      
      console.log('Query result:', { data, error: shipmentError });
      
      if (shipmentError) {
        console.error('Error fetching shipment:', shipmentError);
        setError(`Error: ${shipmentError.message}`);
        return;
      }
      
      if (!data) {
        setError('No shipment found with this tracking number');
        return;
      }
      
      console.log('Shipment found:', data);
      setShipment(data);
      
      // Find current stage index
      const index = SHIPMENT_STAGES.findIndex(stage => stage === data.status);
      setCurrentStageIndex(index);
      
    } catch (err) {
      console.error('Tracking error:', err);
      setError('Failed to track shipment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get transport mode icon
  const getTransportIcon = (mode) => {
    if (!mode) return <FaTruck size={24} />;
    
    const modeLC = mode.toLowerCase();
    if (modeLC.includes('air') || modeLC.includes('plane')) {
      return <FaPlane size={24} />;
    } else if (modeLC.includes('sea') || modeLC.includes('ship')) {
      return <FaShip size={24} />;
    } else if (modeLC.includes('rail') || modeLC.includes('train')) {
      return <FaTrain size={24} />;
    } else {
      return <FaTruck size={24} />;
    }
  };

  // Generate mock timestamps for the demo
  const generateTimestamps = () => {
    const timestamps = [];
    const now = new Date();
    
    for (let i = 0; i <= currentStageIndex; i++) {
      // Create timestamps with decreasing days from now
      const date = new Date(now);
      date.setDate(date.getDate() - (currentStageIndex - i));
      date.setHours(Math.floor(Math.random() * 12) + 8); // Random hour between 8 AM and 8 PM
      date.setMinutes(Math.floor(Math.random() * 60));
      timestamps.push(date);
    }
    
    return timestamps;
  };

  // Generate locations for the stages
  const getLocationForStage = (stage, index) => {
    if (!shipment) return '';
    
    if (index === 0 || index === 1 || index === 2) {
      return ''; // No location for initial stages
    } else if (index === 3) {
      return `${shipment.origin_city}, ${shipment.origin_country}`;
    } else if (index === SHIPMENT_STAGES.length - 1) {
      return `${shipment.destination_city}, ${shipment.destination_country}`;
    } else if (index === currentStageIndex) {
      return `${shipment.current_city || ''}, ${shipment.current_country || ''}`;
    } else {
      // Generate some transit locations
      const transitLocations = [
        'Frankfurt, Germany',
        'Dubai, UAE',
        'Singapore',
        'Mumbai, India',
        'Delhi, India'
      ];
      return transitLocations[index % transitLocations.length];
    }
  };

  // Calculate estimated delivery date (5 days from now)
  const getEstimatedDelivery = () => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (currentStageIndex < 0) return 0;
    return Math.round(((currentStageIndex + 1) / SHIPMENT_STAGES.length) * 100);
  };

  return (
    <>
      <Head>
        <title>Track Your Shipment | ShipTrack</title>
      </Head>
      
      <MainNav />
      
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!shipment ? (
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900">
                  Track Your Shipment
                </h1>
                <p className="mt-4 text-xl text-gray-600">
                  Enter your tracking number to get real-time updates on your shipment.
                </p>
              </div>
              
              <div className="bg-white shadow rounded-lg p-6">
                <form onSubmit={handleTrack} className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter tracking number"
                    className="p-4 text-lg border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white py-4 text-lg font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {loading ? 'Tracking...' : 'Track Shipment'}
                  </button>
                </form>
                
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                    <p className="text-lg">{error}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Panel - Timeline */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="border-b pb-4 mb-6">
                  <div className="flex items-center mb-2">
                    <FaTruck className="text-blue-600 mr-2 text-2xl" />
                    <h2 className="text-2xl font-bold text-gray-800">Shipping ID</h2>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">#{shipment.tracking_id}</p>
                  
                  {/* Transport Mode */}
                  <div className="mt-4 flex items-center">
                    <div className="mr-2 text-blue-600">
                      {getTransportIcon(shipment.transport_mode)}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Transport Mode:</p>
                      <p className="text-xl font-semibold text-gray-800">{shipment.transport_mode || 'Road'}</p>
                    </div>
                  </div>
                  
                  {currentStageIndex >= 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Current Status:</p>
                      <div className="mt-1 inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-lg font-medium">
                        {SHIPMENT_STAGES[currentStageIndex]}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  {SHIPMENT_STAGES.map((stage, index) => {
                    const isCompleted = index <= currentStageIndex;
                    const isCurrent = index === currentStageIndex;
                    const timestamps = generateTimestamps();
                    const location = getLocationForStage(stage, index);
                    
                    return (
                      <div key={stage} className="relative mb-8 last:mb-0">
                        <div className="flex items-start">
                          {/* Status Icon */}
                          <div className={`mt-1 mr-4 ${isCurrent ? 'text-green-500' : isCompleted ? 'text-green-500' : 'text-gray-300'}`}>
                            {isCompleted ? <FaCheckCircle size={28} /> : <FaCircle size={28} />}
                          </div>
                          
                          {/* Content */}
                          <div className={`flex-1 ${isCurrent ? 'font-medium' : ''}`}>
                            {isCompleted && index <= timestamps.length - 1 && (
                              <p className="text-base text-gray-500 mb-1">
                                {timestamps[index].toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}, {timestamps[index].toLocaleTimeString('en-US', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            )}
                            
                            <h4 className={`text-xl ${isCurrent ? 'text-green-600 font-bold' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                              {stage}
                            </h4>
                            
                            {location && (
                              <p className="text-lg text-gray-600 mt-1">{location}</p>
                            )}
                          </div>
                        </div>
                        
                        {/* Vertical line connecting stages */}
                        {index < SHIPMENT_STAGES.length - 1 && (
                          <div className="absolute left-3 top-8 bottom-0 w-0.5 h-8 bg-gray-200"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Carrier Information */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-xl font-medium text-gray-700 mb-3">Carrier</h3>
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                      <span className="text-2xl font-bold text-gray-600">DL</span>
                    </div>
                    <div>
                      <p className="text-xl font-medium">Devon Lane</p>
                      <div className="flex mt-2">
                        <a href="tel:+1234567890" className="flex items-center text-blue-600 mr-4 text-lg">
                          <FaPhone className="mr-1" /> Call
                        </a>
                        <a href="#" className="flex items-center text-blue-600 text-lg">
                          <FaComment className="mr-1" /> Message
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Panel - Map and Details */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Live Shipment Tracking</h2>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-base text-gray-500">Shipping ID:</p>
                      <p className="font-bold text-blue-600 text-xl">#{shipment.tracking_id}</p>
                    </div>
                    <div>
                      <p className="text-base text-gray-500">Shipping Status:</p>
                      <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-lg font-medium">
                        {SHIPMENT_STAGES[currentStageIndex]}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Map Placeholder */}
                <div className="h-64 bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
                  <p className="text-gray-500 text-lg">Interactive Map Placeholder</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-base text-gray-500">Departure</p>
                    <p className="font-medium text-xl">{shipment.origin_city}, {shipment.origin_country}</p>
                  </div>
                  <div>
                    <p className="text-base text-gray-500">Destination</p>
                    <p className="font-medium text-xl">{shipment.destination_city}, {shipment.destination_country}</p>
                  </div>
                </div>
                
                {/* Transport Mode */}
                <div className="mb-6">
                  <div className="flex items-center">
                    <div className="mr-2 text-blue-600">
                      {getTransportIcon(shipment.transport_mode)}
                    </div>
                    <div>
                      <p className="text-base text-gray-500">Transport Mode:</p>
                      <p className="text-xl font-semibold text-gray-800">{shipment.transport_mode || 'Road'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <p className="text-lg font-medium">Package Shipped</p>
                    <p className="text-lg font-medium">Estimated Package Delivery</p>
                  </div>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-3 mb-4 text-xs flex rounded bg-gray-200">
                      <div 
                        style={{ width: `${getProgressPercentage()}%` }} 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-lg text-gray-700 font-medium">
                      {shipment.created_at ? new Date(shipment.created_at).toLocaleDateString('en-US', {
                        month: 'numeric',
                        day: 'numeric',
                        year: 'numeric'
                      }) : 'N/A'}
                    </p>
                    <p className="text-lg text-gray-700 font-medium">{getEstimatedDelivery()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TrackEnhancedPage; 