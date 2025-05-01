import { DBPersonajesUsuario, InputStats, InventoryObject, SkillsAcquired } from '../types';

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
  if (!character.nombre) {
    errors.push({ field: 'name', message: 'Character name is required' });
  }

  if (!character.raza) {
    errors.push({ field: 'race', message: 'Character race is required' });
  }

  // Validate stats
  if (stats.length === 0) {
    errors.push({ field: 'stats', message: 'Character must have stats' });
  } else {
    const requiredStats = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
    const missingStats = requiredStats.filter(
      requiredStat => !stats.some(stat => stat.name === requiredStat)
    );

    if (missingStats.length > 0) {
      errors.push({
        field: 'stats',
        message: `Missing required stats: ${missingStats.join(', ')}`
      });
    }

    stats.forEach(stat => {
      if (stat.value < 0 || stat.value > 20) {
        errors.push({
          field: `stats.${stat.name}`,
          message: `${stat.name} must be between 0 and 20`
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
    if (item.quantity < 0) {
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