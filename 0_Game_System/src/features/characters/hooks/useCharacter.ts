import { useState, useCallback, useEffect } from 'react';
import { InventoryObject, DBSistemaJuego, SkillsAcquired, SkillTypes } from '../types';
import { toInventoryObject, InputStats, DBPersonajesUsuario } from '@core/types/characters/characterDbTypes';
import { characterService } from '../services/characterService';
import { uploadService } from '../../../services/uploadService';

export function useCharacter(id?: string, userId?: string) {
  const [character, setCharacter] = useState<DBPersonajesUsuario | null>(null);
  const [statsData, setStatsData] = useState<InputStats[]>([]);
  const [skillsAcquired, setSkillsAcquired] = useState<SkillsAcquired[]>([]);
  const [skillsRingList, setSkillsRingList] = useState<SkillTypes[]>([]);
  const [inventory, setInventory] = useState<InventoryObject[]>([]);
  const [coins, setCoins] = useState<number[]>([0, 0, 0]);
  const [deleteItems, setDeleteItems] = useState<string[]>([]);
  const [systemGame, setSystemGame] = useState<DBSistemaJuego>({ sju_id: '', sju_nombre: '' });
  const [loading, setLoading] = useState(false);

  const initialize = useCallback(async () => {
    if (!id || !userId) return;
    setLoading(true);
    try {
      const characterData = await characterService.getCharacter(id);
      if (characterData) {
        setCharacter(characterData);
        setStatsData((characterData.stats ?? []).map(stat => ({
          ...stat,
          strength: stat.strength ?? 0,
          dexterity: stat.dexterity ?? 0,
          intelligence: stat.intelligence ?? 0,
          constitution: stat.constitution ?? 0,
          charisma: stat.charisma ?? 0,
          perception: stat.perception ?? 0
        })));
        setSkillsAcquired(characterData.skills ?? []);
        setSkillsRingList(characterData.skillsRing ?? []);
        setInventory((characterData.inventory ?? []).map(toInventoryObject));
        setCoins([characterData.pus_cantidad_oro ?? 0, characterData.pus_cantidad_plata ?? 0, characterData.pus_cantidad_bronce ?? 0]);
        setSystemGame(characterData.systemGame ?? { sju_id: '', sju_nombre: '' });
      }
    } catch (error) {
      console.error('Error al inicializar el personaje:', error);
    } finally {
      setLoading(false);
    }
  }, [id, userId]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const saveCharacter = useCallback(async () => {
    setLoading(true);
    try {
      if (!character) return null;
      
      const characterData: DBPersonajesUsuario = {
        ...character,
        pus_id: character.pus_id ?? '',
        pus_usuario: character.pus_usuario ?? '',
        pus_nombre: character.pus_nombre ?? '',
        pus_nivel: character.pus_nivel ?? 1,
        pus_clase: character.pus_clase ?? '',
        pus_raza: character.pus_raza ?? '',
        pus_trabajo: character.pus_trabajo ?? '',
        pus_descripcion: character.pus_descripcion ?? '',
        pus_conocimientos: character.pus_conocimientos ?? '',
        pus_arma_principal: character.pus_arma_principal ?? '',
        pus_arma_secundaria: character.pus_arma_secundaria ?? '',
        pus_puntos_suerte: character.pus_puntos_suerte ?? 0,
        pus_vida: character.pus_vida ?? 0,
        pus_alineacion: character.pus_alineacion ?? '',
        stats: statsData.map(stat => ({
          ...stat,
          strength: stat.strength ?? 0,
          dexterity: stat.dexterity ?? 0,
          intelligence: stat.intelligence ?? 0,
          constitution: stat.constitution ?? 0,
          charisma: stat.charisma ?? 0,
          perception: stat.perception ?? 0
        })),
        skills: skillsAcquired ?? [],
        skillsRing: skillsRingList ?? [],
        inventory: inventory ?? [],
        pus_cantidad_oro: coins[0] ?? 0,
        pus_cantidad_plata: coins[1] ?? 0,
        pus_cantidad_bronce: coins[2] ?? 0,
        deleteItems: deleteItems ?? [],
        usu_usuario: character?.usu_usuario ?? null,
        pus_sistema_juego: character?.pus_sistema_juego ?? systemGame?.sju_id ?? '',
        sju_sistema_juego: systemGame ?? { sju_id: '', sju_nombre: '' },
        systemGame: systemGame ?? { sju_id: '', sju_nombre: '' }
      };

      const savedCharacterId = await characterService.saveCharacter(characterData, !id);
      if (savedCharacterId) {
        setDeleteItems([]);
        return savedCharacterId;
      }
      return null;
    } catch (error) {
      console.error('Error al guardar el personaje:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [character, statsData, skillsAcquired, skillsRingList, inventory, coins, deleteItems, systemGame, id]);

  const uploadCharacterImage = useCallback(async (file: File): Promise<{error: boolean; url?: string}> => {
    try {
      const result = await uploadService.uploadImage(file, 'characters');
      if (result.url) {
        setCharacter(prev => prev ? { ...prev, url_character_image: result.url } : null);
        return { error: false, url: result.url };
      }
      return { error: true };
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      return { error: true };
    }
  }, []);

  return {
    character,
    statsData,
    skillsAcquired,
    skillsRingList,
    inventory,
    coins,
    deleteItems,
    systemGame,
    loading,
    newRecord: !id,
    setCharacter,
    setStatsData,
    setSkillsAcquired,
    setSkillsRingList,
    setInventory,
    setCoins,
    setDeleteItems,
    setSystemGame,
    initialize,
    saveCharacter,
    uploadCharacterImage
  };
}