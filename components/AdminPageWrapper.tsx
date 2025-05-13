import { useEffect, useState } from 'react';
import { checkAdminAuth, redirectToLogin } from '../lib/adminAuth';
import AdminLayout from './AdminLayout';

interface AdminPageWrapperProps {
  children: React.ReactNode;
  title?: string;
}

export default function AdminPageWrapper({ children, title = 'Admin' }: AdminPageWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if admin is authenticated
    const isAuth = checkAdminAuth();
    
    if (!isAuth) {
      // Redirect to login page if not authenticated
      redirectToLogin();
    } else {
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect
  }
  
  return (
    <AdminLayout title={title}>
      {children}
    </AdminLayout>
  );
} 