// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Create and export the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
  }
});

console.log('Supabase client initialized with URL:', supabaseUrl);

// Test function to check connection
export const testSupabaseConnection = async () => {
  try {
    console.log("Testing Supabase connection...");
    
    const { data, error } = await supabase
      .from('shipments')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error("❌ Supabase connection error:", error);
      return false;
    }
    
    console.log("✅ Successfully connected to Supabase!");
    console.log("Data sample:", data);
    return true;
  } catch (err) {
    console.error("❌ Exception when connecting to Supabase:", err);
    return false;
  }
};

export default supabase;