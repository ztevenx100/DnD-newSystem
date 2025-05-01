export interface InputStats {
    id: string;
    label: string;
    description?: string;
    valueDice: number;
    valueClass: number;
    valueLevel: number;
}

export interface DataCharacter {
    player: string;
    name: string;
    level: number;
    class: string;
    race: string;
    job: string;
    description: string;
    knowledge: string[];
    mainSkill: string;
    extraSkill: string;
    alignment: string;
    mainWeapon: string;
    secondaryWeapon: string;
    str: Array<{dice: number; class: number; level: number}>;
    int: Array<{dice: number; class: number; level: number}>;
    dex: Array<{dice: number; class: number; level: number}>;
    con: Array<{dice: number; class: number; level: number}>;
    per: Array<{dice: number; class: number; level: number}>;
    cha: Array<{dice: number; class: number; level: number}>;
    skills: Array<{value: string; name: string; stat?: string}>;
    coinsInv: number[];
    inv: Array<{id: string; name: string; count: number}>;
}

export interface InventoryObject {
    id: string;
    name: string;
    description: string;
    count: number;
    readOnly: boolean;
}

export interface SystemGame {
    sju_id: string;
    sju_nombre: string;
}