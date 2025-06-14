import React from 'react';
import './CharacterSkills.css';
import { Option, SkillsAcquired, SkillTypes } from '@shared/utils/types/typesCharacterSheet';

interface CharacterSkillsProps {
  alignment: string;
  level: number;
  skills: SkillsAcquired[];
  ringTypes: Option[];
  skillsRingList: SkillTypes[];
  onAlignmentChange: (value: string) => void;
  onSkillRingChange: (ringIndex: string, value: string, field: string) => void;
}

const CharacterSkills: React.FC<CharacterSkillsProps> = ({
  alignment,
  level,
  skills,
  ringTypes,
  skillsRingList,
  onAlignmentChange,
  onSkillRingChange
}) => {
  // Niveles requeridos para cada anillo
  const ringLevelRequirements = [3, 6, 9];

  return (
    <div className="character-skills-container">
      <div className="skills-header">
        <h3 className="skills-title">Habilidades del Personaje</h3>
      </div>
      
      <div className="alignment-selector">
        <label htmlFor="alignment" className="field-label">
          Alineación
        </label>
        <select
          id="alignment"
          className="field-input"
          value={alignment}
          onChange={(e) => onAlignmentChange(e.target.value)}
        >
          <option value="">Selecciona una alineación</option>
          <option value="O">Orden</option>
          <option value="C">Caos</option>
        </select>
      </div>
      
      <div className="ring-skills-grid">
        {/* Mapeo de los 3 anillos de habilidades */}
        {[0, 1, 2].map((ringIndex) => {
          const isDisabled = level < ringLevelRequirements[ringIndex];
          const ringSkill = skills[ringIndex] || { id: "", value: ringIndex.toString(), name: "", description: "", ring: "" };
          const currentRingTypesList = skillsRingList[ringIndex]?.skills || [];
          
          return (
            <div 
              key={`ring-${ringIndex}`} 
              className={`skill-ring ${isDisabled ? 'disabled' : ''}`}
            >
              <div className="ring-header">
                <span className="ring-level">Anillo Nivel {ringLevelRequirements[ringIndex]}</span>
                <span className="ring-position">{isDisabled ? 'Bloqueado' : 'Disponible'}</span>
              </div>
              
              <div className="ring-fields">
                <div className="ring-field">
                  <div className="skill-field">
                    <label htmlFor={`ringType-${ringIndex}`} className="field-label">
                      Tipo de Anillo
                    </label>
                    <select
                      id={`ringType-${ringIndex}`}
                      className="field-input"
                      value={ringSkill.ring || ""}
                      onChange={(e) => onSkillRingChange(ringIndex.toString(), e.target.value, "ring")}
                      disabled={isDisabled}
                    >
                      <option value="">Selecciona un tipo</option>
                      {ringTypes.map((ring) => (
                        <option key={ring.id} value={ring.value}>
                          {ring.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="skill-field">
                    <label htmlFor={`ringSkill-${ringIndex}`} className="field-label">
                      Habilidad
                    </label>
                    <select
                      id={`ringSkill-${ringIndex}`}
                      className="field-input"
                      value={ringSkill.id || ""}
                      onChange={(e) => onSkillRingChange(ringIndex.toString(), e.target.value, "id")}
                      disabled={isDisabled || !ringSkill.ring}
                    >
                      <option value="">Selecciona una habilidad</option>
                      {currentRingTypesList.map((skill) => (
                        <option key={skill.id} value={skill.id}>
                          {skill.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CharacterSkills;
