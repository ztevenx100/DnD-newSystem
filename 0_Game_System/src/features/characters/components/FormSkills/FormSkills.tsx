import React from 'react';
import { Select, SelectItem } from '@nextui-org/react';
import { SkillsAcquired, SkillTypes } from '../../types';
import { Option } from "@interfaces/typesCharacterSheet";
import { RING_TYPES } from '../../../../components/pages/UserCharacters/CharacterSheet/constants';

interface FormSkillsProps {
  level: number;
  alignment: string;
  skillsAcquired: SkillsAcquired[];
  skillsRingList: SkillTypes[];
  skillList: Option[];
  onSkillsChange: (skills: SkillsAcquired[]) => void;
  onAlignmentChange: (alignment: string) => void;
  disabled?: boolean;
}

const FormSkills: React.FC<FormSkillsProps> = ({
  level,
  alignment,
  skillsAcquired,
  skillsRingList,
  skillList,
  onSkillsChange,
  onAlignmentChange,
  disabled = false
}) => {
  const handleSkillChange = (skillIndex: number, value: string) => {
    const updatedSkills = [...skillsAcquired];
    updatedSkills[skillIndex] = {
      ...updatedSkills[skillIndex],
      name: value
    };
    onSkillsChange(updatedSkills);
  };

  const handleRingTypeChange = (skillIndex: number, type: string) => {
    const selectedRingType = RING_TYPES.find(ring => ring.stat === type);
    if (!selectedRingType) return;

    const updatedSkills = [...skillsAcquired];
    updatedSkills[skillIndex] = {
      ...updatedSkills[skillIndex],
      ring: type,
      stat: selectedRingType.stat
    };
    onSkillsChange(updatedSkills);
  };

  const getRequiredLevel = (index: number): number => {
    switch (index) {
      case 0: return 3;
      case 1: return 6;
      case 2: return 9;
      default: return 0;
    }
  };

  return (
    <fieldset className="fieldset-form skills-player col-span-1 row-span-2 bg-white shadow-lg rounded">
      <legend>Habilidades</legend>

      {level >= 3 && (
        <>
          <label htmlFor="alignment" className="form-lbl mt-2">
            Alineación
          </label>
          <select
            id="alignment"
            className="form-input mr-2"
            onChange={(e) => onAlignmentChange(e.target.value)}
            value={alignment}
            disabled={disabled}
          >
            <option value="" />
            <option value="O">Orden</option>
            <option value="C">Caos</option>
          </select>

          <div className="grid grid-cols-2 mt-4">
            <label className="form-lbl-skills ml-2 mb-0">Nivel</label>
            <label className="form-lbl-skills mr-2 mb-0">Anillo de poder</label>
          </div>

          {skillsAcquired.map((skill, index) => {
            const requiredLevel = getRequiredLevel(index);
            const isUnlocked = level >= requiredLevel;

            return (
              <div key={index} className="grid grid-cols-2 gap-2 mt-2">
                <Select
                  label={`Nivel ${requiredLevel}`}
                  selectedKeys={skill.name ? [skill.name] : []}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                  isDisabled={!isUnlocked || disabled}
                >
                  {skillList.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.name}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Tipo"
                  selectedKeys={skill.ring ? [skill.ring] : []}
                  onChange={(e) => handleRingTypeChange(index, e.target.value)}
                  isDisabled={!isUnlocked || disabled}
                >
                  {RING_TYPES.map((ring) => (
                    <SelectItem key={ring.stat} value={ring.stat}>
                      {ring.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            );
          })}
        </>
      )}
    </fieldset>
  );
};

export default FormSkills;