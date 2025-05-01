import { addStorageCharacter } from '@database/dbStorage';

export const uploadService = {
  async uploadImage(file: File, folder: string): Promise<{ url?: string; error?: string }> {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        return { error: 'Usuario no autenticado' };
      }

      const result = await addStorageCharacter(userId, folder, file);
      if (result.path) {
        return { url: result.path };
      }
      return { error: typeof result.error === 'string' ? result.error : 'Error al subir la imagen' };
    } catch (error) {
      console.error('Error en uploadService.uploadImage:', error);
      return { error: 'Error al subir la imagen' };
    }
  }
};