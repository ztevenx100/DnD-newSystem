import { DBPersonajesUsuario } from "@core/types/characters/characterDbTypes";
import { DBSistemaJuego, DBUsuario } from "@core/types/gameSystem/gameSystemDbTypes";
import { 
  DBEstadisticaPersonaje,
  DBHabilidadPersonaje, 
  DBInventarioPersonaje 
} from "@core/types/characters/characterDbTypes";

export interface SkillsRing {
  id: string;
  nombre: string;
  type: string; // Cambiado de 'tipo' a 'type'
  nivel: number;
}

export interface CharacterState {
    character: DBPersonajesUsuario;
    statsData: InputStats[];
    skillsAcquired: SkillsAcquired[];
    skillsRingList: SkillTypes[];
    inventory: InventoryObject[];
    coins: number[];
    deleteItems: string[];
    systemGame: DBSistemaJuego;
    loading: boolean;
    newRecord: boolean;
    characterImage?: string;
}

export interface CharacterStats {
    str: StatBlock[];
    int: StatBlock[];
    dex: StatBlock[];
    con: StatBlock[];
    per: StatBlock[];
    cha: StatBlock[];
}

export interface StatBlock {
    dice: number;
    class: number;
    level: number;
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
  name: string;
  type: string;
  level: number;
  value: number;
}

export interface SkillsRing {
  id: string;
  name: string;
  type: string;
  level: number;
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

export interface CharacterActions {
    setCharacter: (character: DBPersonajesUsuario) => void;
    setStatsData: (stats: InputStats[]) => void;
    setSkillsAcquired: (skills: SkillsAcquired[]) => void;
    setSkillsRingList: (list: SkillTypes[]) => void; 
    setInventory: (items: InventoryObject[]) => void;
    setCoins: (coins: number[]) => void;
    setDeleteItems: (items: string[]) => void;
    setSystemGame: (game: DBSistemaJuego) => void;
    setLoading: (loading: boolean) => void;
    setNewRecord: (isNew: boolean) => void;
    setCharacterImage: (url?: string) => void;
}

export interface CharacterHookResult extends CharacterState, CharacterActions {}