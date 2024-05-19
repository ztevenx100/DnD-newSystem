//import React from 'react';

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