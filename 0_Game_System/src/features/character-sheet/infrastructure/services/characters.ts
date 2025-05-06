import { DBPersonajesUsuario } from "@shared/utils/types";
import { getMockCharacters } from "./mock/charactersMock";
import supabase from "@database/config/supabase";

// Flag para usar datos mock (temporal mientras solucionamos la API)
const useMockData = false; // Cambiado a false para usar Supabase

export const getlistCharacters = async (user: string): Promise<DBPersonajesUsuario[]> => {
  if (!user || user === "undefined") {
    console.error('ID de usuario inválido:', user);
    return [];
  }
  
  if (useMockData) {
    console.log('Usando datos mock (flag useMockData está activado)');
    return getMockCharacters(user);
  }
  
  try {
    console.log('Intentando cargar datos de Supabase para el usuario:', user);
    
    const { data, error } = await supabase
      .from('pus_personajes_usuario')
      .select('*, sju_sistema_juego(*)')
      .eq('pus_usuario', user);
    
    if (error) {
      console.error('Error de Supabase:', error);
      console.warn('Usando datos mock como fallback debido a error en Supabase');
      return getMockCharacters(user);
    }
    
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
  // Validar que id no sea undefined o vacío
  if (!id || id === "undefined" || id === "") {
    console.error('ID de personaje inválido:', id);
    throw new Error("ID de personaje no válido");
  }
  
  // Si estamos usando datos mock
  if (useMockData) {
    console.log(`[MOCK] Eliminando personaje con ID: ${id}`);
    return;
  }
  
  try {
    console.log('Intentando eliminar personaje con ID:', id);
    
    // Usar el cliente de Supabase directamente con el nombre correcto de la tabla
    const { error } = await supabase
      .from('pus_personajes_usuario')
      .delete()
      .eq('pus_id', id);
    
    if (error) {
      console.error('Error al eliminar personaje en Supabase:', error);
      throw new Error(`Error al eliminar el personaje: ${error.message}`);
    }
    
    console.log('Personaje eliminado correctamente de Supabase');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};