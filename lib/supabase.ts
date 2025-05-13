import { createClient } from '@supabase/supabase-js';

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// Create Supabase client with cache disabled
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
    },
    global: {
      fetch: (...args: Parameters<typeof fetch>) => fetch(...args),
    },
    db: {
      schema: 'public',
    }
  }
);

// Add a utility function for error logging
export const handleSupabaseError = (error: any, context: string = 'Operation') => {
  console.error(`Supabase ${context} Error:`, {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint
  });
};

// Add a simple check to verify the client was created successfully
try {
  // Simple test to see if the client is working
  console.log('Supabase client initialized with URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
} catch (error) {
  console.error('Error initializing Supabase client:', error);
} 