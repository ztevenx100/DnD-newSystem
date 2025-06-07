import React from 'react';
import CharacterStats from './CharacterStats';
import { useCharacterSheet } from '../context/CharacterSheetContext';
import { InputStats } from '../context/CharacterSheetTypes';

interface CharacterStatsWrapperProps {
  inputStats: InputStats;
  onSelectedValuesChange: (newInputStats: InputStats) => void;
  externalStyles?: string;
}

/**
 * Este componente es un wrapper que nos permite utilizar el nuevo componente CharacterStats
 * manteniendo compatibilidad con la interfaz del componente FormInputStats original.
 * 
 * Es un componente transitorio que nos permite refactorizar gradualmente.
 */
const CharacterStatsWrapper: React.FC<CharacterStatsWrapperProps> = React.memo(({
  inputStats,
  onSelectedValuesChange,
  externalStyles = ''
}) => {
  // Intentamos usar el contexto para funciones comunes
  let context: ReturnType<typeof useCharacterSheet> | undefined;
  try {
    context = useCharacterSheet();
    // Eliminamos el log para evitar spam en consola
  } catch (error) {
    context = undefined;
  }
    // Calculamos el total de los valores de estadística
  // Intentamos usar el contexto si está disponible, de lo contrario fallback a la lógica local
  const getStatTotal = (statId: string): number => {
    if (context && context.getStatTotal) {
      const contextTotal = context.getStatTotal(statId);
      if (contextTotal !== 0) {
        return contextTotal;
      }
    }
    
    if (statId === inputStats.id) {
      return inputStats.valueDice + inputStats.valueClass + inputStats.valueLevel;
    }
    return 0;
  };
  
  // Función adaptadora para manejar cambios en los valores de estadísticas
  const handleStatChange = (
    statId: string, 
    field: 'valueDice' | 'valueClass' | 'valueLevel', 
    value: number
  ) => {
    if (statId === inputStats.id) {
      const updatedStats = { ...inputStats };
      updatedStats[field] = value;
      onSelectedValuesChange(updatedStats);
    }
  };
  
  return (
    <div className={'stats-wrapper ' + externalStyles}>
      <CharacterStats
        stats={[inputStats]}
        onStatChange={handleStatChange}
        getStatTotal={getStatTotal}
      />
    </div>
  );
});

export default CharacterStatsWrapper;
