import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

type AuthContextType = {
  user: any | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkAuth = () => {
      const storedUser = localStorage.getItem('shiptrack_user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAdmin(userData.role === 'admin');
        } catch (e) {
          console.error('Error parsing stored user:', e);
          localStorage.removeItem('shiptrack_user');
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function using environment variables
  const login = async (email: string, password: string): Promise<boolean> => {
    // Get admin credentials from environment variables
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@shiptrack.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'shiptrack123'; // Fallback password

    // Check if credentials match
    if (email === adminEmail && password === adminPassword) {
      const userData = {
        email,
        role: 'admin',
        name: 'Admin User'
      };
      
      // Store user in localStorage
      localStorage.setItem('shiptrack_user', JSON.stringify(userData));
      setUser(userData);
      setIsAdmin(true);
      return true;
    }
    
    return false;
  };

  // Logout function
  const signOut = () => {
    localStorage.removeItem('shiptrack_user');
    setUser(null);
    setIsAdmin(false);
    router.push('/admin/login');
  };

  const value = {
    user,
    isLoading,
    isAdmin,
    login,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 