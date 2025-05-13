import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { useEffect } from 'react';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  // Clear any old authentication data on app start
  useEffect(() => {
    // Check if we're using the new auth system
    const storedUser = localStorage.getItem('shiptrack_user');
    
    // If not, clear any old auth data
    if (!storedUser) {
      localStorage.removeItem('dummyAdminLogin');
      localStorage.removeItem('adminEmail');
      localStorage.removeItem('redirectAfterLogin');
    }
  }, []);
  
  return (
    <AuthProvider>
      <Head>
        <title>Befach International - Global Shipping & Logistics</title>
        <meta name="description" content="Track your international shipments with Befach International's real-time tracking system" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp; 