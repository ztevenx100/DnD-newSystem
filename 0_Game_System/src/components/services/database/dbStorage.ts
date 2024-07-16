// @filename: storage.ts
import dbConnection, {bucketName} from '@/components/services/database/dbConnection'

const SEPARATOR_PATH:string = '/'
const FOLDER_ENEMYS:string = 'enemigos'
const FOLDER_STAGES:string = 'escenarios'
const FOLDER_NPC:string = 'personajes'
const FOLDER_SOUNDS:string = 'sonidos'
const FOLDER_LOCATIONS:string = 'ubicaciones'
const FOLDER_USERS:string = 'usuarios'
//const randomValueRefreshImage = Math.random().toString(36).substring(7);

/**
 * Retorna la Url publica de una imagen del enemigo en el storage de suparbase.
 * 
 * @param {string} id - identificador del archivo.
 * @returns {string} URL publica del archivo.
 */
export const getUrlEnemy = async ( id:string) => {
    return getUrlImage(FOLDER_ENEMYS, id)
}

/**
 * Retorna la Url publica de una imagen del escenario en el storage de suparbase.
 * 
 * @param {string} id - identificador del archivo.
 * @returns {string} URL publica del archivo.
 */
export const getUrlStage = async (id:string) => {
    return getUrlImage(FOLDER_STAGES, id)
}

/**
 * Retorna la Url publica de una imagen del personaje no jugable en el storage de suparbase.
 * 
 * @param {string} id - identificador del archivo.
 * @returns {string} URL publica del archivo.
 */
export const getUrlNpc = async (id:string) => {
    return getUrlImage(FOLDER_NPC, id)
}

/**
 * Retorna la Url publica de un sonido en el storage de suparbase.
 * 
 * @param {string} id - identificador del archivo.
 * @returns {string} URL publica del archivo.
 */
export const getUrlSound = async (id:string) => {
    return getUrlSoundFile(FOLDER_SOUNDS, id)
}

/**
 * Retorna la Url publica de una imagen de la ubicacion en el storage de suparbase.
 * 
 * @param {string} id - identificador del archivo.
 * @returns {string} URL publica del archivo.
 */
export const getUrlLocation = async (id:string) => {
    return getUrlImage(FOLDER_LOCATIONS, id)
}

/**
 * Retorna la Url publica de una imagen del personaje del usuario en el storage de suparbase.
 * 
 * @param {string} idUser - identificador del usuario.
 * @param {string} id - identificador del archivo.
 * @returns {string} URL publica del archivo.
 */
export const getUrlCharacter = async (idUser:string, id:string) => {
    return getUrlImage(FOLDER_USERS + SEPARATOR_PATH + idUser, id)
}

/**
 * Retorna la Url publica de una imagen en el storage de suparbase.
 * 
 * @param {string} folder - carpeta de ubicacion del archivo.
 * @param {string} id - identificador del archivo.
 * @returns {string} URL publica del archivo.
 */
export const getUrlImage = async (folder:string, id:string) => {
    return getUrl(folder, id + ".webp")
}

/**
 * Retorna la Url publica de un sonido en el storage de suparbase.
 * 
 * @param {string} folder - carpeta de ubicacion del archivo.
 * @param {string} id - identificador del archivo.
 * @returns {string} URL publica del archivo.
 */
export const getUrlSoundFile = async (folder:string, id:string) => {
    return getUrl(folder, id + ".mp3")
}

/**
 * Retorna la Url publica del storage de suparbase.
 * 
 * @param {string} folder - carpeta de ubicacion del archivo.
 * @param {string} id - identificador del archivo.
 * @returns {string} URL publica del archivo.
 */
export const getUrl = async (folder:string, id:string) => {
    return getUrlStorage(folder + SEPARATOR_PATH + id)
}

/**
 * Retorna la Url publica del storage de suparbase.
 * 
 * @param {string} path - Ruta del archivo.
 * @returns {string} URL publica del archivo.
 */
export const getUrlStorage = async (path: string) => {
    let url = ''

    const { data } = dbConnection
        .storage
        .from(bucketName)
        .getPublicUrl(path)

    if (data !== null) {
        url = data.publicUrl
    }

    return url
}
