import { useState, useCallback } from 'react';
import { Option } from "@interfaces/typesCharacterSheet";
import { WEAPONS_LIST } from '../../../components/pages/UserCharacters/CharacterSheet/constants';

export function useWeapons(
  initialMainWeapon?: string,
  initialSecondaryWeapon?: string,
  initialMainSkill?: string,
  initialExtraSkill?: string
) {
  const [mainWeapon, setMainWeapon] = useState(initialMainWeapon || '');
  const [secondaryWeapon, setSecondaryWeapon] = useState(initialSecondaryWeapon || '');
  const [mainSkill, setMainSkill] = useState(initialMainSkill || '');
  const [extraSkill, setExtraSkill] = useState(initialExtraSkill || '');

  const updateMainWeapon = useCallback((weapon: string) => {
    if (!weapon || WEAPONS_LIST.includes(weapon)) {
      setMainWeapon(weapon);
    }
  }, []);

  const updateSecondaryWeapon = useCallback((weapon: string) => {
    if (!weapon || WEAPONS_LIST.includes(weapon)) {
      setSecondaryWeapon(weapon);
    }
  }, []);

  const updateMainSkill = useCallback((skill: string) => {
    setMainSkill(skill);
  }, []);

  const updateExtraSkill = useCallback((skill: string) => {
    setExtraSkill(skill);
  }, []);

  const validateWeaponSelection = useCallback((): boolean => {
    return !!mainWeapon && (!secondaryWeapon || WEAPONS_LIST.includes(secondaryWeapon));
  }, [mainWeapon, secondaryWeapon]);

  const validateSkillSelection = useCallback((availableSkills: Option[]): boolean => {
    const skillValues = availableSkills.map(skill => skill.value);
    return (
      (!mainSkill || skillValues.includes(mainSkill)) &&
      (!extraSkill || skillValues.includes(extraSkill)) &&
      mainSkill !== extraSkill
    );
  }, [mainSkill, extraSkill]);

  return {
    mainWeapon,
    secondaryWeapon,
    mainSkill,
    extraSkill,
    updateMainWeapon,
    updateSecondaryWeapon,
    updateMainSkill,
    updateExtraSkill,
    validateWeaponSelection,
    validateSkillSelection
  };
}