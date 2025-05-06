import { getUrlStorage, addStorageFile } from '@database/storage/dbStorage';

const FOLDER_STAGES = 'escenarios';
const FOLDER_SOUNDS = 'sonidos';
const FOLDER_NPCS = 'personajes';
const FOLDER_ENEMIES = 'enemigos';

export const getStageImageUrl = async (stageId: string) => {
    const path = `${FOLDER_STAGES}/${stageId}`;
    return getUrlStorage(path);
};

export const getSoundUrl = async (soundId: string) => {
    const path = `${FOLDER_SOUNDS}/${soundId}`;
    return getUrlStorage(path);
};

export const getNpcImageUrl = async (npcId: string) => {
    const path = `${FOLDER_NPCS}/${npcId}`;
    return getUrlStorage(path);
};

export const getEnemyImageUrl = async (enemyId: string) => {
    const path = `${FOLDER_ENEMIES}/${enemyId}`;
    return getUrlStorage(path);
};

export const uploadStageImage = async (stageId: string, file: File) => {
    const path = `${FOLDER_STAGES}/${stageId}`;
    return addStorageFile(path, file);
};

export const uploadSound = async (soundId: string, file: File) => {
    const path = `${FOLDER_SOUNDS}/${soundId}`;
    return addStorageFile(path, file);
};

export const uploadNpcImage = async (npcId: string, file: File) => {
    const path = `${FOLDER_NPCS}/${npcId}`;
    return addStorageFile(path, file);
};

export const uploadEnemyImage = async (enemyId: string, file: File) => {
    const path = `${FOLDER_ENEMIES}/${enemyId}`;
    return addStorageFile(path, file);
}; 