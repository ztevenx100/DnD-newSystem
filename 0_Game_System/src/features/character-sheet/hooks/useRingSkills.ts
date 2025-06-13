import { useCallback } from 'react';
import { UseFormReturn, Path } from 'react-hook-form';
import { SkillsAcquired } from '@/shared/utils/types/typesCharacterSheet';
import { CharacterForm } from '../types/characterForm';

/**
 * Custom hook to manage ring skills in a React Hook Form context
 * This hook provides functions to interact with skills array data
 * while ensuring React Hook Form is the primary source of truth
 * 
 * @param methods - UseFormReturn object from React Hook Form
 * @returns Helper functions for skill management
 */
export const useRingSkills = (
  methods: UseFormReturn<CharacterForm>
) => {
  const { getValues, setValue } = methods;

  /**
   * Get the skills array from React Hook Form or fallback to default
   * @returns The current skills array
   */
  const getSkillsFromForm = useCallback((): SkillsAcquired[] => {
    try {
      const formSkills = getValues("skills");
      if (!formSkills || formSkills.length < 3) {
        // Return default structure if form skills are incomplete
        return [
          { id: "", value: "0", name: "", description: "", ring: "" },
          { id: "", value: "1", name: "", description: "", ring: "" },
          { id: "", value: "2", name: "", description: "", ring: "" },
        ];
      }
      
      // Return clean copy with all properties preserved
      return formSkills.map(skill => ({
        ...skill,
        // Ensure core properties are always defined
        id: skill.id || "",
        value: skill.value || "",
        name: skill.name || "",
        description: skill.description || "",
        ring: skill.ring || "",
        stat: skill.stat || skill.ring || "" // Add stat property if missing
      }));
    } catch (error) {
      console.error("Error retrieving skills from form:", error);
      // Return default structure on error
      return [
        { id: "", value: "0", name: "", description: "", ring: "" },
        { id: "", value: "1", name: "", description: "", ring: "" },
        { id: "", value: "2", name: "", description: "", ring: "" },
      ];
    }
  }, [getValues]);

  /**
   * Update a ring skill in the form
   * @param index - The index of the skill to update
   * @param updates - Partial skill data to update
   */
  const updateRingSkill = useCallback((
    index: number,
    updates: Partial<SkillsAcquired>
  ): void => {
    try {
      const skills = getSkillsFromForm();
      if (index < 0 || index >= skills.length) {
        console.warn(`Invalid skill index: ${index}`);
        return;
      }

      // Update the skill with new values
      const updatedSkill = {
        ...skills[index],
        ...updates
      };

      // Update in React Hook Form
      const formPath = `skills.${index}` as Path<CharacterForm>;
      setValue(formPath, updatedSkill, {
        shouldValidate: true,
        shouldDirty: true
      });
    } catch (error) {
      console.error("Error updating ring skill:", error);
    }
  }, [getSkillsFromForm, setValue]);

  /**
   * Update ring type for a specific skill
   * @param index - The skill index
   * @param ringType - The new ring type
   */
    const updateRingType = useCallback((
    index: number | string,
    ringType: string
  ): void => {
    const skillIndex = typeof index === 'string' ? parseInt(index, 10) : index;
    if (isNaN(skillIndex)) {
      console.warn("Invalid skill index:", index);
      return;
    }
      // Evitar actualizaciones innecesarias si el valor es el mismo
    const allSkills = getValues("skills");
    const currentSkill = allSkills && Array.isArray(allSkills) ? allSkills[skillIndex] : undefined;
    const currentRingType = currentSkill?.ring;
    
    if (currentRingType === ringType) {
      return; // No actualizar si el valor no ha cambiado
    }

    updateRingSkill(skillIndex, { ring: ringType });
  }, [updateRingSkill, getValues]);

  /**
   * Set a skill name for a specific ring
   * @param index - The skill index
   * @param skillName - The skill name to set
   * @param ringType - The associated ring type (optional)
   * @param statType - The associated stat type (optional)
   */
  const setRingSkillName = useCallback((
    index: number | string,
    skillName: string,
    ringType?: string,
    statType?: string
  ): void => {
    const skillIndex = typeof index === 'string' ? parseInt(index, 10) : index;
    if (isNaN(skillIndex)) {
      console.warn("Invalid skill index:", index);
      return;
    }
    
    // Obtener los valores actuales para compararlos
    const currentSkills = getSkillsFromForm();
    if (skillIndex >= currentSkills.length) {
      console.warn(`Invalid skill index: ${skillIndex}, max: ${currentSkills.length-1}`);
      return;
    }
    
    const currentSkill = currentSkills[skillIndex];
    const newRingType = ringType || currentSkill?.ring || "";
    const newStatType = statType || ringType || currentSkill?.stat || "";
    
    // Solo actualizar si hay cambios reales
    if (currentSkill.id === skillName && 
        currentSkill.name === skillName && 
        currentSkill.ring === newRingType && 
        currentSkill.stat === newStatType) {
      return; // No hay cambios, evitar actualización
    }

    // Actualizar con los nuevos valores
    updateRingSkill(skillIndex, {
      id: skillName,
      name: skillName,
      ring: newRingType,
      stat: newStatType
    });
  }, [getSkillsFromForm, updateRingSkill]);

  return {
    getSkillsFromForm,
    updateRingSkill,
    updateRingType,
    setRingSkillName
  };
};

export default useRingSkills;
