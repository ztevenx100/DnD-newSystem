import { CharacterClassOption, CharacterRaceOption, CharacterJobOption, CharacterKnowledgeOption, RingTypeOption } from './types';

export const CHARACTER_CLASSES: CharacterClassOption[] = [
  { value: 'WAR', name: 'Guerrero', work: 'STR' },
  { value: 'MAG', name: 'Mago', work: 'INT' },
  { value: 'SCO', name: 'Explorador', work: 'DEX' },
  { value: 'MED', name: 'Médico', work: 'CON' },
  { value: 'RES', name: 'Investigador', work: 'PER' },
  { value: 'ACT', name: 'Actor', work: 'CHA' }
];

export const CHARACTER_RACES: CharacterRaceOption[] = [
  { value: 'HUM', name: 'Humano' },
  { value: 'ELF', name: 'Elfo' },
  { value: 'DWA', name: 'Enano' },
  { value: 'AAS', name: 'Aasimars' },
  { value: 'TIF', name: 'Tieflings' }
];

export const CHARACTER_JOBS: CharacterJobOption[] = [
  { value: 'HUN', name: 'Cazador', extraPoint: 'DEX' },
  { value: 'BLA', name: 'Herrero', extraPoint: 'STR' },
  { value: 'ART', name: 'Artista', extraPoint: 'CHA' },
  { value: 'SAG', name: 'Sabio', extraPoint: 'INT' },
  { value: 'PRI', name: 'Sacerdote', extraPoint: 'CON' },
  { value: 'STR', name: 'Estratega', extraPoint: 'PER' }
];

export const CHARACTER_KNOWLEDGE: CharacterKnowledgeOption[] = [
  { value: 'STR', name: 'Fuerza' },
  { value: 'INT', name: 'Inteligencia' },
  { value: 'DEX', name: 'Destreza' },
  { value: 'CON', name: 'Constitución' },
  { value: 'PER', name: 'Percepción' },
  { value: 'CHA', name: 'Carisma' }
];

export const RING_TYPES: RingTypeOption[] = [
  { id: 'STR', name: 'Anillo de Fuerza', stat: 'STR' },
  { id: 'INT', name: 'Anillo de Inteligencia', stat: 'INT' },
  { id: 'DEX', name: 'Anillo de Destreza', stat: 'DEX' },
  { id: 'CON', name: 'Anillo de Constitución', stat: 'CON' },
  { id: 'PER', name: 'Anillo de Percepción', stat: 'PER' },
  { id: 'CHA', name: 'Anillo de Carisma', stat: 'CHA' }
];