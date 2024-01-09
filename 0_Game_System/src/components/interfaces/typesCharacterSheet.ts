
export interface InputStats {
    id: string;
    label: string;
    description: string;
    valueDice: number;
    valueClass: number;
    valueLevel: number;
}

export interface Skill {
    id: number;
    name: string;
    description: string;
    dice: string;
}

export interface SkillTypes {
    id: string;
    skills: Skill[];
}

export interface SkillsAcquired {
    id: string;
    name: string;
    description: string;
    ring: string;
}

export interface InventoryObject {
    id: number;
    name: string;
    description: string;
    count: number;
    readOnly: boolean;
}
