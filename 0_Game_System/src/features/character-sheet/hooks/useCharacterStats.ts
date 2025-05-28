import { useCallback, useMemo } from 'react';
import { UseFormGetValues, UseFormSetValue, UseFieldArrayUpdate } from 'react-hook-form';
import { CharacterForm } from '../types/characterForm';
import { InputStats } from '@shared/utils/types/typesCharacterSheet';
import { DBPersonajesUsuario } from '@shared/utils/types/dbTypes';

/**
 * Props interface for the useCharacterStats hook
 */
interface UseCharacterStatsProps {
  getValues: UseFormGetValues<CharacterForm>;
  setValue: UseFormSetValue<CharacterForm>;
  updateStats: UseFieldArrayUpdate<CharacterForm, "stats">;
  character: DBPersonajesUsuario;
  optionsCharacterJob: Array<{ value: string; extraPoint: string }>;
  clearValidationError: (field: string) => void;
}

/**
 * Statistics generation types for random stat generation
 */
export type StatGenerationType = 'balanced' | 'heroic' | 'standard';

/**
 * Default statistics data used as fallback when form data is not available
 */
const DEFAULT_STATS_DATA: InputStats[] = [
  { id: 'STR', label: 'Fuerza', description: 'Fuerza física y potencia muscular', valueDice: 1, valueClass: 0, valueLevel: 0 },
  { id: 'INT', label: 'Inteligencia', description: 'Capacidad mental y conocimiento', valueDice: 1, valueClass: 0, valueLevel: 0 },
  { id: 'DEX', label: 'Destreza', description: 'Agilidad y precisión', valueDice: 1, valueClass: 0, valueLevel: 0 },
  { id: 'CON', label: 'Constitución', description: 'Resistencia y salud', valueDice: 1, valueClass: 0, valueLevel: 0 },
  { id: 'PER', label: 'Percepción', description: 'Atención y observación', valueDice: 1, valueClass: 0, valueLevel: 0 },
  { id: 'CHA', label: 'Carisma', description: 'Personalidad y liderazgo', valueDice: 1, valueClass: 0, valueLevel: 0 }
];

/**
 * Mapping of stat IDs to their form field names for individual field updates
 */
const STAT_FIELD_MAPPING: Record<string, { dice: string, class: string, level: string }> = {
  'STR': { dice: "strDice", class: "strClass", level: "strLevel" },
  'INT': { dice: "intDice", class: "intClass", level: "intLevel" },
  'DEX': { dice: "dexDice", class: "dexClass", level: "dexLevel" },
  'CON': { dice: "conDice", class: "conClass", level: "conLevel" },
  'PER': { dice: "perDice", class: "perClass", level: "perLevel" },
  'CHA': { dice: "chaDice", class: "chaClass", level: "chaLevel" }
};

/**
 * Mapping of class codes to their primary stat bonuses
 */
const CLASS_STAT_BONUSES: Record<string, string> = {
  "WAR": "STR", // Guerrero - Fuerza
  "MAG": "INT", // Mago - Inteligencia
  "SCO": "DEX", // Explorador - Destreza
  "MED": "CON", // Médico - Constitución
  "RES": "PER", // Investigador - Percepción
  "ACT": "CHA"  // Artista - Carisma
};

/**
 * Mapping for level-based stat bonuses by class
 */
const CLASS_TO_PRIMARY_STAT: Record<string, { index: number, statId: string, formField: string }> = {
  'WAR': { index: 0, statId: 'STR', formField: "strLevel" }, // STR
  'MAG': { index: 1, statId: 'INT', formField: "intLevel" }, // INT
  'SCO': { index: 2, statId: 'DEX', formField: "dexLevel" }, // DEX
  'MED': { index: 3, statId: 'CON', formField: "conLevel" }, // CON
  'RES': { index: 4, statId: 'PER', formField: "perLevel" }, // PER
  'ACT': { index: 5, statId: 'CHA', formField: "chaLevel" }  // CHA
};

/**
 * Class attributes for random stat generation
 */
const CLASS_ATTRIBUTES: Record<string, { primary: number, secondary: number, name: string, statId: string }> = {
  'WAR': { primary: 0, secondary: 3, name: 'Warrior', statId: 'STR' },    // STR, CON
  'MAG': { primary: 1, secondary: 4, name: 'Mage', statId: 'INT' },       // INT, PER
  'SCO': { primary: 2, secondary: 4, name: 'Scout', statId: 'DEX' },      // DEX, PER
  'MED': { primary: 3, secondary: 1, name: 'Medic', statId: 'CON' },      // CON, INT
  'RES': { primary: 4, secondary: 1, name: 'Researcher', statId: 'PER' }, // PER, INT
  'ACT': { primary: 5, secondary: 2, name: 'Artist', statId: 'CHA' }      // CHA, DEX
};

/**
 * Map of indices to stat IDs for direct access
 */
const STAT_ID_MAP = ['STR', 'INT', 'DEX', 'CON', 'PER', 'CHA'];

/**
 * Custom hook for managing character statistics
 * 
 * This hook encapsulates all logic related to character stats including:
 * - Validation of individual stats
 * - Calculation of total stat values
 * - Handling stat changes and updates
 * - Random stat generation
 * - Level-based stat adjustments
 * - Class and job bonus calculations
 * 
 * @param props - Hook configuration and dependencies
 * @returns Object with stat-related functions and data
 */
export function useCharacterStats({
  getValues,
  setValue,
  updateStats,
  character,
  optionsCharacterJob,
  clearValidationError
}: UseCharacterStatsProps) {

  /**
   * Get current stats from form with fallback to default data
   */
  const getInputStatsFromForm = useCallback((): InputStats[] => {
    const formStats = getValues("stats") || [];
    if (formStats.length < 6) return DEFAULT_STATS_DATA;
    
    return formStats.map((stat: InputStats) => ({
      id: stat.id,
      label: stat.label,
      description: stat.description,
      valueDice: stat.valueDice,
      valueClass: stat.valueClass,
      valueLevel: stat.valueLevel
    }));
  }, [getValues]);

  /**
   * Calculate total stats with memoization for performance optimization
   */
  const totalStats = useMemo(() => {
    const formStats = getValues("stats") || [];
    if (formStats.length < 6) return { str: 0, int: 0, dex: 0, con: 0, per: 0, cha: 0, total: 0 };
    
    const getStatById = (id: string) => formStats.find((s: InputStats) => s.id === id);
    
    const strStat = getStatById('STR');
    const intStat = getStatById('INT');
    const dexStat = getStatById('DEX');
    const conStat = getStatById('CON');
    const perStat = getStatById('PER');
    const chaStat = getStatById('CHA');
    
    return {
      str: strStat ? strStat.valueDice + strStat.valueClass + strStat.valueLevel : 0,
      int: intStat ? intStat.valueDice + intStat.valueClass + intStat.valueLevel : 0,
      dex: dexStat ? dexStat.valueDice + dexStat.valueClass + dexStat.valueLevel : 0,
      con: conStat ? conStat.valueDice + conStat.valueClass + conStat.valueLevel : 0,
      per: perStat ? perStat.valueDice + perStat.valueClass + perStat.valueLevel : 0,
      cha: chaStat ? chaStat.valueDice + chaStat.valueClass + chaStat.valueLevel : 0,
      total: formStats.reduce((sum: number, stat: any) => sum + stat.valueDice + stat.valueClass + stat.valueLevel, 0)
    };
  }, [getValues]);

  /**
   * Get the total value of a specific stat
   */
  const getStatTotal = useCallback((statId: string): number => {
    const statsMap: Record<string, number | undefined> = {
      'STR': totalStats.str,
      'INT': totalStats.int,
      'DEX': totalStats.dex,
      'CON': totalStats.con,
      'PER': totalStats.per,
      'CHA': totalStats.cha,
      'total': totalStats.total
    };

    const mappedValue = statsMap[statId];
    if (mappedValue !== undefined) {
      return mappedValue;
    }

    // Fallback calculation
    const fallbackFormStats = getValues("stats") || [];
    const stat = fallbackFormStats.find((s: InputStats) => s.id === statId);
    if (!stat) return 0;
    
    return stat.valueDice + stat.valueClass + stat.valueLevel;
  }, [totalStats, getValues]);

  /**
   * Validates a specific character stat and provides detailed feedback
   */
  const validateSingleStat = useCallback((statId: string, showAlert = false): {
    isValid: boolean;
    message?: string;
    totalValue: number;
  } => {
    const characterStats = getInputStatsFromForm();
    const stat = characterStats.find(s => s.id === statId);
    
    if (!stat) {
      const errorMsg = `Stat "${statId}" not found`;
      if (showAlert) alert(errorMsg);
      return { isValid: false, message: errorMsg, totalValue: 0 };
    }
    
    const totalValue = stat.valueDice + stat.valueClass + stat.valueLevel;
    
    // Validate dice value range (1-10)
    if (typeof stat.valueDice !== 'number' || isNaN(stat.valueDice) || stat.valueDice < 1 || stat.valueDice > 10) {
      const errorMsg = `${stat.label}: Base value must be between 1 and 10`;
      if (showAlert) alert(errorMsg);
      return { isValid: false, message: errorMsg, totalValue };
    }
    
    // Validate class bonus range (0-3)
    if (typeof stat.valueClass !== 'number' || isNaN(stat.valueClass) || stat.valueClass < 0 || stat.valueClass > 3) {
      const errorMsg = `${stat.label}: Class bonus must be between 0 and 3`;
      if (showAlert) alert(errorMsg);
      return { isValid: false, message: errorMsg, totalValue };
    }
    
    // Validate level bonus range (0-5)
    if (typeof stat.valueLevel !== 'number' || isNaN(stat.valueLevel) || stat.valueLevel < 0 || stat.valueLevel > 5) {
      const errorMsg = `${stat.label}: Level bonus must be between 0 and 5`;
      if (showAlert) alert(errorMsg);
      return { isValid: false, message: errorMsg, totalValue };
    }
    
    // Warning for unusually high values
    if (totalValue > 18) {
      const warningMsg = `${stat.label}: Total value ${totalValue} is unusually high`;
      console.warn(warningMsg);
    }
    
    return { isValid: true, totalValue };
  }, [getInputStatsFromForm]);

  /**
   * Handles changes to character stats and validates them
   */
  const handleStatsInputChange = useCallback((newInputStats: InputStats): boolean => {
    // Validate the stats values
    if (newInputStats.valueDice < 1 || newInputStats.valueDice > 6) {
      console.warn(`Invalid dice value for ${newInputStats.id}: ${newInputStats.valueDice}`);
      return false;
    }
    
    try {
      // Clear any previous validation errors
      clearValidationError(`stat${newInputStats.id}`);
      
      // 1. Update React Hook Form stats array (primary source of truth)
      const updateFormStats = getValues("stats") || [];
      const statIndex = updateFormStats.findIndex((stat: InputStats) => stat.id === newInputStats.id);
      
      if (statIndex !== -1) {
        const updatedStat = {
          ...updateFormStats[statIndex],
          valueDice: newInputStats.valueDice,
          valueClass: newInputStats.valueClass,
          valueLevel: newInputStats.valueLevel
        };
        
        updateStats(statIndex, updatedStat);
        console.log(`Estadística ${newInputStats.id} actualizada en React Hook Form`);
      } else {
        console.warn(`Stat with ID ${newInputStats.id} not found in form stats array`);
        return false;
      }
      
      // 2. Update React Hook Form individual fields (for compatibility)
      const fields = STAT_FIELD_MAPPING[newInputStats.id];
      if (fields) {
        setValue(fields.dice as keyof CharacterForm, newInputStats.valueDice);
        setValue(fields.class as keyof CharacterForm, newInputStats.valueClass);
        setValue(fields.level as keyof CharacterForm, newInputStats.valueLevel);
      }
      
      // Validate the updated stat
      const validationResult = validateSingleStat(newInputStats.id, false);
      
      if (!validationResult.isValid) {
        console.warn(`Stat validation issue: ${validationResult.message}`);
      } else {
        clearValidationError('stats');
      }
      
      return validationResult.isValid;
    } catch (error) {
      console.error("Error updating stats:", error);
      return false;
    }
  }, [clearValidationError, getValues, setValue, updateStats, validateSingleStat]);

  /**
   * Updates stat points based on selected class and job
   */
  const updStatsPoints = useCallback((selectedClass: string, selectedJob: string): void => {
    console.log("Actualizando puntos de estadísticas para", { 
      clase: selectedClass, 
      trabajo: selectedJob 
    });
    
    if (!selectedClass && !selectedJob) {
      console.warn("No se ha seleccionado clase ni trabajo, omitiendo actualización");
      return;
    }
    
    // Get job data
    const jobOption = optionsCharacterJob.find(option => option.value === selectedJob);
    const extraPoints = jobOption?.extraPoint || "";
    
    if (selectedJob && !jobOption) {
      console.warn(`Trabajo seleccionado "${selectedJob}" no encontrado en opciones`);
    }

    const primaryStat = selectedClass ? CLASS_STAT_BONUSES[selectedClass] : null;
    if (selectedClass && !primaryStat) {
      console.warn(`Clase seleccionada "${selectedClass}" no tiene estadística principal definida`);
    }
    
    // Update React Hook Form stats array
    const handleStatsFormStats = getValues("stats") || [];
    
    handleStatsFormStats.forEach((stat: InputStats, index: number) => {
      const classBonus = (primaryStat && stat.id === primaryStat) ? 2 : 0;
      const jobBonus = extraPoints.includes(stat.id) ? 1 : 0;
      const newClassValue = classBonus + jobBonus;
      if (stat.valueClass !== newClassValue) {
        const updatedStat = {
          ...stat,
          description: stat.description || '',
          valueClass: newClassValue
        };
        
        updateStats(index, updatedStat);
        
        console.log(`Estadística ${stat.id} actualizada en React Hook Form:`, {
          anterior: stat.valueClass,
          nuevo: newClassValue,
          bonoClase: classBonus,
          bonoTrabajo: jobBonus
        });
      }
    });
    
    // Update individual fields for compatibility
    handleStatsFormStats.forEach((stat: any) => {
      const fields = STAT_FIELD_MAPPING[stat.id];
      if (fields) {
        setValue(fields.class as keyof CharacterForm, stat.valueClass);
      }
    });
    
    console.log("Estadísticas actualizadas correctamente en React Hook Form");
  }, [optionsCharacterJob, getValues, updateStats, setValue]);

  /**
   * Generates random stats for a character based on their class and generation type
   */
  const randomRoll = useCallback((generationType: StatGenerationType = 'balanced'): boolean => {
    // Prevent stat changes for characters above level 1
    if (character?.pus_nivel && character.pus_nivel > 1) {
      alert("Random stats can only be generated for level 1 characters");
      return false;
    }

    // Check if character class is selected
    if (!character?.pus_clase) {
      alert("Please select a character class before generating random stats");
      return false;
    }

    try {
      // Get character class data
      let classData = CLASS_ATTRIBUTES[character.pus_clase];
      if (!classData) {
        console.warn(`Unknown character class: ${character.pus_clase}`);
        // If class not found, use random primary and secondary stats
        const primaryStat = Math.floor(Math.random() * 6);
        let secondaryStat;
        do {
          secondaryStat = Math.floor(Math.random() * 6);
        } while (secondaryStat === primaryStat);
        
        classData = { 
          primary: primaryStat, 
          secondary: secondaryStat, 
          name: 'Unknown', 
          statId: STAT_ID_MAP[primaryStat]
        };
      }
      
      console.log(`Generating ${generationType} stats for ${classData.name} class`);
      
      // Total points to distribute
      let totalPoints;
      switch (generationType) {
        case 'heroic':
          totalPoints = 18 + Math.floor(Math.random() * 3); // 18-20 points
          break;
        case 'standard':
          totalPoints = 12 + Math.floor(Math.random() * 5); // 12-16 points
          break;
        case 'balanced':
        default:
          totalPoints = 14 + Math.floor(Math.random() * 4); // 14-17 points
      }
      
      // Initialize new stat values
      const newStatValues: Record<string, number> = {
        'STR': 1, 'INT': 1, 'DEX': 1, 'CON': 1, 'PER': 1, 'CHA': 1
      };
      
      // Remaining points to distribute after minimum allocation
      let remainingPoints = totalPoints - 6; // 6 stats with minimum 1 each
      
      // Distribution weights based on generation type
      const weights = {
        primary: generationType === 'balanced' ? 0.5 : (generationType === 'heroic' ? 0.4 : 0.33),
        secondary: generationType === 'balanced' ? 0.3 : (generationType === 'heroic' ? 0.3 : 0.27),
        other: generationType === 'balanced' ? 0.2 : (generationType === 'heroic' ? 0.3 : 0.4)
      };
      
      // Distribute primary stat points
      const primaryPoints = Math.round(remainingPoints * weights.primary);
      const primaryStatId = STAT_ID_MAP[classData.primary];
      newStatValues[primaryStatId] += primaryPoints;
      remainingPoints -= primaryPoints;
      
      // Distribute secondary stat points
      const secondaryPoints = Math.round(remainingPoints * weights.secondary);
      const secondaryStatId = STAT_ID_MAP[classData.secondary];
      newStatValues[secondaryStatId] += secondaryPoints;
      remainingPoints -= secondaryPoints;
      
      // Random distribution of remaining points
      while (remainingPoints > 0) {
        let statIndex;
        const roll = Math.random();
        
        if (roll < 0.6) { // 60% chance to improve a tertiary stat
          const tertiaryIndices = [0, 1, 2, 3, 4, 5].filter(
            i => i !== classData.primary && i !== classData.secondary
          );
          statIndex = tertiaryIndices[Math.floor(Math.random() * tertiaryIndices.length)];
        } else if (roll < 0.85) { // 25% chance for secondary
          statIndex = classData.secondary;
        } else { // 15% chance for primary
          statIndex = classData.primary;
        }
        
        // Add a point if it doesn't exceed the maximum
        const statId = STAT_ID_MAP[statIndex];
        const maxStatValue = generationType === 'heroic' ? 6 : 5;
        if (newStatValues[statId] < maxStatValue) {
          newStatValues[statId] += 1;
          remainingPoints--;
        }
      }
      
      // Final validation to ensure no stat exceeds maximum values
      for (let i = 0; i < STAT_ID_MAP.length; i++) {
        const statId = STAT_ID_MAP[i];
        const maxValue = i === classData.primary ? 6 : 5;
        if (newStatValues[statId] > maxValue) {
          console.warn(`Stat ${statId} exceeded maximum value. Capping at ${maxValue}.`);
          newStatValues[statId] = maxValue;
        }
      }

      // Update React Hook Form individual fields (for backward compatibility)
      setValue("strDice", newStatValues['STR']);
      setValue("intDice", newStatValues['INT']);
      setValue("dexDice", newStatValues['DEX']);
      setValue("conDice", newStatValues['CON']);
      setValue("perDice", newStatValues['PER']);
      setValue("chaDice", newStatValues['CHA']);
      
      // Update the stats array in React Hook Form (primary source)
      const rollStatsFormStats = getValues("stats") || [];
      if (rollStatsFormStats.length >= 6) {
        for (let i = 0; i < rollStatsFormStats.length; i++) {
          const statId = STAT_ID_MAP[i];
          if (statId && rollStatsFormStats[i]) {
            updateStats(i, {
              ...rollStatsFormStats[i],
              valueDice: newStatValues[statId]
            });
          }
        }
      }
      
      // Show informative message
      console.log("Generated random stats:", 
        Object.entries(newStatValues).map(([id, value]) => `${id}: ${value}`).join(', '),
        `(Total: ${Object.values(newStatValues).reduce((sum, val) => sum + val, 0)})`
      );
      
      // Validate all stats after generation
      let allValid = true;
      const statIds = ['STR', 'INT', 'DEX', 'CON', 'PER', 'CHA'];
      
      statIds.forEach(statId => {
        const validationResult = validateSingleStat(statId);
        if (!validationResult.isValid) {
          allValid = false;
          console.warn(`Generated stat validation issue for ${statId}: ${validationResult.message}`);
        }
      });
      
      // Clear validation errors if all stats are valid
      if (allValid) {
        clearValidationError('stats');
      }
      
      return true;
    } catch (error) {
      console.error("Error generating random stats:", error);
      alert("An error occurred while generating random stats. Please try again.");
      return false;
    }
  }, [character?.pus_clase, character?.pus_nivel, setValue, getValues, updateStats, validateSingleStat, clearValidationError]);

  /**
   * Handle changes to character level and adjust stats accordingly
   */
  const handleLevelChange = useCallback((newLevel: number): boolean => {
    // Validate the new level
    if (isNaN(newLevel)) {
      console.error("Invalid level value: Not a number");
      alert("Character level must be a number between 1 and 10");
      return false;
    }
    
    if (newLevel < 1 || newLevel > 10) {
      console.error(`Level value out of valid range: ${newLevel}`);
      alert("Character level must be between 1 and 10");
      return false;
    }

    const previousLevel = character?.pus_nivel || 1;
    
    // If level hasn't changed, do nothing
    if (previousLevel === newLevel) {
      return true;
    }
    
    console.log(`Changing level from ${previousLevel} to ${newLevel}`);
    
    try {
      // Update level in React Hook Form first
      setValue("level", newLevel);
      
      // Get the primary stat info for this character's class
      const characterClass = character?.pus_clase || '';
      const primaryStat = CLASS_TO_PRIMARY_STAT[characterClass];
      
      if (!primaryStat) {
        console.warn(`Unknown character class: ${characterClass}. Stat bonuses not applied.`);
        return true;
      }
      
      // Calculate milestone level bonuses
      const previousMilestones = Math.floor((previousLevel - 1) / 3);
      const newMilestones = Math.floor((newLevel - 1) / 3);
      const bonusDifference = newMilestones - previousMilestones;
      
      if (bonusDifference === 0) {
        console.log("No milestone changes, no stat adjustments needed");
        clearValidationError('level');
        return true;
      }

      const levelFormStats = getValues("stats") || [];
      const currentBonus = levelFormStats[primaryStat.index]?.valueLevel || 0;
      
      // Calculate new level bonus (ensure it stays within valid range 0-3)
      const newBonus = Math.max(0, Math.min(3, currentBonus + bonusDifference));
      
      // Log the change being made
      if (bonusDifference > 0) {
        console.log(`Level ${newLevel}: Adding +${bonusDifference} to ${primaryStat.statId} (primary stat for ${characterClass})`);
      } else {
        console.log(`Level ${newLevel}: Reducing ${Math.abs(bonusDifference)} from ${primaryStat.statId} (primary stat for ${characterClass})`);
      }
      
      // Update React Hook Form fields based on the stat ID
      const levelField = STAT_FIELD_MAPPING[primaryStat.statId]?.level;
      if (levelField) {
        setValue(levelField as keyof CharacterForm, newBonus);
      }
      
      // Also update the stats array in React Hook Form
      if (levelFormStats.length > primaryStat.index) {
        updateStats(primaryStat.index, {
          ...levelFormStats[primaryStat.index],
          valueLevel: newBonus
        });
      }
      
      // Clear validation errors
      clearValidationError('level');
      return true;
    } catch (error) {
      console.error("Error updating character stats for level change:", error);
      alert("An error occurred while updating character stats. Please try again.");
      return false;
    }
  }, [character?.pus_clase, character?.pus_nivel, setValue, getValues, updateStats, clearValidationError]);

  return {
    // Data
    defaultStatsData: DEFAULT_STATS_DATA,
    totalStats,
    
    // Functions
    getInputStatsFromForm,
    getStatTotal,
    validateSingleStat,
    handleStatsInputChange,
    updStatsPoints,
    randomRoll,
    handleLevelChange
  };
}
