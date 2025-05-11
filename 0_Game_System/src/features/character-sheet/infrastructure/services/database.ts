import { getDataQuery, insertDataQuery, updateDataQuery, upsertDataQuery, deleteDataQuery } from '@database/models/dbTables';
import { DBPersonajesUsuario, DBEstadisticaPersonaje, DBHabilidadPersonaje, DBInventarioPersonaje, DBSistemaJuego, DBHabilidad } from '@utils/types';

const TABLE_PUS = 'pus_personajes_usuario';
const TABLE_EPE = 'epe_estadistica_personaje';
const TABLE_HPE = 'hpe_habilidad_personaje';
const TABLE_INP = 'inp_inventario_personaje';

export const getCharacter = async (id: string) => {
    // Especificamos explícitamente que queremos incluir la información del sistema de juego
    return getDataQuery<DBPersonajesUsuario>(
        TABLE_PUS, 
        '*, sju_sistema_juego!inner(*)', 
        { pus_id: id }
    );
};

export const getCharactersByUser = async (userId: string) => {
    return getDataQuery<DBPersonajesUsuario>(TABLE_PUS, '*', { pus_usuario: userId });
};

export const insertCharacter = async (character: DBPersonajesUsuario) => {
    return insertDataQuery<DBPersonajesUsuario>(TABLE_PUS, character);
};

export const updateCharacter = async (character: DBPersonajesUsuario): Promise<DBPersonajesUsuario | null> => {
    const result = await updateDataQuery<DBPersonajesUsuario>(TABLE_PUS, character, { pus_id: character.pus_id });
    return result && result.length > 0 ? result[0] : null;
};

export const insertPus = async (character: DBPersonajesUsuario): Promise<DBPersonajesUsuario | null> => {
    const result = await insertDataQuery<DBPersonajesUsuario>(TABLE_PUS, character);
    return result && result.length > 0 ? result[0] : null;
};

export const deleteCharacter = async (id: string) => {
    return deleteDataQuery(TABLE_PUS, { pus_id: id });
};

export const getCharacterStats = async (characterId: string) => {
    return getDataQuery<DBEstadisticaPersonaje>(TABLE_EPE, '*', { epe_personaje: characterId });
};

export const upsertCharacterStats = async (stats: DBEstadisticaPersonaje[]) => {
    return upsertDataQuery<DBEstadisticaPersonaje>(TABLE_EPE, stats);
};

export const updateCharacterStats = async (stats: DBEstadisticaPersonaje) => {
    return updateDataQuery<DBEstadisticaPersonaje>(TABLE_EPE, stats, { 
        epe_personaje: stats.epe_personaje, 
        epe_sigla: stats.epe_sigla 
    });
};

export const getCharacterSkills = async (characterId: string) => {
    return getDataQuery<DBHabilidadPersonaje>(TABLE_HPE, '*', { hpe_personaje: characterId });
};

export const upsertCharacterSkills = async (skills: DBHabilidadPersonaje[]) => {
    return upsertDataQuery<DBHabilidadPersonaje>(TABLE_HPE, skills);
};

export const getCharacterInventory = async (characterId: string) => {
    return getDataQuery<DBInventarioPersonaje>(TABLE_INP, '*', { inp_personaje: characterId });
};

export const upsertCharacterInventory = async (inventory: DBInventarioPersonaje[]) => {
    return upsertDataQuery<DBInventarioPersonaje>(TABLE_INP, inventory);
};

export const deleteItemInventory = async (items: string[]) => {
    return deleteDataQuery(TABLE_INP, { inp_id: items });
};

export const getGameSystem = async () => {
    return getDataQuery<DBSistemaJuego>('sju_sistema_juego', '*', { sju_estado: 'A' });
};

export const getListHad = async () => {
    return getDataQuery<DBHabilidad>('hab_habilidad', '*', { hab_tipo: ['C','E','R'] });
};