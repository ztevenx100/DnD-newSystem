// Imagenes
import SvgArmory from '@Icons/SvgArmory';
import SvgBird from '@Icons/SvgBird';
import SvgBonfire from '@Icons/SvgBonfire';
import SvgCave from '@Icons/SvgCave';
import SvgHeart from '@Icons/SvgHeart';
import SvgNight from '@Icons/SvgNight';
import SvgRain from '@Icons/SvgRain';
import SvgRuins from '@Icons/SvgRuins';
import SvgSong from '@Icons/SvgSong';
import SvgStorm from '@Icons/SvgStorm';
import SvgTavern from '@Icons/SvgTavern';
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
    typeA: SvgArmory,
    typeC: SvgCave,
    typeR: SvgRuins,
    typeT: SvgTavern,
}