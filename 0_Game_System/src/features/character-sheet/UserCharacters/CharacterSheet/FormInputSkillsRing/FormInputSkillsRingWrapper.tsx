import React from 'react';
import { useCharacterSheet } from '../context/CharacterSheetContext';
import FormInputSkillsRing from './FormInputSkillsRing';
import { SkillTypes, SkillsAcquired } from '@/shared/utils/types/typesCharacterSheet';

interface RingTypes {
  id: string;
  name: string;
  stat: string;
}

/**
 * Props para el FormInputSkillsRingWrapper
 */
interface FormInputSkillsRingWrapperProps {
  id: string;
  level: number;
  levelEvaluated: number;
  ringTypes: RingTypes[];
  skillList: SkillTypes;
  values: SkillsAcquired;
  externalStyles?: string;
}

/**
 * Wrapper component que conecta FormInputSkillsRing con el contexto de CharacterSheet
 * 
 * Este componente:
 * - Obtiene los handlers del contexto (handleSelectedRingSkillChange, handleSelectedTypeRingSkillChange)
 * - Pasa las props necesarias al componente original
 * - Mantiene la compatibilidad con el comportamiento existente
 */
const FormInputSkillsRingWrapper: React.FC<FormInputSkillsRingWrapperProps> = ({
  id,
  level,
  levelEvaluated,
  ringTypes,
  skillList,
  values,
  externalStyles = '',
}) => {
  const { 
    handleSelectedRingSkillChange, 
    handleSelectedTypeRingSkillChange 
  } = useCharacterSheet();

  return (
    <div className={externalStyles}>
      <FormInputSkillsRing
        id={id}
        level={level}
        levelEvaluated={levelEvaluated}
        ringTypes={ringTypes}
        skillList={skillList}
        values={values}
        onSelectChange={handleSelectedRingSkillChange}
        onSelectTypeChange={handleSelectedTypeRingSkillChange}
      />
    </div>
  );
};

// Memoize the component for performance optimization
export default React.memo(FormInputSkillsRingWrapper);
