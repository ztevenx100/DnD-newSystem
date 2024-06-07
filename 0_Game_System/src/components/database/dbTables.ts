// @filename: tables.ts
import dbConnection from '@database/dbConnection'


// Interfaces
import { DBEscenario, DBMapamundi, DBSonidoUbicacion, DBPersonajeNoJugable, DBEnemigo, DBMision, DBSistemaJuego, DBHabilidadPersonaje, DBUsuario } from '@interfaces/dbTypes'

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

interface OrderByClause {
    [key: string]: boolean;
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de enemigos.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos (opcional).
 * @returns {DBEnemigo[]} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryEne = async (fields: string, where?: WhereClause, orderBy?: OrderByClause) => {
    return getDataQuery<DBEnemigo>(TABLE_ENE, fields, where, orderBy)
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de estadisticas por personaje.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos (opcional).
 * @returns {any} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryEpe = async (fields: string, where?: WhereClause, orderBy?: OrderByClause) => {
    return getDataQuery(TABLE_EPE, fields, where, orderBy)
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de escenarios.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos.
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos.
 * @returns {DBEscenario[]} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryEsc = async (fields: string, where?: WhereClause, orderBy?: OrderByClause) => {
    return getDataQuery<DBEscenario>(TABLE_ESC, fields, where, orderBy)
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de habilidades.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos (opcional).
 * @returns {any} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryHad = async (fields: string, where?: WhereClause, orderBy?: OrderByClause) => {
    return getDataQuery(TABLE_HAD, fields, where, orderBy)
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de habilidades por personaje.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos (opcional).
 * @returns {any} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryHpe = async (fields: string, where?: WhereClause, orderBy?: OrderByClause) => {
    return getDataQuery<DBHabilidadPersonaje>(TABLE_HPE, fields, where, orderBy)
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de inventario por personaje.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos (opcional).
 * @returns {any} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryInp = async (fields: string, where?: WhereClause, orderBy?: OrderByClause) => {
    return getDataQuery(TABLE_INP, fields, where, orderBy)
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de misiones.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos (opcional).
 * @returns {DBMision[]} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryMis = async (fields: string, where?: WhereClause, orderBy?: OrderByClause) => {
    return getDataQuery<DBMision>(TABLE_MIS, fields, where, orderBy)
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de mapamundi.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos (opcional).
 * @returns {DBMapamundi[]} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryMmu = async (fields: string, where?: WhereClause, orderBy?: OrderByClause) => {
    return getDataQuery<DBMapamundi>(TABLE_MMU, fields, where, orderBy)
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de personjes no jugables.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos (opcional).
 * @returns {DBPersonajeNoJugable[]} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryPnj = async (fields: string, where?: WhereClause, orderBy?: OrderByClause) => {
    return getDataQuery<DBPersonajeNoJugable>(TABLE_PNJ, fields, where, orderBy)
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de personajes por usuario.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos (opcional).
 * @returns {any} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryPus = async (fields: string, where?: WhereClause, orderBy?: OrderByClause) => {
    return getDataQuery(TABLE_PUS, fields, where, orderBy)
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de sistemas de juego.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos (opcional).
 * @returns {DBSistemaJuego[]} datos obtenidos de la consulta a base de datos.
 */
export const getDataQuerySju = async (fields: string, where?: WhereClause, orderBy?: OrderByClause) => {
    return getDataQuery<DBSistemaJuego>(TABLE_SJU, fields, where, orderBy)
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de sonidos.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos (opcional).
 * @returns {any} datos obtenidos de la consulta a base de datos.
 */
export const getDataQuerySon = async (fields: string, where?: WhereClause, orderBy?: OrderByClause) => {
    return getDataQuery(TABLE_SON, fields, where, orderBy)
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de sonidos por ubicacion.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos (opcional).
 * @returns {DBSonidoUbicacion[]} datos obtenidos de la consulta a base de datos.
 */
export const getDataQuerySub = async (fields: string, where?: WhereClause, orderBy?: OrderByClause) => {
    return getDataQuery<DBSonidoUbicacion>(TABLE_SUB, fields, where, orderBy)
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de ubicaciones.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos (opcional).
 * @returns {any} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryUbi = async (fields: string, where?: WhereClause, orderBy?: OrderByClause) => {
    return getDataQuery(TABLE_UBI, fields, where, orderBy)
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de usuarios.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos (opcional).
 * @returns {DBUsuario[]} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryUsu = async (fields: string, where?: WhereClause, orderBy?: OrderByClause) => {
    return getDataQuery<DBUsuario>(TABLE_USU, fields, where, orderBy)
}

/**
 * Retorna los datos obtenidos de la consulta de base de datos.
 * 
 * @param {string} table - tabla de la base de datos.
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} where - where de la base de datos.
 * @param {OrderByClause} orderBy - orderBy de la base de datos.
 * @returns {any} datos obtenidos de la consulta a base de datos.
 */
export const getDataQuery = async<T> (table: string, fields: string, where?: WhereClause, orderBy?: OrderByClause):Promise<T[]> => {

    try {
        let query = dbConnection
        .from(table)
        .select(fields)
    
        if (where) {
            for (const [key, value] of Object.entries(where)) {
                query = query.eq(key, value);
            }
        }

        if (orderBy) {
            //query = query.order(orderBy.field, { ascending: orderBy.ascending });
            for (const [key, value] of Object.entries(orderBy)) {
                query = query.order(key, { ascending: value })
            }
        }
        
        const { data, error } = await query.returns<T[]>()

        if (error) throw error
        
        return data as T[]
    } catch (error) {
        console.error('Error executing select:', error);
        throw error;
    }

}