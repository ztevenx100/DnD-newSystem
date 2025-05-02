import { useState, useCallback } from 'react';
import { DBPersonajesUsuario } from "@core/types/characters/characterDbTypes";
import { CHARACTER_JOBS } from '../../../components/pages/UserCharacters/CharacterSheet/constants';

export function useProfile(initialCharacter?: DBPersonajesUsuario) {
  const [character, setCharacter] = useState<DBPersonajesUsuario>(initialCharacter || {
    pus_nivel: 1,
    pus_puntos_suerte: 0,
    pus_vida: 10,
    pus_conocimientos: '',
    pus_cantidad_oro: 0,
    pus_cantidad_plata: 0,
    pus_cantidad_bronce: 0,
  } as DBPersonajesUsuario);

  const updateField = useCallback(<K extends keyof DBPersonajesUsuario>(
    field: K,
    value: DBPersonajesUsuario[K]
  ) => {
    setCharacter(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateLevel = useCallback((level: number) => {
    setCharacter(prev => ({
      ...prev,
      pus_nivel: Math.max(1, Math.min(10, level))
    }));
  }, []);

  const updateLuckyPoints = useCallback((points: number) => {
    setCharacter(prev => ({
      ...prev,
      pus_puntos_suerte: Math.max(0, Math.min(10, points))
    }));
  }, []);

  const updateLifePoints = useCallback((points: number) => {
    setCharacter(prev => ({
      ...prev,
      pus_vida: Math.max(1, Math.min(10, points))
    }));
  }, []);

  const updateClass = useCallback((characterClass: string) => {
    setCharacter(prev => ({
      ...prev,
      pus_clase: characterClass
    }));
  }, []);

  const updateRace = useCallback((race: string) => {
    setCharacter(prev => ({
      ...prev,
      pus_raza: race
    }));
  }, []);

  const updateJob = useCallback((job: string) => {
    const jobInfo = CHARACTER_JOBS.find(j => j.value === job);
    setCharacter(prev => ({
      ...prev,
      pus_trabajo: job,
      pus_trabajo_puntos_extra: jobInfo?.extraPoint || ''
    }));
  }, []);

  const updateKnowledge = useCallback((knowledge: string[]) => {
    setCharacter(prev => ({
      ...prev,
      pus_conocimientos: knowledge.join(',')
    }));
  }, []);

  const updateImage = useCallback((url: string) => {
    setCharacter(prev => ({
      ...prev,
      url_character_image: url
    }));
  }, []);

  return {
    character,
    setCharacter,
    updateField,
    updateLevel,
    updateLuckyPoints,
    updateLifePoints,
    updateClass,
    updateRace,
    updateJob,
    updateKnowledge,
    updateImage
  };
}