import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ClientOnlyAdmin from '../../../../components/ClientOnlyAdmin';
import supabase from '../../../../lib/supabaseInstance';
import Link from 'next/link';

export default function ViewShipment() {
  const router = useRouter();
  const { id } = router.query;
  
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchShipment();
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

      setShipment(data);
    } catch (error) {
      console.error('Error fetching shipment:', error);
      setError('Failed to load shipment data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClientOnlyAdmin title="View Shipment">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Shipment Details</h1>
            <div className="space-x-2">
              <Link href="/admin/shipments" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md">
                Back to Shipments
              </Link>
              <Link href={`/admin/shipments/${id}/edit`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                Edit Shipment
              </Link>
              <Link href={`/admin/shipments/${id}/media`} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md ml-2">
                Manage Media
              </Link>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
              <p>{error}</p>
            </div>
          )}

          {shipment && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Tracking ID: {shipment.tracking_id}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Created on {new Date(shipment.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                      {shipment.current_location_city}, {shipment.current_location_country}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Transport Mode</h3>
                    <p className="text-gray-600">{shipment.transport_mode}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Status</h3>
                  <div className="bg-blue-50 p-4 rounded-md">
                    <p className="text-blue-800 font-medium">{shipment.status}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </ClientOnlyAdmin>
  );
} 