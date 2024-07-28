/** 
 * @filename: UserCharactersServices.ts
 * @file: Maneja las funciones relacionadas con el listado de personajes por usuario
 */ 

import { getDataQueryPus, deleteDataQueryPus } from '@database/dbTables';
// Interfaces
import { DBPersonajesUsuario } from '@interfaces/dbTypes';

/**
 * Busca el listado de personajes por usuario.
 * 
 * @param {string} user - El usuario para consultar el listado.
 * @returns {DBPersonajesUsuario[]} Retorna un listado de personajes por usuario.
 */
export const getlistCharacters = async(user: string): Promise<DBPersonajesUsuario[]> => {
    let data:DBPersonajesUsuario[] = [];
    try {
        data = await getDataQueryPus(
            'pus_id, pus_usuario, pus_nombre, pus_clase, pus_raza, pus_trabajo, pus_nivel, pus_descripcion, usu_usuario(usu_id, usu_nombre), sju_sistema_juego(sju_id, sju_nombre)'
            , {'pus_usuario': user}
        );
    } catch (error) {
        data = []
    }

    return data;
};

/**
 * Eliminar personajes por id.
 * 
 * @param {string} id - El id del personaje.
 */
export const deleteCharacter = async (id: string): Promise<void> => {
    
    try {
        deleteDataQueryPus({'pus_id': id});
    } catch (error) {
        console.log(error);
    }

};