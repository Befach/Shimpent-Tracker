import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = 'https://krbvnifjbtsvlaksyxdd.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('Missing Supabase anon key');
}

// Create the Supabase client with additional headers
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  },
  global: {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  }
});

// Test the connection and authentication
supabase.auth.getSession().then(({ data: { session }, error }) => {
  if (error) {
    console.error('Supabase auth error:', error);
  } else if (!session) {
    console.warn('No active session found');
  } else {
    console.log('Supabase client initialized with session');
  }
});

export default supabase; 