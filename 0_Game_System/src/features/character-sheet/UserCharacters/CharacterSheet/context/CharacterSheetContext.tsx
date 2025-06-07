import React, { createContext, useContext, ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CharacterForm } from '@features/character-sheet/types/characterForm';
import {
  DBSistemaJuego,
  Option,
  SkillFields,
  SkillTypes,
  StatsTotal,
  DBUsuario
} from './CharacterSheetTypes';

// Interfaz para el contexto de la hoja de personaje
interface CharacterSheetContextType {
  // Propiedades del formulario
  methods: UseFormReturn<CharacterForm>;
  register: any;
  setValue: any;
  getValues: any;
  control: any;
  errors: any;
  handleSubmit: any;
  watch: any;
  
  // Estados principales
  loading: boolean;
  newRecord: boolean;
  characterImage?: string;
  
  // Estados del sistema de juego
  systemGame: DBSistemaJuego;
  SystemGameList: Option[];
  
  // Estados de habilidades
  skillsRingList: SkillTypes[];
  fieldSkill: SkillFields[];
  optionsSkillClass: Option[];
  optionsSkillExtra: Option[];
  skillsTypes: SkillTypes[];
  
  // Validación
  emptyRequiredFields: string[];
  clearValidationError: (fieldId: string) => void;
  
  // Funciones handler
  handleCharacterClassChange: (value: string) => void;
  handleCharacterJobSelectChange: (value: string) => void;
  handleSelectRaceChange: (value: string) => void;
  handleSystemGameChange: (currentSystem: string) => void;
  handleSelectSkillChange: (currentSkill: string) => void;
  handleSelectExtraSkillChange: (currentSkill: string) => void;
  handleCharacterImageFileChange: (value: string, file: File) => Promise<void>;
  handleSelectedRingSkillChange: (id: string, ring: string, skill: string, stat: string) => void;
  handleSelectedTypeRingSkillChange: (id: string, type: string) => Promise<void>;
  handleAddObject: () => void;
  
  // Funciones para obtener datos
  getInventory: () => Promise<void>;
  getStats: () => Promise<void>;
  getSkills: () => Promise<void>;
  getCharacterImage: () => Promise<void>;
  
  // Estadísticas y utilidades
  totalStats: StatsTotal;
  getStatTotal: (statId: string) => number;
  
  // Datos del usuario y personaje
  user: DBUsuario;
  
  // Utilidades de React Router DOM
  params: any;
  navigate: any;
}

// Crear el contexto
const CharacterSheetContext = createContext<CharacterSheetContextType | undefined>(undefined);

// Provider para el contexto
interface CharacterSheetProviderProps {
  children: ReactNode;
  value: CharacterSheetContextType;
}

export const CharacterSheetProvider: React.FC<CharacterSheetProviderProps> = ({ children, value }) => {
  return (
    <CharacterSheetContext.Provider value={value}>
      {children}
    </CharacterSheetContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useCharacterSheet = (): CharacterSheetContextType => {
  const context = useContext(CharacterSheetContext);
  if (context === undefined) {
    throw new Error('useCharacterSheet must be used within a CharacterSheetProvider');
  }
  return context;
};

export default CharacterSheetContext;
