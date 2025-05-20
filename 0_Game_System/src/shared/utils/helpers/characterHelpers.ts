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
 * Valida las estadísticas de un personaje verificando que tengan valores válidos
 * y cumplan con reglas específicas del sistema de juego
 * 
 * @param stats Las estadísticas del personaje a validar
 * @returns True si las estadísticas son válidas, false en caso contrario
 */
export function validateCharacterStats(stats: any[] | null | undefined): boolean {
  // Verificar si los datos básicos están presentes
  if (!stats || !Array.isArray(stats) || stats.length < 6) {
    console.warn('Estadísticas incompletas o inválidas', { stats });
    return false;
  }
  
  try {
    // Verificar que todas las estadísticas tengan números válidos
    const allHaveValidNumbers = stats.every(stat => 
      typeof stat.valueDice === 'number' && !isNaN(stat.valueDice) &&
      typeof stat.valueClass === 'number' && !isNaN(stat.valueClass) &&
      typeof stat.valueLevel === 'number' && !isNaN(stat.valueLevel)
    );
    
    if (!allHaveValidNumbers) {
      console.warn('Una o más estadísticas tienen valores numéricos inválidos');
      return false;
    }
    
    // Verificar valores mínimos y máximos según las reglas
    const allWithinLimits = stats.every(stat => {
      // Validar rangos: dados entre 1-10, clase entre 0-3, nivel entre 0-5
      const diceInRange = stat.valueDice >= 1 && stat.valueDice <= 10;
      const classInRange = stat.valueClass >= 0 && stat.valueClass <= 3;
      const levelInRange = stat.valueLevel >= 0 && stat.valueLevel <= 5;
      
      return diceInRange && classInRange && levelInRange;
    });
    
    if (!allWithinLimits) {
      console.warn('Una o más estadísticas tienen valores fuera de los rangos permitidos');
      return false;
    }
    
    // Verificar que haya al menos una estadística con valor total > 0
    const anyHasValue = stats.some(stat => 
      (stat.valueDice + stat.valueClass + stat.valueLevel) > 0
    );
    
    if (!anyHasValue) {
      console.warn('Todas las estadísticas tienen valor cero');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error al validar estadísticas del personaje:', error);
    return false;
  }
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

/**
 * Comprehensive validation function for character attributes
 * Returns detailed error information with field names and problem descriptions
 * 
 * @param character The character object to validate
 * @param stats Character statistics to validate
 * @param skills Character skills to validate
 * @param inventory Character inventory to validate
 * @returns Object with validation results and error details
 */
export function validateCharacterAttributes(
  character: DBPersonajesUsuario | null | undefined,
  stats: any[] | null | undefined,
  skills: any[] | null | undefined,
  inventory: any[] | null | undefined,
) {
  // Initialize results object
  const result = {
    isValid: true,
    errors: {} as Record<string, string>,
    warnings: {} as Record<string, string>,
  };

  // 1. Validate basic character properties
  if (!character) {
    result.isValid = false;
    result.errors['character'] = 'Character data is missing';
    return result;
  }

  // Check required fields
  const requiredFields: Array<{field: keyof DBPersonajesUsuario, label: string}> = [
    { field: 'pus_nombre', label: 'Character name' },
    { field: 'pus_clase', label: 'Character class' },
    { field: 'pus_raza', label: 'Character race' },
    { field: 'pus_trabajo', label: 'Character job' }
  ];
  
  requiredFields.forEach(({ field, label }) => {
    const value = getCharacterProperty(character, field);
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      result.isValid = false;
      result.errors[field] = `${label} is required`;
    }
  });

  // Validate level and other numeric fields
  const level = getCharacterProperty(character, 'pus_nivel', 1);
  if (level < 1 || level > 10) {
    result.isValid = false;
    result.errors['pus_nivel'] = `Character level must be between 1 and 10 (got ${level})`;
  }

  const luckyPoints = getCharacterProperty(character, 'pus_puntos_suerte', 0);
  if (luckyPoints < 0) {
    result.isValid = false;
    result.errors['pus_puntos_suerte'] = `Lucky points cannot be negative (got ${luckyPoints})`;
  }

  const lifePoints = getCharacterProperty(character, 'pus_vida', 0);
  if (lifePoints < 0) {
    result.isValid = false;
    result.errors['pus_vida'] = `Life points cannot be negative (got ${lifePoints})`;
  }

  // 2. Validate statistics
  if (!validateCharacterStats(stats)) {
    result.isValid = false;
    result.errors['stats'] = 'Character statistics are invalid';
    
    // Provide more detailed information about stats issues
    if (!stats || !Array.isArray(stats)) {
      result.errors['stats_detail'] = 'Statistics data is missing or invalid format';
    } else if (stats.length < 6) {
      result.errors['stats_detail'] = `Incomplete statistics: expected 6, got ${stats.length}`;
    } else {
      // Check for specific stat problems
      stats.forEach((stat, index) => {
        if (!stat || typeof stat !== 'object') {
          result.errors[`stat_${index}`] = 'Invalid stat entry';
          return;
        }
        
        if (typeof stat.valueDice !== 'number' || isNaN(stat.valueDice)) {
          result.errors[`stat_${stat.id || index}_dice`] = `Invalid dice value for ${stat.label || 'stat'}`;
        } else if (stat.valueDice < 1 || stat.valueDice > 10) {
          result.errors[`stat_${stat.id || index}_dice`] = `Dice value out of range (1-10) for ${stat.label || 'stat'}`;
        }
        
        if (typeof stat.valueClass !== 'number' || isNaN(stat.valueClass)) {
          result.errors[`stat_${stat.id || index}_class`] = `Invalid class bonus for ${stat.label || 'stat'}`;
        } else if (stat.valueClass < 0 || stat.valueClass > 3) {
          result.errors[`stat_${stat.id || index}_class`] = `Class bonus out of range (0-3) for ${stat.label || 'stat'}`;
        }
        
        if (typeof stat.valueLevel !== 'number' || isNaN(stat.valueLevel)) {
          result.errors[`stat_${stat.id || index}_level`] = `Invalid level bonus for ${stat.label || 'stat'}`;
        } else if (stat.valueLevel < 0 || stat.valueLevel > 5) {
          result.errors[`stat_${stat.id || index}_level`] = `Level bonus out of range (0-5) for ${stat.label || 'stat'}`;
        }
      });
    }
  }

  // 3. Validate skills if provided
  if (skills && Array.isArray(skills)) {
    const hasEmptySkills = skills.some(skill => 
      !skill.id || !skill.name || (typeof skill.name === 'string' && skill.name.trim() === '')
    );
    
    if (hasEmptySkills) {
      result.warnings['skills'] = 'One or more skill slots are empty or incomplete';
    }
  }

  // 4. Validate inventory if provided
  if (inventory && Array.isArray(inventory)) {
    const hasInvalidItems = inventory.some(item => 
      !item.id || !item.name || (typeof item.name === 'string' && item.name.trim() === '')
    );
    
    if (hasInvalidItems) {
      result.warnings['inventory'] = 'One or more inventory items are incomplete';
    }
  }

  return result;
}
