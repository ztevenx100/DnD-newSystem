import React from 'react';
import CharacterSkills from './CharacterSkills';
import { Option, SkillsAcquired, SkillTypes } from '@shared/utils/types/typesCharacterSheet';

interface CharacterSkillsWrapperProps {
  externalStyles?: string;
  alignment: string;
  level: number;
  skills: SkillsAcquired[];
  ringTypes: Option[];
  skillsRingList: SkillTypes[];
  onAlignmentChange: (value: string) => void;
  onSkillRingChange: (ringIndex: string, value: string, field: string) => void;
}

const CharacterSkillsWrapper: React.FC<CharacterSkillsWrapperProps> = ({
  externalStyles = '',
  alignment,
  level,
  skills,
  ringTypes,
  skillsRingList,
  onAlignmentChange,
  onSkillRingChange
}) => {
  return (
    <div className={externalStyles}>
      <CharacterSkills
        alignment={alignment}
        level={level}
        skills={skills}
        ringTypes={ringTypes}
        skillsRingList={skillsRingList}
        onAlignmentChange={onAlignmentChange}
        onSkillRingChange={onSkillRingChange}
      />
    </div>
  );
};

export default CharacterSkillsWrapper;
