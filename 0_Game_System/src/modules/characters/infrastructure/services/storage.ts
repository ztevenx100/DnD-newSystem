import { getUrlStorage, addStorageFile } from '@/services/database/dbStorage';

const FOLDER_CHARACTERS = 'personajes';

export const getCharacterImageUrl = async (userId: string, characterId: string) => {
    const path = `${FOLDER_CHARACTERS}/${userId}/${characterId}`;
    return getUrlStorage(path);
};

export const uploadCharacterImage = async (userId: string, characterId: string, file: File) => {
    const path = `${FOLDER_CHARACTERS}/${userId}/${characterId}`;
    return addStorageFile(path, file);
};

export const getUrlCharacter = async (user: string, characterId: string): Promise<string> => {
  try {
    const response = await fetch(`/api/storage/characters/${user}/${characterId}`);
    if (!response.ok) {
      throw new Error('Error al obtener la URL del personaje');
    }
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error:', error);
    return '';
  }
}; 