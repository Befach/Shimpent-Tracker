import { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import supabase from '../lib/supabaseInstance';

const TrackSimplePage: NextPage = () => {
  const [trackingId, setTrackingId] = useState('');
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        .select('tracking_id, origin_city, origin_country, destination_city, destination_country, current_location_city, current_location_country, status, transport_mode, created_at')
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
    } catch (err) {
      console.error('Tracking error:', err);
      setError('Failed to track shipment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Track Your Shipment | ShipTrack</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Track Your Shipment
            </h1>
            <p className="mt-3 text-xl text-gray-500">
              Enter your tracking number to get real-time updates on your shipment.
            </p>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter tracking number"
                className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Tracking...' : 'Track Shipment'}
              </button>
            </form>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                <p>{error}</p>
              </div>
            )}
          </div>
          
          {shipment && (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="border-b pb-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Shipment Details</h2>
                <p className="text-sm text-gray-500">Tracking ID: {shipment.tracking_id}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Origin</h3>
                  <p className="text-gray-600">{shipment.origin_city}, {shipment.origin_country}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Destination</h3>
                  <p className="text-gray-600">{shipment.destination_city}, {shipment.destination_country}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Current Location</h3>
                  <p className="text-gray-600">
                    {shipment.current_location_city || ''}, {shipment.current_location_country || ''}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Transport Mode</h3>
                  <p className="text-gray-600">{shipment.transport_mode}</p>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Shipment Status</h3>
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-blue-800 font-medium">{shipment.status}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Shipment Timeline</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-800">Current Status: {shipment.status}</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Shipment created on: {new Date(shipment.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TrackSimplePage; 