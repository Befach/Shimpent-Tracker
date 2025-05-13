import React from 'react';
import Head from 'next/head';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title = 'Admin Dashboard' }: AdminLayoutProps) {
  // Get admin email from localStorage (client-side only)
  const displayEmail = typeof window !== 'undefined' ? 
    localStorage.getItem('dummyAdminEmail') || 'admin@test.com' : 
    'admin@test.com';

  // Handle sign out
  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dummyAdminLogin');
      localStorage.removeItem('dummyAdminEmail');
      window.location.href = '/admin/login';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>{title} | ShipTrack Admin</title>
      </Head>

      <nav className="bg-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold">ShipTrack Admin</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                <span className="text-sm">{displayEmail}</span>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="bg-blue-800 text-white py-2 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 overflow-x-auto">
            <a href="/admin/dashboard" className="no-underline">
              <span className="px-3 py-2 rounded-md text-sm font-medium cursor-pointer hover:bg-blue-700">
                Dashboard
              </span>
            </a>
            <a href="/admin/shipments" className="no-underline">
              <span className="px-3 py-2 rounded-md text-sm font-medium cursor-pointer hover:bg-blue-700">
                All Shipments
              </span>
            </a>
            <a href="/admin/shipments/new" className="no-underline">
              <span className="px-3 py-2 rounded-md text-sm font-medium cursor-pointer hover:bg-blue-700">
                Add Shipment
              </span>
            </a>
            <a href="/admin/stages" className="no-underline">
              <span className="px-3 py-2 rounded-md text-sm font-medium cursor-pointer hover:bg-blue-700">
                Manage Stages
              </span>
            </a>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow rounded-lg p-6">
          {children}
        </div>
      </main>
    </div>
  );
} 