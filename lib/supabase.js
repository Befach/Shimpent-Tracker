import { createClient } from '@supabase/supabase-js';

// Get environment variables directly
const supabaseUrl = 'https://krbvnifjbtsvlaksyxdd.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY

console.log('Creating Supabase client with URL:', supabaseUrl);

// Create and export the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
  }
});

export { supabase }; 