import { createClient } from '@supabase/supabase-js';

// Hardcode the correct URL and key
const supabaseUrl = 'https://semzvmdjabbceqvanxbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlbXp2bWRqYWJiY2VxdmFueGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NTg2NzMsImV4cCI6MjA1ODEzNDY3M30.1WVli2iZhMfnXD8HZk5Q7WLLdy9p33tSAGyALoEeq-Q';

console.log('Creating Supabase client with URL:', supabaseUrl);

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
  },
});

export default supabase; 