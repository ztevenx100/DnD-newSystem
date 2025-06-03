/**
 * Utilidades y hooks para facilitar la refactorización del componente CharacterSheet
 * Este archivo contiene funciones auxiliares y hooks que nos ayudarán a mover
 * la lógica desde el componente principal al contexto.
 */

import { useEffect, useState } from 'react';
import { useCharacterSheet } from '../context/CharacterSheetContext';

/**
 * Hook para gestionar la carga de la imagen del personaje
 * Este hook abstrae la lógica para cargar la imagen del personaje desde el almacenamiento.
 */
export const useCharacterImage = () => {
  const { user, params, getCharacterImage, characterImage, handleCharacterImageFileChange } = useCharacterSheet();

  // Efecto para cargar la imagen del personaje
  useEffect(() => {
    if (!params.id) return;
    
    // En esta etapa inicial, esto es solo un stub
    // En futuras iteraciones, implementaremos la lógica completa
    console.log('Se debería cargar la imagen del personaje con ID:', params.id, user);
    
    // getCharacterImage();
  }, [params.id, getCharacterImage]);

  return {
    characterImage,
    handleCharacterImageFileChange
  };
};

/**
 * Función para normalizar la gestión de errores durante la refactorización
 */
export const withRefactoringErrorHandler = async <T,>(
  action: () => Promise<T>,
  actionName: string
): Promise<T | null> => {
  try {
    return await action();
  } catch (error) {
    console.error(`Error durante la refactorización (${actionName}):`, error);
    return null;
  }
};

/**
 * Hook para determinar si debemos usar el contexto o los props directamente
 * durante la fase de transición
 */
export const useRefactoringMode = () => {
  const [useContext, setUseContext] = useState(false);
  
  useEffect(() => {
    // En futuras fases, determinaremos si usar el contexto 
    // basándonos en las variables de entorno o configuración
    const checkContextMode = () => {
      try {
        // Intenta acceder al contexto para ver si está disponible
        const context = useCharacterSheet();
        if (context) {
          setUseContext(true);
          console.log("Modo de refactorización: Usando contexto");
        }
      } catch (error) {
        setUseContext(false);
        console.log("Modo de refactorización: Usando props directamente");
      }
    };
    
    checkContextMode();
  }, []);
  
  return { useContext };
};

/**
 * Hook para facilitar la migración gradual de estadísticas
 */
export const useStatsRefactoring = (directProps: any) => {
  const { useContext } = useRefactoringMode();
  let result = {
    stats: directProps.stats,
    updateStat: directProps.onStatChange,
    getTotalStat: directProps.getStatTotal
  };
    // En el futuro, intentaremos usar el contexto si está disponible
  if (useContext) {
    try {
      const contextData = useCharacterSheet();
      // Adaptamos las propiedades del contexto a la interfaz que necesitamos
      result = {
        // Obtener stats del formulario usando métodos del contexto
        stats: contextData.getValues("stats") || directProps.stats,
        // Función para actualizar stats (adaptada)
        updateStat: (id: string, field: string, value: number) => {
          // Actualizar en el contexto usando el índice del stat
          const currentStats = contextData.getValues("stats") || [];
          const statIndex = currentStats.findIndex((stat: { id: string }) => stat.id === id);
          if (statIndex >= 0) {
            // Crear una copia del stat para actualizar
            const updatedStat = { ...currentStats[statIndex] };
            
            // Actualizar la propiedad correspondiente
            if (field === 'valueDice') updatedStat.valueDice = value;
            else if (field === 'valueClass') updatedStat.valueClass = value;
            else if (field === 'valueLevel') updatedStat.valueLevel = value;
            
            // Actualizar el array completo con el nuevo stat
            const updatedStats = [...currentStats];
            updatedStats[statIndex] = updatedStat;
            
            contextData.setValue("stats", updatedStats);
          }
        },
        // Usar la función getStatTotal del contexto
        getTotalStat: contextData.getStatTotal || directProps.getStatTotal
      };
    } catch (error) {
      console.log("Fallback a props directos para estadísticas", error);
    }
  }
  
  // Retornamos el resultado final
  return result;
};

/**
 * Hook para facilitar la migración gradual de información básica del personaje
 */
export const useBasicInfoRefactoring = (directProps: any) => {
  const { useContext } = useRefactoringMode();
  
  // Valor por defecto usando props
  let result = { ...directProps };
  
  if (useContext) {
    try {
      const context = useCharacterSheet();
      result = {
        name: context.getValues("name") || directProps.name,
        characterClass: context.getValues("class") || directProps.characterClass,
        race: context.getValues("race") || directProps.race,
        job: context.getValues("job") || directProps.job,
        level: context.getValues("level") || directProps.level,
        alignment: context.getValues("alignment") || directProps.alignment,
        classOptions: directProps.classOptions, // Mantenemos las opciones del prop
        raceOptions: directProps.raceOptions, // Mantenemos las opciones del prop
        jobOptions: directProps.jobOptions, // Mantenemos las opciones del prop
        // Funciones de cambio - preferimos usar el contexto si está disponible
        onNameChange: (value: string) => {
          context.setValue("name", value);
          context.clearValidationError("name");
          if (directProps.onNameChange) directProps.onNameChange(value);
        },
        onClassChange: (value: string) => {
          if (context.handleCharacterClassChange) {
            context.handleCharacterClassChange(value);
          } else if (directProps.onClassChange) {
            directProps.onClassChange(value);
          }
        },
        onRaceChange: (value: string) => {
          if (context.handleSelectRaceChange) {
            context.handleSelectRaceChange(value);
          } else if (directProps.onRaceChange) {
            directProps.onRaceChange(value);
          }
        },
        onJobChange: (value: string) => {
          if (context.handleCharacterJobSelectChange) {
            context.handleCharacterJobSelectChange(value);
          } else if (directProps.onJobChange) {
            directProps.onJobChange(value);
          }
        },
        onLevelChange: (value: number) => {
          context.setValue("level", value);
          if (directProps.onLevelChange) directProps.onLevelChange(value);
        },
        onAlignmentChange: (value: string) => {
          context.setValue("alignment", value);
          context.clearValidationError("alignment");
          if (directProps.onAlignmentChange) directProps.onAlignmentChange(value);
        }
      };
    } catch (error) {
      console.log("Fallback a props directos para información básica", error);
    }
  }
  
  return result;
};
