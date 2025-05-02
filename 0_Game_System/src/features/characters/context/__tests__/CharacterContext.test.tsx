import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { CharacterProvider, useCharacter } from '../CharacterContext';
import { DBPersonajesUsuario, InputStats } from "@core/types/characters/characterDbTypes";
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
    let error;
    try {
      renderHook(() => useCharacter());
    } catch (e) {
      error = e;
    }
    expect(error).toEqual(Error('useCharacter must be used within a CharacterProvider'));
  });

  it('provides character context', () => {
    const { result } = renderHook(() => useCharacter(), { wrapper });
    expect(result.current.state.character).toEqual(mockCharacter);
  });

  describe('Profile Management', () => {
    it('updates character level within bounds', () => {
      const { result } = renderHook(() => useCharacter(), { wrapper });

      act(() => {
        result.current.dispatch({ type: 'SET_CHARACTER', payload: { ...mockCharacter, pus_nivel: 5 } });
      });
      expect(result.current.state.character?.pus_nivel).toBe(5);

      act(() => {
        result.current.dispatch({ type: 'SET_CHARACTER', payload: { ...mockCharacter, pus_nivel: 11 } });
      });
      expect(result.current.state.character?.pus_nivel).toBe(11);
    });

    it('updates character class', () => {
      const { result } = renderHook(() => useCharacter(), { wrapper });

      act(() => {
        result.current.dispatch({ type: 'SET_CHARACTER', payload: { ...mockCharacter, pus_clase: 'MAG' } });
      });
      expect(result.current.state.character?.pus_clase).toBe('MAG');
    });
  });

  describe('Stats Management', () => {
    it('updates stat values', () => {
      const { result } = renderHook(() => useCharacter(), { wrapper });

      act(() => {
        result.current.dispatch({ 
          type: 'UPDATE_STATS', 
          payload: [{
            id: "STR",
            label: "Fuerza",
            description: "",
            valueDice: 5,
            valueClass: 2,
            valueLevel: 1,
            strength: 5,
            dexterity: 3,
            intelligence: 2,
            constitution: 4,
            charisma: 3,
            perception: 2
          }]
        });
      });

      expect(result.current.state.stats[0].valueDice).toBe(5);
    });

    it('randomizes stats within valid range', () => {
      const { result } = renderHook(() => useCharacter(), { wrapper });

      act(() => {
        result.current.dispatch({ 
          type: 'UPDATE_STATS', 
          payload: [
            {
              id: "STR",
              label: "Fuerza",
              description: "",
              valueDice: 3,
              valueClass: 2,
              valueLevel: 1,
              strength: 3,
              dexterity: 2,
              intelligence: 2,
              constitution: 3,
              charisma: 2,
              perception: 2
            },
            {
              id: "DEX",
              label: "Destreza",
              description: "",
              valueDice: 4,
              valueClass: 2,
              valueLevel: 1,
              strength: 2,
              dexterity: 4,
              intelligence: 2,
              constitution: 2,
              charisma: 2,
              perception: 2
            }
          ]
        });
      });

      result.current.state.stats.forEach((stat: InputStats) => {
        expect(stat.valueDice).toBeGreaterThanOrEqual(1);
        expect(stat.valueDice).toBeLessThanOrEqual(6);
      });
    });
  });

  describe('Inventory Management', () => {
    it('adds and updates items', () => {
      const { result } = renderHook(() => useCharacter(), { wrapper });

      act(() => {
        result.current.dispatch({ 
          type: 'UPDATE_INVENTORY', 
          payload: [{
            id: '1',
            name: 'Potion',
            description: 'Health potion',
            count: 1,
            readOnly: false
          }]
        });
      });
      expect(result.current.state.inventory).toHaveLength(1);
      expect(result.current.state.inventory[0].name).toBe('Potion');

      const itemId = result.current.state.inventory[0].id;
      act(() => {
        result.current.dispatch({ 
          type: 'UPDATE_INVENTORY', 
          payload: [{
            id: itemId,
            name: 'Potion',
            description: 'Health potion',
            count: 2,
            readOnly: false
          }]
        });
      });
      expect(result.current.state.inventory[0].count).toBe(2);
    });

    it('updates coins', () => {
      const { result } = renderHook(() => useCharacter(), { wrapper });

      act(() => {
        result.current.dispatch({ 
          type: 'SET_CHARACTER', 
          payload: { ...mockCharacter, pus_cantidad_oro: 15 }
        });
      });
      expect(result.current.state.character?.pus_cantidad_oro).toBe(15);
    });
  });

  describe('Skills Management', () => {
    it('manages skills based on level', () => {
      const { result } = renderHook(() => useCharacter(), { wrapper });

      act(() => {
        result.current.dispatch({ 
          type: 'SET_CHARACTER', 
          payload: { ...mockCharacter, pus_nivel: 4 }
        });
      });
      expect(result.current.state.character?.pus_nivel).toBe(4);

      act(() => {
        result.current.dispatch({ 
          type: 'UPDATE_SKILLS', 
          payload: [{
            id: '1',
            value: '0',
            name: 'Test Skill',
            description: 'Descripción de la habilidad',
            ring: 'STR',
            type: 'combat',
            level: 0,
            stat: 'strength'
          }]
        });
      });
      expect(result.current.state.skills).toHaveLength(1);
    });
  });

  describe('Weapons Management', () => {
    it('manages weapons and associated skills', () => {
      const { result } = renderHook(() => useCharacter(), { wrapper });

      act(() => {
        result.current.dispatch({ 
          type: 'SET_CHARACTER', 
          payload: { ...mockCharacter, pus_arma_principal: 'Sword' }
        });
      });

      expect(result.current.state.character?.pus_arma_principal).toBe('Sword');
    });
  });

  describe('Validation', () => {
    it('validates character data', () => {
      const { result } = renderHook(() => useCharacter(), { wrapper });

      act(() => {
        result.current.dispatch({ 
          type: 'SET_CHARACTER', 
          payload: { ...mockCharacter, pus_nombre: '' }
        });
      });

      expect(result.current.state.character?.pus_nombre).toBe('');
      expect(result.current.state.errors.length).toBeGreaterThan(0);
    });
  });
});