import { DBMapamundi, DBSonidoUbicacion, DBPersonajeNoJugable, DBEnemigo, DBMision } from '@/shared/utils/types/dbTypes';
import { getDataQueryMis } from '@/database/models/dbTables';

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

/**
 * Obtiene la lista de misiones para una ubicación específica
 * @param ubiId ID de la ubicación
 * @returns Lista de misiones transformada al tipo DBMision de shared
 */
export const getMissionList = async (ubiId: string): Promise<DBMision[]> => {
  if (!ubiId) return [];
  
  try {
    const data = await getDataQueryMis(
      'mis_id, mis_nombre, mis_tipo, mis_cumplido',
      { 'mis_estado': 'A', 'mis_ubi': ubiId },
      { 'mis_tipo': true }
    );
    
    if (!data) return [];
    
    // Ensure each mission has the mis_cumplido property required by shared types
    return data.map(mission => ({
      mis_id: mission.mis_id,
      mis_nombre: mission.mis_nombre,
      mis_tipo: mission.mis_tipo,
      mis_cumplido: typeof mission.mis_cumplido === 'boolean' 
        ? mission.mis_cumplido 
        : mission.mis_cumplido === 'true' || false
    }));
  } catch (error) {
    console.error('Error fetching mission list:', error);
    return [];
  }
}