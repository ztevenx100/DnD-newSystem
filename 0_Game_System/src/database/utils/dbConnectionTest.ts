import { testConnection, supabaseInitialized } from '../config/dbConnection';

/**
 * Utility function to test the database connection
 * Can be imported and called during application initialization
 */
export async function checkDatabaseConnection() {
  console.log('Testing database connection...');
  console.log('Supabase initialized:', supabaseInitialized);
  
  const result = await testConnection();
  
  if (result.success) {
    console.log('Database connection test successful!', result.message);
    return true;
  } else {
    console.error('Database connection test failed!', result.message, result.error);
    return false;
  }
}

/**
 * Function to validate that a character object has all required fields
 * before saving to the database
 */
export function validateCharacterForDb(character: any): { valid: boolean; missingFields: string[] } {
  if (!character) return { valid: false, missingFields: ['character object is null'] };
  
  const missingFields = [];
  
  // Validate required fields for character saving
  if (!character.pus_id) missingFields.push('pus_id');
  if (!character.pus_usuario) missingFields.push('pus_usuario');
  if (!character.pus_nombre) missingFields.push('pus_nombre');
  if (!character.pus_clase) missingFields.push('pus_clase');
  if (!character.pus_raza) missingFields.push('pus_raza');
  if (!character.pus_trabajo) missingFields.push('pus_trabajo');
  
  // Check if level is a number
  if (typeof character.pus_nivel !== 'number') {
    missingFields.push('pus_nivel is not a number');
  }
  
  return {
    valid: missingFields.length === 0,
    missingFields
  };
}
