import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get environment variables - Vite prepends variables with "VITE_" in the browser
const supabaseUrl = import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Log for debugging
console.log('Supabase URL available:', !!supabaseUrl);
console.log('Supabase Key available:', !!supabaseKey);

// Create client with error handling
let supabase: SupabaseClient | any;
let isSupabaseInitialized = false;

try {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials are not available. Check environment variables.');
  }
  supabase = createClient(supabaseUrl, supabaseKey);
  isSupabaseInitialized = true;
  console.log('Supabase client initialized successfully');
} catch (error) {
  console.error('Error creating Supabase client:', error);
  // Create a dummy client that will log errors
  isSupabaseInitialized = false;
  supabase = {
    from: () => {
      console.error('Using dummy Supabase client. Database operations will fail.');
      return {
        insert: () => Promise.reject(new Error('Supabase client not properly initialized')),
        update: () => Promise.reject(new Error('Supabase client not properly initialized')),
        select: () => Promise.reject(new Error('Supabase client not properly initialized')),
        delete: () => Promise.reject(new Error('Supabase client not properly initialized')),
        upsert: () => Promise.reject(new Error('Supabase client not properly initialized'))
      };
    },
    storage: {
      from: () => ({
        upload: () => Promise.reject(new Error('Supabase client not properly initialized')),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    }
  };
}

export const bucket = 'dnd-system';
export { isSupabaseInitialized };
export default supabase;