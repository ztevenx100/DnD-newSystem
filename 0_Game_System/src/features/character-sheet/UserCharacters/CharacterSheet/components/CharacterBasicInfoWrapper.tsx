import React from 'react';
import CharacterBasicInfo from './CharacterBasicInfo';
import { useCharacterSheet } from '../context/CharacterSheetContext';
import { Option } from '../context/CharacterSheetTypes';

interface CharacterBasicInfoWrapperProps {
  externalStyles: string;
  name: string;
  characterClass: string;
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
 * Este componente es un wrapper que nos permite utilizar el nuevo componente CharacterBasicInfo
 * manteniendo compatibilidad con la interfaz del componente FormSelectInfoPlayer original.
 * 
 * Es un componente transitorio que nos permite refactorizar gradualmente.
 */
const CharacterBasicInfoWrapper: React.FC<CharacterBasicInfoWrapperProps> = ({
  externalStyles,
  name,
  characterClass,
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
  // Intento de usar el contexto, pero solo para logging en esta etapa
  // En futuras iteraciones, utilizaremos completamente el contexto
  try {
    const context = useCharacterSheet();
    console.log('Contexto disponible en CharacterBasicInfoWrapper:', !!context);
  } catch (error) {
    console.log('Contexto aún no disponible en CharacterBasicInfoWrapper');
  }
  
  // Por ahora, seguimos utilizando los props que recibimos
  // para mantener la compatibilidad con el componente actual
  
  return (
    <div className={'basic-info-wrapper ' + externalStyles}>
      <CharacterBasicInfo
        name={name}
        class={characterClass}
        race={race}
        job={job}
        level={level}
        alignment={alignment}
        classOptions={classOptions}
        raceOptions={raceOptions}
        jobOptions={jobOptions}
        onNameChange={onNameChange}
        onClassChange={onClassChange}
        onRaceChange={onRaceChange}
        onJobChange={onJobChange}
        onLevelChange={onLevelChange}
        onAlignmentChange={onAlignmentChange}
      />
    </div>
  );
};

export default CharacterBasicInfoWrapper;
