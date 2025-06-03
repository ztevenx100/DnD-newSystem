import React from 'react';
import { Option } from '../context/CharacterSheetTypes';

interface CharacterBasicInfoProps {
  name: string; 
  class: string;
  race: string;
  job: string;
  level: number;
  alignment: string;
  classOptions: Option[];
  raceOptions: Option[];
  jobOptions: Option[];
  onNameChange: (value: string) => void;
  onClassChange: (value: string) => void;
  onRaceChange: (value: string) => void;
  onJobChange: (value: string) => void;
  onLevelChange: (value: number) => void;
  onAlignmentChange: (value: string) => void;
}

/**
 * Componente para mostrar y gestionar la información básica del personaje
 */
export const CharacterBasicInfo: React.FC<CharacterBasicInfoProps> = ({
  name,
  class: characterClass,
  race,
  job,
  level,
  alignment,
  classOptions,
  raceOptions,
  jobOptions,
  onNameChange,
  onClassChange,
  onRaceChange,
  onJobChange,
  onLevelChange,
  onAlignmentChange
}) => {
  return (
    <div className="character-basic-info">
      <div className="info-group">
        <label htmlFor="characterName">Nombre del Personaje</label>
        <input
          id="characterName"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>
      
      <div className="info-group">
        <label htmlFor="characterClass">Clase</label>
        <select
          id="characterClass"
          value={characterClass}
          onChange={(e) => onClassChange(e.target.value)}
        >
          <option value="">Selecciona una clase</option>
          {classOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="info-group">
        <label htmlFor="characterRace">Raza</label>
        <select
          id="characterRace"
          value={race}
          onChange={(e) => onRaceChange(e.target.value)}
        >
          <option value="">Selecciona una raza</option>
          {raceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="info-group">
        <label htmlFor="characterJob">Trabajo/Profesión</label>
        <select
          id="characterJob"
          value={job}
          onChange={(e) => onJobChange(e.target.value)}
        >
          <option value="">Selecciona un trabajo</option>
          {jobOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="info-group">
        <label htmlFor="characterLevel">Nivel</label>
        <input
          id="characterLevel"
          type="number"
          min="1"
          max="20"
          value={level}
          onChange={(e) => onLevelChange(parseInt(e.target.value, 10) || 1)}
        />
      </div>
      
      <div className="info-group">
        <label>Alineamiento</label>
        <div className="alignment-options">
          <button
            className={`alignment-button ${alignment === 'O' ? 'selected' : ''}`}
            onClick={() => onAlignmentChange('O')}
          >
            Orden
          </button>
          <button
            className={`alignment-button ${alignment === 'C' ? 'selected' : ''}`}
            onClick={() => onAlignmentChange('C')}
          >
            Caos
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterBasicInfo;
