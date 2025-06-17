import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// Create Supabase client with cache disabled
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  global: {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  }
});

// Add a utility function for error logging
export const handleSupabaseError = (error: any, context: string = 'Operation') => {
  console.error(`Supabase ${context} Error:`, {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint
  });
};

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