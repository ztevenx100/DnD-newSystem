import { getUrlStorage, addStorageFile } from '@/services/database/dbStorage';

const FOLDER_GAME_SYSTEMS = 'sistemas-juego';

export const getGameSystemImageUrl = async (gameSystemId: string) => {
    const path = `${FOLDER_GAME_SYSTEMS}/${gameSystemId}`;
    return getUrlStorage(path);
};

export const uploadGameSystemImage = async (gameSystemId: string, file: File) => {
    const path = `${FOLDER_GAME_SYSTEMS}/${gameSystemId}`;
    return addStorageFile(path, file);
}; 