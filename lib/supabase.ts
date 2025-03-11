import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';

// For server-side operations (API routes)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://supabase.lucidsro.com';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc0MTY0ODMyMCwiZXhwIjo0ODk3MzIxOTIwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.oVjVZ09ZrpHHhZsXyByMy7vonBsKqXQNlF7Ie3Gvnds';

// Check if we have the required values
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// For client-side operations (components)
export const createClientSupabase = () => {
  return createClientComponentClient<Database>({
    supabaseUrl,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc0MTY0ODMyMCwiZXhwIjo0ODk3MzIxOTIwLCJyb2xlIjoiYW5vbiJ9.N827pCpOn1nvdAhUC7OV_N4OBhPFB74jCYKtREZHZlE'
  });
};

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  
  // Return a standardized error object
  return {
    error: error.message || 'An error occurred with the database operation',
    code: error.code || 'unknown_error',
    details: error.details || null,
    hint: error.hint || null,
  };
}; 