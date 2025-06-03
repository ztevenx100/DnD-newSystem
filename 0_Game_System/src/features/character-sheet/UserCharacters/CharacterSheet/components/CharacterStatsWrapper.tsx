import React from 'react';
import CharacterStats from './CharacterStats';
import { useCharacterSheet } from '../context/CharacterSheetContext';
import { InputStats } from '../context/CharacterSheetTypes';

interface CharacterStatsWrapperProps {
  externalStyles: string;
  statsData: InputStats[];
  handleStatsChange: (statId: string, field: string, value: number) => void;
  getStatTotal: (statId: string) => number;
}

/**
 * Este componente es un wrapper que nos permite utilizar el nuevo componente CharacterStats
 * manteniendo compatibilidad con la interfaz del componente FormInputStats original.
 * 
 * Es un componente transitorio que nos permite refactorizar gradualmente.
 */
const CharacterStatsWrapper: React.FC<CharacterStatsWrapperProps> = ({
  externalStyles,
  statsData,
  handleStatsChange,
  getStatTotal,
}) => {
  // Intento de usar el contexto, pero solo para logging en esta etapa
  // En futuras iteraciones, utilizaremos completamente el contexto
  try {
    const context = useCharacterSheet();
    console.log('Contexto disponible en CharacterStatsWrapper:', !!context);
  } catch (error) {
    console.log('Contexto aún no disponible en CharacterStatsWrapper');
  }
  
  // Por ahora, seguimos utilizando los props que recibimos
  // para mantener la compatibilidad con el componente actual
  
  // Adaptador para la función de cambio de estadísticas
  const handleStatChange = (
    statId: string, 
    field: 'valueDice' | 'valueClass' | 'valueLevel', 
    value: number
  ) => {
    handleStatsChange(statId, field, value);
  };
  
  return (
    <div className={'stats-wrapper ' + externalStyles}>
      <CharacterStats
        stats={statsData}
        onStatChange={handleStatChange}
        getStatTotal={getStatTotal}
      />
    </div>
  );
};

export default CharacterStatsWrapper;
