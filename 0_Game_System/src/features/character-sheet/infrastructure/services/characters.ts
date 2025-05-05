import { DBPersonajesUsuario } from "@shared/utils/types";

export const getlistCharacters = async (user: string): Promise<DBPersonajesUsuario[]> => {
  try {
    const response = await fetch(`/api/characters?user=${user}`);
    if (!response.ok) {
      throw new Error('Error al obtener la lista de personajes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export const deleteCharacter = async (id: string): Promise<void> => {
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