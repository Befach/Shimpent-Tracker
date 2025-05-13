import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Head from 'next/head';
import AdminNav from './AdminNav';

interface ClientOnlyAdminProps {
  children: React.ReactNode;
  title?: string;
}

export default function ClientOnlyAdmin({ children, title = 'Admin' }: ClientOnlyAdminProps) {
  const [mounted, setMounted] = useState(false);
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
    // If not loading and not admin, redirect to login
    if (!isLoading && !isAdmin) {
      router.push('/admin/login');
    }
  }, [isLoading, isAdmin, router]);

  // Don't render anything until we check auth status
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not admin, don't render the protected content
  if (!isAdmin) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <>
      <Head>
        <title>{title} | ShipTrack Admin</title>
      </Head>
      
      <div className="min-h-screen bg-gray-100">
        <AdminNav />
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </>
  );
} 