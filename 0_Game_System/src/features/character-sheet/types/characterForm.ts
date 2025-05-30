import { InventoryObject, SkillsAcquired } from "@/shared/utils/types/typesCharacterSheet";

/**
 * Interface representing the form data of a character sheet
 */
export interface CharacterForm {
  // Basic information
  characterId?: string;
  userName: string;
  name: string;
  class: string;
  level: number;
  race: string;
  job: string;
  alignment: string;
  
  // Character attributes
  luckyPoints: number;
  lifePoints: number;
  knowledge: string;  
  characterDescription: string;
  
  // Weapons
  mainWeapon: string;
  secondaryWeapon: string;
  
  // Currency
  goldCoins: number;
  silverCoins: number;
  bronzeCoins: number;
  
  // Stats (individual fields for compatibility)
  strDice: number;
  strClass: number;
  strLevel: number;
  intDice: number;
  intClass: number;
  intLevel: number;
  dexDice: number;
  dexClass: number;
  dexLevel: number;
  conDice: number;
  conClass: number;
  conLevel: number;
  perDice: number;
  perClass: number;
  perLevel: number;
  chaDice: number;
  chaClass: number;
  chaLevel: number;
  
  // Skills
  skillClass: string;
  skillExtra: string;
  
  // Inventory (new item fields)
  newObjectName: string;
  newObjectDescription: string;
  newObjectCount: number;
  
  // Arrays for structured form data (React Hook Form)
  stats: {
    id: string;
    label: string;
    description: string;
    valueDice: number;
    valueClass: number;
    valueLevel: number;
  }[];
  
  inventory: InventoryObject[];
  
  skills: SkillsAcquired[];
}
