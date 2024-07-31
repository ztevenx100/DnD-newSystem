import React from 'react';
// Imagenes
const SvgArmory = React.lazy(() => import('@Icons/SvgArmory'));
const SvgBird = React.lazy(() => import('@Icons/SvgBird'));
const SvgBonfire = React.lazy(() => import('@Icons/SvgBonfire'));
const SvgCamp = React.lazy(() => import('@Icons/SvgCamp'));
const SvgCave = React.lazy(() => import('@Icons/SvgCave'));
const SvgCemetery = React.lazy(() => import('@Icons/SvgCemetery'));
const SvgHeart = React.lazy(() => import('@Icons/SvgHeart'));
const SvgInterest = React.lazy(() => import('@Icons/SvgInterest'));
const SvgNest = React.lazy(() => import('@Icons/SvgNest'));
const SvgNight = React.lazy(() => import('@Icons/SvgNight'));
const SvgRain = React.lazy(() => import('@Icons/SvgRain'));
const SvgRest = React.lazy(() => import('@Icons/SvgRest'));
const SvgRuins = React.lazy(() => import('@Icons/SvgRuins'));
const SvgSong = React.lazy(() => import('@Icons/SvgSong'));
const SvgSpecial = React.lazy(() => import('@Icons/SvgSpecial'));
const SvgStore = React.lazy(() => import('@Icons/SvgStore'));
const SvgStorm = React.lazy(() => import('@Icons/SvgStorm'));
const SvgTavern = React.lazy(() => import('@Icons/SvgTavern'));
const SvgTemple = React.lazy(() => import('@Icons/SvgTemple'));
const SvgTreasure = React.lazy(() => import('@Icons/SvgTreasure'));
const SvgWave = React.lazy(() => import('@Icons/SvgWave'));
const SvgWind = React.lazy(() => import('@Icons/SvgWind'));
const SvgBlacksmithing = React.lazy(() => import('@Icons/SvgBlacksmithing'));
const SvgGuild = React.lazy(() => import('@Icons/SvgGuild'));

export type ComponentIcon = {
    [key: string]: React.ComponentType<any>;
}

export const itemsSoundsSvg: ComponentIcon = {
    typeFO: SvgBonfire,
    typeLL: SvgRain,
    typeNO: SvgNight,
    typeOL: SvgWave,
    typePA: SvgBird,
    typeTO: SvgStorm,
    typeVI: SvgWind,
    typeCO: SvgHeart,
    typeRU: SvgRuins,
    typeSO: SvgSong,
    typeSP: SvgSpecial,
};
    
export const itemsTypeUbgSvg: ComponentIcon = {
    typeARM: SvgArmory,
    typeHER: SvgBlacksmithing,
    typeCAM: SvgCamp,
    typeCAV: SvgCave,
    typeCEM: SvgCemetery,
    typeGRE: SvgGuild,
    typePIN: SvgInterest,
    typeNMO: SvgNest,
    typeZDE: SvgRest,
    typeMOL: SvgRuins,
    typeTIE: SvgStore,
    typeTAB: SvgTavern,
    typeTEM: SvgTemple,
    typeREL: SvgTreasure,
};