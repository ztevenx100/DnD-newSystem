/** 
 * @filename: UserCharactersServices.ts
 * @file: Maneja las funciones relacionadas con el listado de personajes por usuario
 */ 

import { getDataQueryPus, deleteDataQueryPus, getDataQueryUsu, getDataQueryHad, getDataQuerySju, getDataQueryEpe, getDataQueryHpe, getDataQueryInp, updateDataPus } from '@database/dbTables';
// Interfaces
import { DBEstadisticaPersonaje, DBHabilidad, DBHabilidadPersonaje, DBInventarioPersonaje, DBPersonajesUsuario, DBSistemaJuego, DBUsuario, initialPersonajesUsuario } from '@interfaces/dbTypes';

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

// Character sheet

/**
 * Busca informacion del usuario.
 * 
 * @param {string} user - El usuario a consultar.
 * @returns {DBUsuario[]} Retorna el usuario.
 */
export const getUser = async(user: string): Promise<DBUsuario[]> => {
    let data:DBUsuario[] = [];
    try {
        data = await getDataQueryUsu(
            'usu_id, usu_nombre'
            , { 'usu_id': user }
        );
    } catch (error) {
        data = [];
    }

    return data;
};

/**
 * Busca el listado de habilidades.
 * 
 * @returns {DBHabilidad[]} Retorna el listado de habilidades.
 */
export const getListHad = async(): Promise<DBHabilidad[]> => {
    let data:DBHabilidad[] = [];
    try {
        data = await getDataQueryHad(
            'hab_id, hab_nombre, had_estadistica_base, hab_siglas, hab_tipo'
            , { 'hab_tipo': ['C','E','R'] }
            , { 'hab_tipo': true, 'had_estadistica_base': true }
         );
    } catch (error) {
        data = [];
    }

    return data;
};

/**
 * Busca el listado del sistema del juego.
 * 
 * @returns {DBSistemaJuego[]} Retorna el listado de sistema de juego.
 */
export const getGameSystem = async(): Promise<DBSistemaJuego[]> => {
    let data:DBSistemaJuego[] = [];
    try {
        data = await getDataQuerySju(
            'sju_id, sju_nombre'
            , { 'sju_estado': 'A' }
         );
    } catch (error) {
        data = [];
    }

    return data;
};

/**
 * Busca informacion del personaje.
 * 
 * @param {string} id - El id del personaje.
 * @returns {DBPersonajesUsuario[]} Retorna el personaje.
 */
export const getCharacter = async(id: string): Promise<DBPersonajesUsuario[]> => {
    let data:DBPersonajesUsuario[] = [];
    try {
        data = await getDataQueryPus(
            'pus_id, pus_usuario, pus_nombre, pus_clase, pus_raza, pus_trabajo, pus_nivel, pus_descripcion, pus_conocimientos, pus_arma_principal, pus_arma_secundaria'
            + ', pus_cantidad_oro, pus_cantidad_plata, pus_cantidad_bronce, pus_puntos_suerte, pus_vida, pus_alineacion, pus_sistema_juego'
            + ', sju_sistema_juego(sju_id,sju_nombre)'
            , { 'pus_id': id }
         );
    } catch (error) {
        data = [];
    }

    return data;
};

/**
 * Busca listado de estadisticas por personaje.
 * 
 * @param {string} id - El id del personaje.
 * @returns {DBEstadisticaPersonaje[]} Retorna el listado de estadisticas del personaje.
 */
export const getListEpe = async(id: string): Promise<DBEstadisticaPersonaje[]> => {
    let data:DBEstadisticaPersonaje[] = [];
    try {
        data = await getDataQueryEpe(
            'epe_personaje, epe_sigla, epe_nombre, epe_num_dado, epe_num_clase, epe_num_nivel'
            , { 'epe_personaje': id }
         );
    } catch (error) {
        data = [];
    }

    return data;
};

/**
 * Busca listado de habilidades por personaje.
 * 
 * @param {string} id - El id del personaje.
 * @returns {DBHabilidadPersonaje[]} Retorna el listado de habilidades del personaje.
 */
export const getListHpe = async(id: string): Promise<DBHabilidadPersonaje[]> => {
    let data:DBHabilidadPersonaje[] = [];
    try {
        data = await getDataQueryHpe(
            'hpe_habilidad, hpe_campo, hpe_alineacion, hab_habilidad(hab_id, hab_nombre, had_estadistica_base, hab_siglas)'
            , { 'hpe_personaje': id }
            , { 'hpe_campo': true }
         );
    } catch (error) {
        data = [];
    }

    return data;
};

/**
 * Busca listado de inventario por personaje.
 * 
 * @param {string} id - El id del personaje.
 * @returns {DBInventarioPersonaje[]} Retorna el listado de inventario del personaje.
 */
export const getListInp = async(id: string): Promise<DBInventarioPersonaje[]> => {
    let data:DBInventarioPersonaje[] = [];
    try {
        data = await getDataQueryInp(
            'inp_id, inp_nombre, inp_descripcion, inp_cantidad'
            , { 'inp_personaje': id }
         );
    } catch (error) {
        data = [];
    }

    return data;
};

/**
 * Busca listado de inventario por personaje.
 * 
 * @param {string} id - El id del personaje.
 * @returns {DBPersonajesUsuario[]} Retorna el listado de inventario del personaje.
 */
export const updatePus = async( dataPus: DBPersonajesUsuario, id: string ): Promise<DBPersonajesUsuario> => {
    let data:DBPersonajesUsuario;
    try {
        data = await updateDataPus(
            dataPus
            , { 'pus_id': id }
         );
    } catch (error) {
        data = initialPersonajesUsuario;
    }

    return data;
};

