import { renderHook, act } from '@testing-library/react';
import { useStats, useInventory, useSkills, useProfile, useWeapons } from '..';
import { DBPersonajesUsuario, InputStats, InventoryObject, SkillsAcquired } from '@core/types/characters';

describe('Character Hooks', () => {
  describe('useStats', () => {
    const mockStats: InputStats[] = [
      { id: "STR", label: "Fuerza", description: "", valueDice: 5, valueClass: 2, valueLevel: 1, strength: 1, dexterity: 0, intelligence: 0, constitution: 0, charisma: 0, perception: 0 }
    ];

    it('should initialize with default or provided stats', () => {
      const { result } = renderHook(() => useStats(mockStats));
      expect(result.current.stats).toEqual(mockStats);
    });

    it('should update stats correctly', () => {
      const { result } = renderHook(() => useStats(mockStats));

      act(() => {
        result.current.updateStatValue("STR", "valueDice", 6);
      });

      expect(result.current.stats[0].valueDice).toBe(6);
    });

    it('should randomize stats', () => {
      const { result } = renderHook(() => useStats(mockStats));

      act(() => {
        result.current.randomizeStats();
      });

      expect(result.current.stats).toHaveLength(6);
      result.current.stats.forEach(stat => {
        expect(stat.valueDice).toBeGreaterThanOrEqual(1);
        expect(stat.valueDice).toBeLessThanOrEqual(6);
      });
    });
  });

  describe('useInventory', () => {
    const mockInventory: InventoryObject[] = [
      { id: "1", name: "Potion", description: "Health potion", count: 1, readOnly: false }
    ];
    const mockCoins = [10, 5, 2];

    it('should initialize with default or provided inventory', () => {
      const { result } = renderHook(() => useInventory(mockInventory, mockCoins));
      expect(result.current.inventory).toEqual(mockInventory);
      expect(result.current.coins).toEqual(mockCoins);
    });

    it('should add items correctly', () => {
      const { result } = renderHook(() => useInventory());

      act(() => {
        result.current.addItem("New Item", "Description", 2);
      });

      expect(result.current.inventory).toHaveLength(1);
      expect(result.current.inventory[0].name).toBe("New Item");
      expect(result.current.inventory[0].count).toBe(2);
    });

    it('should update coins correctly', () => {
      const { result } = renderHook(() => useInventory(mockInventory, mockCoins));

      act(() => {
        result.current.updateCoins(0, 15);
      });

      expect(result.current.coins[0]).toBe(15);
    });
  });

  describe('useProfile', () => {
    const mockCharacter: DBPersonajesUsuario = {
      pus_id: "1",
      pus_usuario: "testUser",
      pus_nombre: "Test Character",
      pus_nivel: 1,
      pus_clase: "WAR",
      pus_puntos_suerte: 3,
      pus_vida: 10
    } as DBPersonajesUsuario;

    it('should initialize with default or provided character', () => {
      const { result } = renderHook(() => useProfile(mockCharacter));
      expect(result.current.character).toEqual(mockCharacter);
    });

    it('should update level within bounds', () => {
      const { result } = renderHook(() => useProfile(mockCharacter));

      act(() => {
        result.current.updateLevel(11);
      });
      expect(result.current.character.pus_nivel).toBe(10);

      act(() => {
        result.current.updateLevel(0);
      });
      expect(result.current.character.pus_nivel).toBe(1);
    });

    it('should update knowledge correctly', () => {
      const { result } = renderHook(() => useProfile(mockCharacter));

      act(() => {
        result.current.updateKnowledge(['HIS', 'ALC']);
      });

      expect(result.current.character.pus_conocimientos).toBe('HIS,ALC');
    });
  });

  describe('useSkills', () => {
    const mockSkills: SkillsAcquired[] = [
      { id: "1", value: "0", name: "Skill1", description: "", ring: "STR", type: "combat", level: 0 }
    ];

    it('should calculate available skill slots based on level', () => {
      const { result } = renderHook(() => useSkills(mockSkills, [], 4));
      expect(result.current.availableSkillSlots).toBe(1);
    });

    it('should validate skill level requirements', () => {
      const { result } = renderHook(() => useSkills(mockSkills, [], 4));
      
      expect(result.current.validateSkillLevel(0)).toBe(true);
      expect(result.current.validateSkillLevel(1)).toBe(false);
    });

    it('should manage skills list correctly', () => {
      const { result } = renderHook(() => useSkills(mockSkills));

      act(() => {
        result.current.updateRingList("STR", ["skill1", "skill2"]);
      });

      expect(result.current.getAvailableSkillsByRing("STR")).toEqual(["skill1", "skill2"]);
    });
  });

  describe('useWeapons', () => {
    it('should initialize with default or provided weapons', () => {
      const { result } = renderHook(() => useWeapons("Sword", "Shield", "skill1", "skill2"));
      
      expect(result.current.mainWeapon).toBe("Sword");
      expect(result.current.secondaryWeapon).toBe("Shield");
      expect(result.current.mainSkill).toBe("skill1");
      expect(result.current.extraSkill).toBe("skill2");
    });

    it('should validate weapon selection', () => {
      const { result } = renderHook(() => useWeapons("Sword"));
      expect(result.current.validateWeaponSelection()).toBe(true);

      act(() => {
        result.current.updateMainWeapon("");
      });
      expect(result.current.validateWeaponSelection()).toBe(false);
    });

    it('should validate skill selection', () => {
      const { result } = renderHook(() => useWeapons("Sword", "", "skill1", "skill2"));
      const mockSkills = [
        { value: "skill1", name: "Skill 1" },
        { value: "skill2", name: "Skill 2" }
      ];

      expect(result.current.validateSkillSelection(mockSkills)).toBe(true);

      act(() => {
        result.current.updateMainSkill("skill3");
      });
      expect(result.current.validateSkillSelection(mockSkills)).toBe(false);
    });
  });
});