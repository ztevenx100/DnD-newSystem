// Importamos ambos tipos para poder hacer la transformación
import { 
  DBPersonajeNoJugable as DomainDBPersonajeNoJugable,
  DBEnemigo as DomainDBEnemigo 
} from '@/features/world-map/domain/types';
import { 
  DBPersonajeNoJugable as SharedDBPersonajeNoJugable,
  DBEnemigo as SharedDBEnemigo 
} from '@/shared/utils/types/dbTypes';

/**
 * Transforma un personaje no jugable del tipo shared al tipo domain
 * Convierte pnj_edad de number a string
 */
export function transformToDomainPNJ(pnj: SharedDBPersonajeNoJugable): DomainDBPersonajeNoJugable {
  return {
    ...pnj,
    // Convertir número a string
    pnj_edad: pnj.pnj_edad.toString()
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
    pnj_edad: parseInt(pnj.pnj_edad, 10) || 0 // El || 0 es para manejar valores NaN
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
    ene_edad: enemigo.ene_edad.toString()
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
    ene_edad: parseInt(enemigo.ene_edad, 10) || 0 // El || 0 es para manejar valores NaN
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