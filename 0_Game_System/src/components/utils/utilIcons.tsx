/** 
 * @filename: utilIcons.tsx
 * @file: Maneja las funciones relacionadas con el manejo de iconos
 */ 

import React from 'react';

// Images
import SvgUnknown from '../UI/Icons/SvgUnknown';

// Interfaces
import { Components } from '../interfaces/typesCharacterSheet';

/**
 * Retorna el icono a utilizar segun un valor-clave.
 * 
 * @param {string} component - El valor-clave del icono a retonar.
 * @param {Components} itemsSvg - Listado de iconos.
 * @param {number} iconWidth - El valor de anchura de icono (opcional).
 * @param {number} iconHeight - El valor de altura de icono (opcional).
 * @returns {React.ReactElement} Retorna un icono SVG.
 */
export function getIcon (component: string, itemsSvg: Components, iconWidth?: number, iconHeight?: number): React.ReactElement {
    const componentSeleted = itemsSvg[component];
    if(!iconWidth) iconWidth = 30;
    if(!iconHeight) iconHeight = 30;

    if (componentSeleted) {
        return React.createElement(componentSeleted, { width: iconWidth, height: iconHeight });
    } else {
        return <SvgUnknown width={iconWidth} height={iconHeight} />;
    }
}
