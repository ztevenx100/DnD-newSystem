import { validateCharacter } from '../validation';
import { DBPersonajesUsuario, InputStats, InventoryObject, SkillsAcquired } from '../../types';

describe('validateCharacter', () => {
  const validCharacter: DBPersonajesUsuario = {
    pus_id: "1",
    pus_usuario: "testUser",
    pus_nombre: "Test Character",
    pus_nivel: 1,
    pus_clase: "WAR",
    pus_raza: "Human",
    pus_puntos_suerte: 3,
    pus_vida: 10,
    pus_cantidad_oro: 0,
    pus_cantidad_plata: 0,
    pus_cantidad_bronce: 0
  } as DBPersonajesUsuario;

  const validStats: InputStats[] = [
    { id: "STR", label: "Fuerza", description: "", valueDice: 5, valueClass: 2, valueLevel: 1 }
  ];

  const validInventory: InventoryObject[] = [
    { id: "1", name: "Potion", description: "Health potion", count: 1, readOnly: false }
  ];

  const validSkills: SkillsAcquired[] = [];

  it('validates a valid character successfully', () => {
    const result = validateCharacter(validCharacter, validStats, validInventory, validSkills);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  describe('Basic Info Validation', () => {
    it('requires character name', () => {
      const character = { ...validCharacter, pus_nombre: '' };
      const result = validateCharacter(character, validStats, validInventory, validSkills);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('name');
    });

    it('requires character class', () => {
      const character = { ...validCharacter, pus_clase: '' };
      const result = validateCharacter(character, validStats, validInventory, validSkills);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('class');
    });

    it('requires character race', () => {
      const character = { ...validCharacter, pus_raza: '' };
      const result = validateCharacter(character, validStats, validInventory, validSkills);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('race');
    });
  });

  describe('Level Validation', () => {
    it('validates level range', () => {
      const lowLevel = { ...validCharacter, pus_nivel: 0 };
      const highLevel = { ...validCharacter, pus_nivel: 11 };

      const lowResult = validateCharacter(lowLevel, validStats, validInventory, validSkills);
      const highResult = validateCharacter(highLevel, validStats, validInventory, validSkills);

      expect(lowResult.isValid).toBe(false);
      expect(highResult.isValid).toBe(false);
      expect(lowResult.errors[0].field).toBe('level');
      expect(highResult.errors[0].field).toBe('level');
    });
  });

  describe('Stats Validation', () => {
    it('requires stats to be assigned', () => {
      const result = validateCharacter(validCharacter, [], validInventory, validSkills);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('stats');
    });

    it('validates stat dice values', () => {
      const invalidStats = [
        { ...validStats[0], valueDice: 7 }
      ];
      const result = validateCharacter(validCharacter, invalidStats, validInventory, validSkills);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('stats.STR');
    });
  });

  describe('Skills Validation', () => {
    it('validates skill slots based on level', () => {
      const character = { ...validCharacter, pus_nivel: 1 };
      const skills: SkillsAcquired[] = [
        { id: '1', value: '0', name: 'Skill 1', description: '', ring: 'STR' }
      ];

      const result = validateCharacter(character, validStats, validInventory, skills);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('skills');
    });
  });

  describe('Inventory Validation', () => {
    it('validates item names', () => {
      const invalidInventory = [
        { ...validInventory[0], name: '' }
      ];
      const result = validateCharacter(validCharacter, validStats, invalidInventory, validSkills);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('inventory.0');
    });

    it('validates item counts', () => {
      const invalidInventory = [
        { ...validInventory[0], count: -1 }
      ];
      const result = validateCharacter(validCharacter, validStats, invalidInventory, validSkills);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('inventory.0');
    });
  });

  describe('Special Points Validation', () => {
    it('validates lucky points range', () => {
      const character = { ...validCharacter, pus_puntos_suerte: 11 };
      const result = validateCharacter(character, validStats, validInventory, validSkills);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('luckyPoints');
    });

    it('validates life points', () => {
      const character = { ...validCharacter, pus_vida: 0 };
      const result = validateCharacter(character, validStats, validInventory, validSkills);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('lifePoints');
    });
  });

  describe('Currency Validation', () => {
    it('validates currency amounts', () => {
      const character = { 
        ...validCharacter, 
        pus_cantidad_oro: -1,
        pus_cantidad_plata: -1,
        pus_cantidad_bronce: -1
      };
      const result = validateCharacter(character, validStats, validInventory, validSkills);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
    });
  });
});