import { validateCharacter, validateSaveRequirements, generateRandomStats } from './validation';
import { DBPersonajesUsuario, InputStats, InventoryObject } from '@core/types/characters/characterDbTypes';
import { SkillsAcquired } from '../types';

describe('Character Validation Utils', () => {
  const mockCharacter: DBPersonajesUsuario = {
    pus_id: "1",
    pus_usuario: "testUser",
    usu_usuario: null,
    sju_sistema_juego: { sju_id: "1", sju_nombre: "Test System" },
    pus_nombre: "Test Character",
    pus_clase: "WAR",
    pus_raza: "HUM",
    pus_trabajo: "HUN",
    pus_nivel: 1,
    pus_puntos_suerte: 3,
    pus_vida: 10,
    pus_alineacion: "",
    pus_arma_principal: "Sword",
    pus_arma_secundaria: "Shield",
    pus_descripcion: "Test description",
    pus_conocimientos: "HIS,ALC",
    pus_cantidad_oro: 10,
    pus_cantidad_plata: 5,
    pus_cantidad_bronce: 2,
    pus_sistema_juego: null,
    url_character_image: ""
  };

  const mockStats: InputStats[] = [
    { id: "STR", label: "Fuerza", valueDice: 5, valueClass: 2, valueLevel: 1, strength: 1, dexterity: 0, intelligence: 0, constitution: 0, charisma: 0, perception: 0 }
  ];

  const mockInventory: InventoryObject[] = [
    { id: "1", name: "Potion", description: "Health potion", count: 1, readOnly: false }
  ];

  const mockSkills: SkillsAcquired[] = [
    { id: "1", value: "0", name: "Skill1", description: "", ring: "STR", type: "combat", level: 1 }
  ];

  describe('validateCharacter', () => {
    it('should validate a correct character', () => {
      const result = validateCharacter(mockCharacter, mockStats, mockInventory, mockSkills);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail on missing name', () => {
      const invalidChar = { ...mockCharacter, pus_nombre: "" };
      const result = validateCharacter(invalidChar, mockStats, mockInventory, mockSkills);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('name');
    });

    it('should fail on invalid class', () => {
      const invalidChar = { ...mockCharacter, pus_clase: "INVALID" };
      const result = validateCharacter(invalidChar, mockStats, mockInventory, mockSkills);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('class');
    });

    it('should fail on invalid level', () => {
      const invalidChar = { ...mockCharacter, pus_nivel: 11 };
      const result = validateCharacter(invalidChar, mockStats, mockInventory, mockSkills);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('level');
    });

    it('should require alignment at level 3', () => {
      const highLevelChar = { ...mockCharacter, pus_nivel: 3, pus_alineacion: "" };
      const result = validateCharacter(highLevelChar, mockStats, mockInventory, mockSkills);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('alignment');
    });

    it('should validate stats range', () => {
      const invalidStats = [
        { ...mockStats[0], valueDice: 11 }
      ];
      const result = validateCharacter(mockCharacter, invalidStats, mockInventory, mockSkills);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toContain('stats');
    });

    it('should validate inventory items', () => {
      const invalidInventory = [
        { ...mockInventory[0], count: 0 }
      ];
      const result = validateCharacter(mockCharacter, mockStats, invalidInventory, mockSkills);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toContain('inventory');
    });
  });

  describe('validateSaveRequirements', () => {
    it('should validate correct save requirements', () => {
      expect(validateSaveRequirements(mockCharacter)).toBe(true);
    });

    it('should fail on missing required fields', () => {
      const invalidChar = { ...mockCharacter, pus_id: "" };
      expect(validateSaveRequirements(invalidChar)).toBe(false);
    });
  });

  describe('generateRandomStats', () => {
    it('should generate valid random stats', () => {
      const stats = generateRandomStats();
      expect(stats).toHaveLength(6);
      stats.forEach(stat => {
        expect(stat.valueDice).toBeGreaterThanOrEqual(1);
        expect(stat.valueDice).toBeLessThanOrEqual(6);
      });
    });

    it('should have all required stats', () => {
      const stats = generateRandomStats();
      const requiredIds = ['STR', 'INT', 'DEX', 'CON', 'PER', 'CHA'];
      requiredIds.forEach(id => {
        expect(stats.some(stat => stat.id === id)).toBe(true);
      });
    });
  });
});