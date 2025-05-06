import { getUrlStorage, addStorageFile } from '@database/storage/dbStorage';

const FOLDER_CHARACTERS = 'personajes';
const FOLDER_SOUNDS = 'sonidos';

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

export const getUrlSound = async (soundId: string): Promise<string> => {
  try {
    const response = await fetch(`/api/storage/sounds/${soundId}`);
    if (!response.ok) {
      throw new Error('Error al obtener la URL del sonido');
    }
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error:', error);
    return '';
  }
};

export const uploadSound = async (soundId: string, file: File): Promise<{ path: string; error: unknown | null }> => {
  try {
    const path = `${FOLDER_SOUNDS}/${soundId}`;
    const result = await addStorageFile(path, file);
    if (!result.path) {
      throw new Error('No se pudo obtener la ruta del archivo');
    }
    return { path: result.path, error: null };
  } catch (error) {
    console.error('Error al subir el sonido:', error);
    return { path: '', error };
  }
}; 