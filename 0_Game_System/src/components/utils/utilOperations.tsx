/** 
 * @filename: utilOperations.tsx
 * @file: Maneja las funciones relacionadas con operaciones matematicas
 */ 

/**
 * Genera un número entero aleatorio entre dos valores (inclusive).
 * 
 * @param {number} min - El valor mínimo del rango.
 * @param {number} max - El valor máximo del rango.
 * @returns {number} Un número entero aleatorio entre min y max (inclusive).
 */
export const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};