import React from 'react';
import SvgCemetery from '@Icons/SvgCemetery';
import SvgTemple from '@Icons/SvgTemple';
import SvgArmory from '@Icons/SvgArmory';
import SvgGuild from '@Icons/SvgGuild';
import SvgBlacksmithing from '@Icons/SvgBlacksmithing';
import SvgStore from '@Icons/SvgStore';
import SvgTavern from '@Icons/SvgTavern';
import SvgNest from '@Icons/SvgNest';
import SvgInterest from '@Icons/SvgInterest';
import SvgCamp from '@Icons/SvgCamp';
import SvgRuins from '@Icons/SvgRuins';
import SvgUnknown from '@Icons/SvgUnknown';
import SvgWave from '@Icons/SvgWave';
import SvgBonfire from '@Icons/SvgBonfire';
import SvgCave from '@Icons/SvgCave';
import SvgRain from '@Icons/SvgRain';
import SvgStorm from '@Icons/SvgStorm';
import SvgNight from '@Icons/SvgNight';
import SvgHeart from '@Icons/SvgHeart';
import SvgEnemy from '@Icons/SvgEnemy';
import SvgMap from '@Icons/SvgMap';
import SvgBird from '@Icons/SvgBird';
import SvgWind from '@Icons/SvgWind';
import SvgSong from '@Icons/SvgSong';
import SvgRest from '@Icons/SvgRest';
import SvgSpecial from '@Icons/SvgSpecial';
import SvgTreasure from '@Icons/SvgTreasure';

export type ComponentIcon = {
    [key: string]: React.ComponentType<any>;
};

export const locationIcons: ComponentIcon = {
    'typeC': SvgCemetery,
    'typeT': SvgTemple,
    'typeA': SvgArmory,
    'typeG': SvgGuild,
    'typeB': SvgBlacksmithing,
    'typeS': SvgStore,
    'typeR': SvgTavern,
    'typeN': SvgNest,
    'typeI': SvgInterest,
    'typeD': SvgCamp,
    'typeE': SvgRuins,
    'typeU': SvgUnknown,
    'typeARM': SvgArmory,
    'typeHER': SvgBlacksmithing,
    'typeCAM': SvgCamp,
    'typeCAV': SvgCave,
    'typeCEM': SvgCemetery,
    'typeGRE': SvgGuild,
    'typePIN': SvgInterest,
    'typeNMO': SvgNest,
    'typeZDE': SvgRest,
    'typeMOL': SvgRuins,
    'typeTIE': SvgStore,
    'typeTAB': SvgTavern,
    'typeTEM': SvgTemple,
    'typeREL': SvgTreasure
};

export const soundIcons: ComponentIcon = {
    'soundWa': SvgWave,
    'soundBo': SvgBonfire,
    'soundCa': SvgCave,
    'soundRa': SvgRain,
    'soundSt': SvgStorm,
    'soundNi': SvgNight,
    'soundHe': SvgHeart,
    'soundEn': SvgEnemy,
    'soundMa': SvgMap,
    'soundBi': SvgBird,
    'soundWi': SvgWind,
    'soundSo': SvgSong,
    'typeFO': SvgBonfire,
    'typeLL': SvgRain,
    'typeNO': SvgNight,
    'typeOL': SvgWave,
    'typePA': SvgBird,
    'typeTO': SvgStorm,
    'typeVI': SvgWind,
    'typeCO': SvgHeart,
    'typeRU': SvgRuins,
    'typeSO': SvgSong,
    'typeSP': SvgSpecial
}; 