import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export function withAdminAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> {
  return function WithAdminAuth(props: P) {
    const router = useRouter();
    const { user, isAdmin, isLoading } = useAuth();
    const [isDummyAdmin, setIsDummyAdmin] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Check if we're using dummy admin from localStorage
      const dummyLogin = localStorage.getItem('dummyAdminLogin') === 'true';
      setIsDummyAdmin(dummyLogin);
      
      // Skip auth check if we're using dummy admin
      if (dummyLogin) {
        setIsAuthorized(true);
        setLoading(false);
      } else if (!isLoading) {
        // Regular auth check
        if (!user) {
          router.push('/admin/login');
        } else if (!isAdmin) {
          router.push('/');
        } else {
          setIsAuthorized(true);
        }
        setLoading(false);
      }
    }, [user, isAdmin, isLoading, router]);

    if (loading) {
      return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!isAuthorized && !isDummyAdmin) {
      return null; // This will be redirected by the useEffect hook
    }

    return <WrappedComponent {...props} />;
  };
} 