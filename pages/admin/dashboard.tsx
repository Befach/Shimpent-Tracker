import { useState, useEffect } from 'react';
import Link from 'next/link';
import ClientOnlyAdmin from '../../components/ClientOnlyAdmin';
import supabase from '../../lib/supabaseInstance';
import { FaBox, FaShippingFast, FaCheckCircle } from 'react-icons/fa';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalShipments: 0,
    activeShipments: 0,
    deliveredShipments: 0
  });
  const [recentShipments, setRecentShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get total shipments count
      const { count: totalCount, error: totalError } = await supabase
        .from('shipments')
        .select('*', { count: 'exact', head: true });
      
      if (totalError) throw totalError;
      
      // Get active shipments count (not delivered)
      const { count: activeCount, error: activeError } = await supabase
        .from('shipments')
        .select('*', { count: 'exact', head: true })
        .not('status', 'eq', 'Dispatched to Customer Warehouse');
      
      if (activeError) throw activeError;
      
      // Get delivered shipments count
      const { count: deliveredCount, error: deliveredError } = await supabase
        .from('shipments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Dispatched to Customer Warehouse');
      
      if (deliveredError) throw deliveredError;
      
      // Get recent shipments
      const { data: recentData, error: recentError } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (recentError) throw recentError;
      
      setStats({
        totalShipments: totalCount || 0,
        activeShipments: activeCount || 0,
        deliveredShipments: deliveredCount || 0
      });
      
      setRecentShipments(recentData || []);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClientOnlyAdmin title="Admin Dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-blue-500">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                    <FaBox className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-700">Total Shipments</h3>
                    <div className="mt-1 text-3xl font-semibold text-blue-600">{stats.totalShipments}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-yellow-500">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-100 rounded-full p-3">
                    <FaShippingFast className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-700">Active Shipments</h3>
                    <div className="mt-1 text-3xl font-semibold text-yellow-600">{stats.activeShipments}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-green-500">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                    <FaCheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-700">Delivered</h3>
                    <div className="mt-1 text-3xl font-semibold text-green-600">{stats.deliveredShipments}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Shipments */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Recent Shipments</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tracking ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Origin
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destination
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentShipments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        No shipments found
                      </td>
                    </tr>
                  ) : (
                    recentShipments.map((shipment) => (
                      <tr key={shipment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{shipment.tracking_id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{shipment.origin_city}, {shipment.origin_country}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{shipment.destination_city}, {shipment.destination_country}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {shipment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(shipment.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href={`/admin/shipments/${shipment.id}`} className="text-indigo-600 hover:text-indigo-900 mr-3">
                            View
                          </Link>
                          <Link href={`/admin/shipments/${shipment.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200">
              <Link href="/admin/shipments" className="text-indigo-600 hover:text-indigo-900 font-medium">
                View All Shipments
              </Link>
            </div>
          </div>
        </>
      )}
    </ClientOnlyAdmin>
  );
}
