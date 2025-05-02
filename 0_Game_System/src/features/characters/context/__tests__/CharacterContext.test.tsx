import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { CharacterProvider, useCharacter } from '../CharacterContext';
import { DBPersonajesUsuario } from "@core/types/characters/characterDbTypes";
import { DBSistemaJuego } from "@core/types/gameSystem/gameSystemDbTypes";

describe('CharacterContext', () => {
  const mockCharacter: DBPersonajesUsuario = {
    pus_id: "1",
    pus_usuario: "testUser",
    usu_usuario: null,
    pus_nombre: "Test Character",
    pus_nivel: 1,
    pus_clase: "WAR",
    pus_raza: "Humano",
    pus_trabajo: "Guerrero",
    pus_descripcion: "Descripción del personaje",
    pus_conocimientos: "",
    pus_arma_principal: "",
    pus_arma_secundaria: "",
    pus_cantidad_oro: 0,
    pus_cantidad_plata: 0,
    pus_cantidad_bronce: 0,
    pus_puntos_suerte: 3,
    pus_vida: 10,
    pus_alineacion: "Neutral",
    pus_sistema_juego: null,
    sju_sistema_juego: { sju_id: "1", sju_nombre: "DnD" } as DBSistemaJuego,
    stats: [],
    skills: [],
    skillsRing: [],
    inventory: []
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CharacterProvider initialCharacter={mockCharacter}>
      {children}
    </CharacterProvider>
  );

  it('throws error when used outside provider', () => {
    const { result } = renderHook(() => useCharacter());
    expect(result.error).toEqual(Error('useCharacter must be used within a CharacterProvider'));
  });

  it('provides character context', () => {
    const { result } = renderHook(() => useCharacter(), { wrapper });
    expect(result.current.character).toEqual(mockCharacter);
  });

  describe('Profile Management', () => {
    it('updates character level within bounds', () => {
      const { result } = renderHook(() => useCharacter(), { wrapper });

      act(() => {
        result.current.updateLevel(5);
      });
      expect(result.current.character.pus_nivel).toBe(5);

      act(() => {
        result.current.updateLevel(11);
      });
      expect(result.current.character.pus_nivel).toBe(10);
    });

    it('updates character class', () => {
      const { result } = renderHook(() => useCharacter(), { wrapper });

      act(() => {
        result.current.updateClass('MAG');
      });
      expect(result.current.character.pus_clase).toBe('MAG');
    });
  });

  describe('Stats Management', () => {
    it('updates stat values', () => {
      const { result } = renderHook(() => useCharacter(), { wrapper });

      act(() => {
        result.current.updateStats([
          { id: "STR", label: "Fuerza", description: "", valueDice: 5, valueClass: 2, valueLevel: 1 }
        ]);
      });

      expect(result.current.stats[0].valueDice).toBe(5);
    });

    it('randomizes stats within valid range', () => {
      const { result } = renderHook(() => useCharacter(), { wrapper });

      act(() => {
        result.current.randomizeStats();
      });

      result.current.stats.forEach(stat => {
        expect(stat.valueDice).toBeGreaterThanOrEqual(1);
        expect(stat.valueDice).toBeLessThanOrEqual(6);
      });
    });
  });

  describe('Inventory Management', () => {
    it('adds and updates items', () => {
      const { result } = renderHook(() => useCharacter(), { wrapper });

      act(() => {
        result.current.addItem('Potion', 'Health potion', 1);
      });
      expect(result.current.inventory).toHaveLength(1);
      expect(result.current.inventory[0].name).toBe('Potion');

      const itemId = result.current.inventory[0].id;
      act(() => {
        result.current.updateItem(itemId, { count: 2 });
      });
      expect(result.current.inventory[0].count).toBe(2);
    });

    it('updates coins', () => {
      const { result } = renderHook(() => useCharacter(), { wrapper });

      act(() => {
        result.current.updateCoins(0, 15);
      });
      expect(result.current.coins[0]).toBe(15);
    });
  });

  describe('Skills Management', () => {
    it('manages skills based on level', () => {
      const { result } = renderHook(() => useCharacter(), { wrapper });

      act(() => {
        result.current.updateLevel(4);
      });
      expect(result.current.availableSkillSlots).toBe(1);

      act(() => {
        result.current.addSkill({
          id: '1',
          value: '0',
          name: 'Test Skill',
          description: 'Descripción de la habilidad',
          ring: 'STR',
          type: 'combat',
          level: 0,
          stat: 'strength'
        });
      });
      expect(result.current.skillsAcquired).toHaveLength(1);
    });
  });

  describe('Weapons Management', () => {
    it('manages weapons and associated skills', () => {
      const { result } = renderHook(() => useCharacter(), { wrapper });

      act(() => {
        result.current.updateMainWeapon('Sword');
        result.current.updateMainSkill('skill1');
      });

      expect(result.current.mainWeapon).toBe('Sword');
      expect(result.current.mainSkill).toBe('skill1');
      expect(result.current.validateWeaponSelection()).toBe(true);
    });
  });

  describe('Validation', () => {
    it('validates character data', () => {
      const { result } = renderHook(() => useCharacter(), { wrapper });

      act(() => {
        result.current.updateField('pus_nombre', '');
      });

      const validation = result.current.validateCharacterData();
      expect(validation.isValid).toBe(false);
      expect(validation.errors[0].field).toBe('name');
    });
  });
});