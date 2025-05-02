import { InputStats, SkillsAcquired } from '../types';
import { DBPersonajesUsuario, InventoryObject } from '@core/types/characters/characterDbTypes';

// Función para validar los requisitos mínimos para guardar un personaje
export function validateSaveRequirements(character: DBPersonajesUsuario): boolean {
  // Verificar campos requeridos
  if (!character.pus_id || !character.pus_usuario || !character.pus_nombre) {
    return false;
  }

  // Verificar campos numéricos
  if (typeof character.pus_nivel !== 'number' || 
      typeof character.pus_puntos_suerte !== 'number' || 
      typeof character.pus_vida !== 'number') {
    return false;
  }

  // Verificar campos de moneda
  if (typeof character.pus_cantidad_oro !== 'number' || 
      typeof character.pus_cantidad_plata !== 'number' || 
      typeof character.pus_cantidad_bronce !== 'number') {
    return false;
  }

  return true;
}

// Función para generar estadísticas aleatorias para un personaje
export function generateRandomStats(): InputStats[] {
  const statIds = ['STR', 'INT', 'DEX', 'CON', 'PER', 'CHA'];
  const statLabels = ['Fuerza', 'Inteligencia', 'Destreza', 'Constitución', 'Percepción', 'Carisma'];
  
  return statIds.map((id, index) => ({
    id,
    label: statLabels[index],
    valueDice: Math.floor(Math.random() * 6) + 1, // Valor aleatorio entre 1 y 6
    valueClass: 0,
    valueLevel: 0,
    strength: id === 'STR' ? 1 : 0,
    dexterity: id === 'DEX' ? 1 : 0,
    intelligence: id === 'INT' ? 1 : 0,
    constitution: id === 'CON' ? 1 : 0,
    charisma: id === 'CHA' ? 1 : 0,
    perception: id === 'PER' ? 1 : 0
  }));
}

interface ValidationResult {
  isValid: boolean;
  errors: { field: string; message: string }[];
}

export function validateCharacter(
  character: DBPersonajesUsuario,
  stats: InputStats[],
  inventory: InventoryObject[],
  skills: SkillsAcquired[]
): ValidationResult {
  const errors: { field: string; message: string }[] = [];

  // Validate character basic info
  if (!character.pus_nombre) {
    errors.push({ field: 'name', message: 'Character name is required' });
  }

  if (!character.pus_raza) {
    errors.push({ field: 'race', message: 'Character race is required' });
  }

  // Validate stats
  if (stats.length === 0) {
    errors.push({ field: 'stats', message: 'Character must have stats' });
  } else {
    const requiredStats = ['STR', 'DEX', 'CON', 'INT', 'PER', 'CHA'];
    const missingStats = requiredStats.filter(
      requiredStat => !stats.some(stat => stat.id === requiredStat)
    );

    if (missingStats.length > 0) {
      errors.push({
        field: 'stats',
        message: `Missing required stats: ${missingStats.join(', ')}`
      });
    }

    stats.forEach(stat => {
      const totalValue = (stat.valueDice || 0) + (stat.valueClass || 0) + (stat.valueLevel || 0);
      if (totalValue < 0 || totalValue > 20) {
        errors.push({
          field: `stats.${stat.id}`,
          message: `${stat.label} must be between 0 and 20`
        });
      }
    });
  }

  // Validate inventory
  inventory.forEach((item, index) => {
    if (!item.name) {
      errors.push({
        field: `inventory[${index}]`,
        message: 'Item name is required'
      });
    }
    if (item.count < 0) {
      errors.push({
        field: `inventory[${index}]`,
        message: 'Item quantity cannot be negative'
      });
    }
  });

  // Validate skills
  skills.forEach((skill, index) => {
    if (!skill.name) {
      errors.push({
        field: `skills[${index}]`,
        message: 'Skill name is required'
      });
    }
    if (skill.level < 0 || skill.level > 5) {
      errors.push({
        field: `skills[${index}]`,
        message: 'Skill level must be between 0 and 5'
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}