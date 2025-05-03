import { DBMapamundi, DBSonidoUbicacion, DBPersonajeNoJugable, DBEnemigo, DBMision } from '../../domain/types';

export const getMapData = async (): Promise<DBMapamundi[]> => {
  try {
    const response = await fetch('/api/world/map');
    if (!response.ok) {
      throw new Error('Error al obtener los datos del mapa');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export const getSoundList = async (ubiId: string): Promise<DBSonidoUbicacion[]> => {
  try {
    const response = await fetch(`/api/world/sounds/${ubiId}`);
    if (!response.ok) {
      throw new Error('Error al obtener la lista de sonidos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export const getNpcList = async (ubiId: string): Promise<DBPersonajeNoJugable[]> => {
  try {
    const response = await fetch(`/api/world/npcs/${ubiId}`);
    if (!response.ok) {
      throw new Error('Error al obtener la lista de PNJs');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export const getEnemyList = async (ubiId: string): Promise<DBEnemigo[]> => {
  try {
    const response = await fetch(`/api/world/enemies/${ubiId}`);
    if (!response.ok) {
      throw new Error('Error al obtener la lista de enemigos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export const getMissionList = async (ubiId: string): Promise<DBMision[]> => {
  try {
    const response = await fetch(`/api/world/missions/${ubiId}`);
    if (!response.ok) {
      throw new Error('Error al obtener la lista de misiones');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}; 