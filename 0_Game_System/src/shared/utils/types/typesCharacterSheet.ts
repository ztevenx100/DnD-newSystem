export interface Option {
    id?: string;
    value: string;
    name: string;
    extraPoint?: string;
    work?: string;
    mainStat?: string;
    stat?: string;
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

export type Components = {
    [key: string]: React.ComponentType<any>;
};

export interface stageImageList {
    id: string;
    url: string;
}

export type CheckboxItem = {
    id: string;
    value: string;
    name: string;
}

export type RingTypes = {
    id: string;
    value: string;
    name: string;
    stat: string;
}