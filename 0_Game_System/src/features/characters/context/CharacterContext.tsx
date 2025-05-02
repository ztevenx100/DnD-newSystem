import React, { createContext, useContext, useReducer } from 'react';
import { DBPersonajesUsuario, InputStats, InventoryObject, SkillsAcquired } from '@core/types/characters';
import { validateCharacter } from '../utils/validation';

interface CharacterState {
  character: DBPersonajesUsuario | null;
  stats: InputStats[];
  inventory: InventoryObject[];
  skills: SkillsAcquired[];
  errors: { field: string; message: string }[];
  isLoading: boolean;
}

type CharacterAction =
  | { type: 'SET_CHARACTER'; payload: DBPersonajesUsuario }
  | { type: 'UPDATE_STATS'; payload: InputStats[] }
  | { type: 'UPDATE_INVENTORY'; payload: InventoryObject[] }
  | { type: 'UPDATE_SKILLS'; payload: SkillsAcquired[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_CHARACTER' };

const initialState: CharacterState = {
  character: null,
  stats: [],
  inventory: [],
  skills: [],
  errors: [],
  isLoading: false,
};

const CharacterContext = createContext<{
  state: CharacterState;
  dispatch: React.Dispatch<CharacterAction>;
} | undefined>(undefined);

function characterReducer(state: CharacterState, action: CharacterAction): CharacterState {
  switch (action.type) {
    case 'SET_CHARACTER':
      return {
        ...state,
        character: action.payload,
        errors: state.character ? validateCharacter(action.payload, state.stats, state.inventory, state.skills).errors : [],
      };
    case 'UPDATE_STATS':
      return {
        ...state,
        stats: action.payload,
        errors: state.character ? validateCharacter(state.character, action.payload, state.inventory, state.skills).errors : [],
      };
    case 'UPDATE_INVENTORY':
      return {
        ...state,
        inventory: action.payload,
        errors: state.character ? validateCharacter(state.character, state.stats, action.payload, state.skills).errors : [],
      };
    case 'UPDATE_SKILLS':
      return {
        ...state,
        skills: action.payload,
        errors: state.character ? validateCharacter(state.character, state.stats, state.inventory, action.payload).errors : [],
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'CLEAR_CHARACTER':
      return initialState;
    default:
      return state;
  }
}

export function CharacterProvider({ children, initialCharacter }: { children: React.ReactNode; initialCharacter?: DBPersonajesUsuario }) {
  const [state, dispatch] = useReducer(characterReducer, {
    ...initialState,
    character: initialCharacter || null
  });

  return (
    <CharacterContext.Provider value={{ state, dispatch }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
}

// Helper hooks for specific character data
export function useCharacterStats() {
  const { state, dispatch } = useCharacter();
  return {
    stats: state.stats,
    updateStats: (stats: InputStats[]) => dispatch({ type: 'UPDATE_STATS', payload: stats }),
  };
}

export function useCharacterInventory() {
  const { state, dispatch } = useCharacter();
  return {
    inventory: state.inventory,
    updateInventory: (inventory: InventoryObject[]) => 
      dispatch({ type: 'UPDATE_INVENTORY', payload: inventory }),
  };
}

export function useCharacterSkills() {
  const { state, dispatch } = useCharacter();
  return {
    skills: state.skills,
    updateSkills: (skills: SkillsAcquired[]) => 
      dispatch({ type: 'UPDATE_SKILLS', payload: skills }),
  };
}