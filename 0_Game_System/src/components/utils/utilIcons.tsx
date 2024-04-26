import React from 'react';

// Images
import SvgUnknown from '../UI/Icons/SvgUnknown';

// Interfaces
import { Components } from '../interfaces/typesCharacterSheet';

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
