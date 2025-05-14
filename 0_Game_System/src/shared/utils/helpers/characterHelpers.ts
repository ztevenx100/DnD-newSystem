import { DBPersonajesUsuario, DBSistemaJuego } from '@shared/utils/types';
import { getProperty } from './safeAccess';

/**
 * Safely access game system properties using a type-safe getter
 * @param gameSystem The game system object
 * @param property The property to access
 * @param defaultValue Default value if property doesn't exist
 * @returns The property value or default value
 */
export function getGameSystemProperty<K extends keyof DBSistemaJuego>(
  gameSystem: DBSistemaJuego | null | undefined,
  property: K,
  defaultValue?: DBSistemaJuego[K]
): DBSistemaJuego[K] {
  return getProperty(gameSystem as DBSistemaJuego, property, defaultValue);
}

/**
 * Safely access character properties using a type-safe getter
 * @param character The character object
 * @param property The property to access
 * @param defaultValue Default value if property doesn't exist
 * @returns The property value or default value
 */
export function getCharacterProperty<K extends keyof DBPersonajesUsuario>(
  character: DBPersonajesUsuario | null | undefined,
  property: K,
  defaultValue?: DBPersonajesUsuario[K]
): DBPersonajesUsuario[K] {
  return getProperty(character as DBPersonajesUsuario, property, defaultValue);
}

/**
 * Safely sets a character property with proper type checking
 * @param character The character object to update
 * @param property The property to set
 * @param value The new value for the property
 * @returns An updated character object with the new property value
 */
export function setCharacterProperty<K extends keyof DBPersonajesUsuario>(
  character: DBPersonajesUsuario | undefined | null,
  property: K,
  value: DBPersonajesUsuario[K]
): DBPersonajesUsuario {
  if (!character) {
    // Create a new character with the initialPersonajesUsuario as base
    const newChar: Partial<DBPersonajesUsuario> = {};
    newChar[property] = value;
    return newChar as DBPersonajesUsuario;
  }  
  return {
    ...character,
    [property]: value
  };
}

/**
 * Validate a character by checking required fields
 * @param character The character to validate
 * @returns An array of field names that are invalid
 */
export function validateCharacter(character: DBPersonajesUsuario | null | undefined): string[] {
  const missingFields: string[] = [];
  if (!character) return ['character'];
  
  // Check required fields
  if (!getCharacterProperty(character, 'pus_nombre')) missingFields.push('pus_nombre');
  if (!getCharacterProperty(character, 'pus_clase')) missingFields.push('pus_clase');
  if (!getCharacterProperty(character, 'pus_raza')) missingFields.push('pus_raza');
  if (!getCharacterProperty(character, 'pus_trabajo')) missingFields.push('pus_trabajo');
  
  return missingFields;
}

/**
 * Validate a character's stats by checking if they have valid values
 * @param stats The character stats to validate
 * @returns True if stats are valid, false otherwise
 */
export function validateCharacterStats(stats: any[] | null | undefined): boolean {
  if (!stats || !Array.isArray(stats) || stats.length < 6) return false;
  
  // Check if we have valid numbers for each stat
  return stats.every(stat => 
    typeof stat.valueDice === 'number' && 
    typeof stat.valueClass === 'number' && 
    typeof stat.valueLevel === 'number'
  );
}

/**
 * Convert any value to a safe number
 * @param value The value to convert
 * @param defaultValue Default value if conversion fails
 * @returns The numeric value or default
 */
export function safeNumberConversion(value: any, defaultValue: number = 0): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
}
