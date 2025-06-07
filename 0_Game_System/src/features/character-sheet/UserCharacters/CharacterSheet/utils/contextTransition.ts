/**
 * Este archivo contiene utilidades para ayudar en la transición gradual
 * hacia el uso completo del Context API de React.
 * 
 * Durante el proceso de refactorización, necesitamos mantener la compatibilidad
 * entre los componentes que ya usan el contexto y los que aún no lo hacen.
 */

import { CharacterSheetContextType } from "../context/CharacterSheetTypes";

/**
 * Verifica si un contexto es "completo" (tiene todas las funcionalidades implementadas)
 * o es solo un esqueleto parcial.
 * 
 * @param context El contexto a verificar
 * @returns true si el contexto está completamente implementado
 */
export const isFullContext = (context: any): boolean => {
  if (!context) return false;
  
  // Verificar algunas propiedades clave que indicarían un contexto completo
  return (
    typeof context.getValues === 'function' &&
    typeof context.setValue === 'function' &&
    typeof context.handleSubmit === 'function' &&
    typeof context.register === 'function' &&
    context.methods && Object.keys(context.methods).length > 0
  );
};

/**
 * Intenta usar una función del contexto, pero cae en la versión de prop si
 * el contexto no está disponible o no es completo.
 * 
 * @param context El contexto actual (o undefined)
 * @param contextFnName Nombre de la función en el contexto
 * @param propFn Función alternativa desde props
 * @param args Argumentos para pasar a la función
 * @returns El resultado de la función del contexto o de la prop
 */
export function tryUseContextFunction<T>(
  context: CharacterSheetContextType | undefined,
  contextFnName: keyof CharacterSheetContextType,
  propFn: (...args: any[]) => T,
  ...args: any[]
): T {
  if (context && isFullContext(context) && typeof context[contextFnName] === 'function') {
    return (context[contextFnName] as Function)(...args);
  }
  return propFn(...args);
}

/**
 * Obtiene un valor del contexto o usa un valor alternativo si no está disponible
 * 
 * @param context El contexto actual (o undefined)
 * @param contextPropName Nombre de la propiedad en el contexto
 * @param fallbackValue Valor alternativo a usar
 * @returns El valor del contexto o el fallback
 */
export function getContextValueOrFallback<T>(
  context: CharacterSheetContextType | undefined,
  contextPropName: keyof CharacterSheetContextType,
  fallbackValue: T
): T {
  if (context && context[contextPropName] !== undefined) {
    return context[contextPropName] as unknown as T;
  }
  return fallbackValue;
}
