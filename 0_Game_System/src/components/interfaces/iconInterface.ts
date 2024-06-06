// Imagenes
import SvgArmory from '@Icons/SvgArmory'
import SvgBird from '@Icons/SvgBird'
import SvgBonfire from '@Icons/SvgBonfire'
import SvgCamp from '@Icons/SvgCamp'
import SvgCave from '@Icons/SvgCave'
import SvgCemetery from '@Icons/SvgCemetery'
import SvgHeart from '@Icons/SvgHeart'
import SvgInterest from '@Icons/SvgInterest'
import SvgNest from '@Icons/SvgNest'
import SvgNight from '@Icons/SvgNight'
import SvgRain from '@Icons/SvgRain'
import SvgRest from '@Icons/SvgRest'
import SvgRuins from '@Icons/SvgRuins'
import SvgSong from '@Icons/SvgSong'
import SvgStore from '@Icons/SvgStore'
import SvgStorm from '@Icons/SvgStorm'
import SvgTavern from '@Icons/SvgTavern'
import SvgTemple from '@Icons/SvgTemple'
import SvgTreasure from '@Icons/SvgTreasure'
import SvgWave from '@Icons/SvgWave'
import SvgWind from '@Icons/SvgWind'

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
}

export const itemsTypeUbgSvg: ComponentIcon = {
    typeARM: SvgArmory,
    typeCAM: SvgCamp,
    typeCAV: SvgCave,
    typeCEM: SvgCemetery,
    typePIN: SvgInterest,
    typeNMO: SvgNest,
    typeZDE: SvgRest,
    typeMOL: SvgRuins,
    typeTIE: SvgStore,
    typeTAB: SvgTavern,
    typeTEM: SvgTemple,
    typeREL: SvgTreasure,
}