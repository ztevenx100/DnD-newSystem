// Character related types
export interface Option {
    id?: string;
    value: string;
    name: string;
}

export interface InputStats {
    id: string;  
    label: string;
    description?: string;
    valueDice: number;
    valueClass: number;
    valueLevel: number;
}

export interface Skill {
    id: string;
    value?: string;
    name: string;
    description?: string;
    dice?: string;
    alignment?: string;
}

export interface SkillTypes {
    id: string;
    skills: Skill[];
}

export interface SkillsAcquired {
    id: string;
    value: string;
    name: string;
    description?: string;
    ring: string;
    stat?: string;
}

export interface InventoryObject {
    id: string;
    name: string;
    description: string;
    count: number;
    readOnly: boolean;
}

export interface SkillFields {
    id: string;
    skill: string;
    field: string;
}

export interface CharacterForm {
    userName: string;
    name: string;
    class: string;
    level: number;
    luckyPoints: number;
    lifePoints: number;
    mainWeapon: string;
    secondaryWeapon: string;
    goldCoins: number;
    silverCoins: number;
    bronzeCoins: number;
    characterDescription: string;
}