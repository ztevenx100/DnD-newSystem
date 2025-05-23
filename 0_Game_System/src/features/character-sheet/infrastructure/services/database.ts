import { getDataQuery, insertDataQuery, updateDataQuery, upsertDataQuery, deleteDataQuery, getDataQueryHab } from '@database/models/dbTables';
import { DBPersonajesUsuario, DBEstadisticaPersonaje, DBHabilidadPersonaje, DBInventarioPersonaje, DBSistemaJuego, DBHabilidad } from '@utils/types';

const TABLE_PUS = 'pus_personajes_usuario';
const TABLE_EPE = 'epe_estadistica_personaje';
const TABLE_HPE = 'hpe_habilidad_personaje';
const TABLE_INP = 'inp_inventario_personaje';
const TABLE_HAD = 'hab_habilidad';

export const getCharacter = async (id: string) => {
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
    try {
        let result = await getDataQueryHab('*', { hab_tipo: ['C','E','R'] });
        
        if (!result || result.length === 0) {
            result = await getDataQuery<DBHabilidad>(TABLE_HAD, '*', { tipo: ['C','E','R'] });
        }
        
        if (!result || result.length === 0) {
            result = [
                { id: '1', nombre: 'Ataque Brutal', sigla: 'AB', tipo: 'C', estadistica_base: 'STR', 
                  hab_id: '1', hab_nombre: 'Ataque Brutal', hab_siglas: 'AB', hab_tipo: 'C', had_estadistica_base: 'STR' } as DBHabilidad,
                
                { id: '2', nombre: 'Magia Arcana', sigla: 'MA', tipo: 'C', estadistica_base: 'INT',
                  hab_id: '2', hab_nombre: 'Magia Arcana', hab_siglas: 'MA', hab_tipo: 'C', had_estadistica_base: 'INT' } as DBHabilidad,
                
                { id: '3', nombre: 'Sigilo Avanzado', sigla: 'SA', tipo: 'E', estadistica_base: 'DEX',
                  hab_id: '3', hab_nombre: 'Sigilo Avanzado', hab_siglas: 'SA', hab_tipo: 'E', had_estadistica_base: 'DEX' } as DBHabilidad,
                
                { id: '4', nombre: 'Curación', sigla: 'CU', tipo: 'E', estadistica_base: 'CON',
                  hab_id: '4', hab_nombre: 'Curación', hab_siglas: 'CU', hab_tipo: 'E', had_estadistica_base: 'CON' } as DBHabilidad,
                
                { id: '5', nombre: 'Anillo de Fuerza', sigla: 'RF', tipo: 'R', estadistica_base: 'STR',
                  hab_id: '5', hab_nombre: 'Anillo de Fuerza', hab_siglas: 'RF', hab_tipo: 'R', had_estadistica_base: 'STR' } as DBHabilidad,
                
                { id: '6', nombre: 'Anillo de Inteligencia', sigla: 'RI', tipo: 'R', estadistica_base: 'INT',
                  hab_id: '6', hab_nombre: 'Anillo de Inteligencia', hab_siglas: 'RI', hab_tipo: 'R', had_estadistica_base: 'INT' } as DBHabilidad,
                
                { id: '7', nombre: 'Anillo de Destreza', sigla: 'RD', tipo: 'R', estadistica_base: 'DEX',
                  hab_id: '7', hab_nombre: 'Anillo de Destreza', hab_siglas: 'RD', hab_tipo: 'R', had_estadistica_base: 'DEX' } as DBHabilidad,
                
                { id: '8', nombre: 'Anillo de Constitución', sigla: 'RC', tipo: 'R', estadistica_base: 'CON',
                  hab_id: '8', hab_nombre: 'Anillo de Constitución', hab_siglas: 'RC', hab_tipo: 'R', had_estadistica_base: 'CON' } as DBHabilidad,
                
                { id: '9', nombre: 'Anillo de Percepción', sigla: 'RP', tipo: 'R', estadistica_base: 'PER',
                  hab_id: '9', hab_nombre: 'Anillo de Percepción', hab_siglas: 'RP', hab_tipo: 'R', had_estadistica_base: 'PER' } as DBHabilidad,
                
                { id: '10', nombre: 'Anillo de Carisma', sigla: 'RCH', tipo: 'R', estadistica_base: 'CHA',
                  hab_id: '10', hab_nombre: 'Anillo de Carisma', hab_siglas: 'RCH', hab_tipo: 'R', had_estadistica_base: 'CHA' } as DBHabilidad,
            ];
            console.log("Created test data:", result);
        }
        
        return result;
    } catch (error) {
        console.error("Error fetching skills data:", error);
        return [];
    }
};