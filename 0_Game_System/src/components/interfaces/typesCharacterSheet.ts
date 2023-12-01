
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
    id: number;
    ring: string;
    skill: string;
}