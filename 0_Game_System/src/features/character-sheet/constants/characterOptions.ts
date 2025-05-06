import { Option, CheckboxItem, RingTypes } from '@shared/utils/types';

export const optionsCharacterClass: Option[] = [
    { value: 'WAR', name: 'Guerrero', mainStat: 'STR', work: 'CAZADOR' },
    { value: 'MAG', name: 'Mago', mainStat: 'INT', work: 'SABIO' },
    { value: 'SCO', name: 'Explorador', mainStat: 'DEX', work: 'HERRERO' },
    { value: 'MED', name: 'Médico', mainStat: 'CON', work: 'SACERDOTE' },
    { value: 'RES', name: 'Investigador', mainStat: 'PER', work: 'ESTRATEGA' },
    { value: 'ACT', name: 'Actor', mainStat: 'CHA', work: 'ARTISTA' }
];

export const optionsCharacterRace: Option[] = [
    { value: 'HUM', name: 'Humano' },
    { value: 'ELF', name: 'Elfo' },
    { value: 'DWA', name: 'Enano' },
    { value: 'AAS', name: 'Aasimar' },
    { value: 'TIE', name: 'Tiefling' }
];

export const optionsCharacterJob: Option[] = [
    { value: 'CAZADOR', name: 'Cazador', extraPoint: 'STR' },
    { value: 'SABIO', name: 'Sabio', extraPoint: 'INT' },
    { value: 'HERRERO', name: 'Herrero', extraPoint: 'DEX' },
    { value: 'SACERDOTE', name: 'Sacerdote', extraPoint: 'CON' },
    { value: 'ESTRATEGA', name: 'Estratega', extraPoint: 'PER' },
    { value: 'ARTISTA', name: 'Artista', extraPoint: 'CHA' }
];

export const optionsRingTypes: RingTypes[] = [
    { id: 'STR', value: 'STR', name: 'Fuerza', stat: 'STR' },
    { id: 'INT', value: 'INT', name: 'Inteligencia', stat: 'INT' },
    { id: 'DEX', value: 'DEX', name: 'Destreza', stat: 'DEX' },
    { id: 'CON', value: 'CON', name: 'Constitución', stat: 'CON' },
    { id: 'PER', value: 'PER', name: 'Percepción', stat: 'PER' },
    { id: 'CHA', value: 'CHA', name: 'Carisma', stat: 'CHA' }
];

export const listWearpons: string[] = [
    'Espada corta',
    'Espada larga',
    'Hacha',
    'Arco',
    'Daga',
    'Bastón',
    'Vara',
    'Escudo',
    'Martillo'
];

export const checkboxesData: CheckboxItem[] = [
    { id: 'CAZADOR', value: 'CAZADOR', name: 'Caza' },
    { id: 'SABIO', value: 'SABIO', name: 'Sabiduría' },
    { id: 'HERRERO', value: 'HERRERO', name: 'Herrería' },
    { id: 'SACERDOTE', value: 'SACERDOTE', name: 'Religión' },
    { id: 'ESTRATEGA', value: 'ESTRATEGA', name: 'Estrategia' },
    { id: 'ARTISTA', value: 'ARTISTA', name: 'Arte' }
];