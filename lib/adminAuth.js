// A simple utility to handle admin auth consistently across all pages
export const checkAdminAuth = () => {
  // Check if we're in a browser context
  if (typeof window === 'undefined') return false;
  
  // Check for dummy admin login
  return localStorage.getItem('dummyAdminLogin') === 'true';
};

// A utility to redirect to admin login if not authenticated
export const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    window.location.href = '/admin/login';
  }
};

// A utility to redirect to admin dashboard
export const redirectToDashboard = () => {
  if (typeof window !== 'undefined') {
    window.location.href = '/admin/dashboard';
  }
};

// A utility to get the admin email
export const getAdminEmail = () => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('dummyAdminEmail') || '';
};

// A utility to handle sign out
export const adminSignOut = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('dummyAdminLogin');
    localStorage.removeItem('dummyAdminEmail');
    window.location.href = '/admin/login';
  }
}; 