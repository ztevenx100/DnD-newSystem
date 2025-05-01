import { useState, useCallback } from 'react';
// Actualizar la importación de modelos
import { InputStats, InventoryObject, DBSistemaJuego, SkillsAcquired, SkillsRing } from '../types';
import { DBPersonajesUsuario } from '@core/types';
import { characterService } from '../services/characterService';
import { uploadService } from '../../../services/uploadService';

export function useCharacter(id?: string, userId?: string) {
  const [character, setCharacter] = useState<DBPersonajesUsuario | null>(null);
  const [statsData, setStatsData] = useState<InputStats[]>([]);
  const [skillsAcquired, setSkillsAcquired] = useState<SkillsAcquired[]>([]);
  const [skillsRingList, setSkillsRingList] = useState<SkillsRing[]>([]);
  const [inventory, setInventory] = useState<InventoryObject[]>([]);
  const [coins, setCoins] = useState<number[]>([0, 0, 0]);
  const [deleteItems, setDeleteItems] = useState<string[]>([]);
  const [systemGame, setSystemGame] = useState<DBSistemaJuego>({ sju_id: '', sju_nombre: '' });
  const [loading, setLoading] = useState(false);
  const [characterImage, _setCharacterImage] = useState<string>('');

  const initialize = useCallback(async () => {
    if (!id || !userId) return;
    setLoading(true);
    try {
      const characterData = await characterService.getCharacter(id);
      if (characterData) {
        setCharacter(characterData);
        // Inicializar otros estados con los datos del personaje
        setStatsData(characterData.stats || []);
        setSkillsAcquired(characterData.skills || []);
        setSkillsRingList(characterData.skillsRing || []);
        setInventory(characterData.inventory || []);
        setCoins([characterData.pus_cantidad_oro || 0, characterData.pus_cantidad_plata || 0, characterData.pus_cantidad_bronce || 0]);
        setSystemGame(characterData.systemGame || { sju_id: '', sju_nombre: '' });
      }
    } catch (error) {
      console.error('Error al inicializar el personaje:', error);
    } finally {
      setLoading(false);
    }
  }, [id, userId]);

  const saveCharacter = useCallback(async () => {
    setLoading(true);
    try {
      const characterData: DBPersonajesUsuario = {
        ...(character ?? {}),
        stats: statsData,
        skills: skillsAcquired,
        skillsRing: skillsRingList,
        inventory,
        pus_cantidad_oro: coins[0],
        pus_cantidad_plata: coins[1],
        pus_cantidad_bronce: coins[2],
        deleteItems,
        usu_usuario: character?.usu_usuario ?? userId ?? '',
        sju_sistema_juego: character?.sju_sistema_juego ?? systemGame.sju_id ?? '',
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
  }, [character, statsData, skillsAcquired, skillsRingList, inventory, coins, deleteItems, userId, systemGame, id]);

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
    characterImage,
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