//import React from 'react';

/**
 * Convierte una variable string a un number, en caso de no ser asi retorna un valor por defecto.
 * 
 * @param {string} value - El valor string a convertr a number.
 * @param {number} [valueDefault] - El valor por defecto si se recibo un string no valido (opcional).
 * @returns {number} Un número entero convertido (inclusive).
 */
export function validateNumeric(value:string, valueDefault?: number): number{
    if(isNaN(Number(value))){
       alert('Valor no numerico');
       return valueDefault||0;
    } else if (value === '') {
       return valueDefault||0;
    } else {
       return parseInt(value);
    }
}