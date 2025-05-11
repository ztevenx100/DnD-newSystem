import { Option, CheckboxItem, RingTypes } from '@shared/utils/types';

export const optionsCharacterClass: Option[] = [
    { value: 'WAR', name: 'Guerrero', mainStat: 'STR', work: 'HUN', knowledge: 'FOR' },
    { value: 'MAG', name: 'Mago', mainStat: 'INT', work: 'WIS', knowledge: 'SAB' },
    { value: 'SCO', name: 'Explorador', mainStat: 'DEX', work: 'BLA', knowledge: 'HER' },
    { value: 'MED', name: 'Médico', mainStat: 'CON', work: 'PRI', knowledge: 'ALC' },
    { value: 'RES', name: 'Investigador', mainStat: 'PER', work: 'STR', knowledge: 'ACO' },
    { value: 'ACT', name: 'Actor', mainStat: 'CHA', work: 'ART', knowledge: 'ART' }
];

export const optionsCharacterRace: Option[] = [
    { value: 'HUM', name: 'Humano' },
    { value: 'ELF', name: 'Elfo' },
    { value: 'DWA', name: 'Enano' },
    { value: 'AAS', name: 'Aasimar' },
    { value: 'TIE', name: 'Tiefling' }
];

export const optionsCharacterJob: Option[] = [
    { value: 'HUN', name: 'Cazador', extraPoint: 'STR' },
    { value: 'WIS', name: 'Sabio', extraPoint: 'INT' },
    { value: 'BLA', name: 'Herrero', extraPoint: 'DEX' },
    { value: 'PRI', name: 'Sacerdote', extraPoint: 'CON' },
    { value: 'STR', name: 'Estratega', extraPoint: 'PER' },
    { value: 'ART', name: 'Artista', extraPoint: 'CHA' }
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
    { id: "KHIS", name: "Historia", value: "HIS" },
    { id: "KALC", name: "Alquimia", value: "ALC" },
    { id: "KBOT", name: "Botánica", value: "BOT" },
    { id: "KOCC", name: "Ocultismo", value: "OCC" },
    { id: "KCRY", name: "Criptozoología", value: "CRY" },
    { id: "KFOR", name: "Fortaleza", value: "FOR" },
    { id: "KMED", name: "Medium", value: "MED" },
    { id: "KACO", name: "Control Animal", value: "ACO" },
    { id: "KARC", name: "Arcano", value: "ARC" },
    { id: "KPSY", name: "Psicología", value: "PSY" },
    { id: "KNSC", name: "Ciencias Naturales", value: "NSC" },
    { id: "KAPP", name: "Tasación", value: "APP" },
];