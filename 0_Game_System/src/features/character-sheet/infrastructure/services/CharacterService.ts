import { v4 as uuidv4 } from 'uuid';

// Types
import { 
  DBPersonajesUsuario, 
  DBEstadisticaPersonaje, 
  DBHabilidadPersonaje, 
  DBInventarioPersonaje 
} from '@shared/utils/types/dbTypes';
import { InputStats, SkillsAcquired } from '@shared/utils/types/typesCharacterSheet';
import { CharacterForm } from '../../types/characterForm';

// Database functions
import { 
  updateCharacter, 
  insertPus, 
  updateCharacterStats, 
  deleteItemInventory 
} from './database';
import { 
  insertDataEpe, 
  upsertDataHpe, 
  upsertDataInp 
} from '@database/models/dbTables';

// Validation helpers
import { validateCharacter } from '@shared/utils/helpers/characterHelpers';

/**
 * Character Service
 * 
 * This service centralizes all character-related database operations,
 * providing a clean interface for character CRUD operations and
 * separating database logic from UI components.
 */
export class CharacterService {
  
  /**
   * Saves or updates basic character information
   * 
   * @param character - The character data to save
   * @param formValues - Current form values from React Hook Form
   * @param isNewRecord - Whether this is a new character or an update
   * @returns The ID of the saved character
   */
  static async saveCharacterInfo(
    character: DBPersonajesUsuario,
    formValues: CharacterForm,
    isNewRecord: boolean
  ): Promise<string> {
    if (!character) {
      throw new Error("No character data available to save");
    }

    // Update character object with the latest form values
    const updatedCharacter = this.updateCharacterFromForm(character, formValues);

    // Validate character data before saving
    const missingFields = validateCharacter(updatedCharacter);
    if (missingFields.length > 0) {
      throw new Error(`Datos incompletos del personaje: ${missingFields.join(', ')}`);
    }
    
    try {
      console.log("Saving character data with form values:", { character: updatedCharacter, formValues });
      
      if (!isNewRecord) {
        const data = await updateCharacter(updatedCharacter);
        if (!data) throw new Error("No se recibió respuesta al actualizar el personaje");
        console.log("Character updated successfully:", data);
        return data.pus_id;
      } else {
        const data = await insertPus(updatedCharacter);
        if (!data) throw new Error("No se recibió respuesta al insertar el personaje");
        console.log("Character inserted successfully:", data);
        return data.pus_id;
      }
    } catch (error) {
      console.error("Error saving character data:", error);
      throw error;
    }
  }

  /**
   * Saves character statistics to the database
   * 
   * @param characterStats - Array of character stats from form
   * @param characterId - The ID of the character
   * @param isNewCharacter - Whether this is a new character or an update
   */
  static async saveCharacterStats(
    characterStats: InputStats[],
    characterId: string,
    isNewCharacter: boolean
  ): Promise<void> {
    if (!characterId) return;
    
    // Map of stat IDs to their labels for building database records
    const statLabels = {
      'STR': 'Fuerza',
      'INT': 'Inteligencia',
      'DEX': 'Destreza',
      'CON': 'Constitución',
      'PER': 'Percepción',
      'CHA': 'Carisma'
    };
    
    // Build stat records
    const stats: DBEstadisticaPersonaje[] = characterStats.map(stat => ({
      epe_id: uuidv4(),
      epe_personaje: characterId,
      epe_sigla: stat.id,
      epe_nombre: statLabels[stat.id as keyof typeof statLabels] || stat.label,
      epe_num_dado: stat.valueDice,
      epe_num_clase: stat.valueClass,
      epe_num_nivel: stat.valueLevel,
    }));
    
    try {
      if (!isNewCharacter) {
        // Update each stat record individually
        for (const stat of stats) {
          await updateCharacterStats(stat);
        }
        console.log(`Updated ${stats.length} stats for character ${characterId}`);
      } else {
        // Insert all stats at once for new character
        await insertDataEpe(stats);
        console.log(`Inserted ${stats.length} stats for new character ${characterId}`);
      }
    } catch (error) {
      console.error("Error saving character stats:", error);
      throw error;
    }
  }

  /**
   * Saves character skills to the database
   * 
   * @param formValues - Current form values containing skill data
   * @param characterSkills - Ring skills data
   * @param characterId - The ID of the character
   * @param fieldSkill - Legacy field skill data (fallback)
   */
  static async saveCharacterSkills(
    formValues: CharacterForm,
    characterSkills: SkillsAcquired[],
    characterId: string,
    fieldSkill?: Array<{ field: string; skill: string }>
  ): Promise<void> {
    if (!characterId) return;

    const saveSkill: DBHabilidadPersonaje[] = [];
    
    // Add main skill (try React Hook Form first, fall back to local state)
    const mainSkillId = formValues.skillClass || 
      fieldSkill?.find(skill => skill.field === "skillClass")?.skill || '';
      
    if (mainSkillId) {
      saveSkill.push({
        hpe_id: uuidv4(),
        hpe_personaje: characterId,
        hpe_habilidad: mainSkillId,
        hpe_campo: "skillClass",
        hpe_alineacion: null,
      });
    } else {
      console.warn("No main skill found for character");
    }
    
    // Add extra skill (try React Hook Form first, fall back to local state)
    const extraSkillId = formValues.skillExtra || 
      fieldSkill?.find(skill => skill.field === "skillExtra")?.skill || '';
      
    if (extraSkillId) {
      saveSkill.push({
        hpe_id: uuidv4(),
        hpe_personaje: characterId,
        hpe_habilidad: extraSkillId,
        hpe_campo: "skillExtra",
        hpe_alineacion: null,
      });
    } else {
      console.warn("No extra skill found for character");
    }

    // Add ring skills
    for (let index = 0; index < characterSkills.length; index++) {
      if (!characterSkills[index].id) continue;
      saveSkill.push({
        hpe_id: uuidv4(),
        hpe_personaje: characterId,
        hpe_habilidad: characterSkills[index].id,
        hpe_campo: "skillRing" + characterSkills[index].value,
        hpe_alineacion: formValues.alignment || null,
      });
    }

    try {
      console.log(`Saving ${saveSkill.length} skills for character ${characterId}`, saveSkill);
      await upsertDataHpe(saveSkill);
    } catch (error) {
      console.error("Error saving character skills:", error);
      throw error;
    }
  }

  /**
   * Saves character inventory to the database
   * 
   * @param inventoryItems - Array of inventory items from form
   * @param characterId - The ID of the character
   * @param deleteItems - Array of item IDs to delete
   */
  static async saveCharacterInventory(
    inventoryItems: Array<{ id: string; name: string; description: string; count: number }>,
    characterId: string,
    deleteItems: string[] = []
  ): Promise<void> {
    if (!characterId) return;

    const saveItems: DBInventarioPersonaje[] = inventoryItems.map(item => ({
      inp_id: item.id,
      inp_personaje: characterId,
      inp_nombre: item.name,
      inp_descripcion: item.description,
      inp_cantidad: item.count,
    }));

    try {
      await upsertDataInp(saveItems);
      if (deleteItems.length > 0) {
        await deleteItemInventory(deleteItems);
      }
      console.log(`Saved ${saveItems.length} inventory items for character ${characterId}`);
    } catch (error) {
      console.error("Error saving character inventory:", error);
      throw error;
    }
  }

  /**
   * Orchestrates the complete character save process
   * 
   * @param character - The character data to save
   * @param formValues - Current form values from React Hook Form
   * @param characterStats - Character statistics
   * @param characterSkills - Ring skills data
   * @param inventoryItems - Inventory items
   * @param isNewRecord - Whether this is a new character
   * @param deleteItems - Items to delete from inventory
   * @param fieldSkill - Legacy field skill data (fallback)
   * @returns The ID of the saved character
   */
  static async saveCompleteCharacter(
    character: DBPersonajesUsuario,
    formValues: CharacterForm,
    characterStats: InputStats[],
    characterSkills: SkillsAcquired[],
    inventoryItems: Array<{ id: string; name: string; description: string; count: number }>,
    isNewRecord: boolean,
    deleteItems: string[] = [],
    fieldSkill?: Array<{ field: string; skill: string }>
  ): Promise<string> {
    
    // Validate essential character fields first
    const missingFields = validateCharacter(character);
    if (missingFields.length > 0) {
      throw new Error(`Datos incompletos del personaje: ${missingFields.join(', ')}`);
    }

    console.log("Starting complete character save process", { 
      isNewRecord, 
      characterId: character.pus_id,
      username: character.pus_usuario,
      formValues
    });
    
    // Step 1: Save character basic information
    const characterId = await this.saveCharacterInfo(character, formValues, isNewRecord);
    
    if (!characterId) {
      throw new Error("No se pudo guardar la información básica del personaje");
    }
    
    console.log("Character base info saved successfully with ID:", characterId);

    // Step 2: Save all remaining data in parallel for better performance
    try {
      console.log("Uploading additional character data...");
      await Promise.all([
        this.saveCharacterStats(characterStats, characterId, isNewRecord)
          .catch(err => {
            console.error("Stats upload failed:", err);
            throw new Error(`Error al guardar estadísticas: ${err.message}`);
          }),
        this.saveCharacterSkills(formValues, characterSkills, characterId, fieldSkill)
          .catch(err => {
            console.error("Skills upload failed:", err);
            throw new Error(`Error al guardar habilidades: ${err.message}`);
          }),
        this.saveCharacterInventory(inventoryItems, characterId, deleteItems)
          .catch(err => {
            console.error("Inventory upload failed:", err);
            throw new Error(`Error al guardar inventario: ${err.message}`);
          }),
      ]);
      
      console.log("All character data saved successfully");
      return characterId;
    } catch (error) {
      console.error("Error during additional character data upload:", error);
      throw error;
    }
  }

  /**
   * Updates character object with form values
   * 
   * @param character - Current character object
   * @param formValues - Form values to merge
   * @returns Updated character object
   */
  private static updateCharacterFromForm(
    character: DBPersonajesUsuario,
    formValues: CharacterForm
  ): DBPersonajesUsuario {
    return {
      ...character,
      pus_nombre: formValues.name,
      pus_nivel: Number(formValues.level),
      pus_suerte: Number(formValues.luckyPoints),
      pus_vida: Number(formValues.lifePoints),
      pus_descripcion: formValues.characterDescription || '',
      pus_alineacion: formValues.alignment || '',
      pus_arma_principal: formValues.mainWeapon,
      pus_arma_secundaria: formValues.secondaryWeapon,
      pus_cantidad_oro: formValues.goldCoins,
      pus_cantidad_plata: formValues.silverCoins,
      pus_cantidad_bronce: formValues.bronzeCoins,
    };
  }
}
