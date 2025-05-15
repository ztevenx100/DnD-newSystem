// @filename: tables.ts
import dbConnection from '@database/config/dbConnection';

// Interfaces
import { 
    DBEscenario, 
    DBMapamundi, 
    DBSonidoUbicacion, 
    DBPersonajeNoJugable, 
    DBEnemigo, 
    DBMision, 
    DBSistemaJuego, 
    DBHabilidadPersonaje, 
    DBUsuario, 
    DBPersonajesUsuario, 
    DBHabilidad, 
    DBEstadisticaPersonaje, 
    DBInventarioPersonaje, 
    DBUbicacion,
    DBSonido
} from '@utils/types';

const TABLE_ENE:string = 'ene_enemigo';
const TABLE_EPE:string = 'epe_estadistica_personaje';
const TABLE_ESC:string = 'esc_escenario';
const TABLE_HAD:string = 'hab_habilidad';
const TABLE_HPE:string = 'hpe_habilidad_personaje';
const TABLE_INP:string = 'inp_inventario_personaje';
const TABLE_MIS:string = 'mis_mision';
const TABLE_MMU:string = 'mmu_mapamundi';
const TABLE_PNJ:string = 'pnj_personaje_no_jugable';
const TABLE_PUS:string = 'pus_personajes_usuario';
const TABLE_SJU:string = 'sju_sistema_juego';
const TABLE_SON:string = 'son_sonidos';
const TABLE_SUB:string = 'sub_sonido_ubicacion';
const TABLE_UBI:string = 'ubi_ubicacion';
const TABLE_USU:string = 'usu_usuario';

interface WhereClause {
    [key: string]: string | string[];
}

interface OrderByClause {
    [key: string]: boolean | { [key: string]: boolean };
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de enemigos.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos (opcional).
 * @returns {DBEnemigo[]} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryEne = async (fields: string, where?: WhereClause, orderBy?: OrderByClause): Promise<DBEnemigo[]>  => {
    return getDataQuery(TABLE_ENE, fields, where, orderBy) as Promise<DBEnemigo[]>;
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de estadisticas por personaje.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos (opcional).
 * @returns {DBEstadisticaPersonaje[]} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryEpe = async (fields: string, where?: WhereClause, orderBy?: OrderByClause): Promise<DBEstadisticaPersonaje[]>  => {
    return getDataQuery(TABLE_EPE, fields, where, orderBy) as Promise<DBEstadisticaPersonaje[]>;
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de escenarios.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos.
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos.
 * @returns {DBEscenario[]} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryEsc = async (fields: string, where?: WhereClause, orderBy?: OrderByClause): Promise<DBEscenario[]>  => {
    return getDataQuery(TABLE_ESC, fields, where, orderBy) as Promise<DBEscenario[]>;
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de habilidades.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos (opcional).
 * @returns {DBHabilidad[]} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryHab = async (fields: string, where?: WhereClause, orderBy?: OrderByClause): Promise<DBHabilidad[]>  => {
    return getDataQuery(TABLE_HAD, fields, where, orderBy) as Promise<DBHabilidad[]>;
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de habilidades por personaje.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos (opcional).
 * @returns {DBHabilidadPersonaje[]} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryHpe = async (fields: string, where?: WhereClause, orderBy?: OrderByClause): Promise<DBHabilidadPersonaje[]>  => {
    return getDataQuery(TABLE_HPE, fields, where, orderBy) as Promise<DBHabilidadPersonaje[]>;
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de inventario por personaje.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos (opcional).
 * @returns {DBInventarioPersonaje[]} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryInp = async (fields: string, where?: WhereClause, orderBy?: OrderByClause): Promise<DBInventarioPersonaje[]>  => {
    return getDataQuery(TABLE_INP, fields, where, orderBy) as Promise<DBInventarioPersonaje[]>;
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de misiones.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos (opcional).
 * @returns {DBMision[]} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryMis = async (fields: string, where?: WhereClause, orderBy?: OrderByClause): Promise<DBMision[]>  => {
    return getDataQuery(TABLE_MIS, fields, where, orderBy) as Promise<DBMision[]>;
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de mapamundi.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos (opcional).
 * @returns {DBMapamundi[]} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryMmu = async (fields: string, where?: WhereClause, orderBy?: OrderByClause): Promise<DBMapamundi[]>  => {
    return getDataQuery(TABLE_MMU, fields, where, orderBy) as Promise<DBMapamundi[]>;
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de personjes no jugables.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos (opcional).
 * @returns {DBPersonajeNoJugable[]} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryPnj = async (fields: string, where?: WhereClause, orderBy?: OrderByClause): Promise<DBPersonajeNoJugable[]>  => {
    return getDataQuery(TABLE_PNJ, fields, where, orderBy) as Promise<DBPersonajeNoJugable[]>;
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de personajes por usuario.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos (opcional).
 * @returns {DBPersonajesUsuario[]} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryPus = async (fields: string, where?: WhereClause, orderBy?: OrderByClause): Promise<DBPersonajesUsuario[]>  => {
    return getDataQuery(TABLE_PUS, fields, where, orderBy) as Promise<DBPersonajesUsuario[]>;
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de sistemas de juego.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos (opcional).
 * @returns {DBSistemaJuego[]} datos obtenidos de la consulta a base de datos.
 */
export const getDataQuerySju = async (fields: string, where?: WhereClause, orderBy?: OrderByClause): Promise<DBSistemaJuego[]>  => {
    return getDataQuery(TABLE_SJU, fields, where, orderBy) as Promise<DBSistemaJuego[]>;
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de sonidos.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos (opcional).
 * @returns {DBSonido[]} datos obtenidos de la consulta a base de datos.
 */
export const getDataQuerySon = async (fields: string, where?: WhereClause, orderBy?: OrderByClause) => {
    return getDataQuery(TABLE_SON, fields, where, orderBy)as Promise<DBSonido[]>;
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de sonidos por ubicacion.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos (opcional).
 * @returns {DBSonidoUbicacion[]} datos obtenidos de la consulta a base de datos.
 */
export const getDataQuerySub = async (fields: string, where?: WhereClause, orderBy?: OrderByClause): Promise<DBSonidoUbicacion[]>  => {
    return getDataQuery(TABLE_SUB, fields, where, orderBy) as Promise<DBSonidoUbicacion[]>;
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de ubicaciones.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos (opcional).
 * @returns {DBUbicacion[]} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryUbi = async (fields: string, where?: WhereClause, orderBy?: OrderByClause) => {
    return getDataQuery(TABLE_UBI, fields, where, orderBy) as Promise<DBUbicacion[]>;
}

/**
 * Retorna los datos obtenidos de la consulta a la tabla de usuarios.
 * 
 * @param {string} fields - campos de la base de datos.
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 * @param {OrderByClause} [orderBy] - orderBy de la base de datos (opcional).
 * @returns {DBUsuario[]} datos obtenidos de la consulta a base de datos.
 */
export const getDataQueryUsu = async (fields: string, where?: WhereClause, orderBy?: OrderByClause): Promise<DBUsuario[]>  => {
    return getDataQuery(TABLE_USU, fields, where, orderBy) as Promise<DBUsuario[]>;
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
        /*console.log(`Executing query on table ${table} with fields ${fields}`, {
            where: where ? JSON.stringify(where) : 'none',
            orderBy: orderBy ? JSON.stringify(orderBy) : 'none'
        });*/

        let query = dbConnection
        .from(table)
        .select(fields);
    
        if (where) {
            for (const [key, value] of Object.entries(where)) {
                if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
                    /*console.log(`Adding IN condition: ${key} in [${value.join(', ')}]`);*/
                    query = query.in(key, value);
                } else if (typeof value === 'string') {
                    /*console.log(`Adding EQ condition: ${key} = ${value}`);*/
                    query = query.eq(key, value);
                }
            }
        }

        if (orderBy) {
            for (const [key, value] of Object.entries(orderBy)) {
                if (typeof value === 'boolean') {
                    query = query.order(key, { ascending: value });
                } else {
                    for (const [keyRef, valueRef] of Object.entries(value)) {
                        query = query.order(key, { referencedTable: keyRef, ascending: valueRef });
                    }
                }
            }
        }
        
        const { data, error } = await query.returns();

        if (error) {
            console.error(`Database error when querying ${table}:`, error);
            throw error;
        }
        
        /*console.log(`Query on ${table} returned ${data?.length || 0} results`);*/
        return data as T[] || [];
    } catch (error) {
        console.error(`Error executing select on ${table}:`, error);
        return [] as T[];
    }
}

// -- DELETE

/**
 *  Funcion para eliminar los datos para la tabla de personajes por usuario.
 * 
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 */
export const deleteDataQueryInp = async (where?: WhereClause) => {
    deleteDataQuery(TABLE_INP, where);
}

/**
 *  Funcion para eliminar los datos para la tabla de personajes por usuario.
 * 
 * @param {WhereClause} [where] - where de la base de datos (opcional).
 */
export const deleteDataQueryPus = async (where?: WhereClause) => {
    deleteDataQuery(TABLE_PUS, where);
}

/**
 * Funcion para eliminar los datos de base de datos.
 * 
 * @param {string} table - tabla de la base de datos.
 * @param {WhereClause} where - where de la base de datos.
 */
export const deleteDataQuery = async (table: string, where?: WhereClause):Promise<void> => {
    try {
        let query = dbConnection
        .from(table)
        .delete();

        if (where) {
            for (const [key, value] of Object.entries(where)) {
                if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
                    query = query.in(key, value);
                } else if (typeof value === 'string') {
                    query = query.eq(key, value);
                }
            }
        }
        
        const { error } = await query;

        if (error) throw error;
    } catch (error) {
        console.error('Error executing delete:', error);
        throw error;
    }
}

// -- INSERT

/**
 * Adicionar los datos obtenidos de la consulta a la tabla de estadisticas por personajes.
 * 
 * @param {DBEstadisticaPersonaje} data - estadisticas del personaje.
 * @returns {Promise<DBEstadisticaPersonaje>} datos obtenidos de la adicion a base de datos.
 */
export const insertDataEpe = async ( data: DBEstadisticaPersonaje | DBEstadisticaPersonaje[] ): Promise<DBEstadisticaPersonaje[]> => {
    return insertDataQuery(TABLE_EPE, data) as Promise<DBEstadisticaPersonaje[]>;
}

/**
 * Adicionar los datos obtenidos de la consulta a la tabla de habilidades por personajes.
 * 
 * @param {DBHabilidadPersonaje} data - Habilidades del personaje.
 * @returns {Promise<DBHabilidadPersonaje>} datos obtenidos de la adicion a base de datos.
 */
export const insertDataHpe = async ( data: DBHabilidadPersonaje | DBHabilidadPersonaje[] ): Promise<DBHabilidadPersonaje[]> => {
    return insertDataQuery(TABLE_HPE, data) as Promise<DBHabilidadPersonaje[]>;
}

/**
 * Adicionar los datos obtenidos de la consulta a la tabla de personajes por usuario.
 * 
 * @param {DBPersonajesUsuario} data - datos del personaje.
 * @returns {Promise<DBPersonajesUsuario>} datos obtenidos de la adicion a base de datos.
 */
export const insertDataPus = async ( data: DBPersonajesUsuario ): Promise<DBPersonajesUsuario[]> => {
    // Remover objetos anidados (joins) que no son columnas reales en la tabla
    const { sju_sistema_juego, usu_usuario, url_character_image, ...dataWithoutJoin } = data;
    
    // Log para depuración
    console.log('Insertando personaje:', { 
        dataId: data.pus_id,
        withJoins: Object.keys(data),
        withoutJoins: Object.keys(dataWithoutJoin)
    });
    
    return insertDataQuery(TABLE_PUS, dataWithoutJoin) as Promise<DBPersonajesUsuario[]>;
}

/**
 * Inserta datos de una tabla.
 * 
 * @param {string} table - El nombre de la tabla.
 * @param {object} data - Los datos a insertar.
 * @returns {Promise<T>} - La filas insertadas.
 */
export const insertDataQuery = async <T>(table: string, data: object | object[]): Promise<T[]> => {
    try {
        const { data: insertedData, error } = await Promise.resolve( dbConnection
            .from(table)
            .insert(data)
            .select()
        );
  
        if (error) throw error;

        console.log('data: ', insertedData);
        
        return insertedData as T[];
    } catch (error) {
        console.error('Error executing insert:', error);
        throw error;
    }
};

// -- UPDATE

/**
 * Actualizar los datos en la tabla de estadisticas por personajes.
 * 
 * @param {DBPersonajesUsuario} data - datos del personaje.
 * @returns {Promise<DBEstadisticaPersonaje>} datos obtenidos de la actualizacion a base de datos.
 */
export const updateDataEpe = async ( data: DBEstadisticaPersonaje, where?: WhereClause ): Promise<DBEstadisticaPersonaje[]> => {
    return updateDataQuery(TABLE_EPE, data, where);
}

/**
 * Actualizar los datos en la tabla de habilidades por personajes.
 * 
 * @param {DBPersonajesUsuario} data - datos del personaje.
 * @returns {Promise<DBHabilidadPersonaje>} datos obtenidos de la actualizacion a base de datos.
 */
export const updateDataHpe = async ( data: DBHabilidadPersonaje, where?: WhereClause ): Promise<DBHabilidadPersonaje[]> => {
    return updateDataQuery(TABLE_HPE, data, where);
}

/**
 * Actualizar los datos obtenidos de la consulta a la tabla de personajes por usuario.
 * 
 * @param {DBPersonajesUsuario} data - datos del personaje.
 * @returns {Promise<DBPersonajesUsuario[]>} datos obtenidos de la actualizacion a base de datos.
 */
export const updateDataPus = async ( data: DBPersonajesUsuario, where?: WhereClause ): Promise<DBPersonajesUsuario[]> => {
    // Remover objetos anidados (joins) que no son columnas reales en la tabla
    const { sju_sistema_juego, usu_usuario, url_character_image, ...dataWithoutJoin } = data;
    
    // Log para depuración
    console.log('Actualizando personaje:', { 
        dataId: data.pus_id,
        withJoins: Object.keys(data),
        withoutJoins: Object.keys(dataWithoutJoin)
    });
    
    return updateDataQuery(TABLE_PUS, dataWithoutJoin, where);
}

/**
 * Actualiza datos en una tabla.
 * 
 * @param {string} table - El nombre de la tabla.
 * @param {object} data - Los datos a actualizar.
 * @param {WhereClause} where - Cláusula WHERE para especificar qué filas actualizar.
 * @returns {Promise<T>} - La filas actualizadas.
 */
export const updateDataQuery = async <T>(table: string, data: object, where?: WhereClause): Promise<T[]> => {
    try {
        // Log de diagnóstico que muestra qué campos estamos intentando actualizar
        console.log(`Actualizando tabla ${table} con campos:`, Object.keys(data));
        
        let query = dbConnection
        .from(table)
        .update(data);

        if (where) {
            for (const [key, value] of Object.entries(where)) {
                if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
                    query = query.in(key, value);
                } else if (typeof value === 'string') {
                    query = query.eq(key, value);
                }
            }
        }
        
        const { data: updatedData, error } = await Promise.resolve( query.select() );
        
        if (error) {
            // Mensaje de error detallado para problemas de columnas
            if (error.message.includes("column") && error.message.includes("does not exist")) {
                console.error(`Error de columna inexistente en tabla ${table}:`, {
                    error,
                    data_fields: Object.keys(data)
                });
            }
            throw error;
        }
        
        console.log(`Actualización exitosa en tabla ${table}, filas actualizadas:`, updatedData?.length || 0);
        return updatedData as T[];
    } catch (error) {
        console.error(`Error executing update on table ${table}:`, error);
        throw error;
    }
};


// UPSERT

/**
 * Adicionar/Actualizar los datos obtenidos de la consulta a la tabla de habilidades por personajes.
 * 
 * @param {DBHabilidadPersonaje} data - Habilidades del personaje.
 * @returns {Promise<DBHabilidadPersonaje>} datos obtenidos de la adicion a base de datos.
 */
export const upsertDataHpe = async (data: DBHabilidadPersonaje | DBHabilidadPersonaje[]): Promise<DBHabilidadPersonaje[]> => {
    try {
        if (Array.isArray(data)) {
            const dataWithoutJoinArray = data.map(item => {
                const { hab_habilidad, ...rest } = item;
                return rest;
            });
            return upsertDataQuery(TABLE_HPE, dataWithoutJoinArray) as Promise<DBHabilidadPersonaje[]>;
        } else {
            const { hab_habilidad, ...dataWithoutJoin } = data;
            return upsertDataQuery(TABLE_HPE, dataWithoutJoin) as Promise<DBHabilidadPersonaje[]>;
        }
    } catch (error) {
        console.error('Error en upsertDataHpe:', error);
        throw error;
    }
}

/**
 * Adicionar/Actualizar los datos obtenidos de la consulta a la tabla de habilidades por personajes.
 * 
 * @param {DBInventarioPersonaje} data - Habilidades del personaje.
 * @returns {Promise<DBInventarioPersonaje>} datos obtenidos de la adicion a base de datos.
 */
export const upsertDataInp = async ( data: DBInventarioPersonaje | DBInventarioPersonaje[] ): Promise<DBInventarioPersonaje[]> => {
    if (Array.isArray(data)) {
        return upsertDataQuery(TABLE_INP, data) as Promise<DBInventarioPersonaje[]>;
    } else {
        return upsertDataQuery(TABLE_INP, data) as Promise<DBInventarioPersonaje[]>;
    }
}



/**
 * Inserta/Actualiza datos de una tabla.
 * 
 * @param {string} table - El nombre de la tabla.
 * @param {object} data - Los datos a insertar.
 * @returns {Promise<T>} - La filas insertadas.
 */
export const upsertDataQuery = async <T>(table: string, data: object | object[]): Promise<T[]> => {
    try {
        const { data: upsertedData, error } = await Promise.resolve( dbConnection
            .from(table)
            .upsert(data)
            .select()
        );
        
        if (error) throw error;
        
        console.log('data: ', upsertedData);
        
        return upsertedData as T[];
    } catch (error) {
        console.error('Error executing upsert:', error);
        throw error;
    }
};
