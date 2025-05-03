import { getDataQuery, insertDataQuery, updateDataQuery, upsertDataQuery, deleteDataQuery } from '@/services/database/dbTables';
import { DBPersonajesUsuario, DBEstadisticaPersonaje, DBHabilidadPersonaje, DBInventarioPersonaje } from '@/interfaces';

const TABLE_PUS = 'pus_personajes_usuario';
const TABLE_EPE = 'epe_estadistica_personaje';
const TABLE_HPE = 'hpe_habilidad_personaje';
const TABLE_INP = 'inp_inventario_personaje';

export const getCharacter = async (id: string) => {
    return getDataQuery<DBPersonajesUsuario>(TABLE_PUS, '*', { pus_id: id });
};

export const getCharactersByUser = async (userId: string) => {
    return getDataQuery<DBPersonajesUsuario>(TABLE_PUS, '*', { pus_usuario: userId });
};

export const insertCharacter = async (character: DBPersonajesUsuario) => {
    return insertDataQuery<DBPersonajesUsuario>(TABLE_PUS, character);
};

export const updateCharacter = async (character: DBPersonajesUsuario) => {
    return updateDataQuery<DBPersonajesUsuario>(TABLE_PUS, character, { pus_id: character.pus_id });
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