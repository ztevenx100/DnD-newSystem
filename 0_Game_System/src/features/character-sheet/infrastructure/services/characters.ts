import { DBPersonajesUsuario } from "@shared/utils/types";
import { getMockCharacters } from "./mock/charactersMock";

// Determinar si estamos en modo desarrollo
const isDevelopmentMode = import.meta.env.DEV;

export const getlistCharacters = async (user: string): Promise<DBPersonajesUsuario[]> => {
  // En modo desarrollo, usar datos mock
  if (isDevelopmentMode) {
    console.log('Usando datos mock para desarrollo');
    return getMockCharacters(user);
  }
  
  try {
    const response = await fetch(`/api/characters?user=${user}`);
    
    if (!response.ok) {
      // Extraemos el texto para hacer diagnóstico
      const errorText = await response.text();
      console.error('Respuesta no exitosa:', {
        status: response.status,
        statusText: response.statusText,
        responseText: errorText.substring(0, 200) + '...' // Solo los primeros 200 caracteres
      });
      
      // Si en producción hay un error, intentamos usar datos mock como fallback
      console.warn('Usando datos mock como fallback debido a error en API');
      return getMockCharacters(user);
    }
    
    // Verificamos el tipo de contenido
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Si no es JSON, intentamos obtener el texto para diagnóstico
      const textResponse = await response.text();
      console.error('Respuesta no es JSON:', {
        contentType,
        responsePreview: textResponse.substring(0, 200) + '...' // Solo los primeros 200 caracteres
      });
      
      // Usamos datos mock como fallback
      console.warn('Usando datos mock como fallback debido a respuesta no-JSON');
      return getMockCharacters(user);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al obtener personajes:', error);
    
    // En caso de cualquier error, usamos los datos mock como fallback
    console.warn('Usando datos mock como fallback debido a error en fetch');
    return getMockCharacters(user);
  }
};

export const deleteCharacter = async (id: string): Promise<void> => {
  // En modo desarrollo, simplemente logueamos la acción
  if (isDevelopmentMode) {
    console.log(`[MOCK] Eliminando personaje con ID: ${id}`);
    return;
  }
  
  try {
    const response = await fetch(`/api/characters/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error al eliminar el personaje');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};