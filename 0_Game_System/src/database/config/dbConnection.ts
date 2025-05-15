import supabase, { bucket, isSupabaseInitialized } from './supabase'

// Check and report database connection status
const dbConnection = supabase;

// Export initialization status to make it available to the app
export const supabaseInitialized = isSupabaseInitialized;

// Add a method to verify the connection is working
export const testConnection = async () => {
  try {
    const { data, error } = await dbConnection.from('sju_sistema_juego').select('*').limit(1);
    if (error) throw error;
    return { 
      success: true, 
      message: 'Database connection successful', 
      data 
    };
  } catch (error) {
    console.error('Database connection test failed:', error);
    return { 
      success: false, 
      message: 'Database connection failed', 
      error 
    };
  }
};

export const bucketName = bucket;

export default dbConnection;