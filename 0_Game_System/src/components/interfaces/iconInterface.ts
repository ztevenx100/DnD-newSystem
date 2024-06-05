// Imagenes
import SvgArmory from '@Icons/SvgArmory';
import SvgBird from '@Icons/SvgBird';
import SvgBonfire from '@Icons/SvgBonfire';
import SvgCamp from '@Icons/SvgCamp';
import SvgCave from '@Icons/SvgCave';
import SvgCemetery from '@Icons/SvgCemetery';
import SvgHeart from '@Icons/SvgHeart';
import SvgNest from '@Icons/SvgNest';
import SvgNight from '@Icons/SvgNight';
import SvgRain from '@Icons/SvgRain';
import SvgRuins from '@Icons/SvgRuins';
import SvgSong from '@Icons/SvgSong';
import SvgStorm from '@Icons/SvgStorm';
import SvgTavern from '@Icons/SvgTavern';
import SvgTemple from '@Icons/SvgTemple';
import SvgTreasure from '@Icons/SvgTreasure';
import SvgWave from '@Icons/SvgWave';
import SvgWind from '@Icons/SvgWind';

export type ComponentIcon = {
    [key: string]: React.ComponentType<any>;
};

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
}

export const itemsTypeUbgSvg: ComponentIcon = {
    typeARM: SvgArmory,
    typeCAM: SvgCamp,
    typeCAV: SvgCave,
    typeCEM: SvgCemetery,
    typeNMO: SvgNest,
    typeMOL: SvgRuins,
    typeTAB: SvgTavern,
    typeTEM: SvgTemple,
    typeREL: SvgTreasure,
}