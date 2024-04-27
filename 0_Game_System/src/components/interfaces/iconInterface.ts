// Imagenes
import SvgArmory from '../UI/Icons/SvgArmory';
import SvgBird from '../UI/Icons/SvgBird';
import SvgBonfire from '../UI/Icons/SvgBonfire';
import SvgCave from '../UI/Icons/SvgCave';
import SvgHeart from '../UI/Icons/SvgHeart';
import SvgNight from '../UI/Icons/SvgNight';
import SvgRain from '../UI/Icons/SvgRain';
import SvgRuins from '../UI/Icons/SvgRuins';
import SvgSong from '../UI/Icons/SvgSong';
import SvgStorm from '../UI/Icons/SvgStorm';
import SvgTavern from '../UI/Icons/SvgTavern';
import SvgWave from '../UI/Icons/SvgWave';
import SvgWind from '../UI/Icons/SvgWind';

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