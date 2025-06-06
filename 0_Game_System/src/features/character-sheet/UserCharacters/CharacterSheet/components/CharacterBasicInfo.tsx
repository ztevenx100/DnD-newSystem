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
  emptyRequiredFields?: string[]; // Nuevo prop para manejar validación visual
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
  emptyRequiredFields = [], // Valor por defecto
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
        <label htmlFor="characterName" className="form-lbl col-start-1 col-end-2 bg-grey-lighter">
          Nombre del Personaje
        </label>
        <input
          id="characterName"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className={`form-input-y col-start-2 col-end-3 mr-2 ${
            emptyRequiredFields.includes('name') ? 'required-input' : ''
          }`}
        />
      </div>
      
      <div className="info-group">
        <label htmlFor="characterClass" className="form-lbl col-start-1 col-end-2 bg-grey-lighter">
          Clase
        </label>
        <select
          id="characterClass"
          value={characterClass}
          onChange={(e) => onClassChange(e.target.value)}
          className={`form-input col-start-2 col-end-3 mr-2 ${
            emptyRequiredFields.includes('characterClass') ? 'required-input' : ''
          }`}
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
        <label htmlFor="characterRace" className="form-lbl col-start-1 col-end-2 bg-grey-lighter">
          Raza
        </label>
        <select
          id="characterRace"
          value={race}
          onChange={(e) => onRaceChange(e.target.value)}
          className={`form-input col-start-2 col-end-3 mr-2 ${
            emptyRequiredFields.includes('characterRace') ? 'required-input' : ''
          }`}
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
        <label htmlFor="characterJob" className="form-lbl col-start-1 col-end-2 bg-grey-lighter">
          Trabajo/Profesión
        </label>
        <select
          id="characterJob"
          value={job}
          onChange={(e) => onJobChange(e.target.value)}
          className={`form-input col-start-2 col-end-3 mr-2 ${
            emptyRequiredFields.includes('characterJob') ? 'required-input' : ''
          }`}
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
        <label htmlFor="characterLevel" className="form-lbl col-start-1 col-end-2 bg-grey-lighter">Nivel</label>
        <input
          id="characterLevel"
          type="number"
          min="1"
          max="20"
          value={level}
          onChange={(e) => onLevelChange(parseInt(e.target.value, 10) || 1)}
          className={`form-input-y col-start-2 col-end-3 mr-2 ${
            emptyRequiredFields.includes('level') ? 'required-input' : ''
          }`}
        />
      </div>
      <div className="info-group">
        <label className="form-lbl col-start-1 col-end-2 bg-grey-lighter">Alineamiento</label>
        <div className="alignment-options col-start-2 col-end-3 mr-2">
          <button
            className={`orden ${alignment === 'O' ? 'selected' : ''}`}
            onClick={() => onAlignmentChange('O')}
          >
            Orden
          </button>
          <button
            className={`caos ${alignment === 'C' ? 'selected' : ''}`}
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
