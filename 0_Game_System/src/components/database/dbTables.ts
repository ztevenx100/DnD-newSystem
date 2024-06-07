// @filename: tables.ts
import dbConnection from '@database/dbConnection'

const TABLE_ENE:string = 'ene_enemigo'
const TABLE_EPE:string = 'epe_estadistica_personaje'
const TABLE_ESC:string = 'esc_escenario'
const TABLE_HAD:string = 'hab_habilidad'
const TABLE_HPE:string = 'hpe_habilidad_personaje'
const TABLE_INP:string = 'inp_inventario_personaje'
const TABLE_MIS:string = 'mis_mision'
const TABLE_MMU:string = 'mmu_mapamundi'
const TABLE_PNJ:string = 'pnj_personaje_no_jugable'
const TABLE_PUS:string = 'pus_personajes_usuario'
const TABLE_SJU:string = 'sju_sistema_juego'
const TABLE_SON:string = 'son_sonidos'
const TABLE_SUB:string = 'sub_sonido_ubicacion'
const TABLE_UBI:string = 'ubi_ubicacion'
const TABLE_USU:string = 'usu_usuario'

interface WhereClause {
    [key: string]: string;
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de enemigos.
 * 
 * @param {string} fields - campos de la base de datos.
 * @returns {any} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryEne = async (fields: string) => {
    return getDataQuery(TABLE_ENE, fields, {})
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de estadisticas por personaje.
 * 
 * @param {string} fields - campos de la base de datos.
 * @returns {any} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryEpe = async (fields: string) => {
    return getDataQuery(TABLE_EPE, fields, {})
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de escenarios.
 * 
 * @param {string} fields - campos de la base de datos.
 * @returns {any} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryEsc = async (fields: string) => {
    return getDataQuery(TABLE_ESC, fields, {})
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de habilidades.
 * 
 * @param {string} fields - campos de la base de datos.
 * @returns {any} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryHad = async (fields: string) => {
    return getDataQuery(TABLE_HAD, fields, {})
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de habilidades por personaje.
 * 
 * @param {string} fields - campos de la base de datos.
 * @returns {any} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryHpe = async (fields: string) => {
    return getDataQuery(TABLE_HPE, fields, {})
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de inventario por personaje.
 * 
 * @param {string} fields - campos de la base de datos.
 * @returns {any} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryInp = async (fields: string) => {
    return getDataQuery(TABLE_INP, fields, {})
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de misiones.
 * 
 * @param {string} fields - campos de la base de datos.
 * @returns {any} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryMis = async (fields: string) => {
    return getDataQuery(TABLE_MIS, fields, {})
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de mapamundi.
 * 
 * @param {string} fields - campos de la base de datos.
 * @returns {any} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryMmu = async (fields: string) => {
    return getDataQuery(TABLE_MMU, fields, {})
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de personjes no jugables.
 * 
 * @param {string} fields - campos de la base de datos.
 * @returns {any} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryPnj = async (fields: string) => {
    return getDataQuery(TABLE_PNJ, fields, {})
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de personajes por usuario.
 * 
 * @param {string} fields - campos de la base de datos.
 * @returns {any} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryPus = async (fields: string) => {
    return getDataQuery(TABLE_PUS, fields, {})
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de sistemas de juego.
 * 
 * @param {string} fields - campos de la base de datos.
 * @returns {any} datos obtenidos de la consulta a base de datos.
 */
export const getDataQuerySju = async (fields: string) => {
    return getDataQuery(TABLE_SJU, fields, {})
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de sonidos.
 * 
 * @param {string} fields - campos de la base de datos.
 * @returns {any} datos obtenidos de la consulta a base de datos.
 */
export const getDataQuerySon = async (fields: string) => {
    return getDataQuery(TABLE_SON, fields, {})
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de sonidos por ubicacion.
 * 
 * @param {string} fields - campos de la base de datos.
 * @returns {any} datos obtenidos de la consulta a base de datos.
 */
export const getDataQuerySub = async (fields: string) => {
    return getDataQuery(TABLE_SUB, fields, {})
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de ubicaciones.
 * 
 * @param {string} fields - campos de la base de datos.
 * @returns {any} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryUbi = async (fields: string) => {
    return getDataQuery(TABLE_UBI, fields, {})
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de usuarios.
 * 
 * @param {string} fields - campos de la base de datos.
 * @returns {any} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryUsu = async (fields: string) => {
    return getDataQuery(TABLE_USU, fields, {})
}

/**
 * Retorna los datos obtenidos de la consulta de base de datos.
 * 
 * @param {string} table - tabla de la base de datos.
 * @param {string} fields - campos de la base de datos.
 * @returns {any} datos obtenidos de la consulta a base de datos.
 */
export const getDataQuerySimple = async (table: string, fields: string) => {
    return getDataQuery(table, fields, {})
}

/**
 * Retorna los datos obtenidos de la consulta de base de datos.
 * 
 * @param {string} table - tabla de la base de datos.
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} where - where de la base de datos.
 * @returns {any} datos obtenidos de la consulta a base de datos.
 */
export const getDataQuery = async (table: string, fields: string, where: WhereClause) => {

    try {
        let query = dbConnection
        .from(table)
        .select(fields)
    
        for (const [key, value] of Object.entries(where)) {
            query = query.eq(key, value);
        }
    
        const { data, error } = await query

        if (error) throw error
        
        return data
    } catch (error) {
        console.error('Error executing select:', error);
        throw error;
    }

}