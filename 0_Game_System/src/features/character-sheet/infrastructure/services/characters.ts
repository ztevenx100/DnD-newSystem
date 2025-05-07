import { DBPersonajesUsuario } from "@shared/utils/types";
import { getDataQueryPus } from '@database/models/dbTables';
import { getMockCharacters } from "./mock/charactersMock";
// Flag para usar datos mock (temporal mientras solucionamos la API)
const useMockData = false; // Cambiado a false para usar Supabase

export const getlistCharacters = async (user: string): Promise<DBPersonajesUsuario[]> => {
  // Mejorada la validación para detectar undefined y manejar errores adecuadamente
  if (!user || user === "undefined") {
    console.error('ID de usuario inválido:', user);
    return [];
  }
  
  if (useMockData) {
    console.log('Usando datos mock (flag useMockData está activado)');
    return getMockCharacters(user);
  }
  
  let data:DBPersonajesUsuario[] = [];
  try {
    console.log('Intentando cargar datos de Supabase para el usuario:', user);
    
    data = await getDataQueryPus(
        'pus_id, pus_usuario, pus_nombre, pus_clase, pus_raza, pus_trabajo, pus_nivel, pus_descripcion, pus_conocimientos, pus_arma_principal, pus_arma_secundaria'
        + ', pus_cantidad_oro, pus_cantidad_plata, pus_cantidad_bronce, pus_puntos_suerte, pus_vida, pus_alineacion, pus_sistema_juego'
        + ', sju_sistema_juego(sju_id,sju_nombre)'
        , {'pus_usuario': user}
    );
    
    console.log('Datos recibidos de Supabase:', data);
    
    if (data && data.length > 0) {
      return data as DBPersonajesUsuario[];
    } else {
      console.log('No se encontraron personajes para el usuario:', user);
      return [];
    }
  } catch (error) {
    console.error('Error al obtener personajes:', error);
    console.warn('Usando datos mock como fallback debido a error');
    return getMockCharacters(user);
  }
};

export const deleteCharacter = async (id: string): Promise<void> => {
  if (!id) {
    console.error('ID de personaje inválido para eliminar');
    return;
  }
  
  try {
    await import('@database/models/dbTables').then(({ deleteDataQueryPus }) => 
      deleteDataQueryPus({ 'pus_id': id })
    );
    console.log('Personaje eliminado correctamente:', id);
  } catch (error) {
    console.error('Error al eliminar personaje:', error);
    throw error;
  }
};