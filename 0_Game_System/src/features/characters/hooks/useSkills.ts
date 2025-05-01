import { useState, useCallback, useMemo } from 'react';
import { SkillsAcquired, SkillTypes } from '../types';
import { RING_TYPES } from '../../../components/pages/UserCharacters/CharacterSheet/constants';

export function useSkills(
  initialSkills?: SkillsAcquired[],
  initialRingList?: SkillTypes[],
  characterLevel: number = 1
) {
  const [skillsAcquired, setSkillsAcquired] = useState<SkillsAcquired[]>(initialSkills || []);
  const [skillsRingList, setSkillsRingList] = useState<SkillTypes[]>(initialRingList || []);

  const availableSkillSlots = useMemo(() => {
    if (characterLevel < 3) return 0;
    return Math.floor((characterLevel - 1) / 3);
  }, [characterLevel]);

  const addSkill = useCallback((skill: SkillsAcquired) => {
    setSkillsAcquired(prev => [...prev, skill]);
  }, []);

  const updateSkill = useCallback((index: number, updates: Partial<SkillsAcquired>) => {
    setSkillsAcquired(prev => 
      prev.map((skill, i) => 
        i === index ? { ...skill, ...updates } : skill
      )
    );
  }, []);

  const removeSkill = useCallback((index: number) => {
    setSkillsAcquired(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateRingList = useCallback((ringType: string, skills: string[]) => {
    setSkillsRingList(prev => {
      const existingIndex = prev.findIndex(item => item.id === ringType);
      if (existingIndex >= 0) {
        return prev.map((item, index) =>
          index === existingIndex ? { ...item, skills } : item
        );
      }
      return [...prev, { id: ringType, skills }];
    });
  }, []);

  const getAvailableSkillsByRing = useCallback((ringType: string) => {
    const ring = skillsRingList.find(r => r.id === ringType);
    return ring?.skills || [];
  }, [skillsRingList]);

  const validateSkillLevel = useCallback((skillIndex: number): boolean => {
    const requiredLevel = (skillIndex + 1) * 3;
    return characterLevel >= requiredLevel;
  }, [characterLevel]);

  const getRingTypeStats = useCallback((ringType: string) => {
    return RING_TYPES.find(ring => ring.value === ringType)?.name || '';
  }, []);

  return {
    skillsAcquired,
    skillsRingList,
    availableSkillSlots,
    setSkillsAcquired,
    setSkillsRingList,
    addSkill,
    updateSkill,
    removeSkill,
    updateRingList,
    getAvailableSkillsByRing,
    validateSkillLevel,
    getRingTypeStats
  };
}