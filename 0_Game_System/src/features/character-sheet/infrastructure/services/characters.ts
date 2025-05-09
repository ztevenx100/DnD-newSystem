import { DBPersonajesUsuario } from "@shared/utils/types";
import { getDataQueryPus } from '@database/models/dbTables';
import { getMockCharacters } from "./mock/charactersMock";
// Flag para usar datos mock (temporal mientras solucionamos la API)
const useMockData = false; // Cambiado a false para usar Supabase

/**
 * Obtiene la lista de personajes para un usuario específico
 * @param user ID del usuario
 * @returns Lista de personajes del usuario
 */
export const getlistCharacters = async (user: string): Promise<DBPersonajesUsuario[]> => {
  // Validación mejorada del ID de usuario
  if (!user || user === "undefined" || user.trim() === "") {
    console.error('ID de usuario inválido:', user);
    return [];
  }
  
  if (useMockData) {
    console.log('Usando datos mock (flag useMockData está activado)');
    return getMockCharacters(user);
  }
  
  try {
    console.log('Cargando datos de Supabase para el usuario:', user);
    
    // Consulta completa para obtener todos los campos necesarios
    const data = await getDataQueryPus(
      'pus_id, pus_usuario, pus_nombre, pus_clase, pus_raza, pus_trabajo, pus_nivel, ' +
      'pus_descripcion, pus_conocimientos, pus_arma_principal, pus_arma_secundaria, ' +
      'pus_cantidad_oro, pus_cantidad_plata, pus_cantidad_bronce, pus_puntos_suerte, ' +
      'pus_vida, pus_alineacion, pus_sistema_juego, ' +
      'sju_sistema_juego(sju_id, sju_nombre)',
      { 'pus_usuario': user }
    );
    
    console.log('Personajes recibidos de Supabase:', data);
    
    if (data && data.length > 0) {
      // Validar que cada personaje tenga los campos requeridos
      return data.map(personaje => {
        // Asegurar que los campos numéricos sean realmente números
        return {
          ...personaje,
          pus_nivel: Number(personaje.pus_nivel) || 1,
          pus_puntos_suerte: Number(personaje.pus_puntos_suerte) || 0,
          pus_vida: Number(personaje.pus_vida) || 0,
          pus_cantidad_oro: Number(personaje.pus_cantidad_oro) || 0,
          pus_cantidad_plata: Number(personaje.pus_cantidad_plata) || 0,
          pus_cantidad_bronce: Number(personaje.pus_cantidad_bronce) || 0
        };
      });
    } else {
      console.log('No se encontraron personajes para el usuario:', user);
      return [];
    }
  } catch (error) {
    console.error('Error al obtener personajes:', error);
    // Usar datos mock como fallback en caso de error
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