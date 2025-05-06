// Importamos ambos tipos para poder hacer la transformación
import { 
  DBPersonajeNoJugable as DomainDBPersonajeNoJugable,
  DBEnemigo as DomainDBEnemigo,
  DBMapamundi as DomainDBMapamundi,
  DBSonidoUbicacion as DomainDBSonidoUbicacion,
  DBMision as DomainDBMision
} from '@/features/world-map/domain/types';
import { 
  DBPersonajeNoJugable as SharedDBPersonajeNoJugable,
  DBEnemigo as SharedDBEnemigo,
  DBMapamundi as SharedDBMapamundi,
  DBSonidoUbicacion as SharedDBSonidoUbicacion,
  DBMision as SharedDBMision
} from '@/shared/utils/types/dbTypes';

/**
 * Transforma un personaje no jugable del tipo shared al tipo domain
 * Convierte pnj_edad de number a string
 */
export function transformToDomainPNJ(pnj: SharedDBPersonajeNoJugable): DomainDBPersonajeNoJugable {
  return {
    ...pnj,
    // Convertir número a string
    pnj_edad: pnj.pnj_edad
  };
}

/**
 * Transforma un personaje no jugable del tipo domain al tipo shared
 * Convierte pnj_edad de string a number
 */
export function transformToSharedPNJ(pnj: DomainDBPersonajeNoJugable): SharedDBPersonajeNoJugable {
  return {
    ...pnj,
    // Convertir string a número
    pnj_edad: pnj.pnj_edad || 0 // El || 0 es para manejar valores NaN
  };
}

/**
 * Transforma un array de personajes no jugables del tipo shared al tipo domain
 */
export function transformToDomainPNJList(pnjList: SharedDBPersonajeNoJugable[]): DomainDBPersonajeNoJugable[] {
  return pnjList.map(transformToDomainPNJ);
}

/**
 * Transforma un array de personajes no jugables del tipo domain al tipo shared
 */
export function transformToSharedPNJList(pnjList: DomainDBPersonajeNoJugable[]): SharedDBPersonajeNoJugable[] {
  return pnjList.map(transformToSharedPNJ);
}

/**
 * Transforma un enemigo del tipo shared al tipo domain
 * Convierte ene_edad de number a string
 */
export function transformToDomainEnemigo(enemigo: SharedDBEnemigo): DomainDBEnemigo {
  return {
    ...enemigo,
    // Convertir número a string
    ene_edad: enemigo.ene_edad
  };
}

/**
 * Transforma un enemigo del tipo domain al tipo shared
 * Convierte ene_edad de string a number
 */
export function transformToSharedEnemigo(enemigo: DomainDBEnemigo): SharedDBEnemigo {
  return {
    ...enemigo,
    // Convertir string a número
    ene_edad: enemigo.ene_edad || 0 // El || 0 es para manejar valores NaN
  };
}

/**
 * Transforma un array de enemigos del tipo shared al tipo domain
 */
export function transformToDomainEnemigoList(enemigoList: SharedDBEnemigo[]): DomainDBEnemigo[] {
  return enemigoList.map(transformToDomainEnemigo);
}

/**
 * Transforma un array de enemigos del tipo domain al tipo shared
 */
export function transformToSharedEnemigoList(enemigoList: DomainDBEnemigo[]): SharedDBEnemigo[] {
  return enemigoList.map(transformToSharedEnemigo);
}

/**
 * Transforma un objeto DBSonidoUbicacion del tipo domain al tipo shared
 */
export function transformToSharedSonidoUbicacion(sonido: DomainDBSonidoUbicacion): SharedDBSonidoUbicacion {
  return {
    // Propiedades que existen en domain pero no en shared
    ...sonido,
    // Añadimos propiedades requeridas por shared pero que no existen en domain
    sub_id: '', // Valor por defecto
    sub_ubi: '' // Valor por defecto
  };
}

/**
 * Transforma un objeto DBSonidoUbicacion del tipo shared al tipo domain
 */
export function transformToDomainSonidoUbicacion(sonido: SharedDBSonidoUbicacion): DomainDBSonidoUbicacion {
  // Omitimos las propiedades que no existen en domain
  const { sub_id, sub_ubi, ...domainProps } = sonido;
  return domainProps as DomainDBSonidoUbicacion;
}

/**
 * Transforma una lista de DBSonidoUbicacion del tipo domain al tipo shared
 */
export function transformToSharedSonidoUbicacionList(sonidos: DomainDBSonidoUbicacion[]): SharedDBSonidoUbicacion[] {
  return sonidos.map(transformToSharedSonidoUbicacion);
}

/**
 * Transforma una lista de DBSonidoUbicacion del tipo shared al tipo domain
 */
export function transformToDomainSonidoUbicacionList(sonidos: SharedDBSonidoUbicacion[]): DomainDBSonidoUbicacion[] {
  return sonidos.map(transformToDomainSonidoUbicacion);
}

/**
 * Transforma un objeto DBMapamundi del tipo domain al tipo shared
 */
export function transformToSharedMapamundi(mapamundi: DomainDBMapamundi): SharedDBMapamundi {
  return {
    ...mapamundi,
    // Convertir las listas usando las funciones de transformación
    lista_sonidos: transformToSharedSonidoUbicacionList(mapamundi.lista_sonidos),
    lista_pnj: transformToSharedPNJList(mapamundi.lista_pnj),
    lista_enemigo: transformToSharedEnemigoList(mapamundi.lista_enemigo),
    lista_mision: transformToSharedMisionList(mapamundi.lista_mision)
  };
}

/**
 * Transforma un objeto DBMapamundi del tipo shared al tipo domain
 */
export function transformToDomainMapamundi(mapamundi: SharedDBMapamundi): DomainDBMapamundi {
  return {
    ...mapamundi,
    // Convertir las listas usando las funciones de transformación
    lista_sonidos: transformToDomainSonidoUbicacionList(mapamundi.lista_sonidos),
    lista_pnj: transformToDomainPNJList(mapamundi.lista_pnj),
    lista_enemigo: transformToDomainEnemigoList(mapamundi.lista_enemigo),
    lista_mision: transformToDomainMisionList(mapamundi.lista_mision)
  };
}

/**
 * Transforma una lista de DBMapamundi del tipo domain al tipo shared
 */
export function transformToSharedMapamundiList(mapamundis: DomainDBMapamundi[]): SharedDBMapamundi[] {
  return mapamundis.map(transformToSharedMapamundi);
}

/**
 * Transforma una lista de DBMapamundi del tipo shared al tipo domain
 */
export function transformToDomainMapamundiList(mapamundis: SharedDBMapamundi[]): DomainDBMapamundi[] {
  return mapamundis.map(transformToDomainMapamundi);
}

/**
 * Transforma una misión del tipo domain al tipo shared
 * Añade la propiedad mis_cumplido que está en shared pero no en domain
 */
export function transformToSharedMision(mision: DomainDBMision): SharedDBMision {
  return {
    ...mision,
    // Añadimos la propiedad requerida por shared
    mis_cumplido: false // Valor por defecto
  };
}

/**
 * Transforma una misión del tipo shared al tipo domain
 * Elimina la propiedad mis_cumplido que está en shared pero no en domain
 */
export function transformToDomainMision(mision: SharedDBMision): DomainDBMision {
  // Desestructuramos para omitir la propiedad mis_cumplido
  const { mis_cumplido, ...domainProps } = mision;
  return domainProps as DomainDBMision;
}

/**
 * Transforma una lista de misiones del tipo domain al tipo shared
 */
export function transformToSharedMisionList(misiones: DomainDBMision[]): SharedDBMision[] {
  return misiones.map(transformToSharedMision);
}

/**
 * Transforma una lista de misiones del tipo shared al tipo domain
 */
export function transformToDomainMisionList(misiones: SharedDBMision[]): DomainDBMision[] {
  return misiones.map(transformToDomainMision);
}