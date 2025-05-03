import React from 'react';
import SvgCemetery from '@/components/UI/Icons/SvgCemetery';
import SvgTemple from '@/components/UI/Icons/SvgTemple';
import SvgArmory from '@/components/UI/Icons/SvgArmory';
import SvgGuild from '@/components/UI/Icons/SvgGuild';
import SvgBlacksmithing from '@/components/UI/Icons/SvgBlacksmithing';
import SvgStore from '@/components/UI/Icons/SvgStore';
import SvgTavern from '@/components/UI/Icons/SvgTavern';
import SvgNest from '@/components/UI/Icons/SvgNest';
import SvgInterest from '@/components/UI/Icons/SvgInterest';
import SvgCamp from '@/components/UI/Icons/SvgCamp';
import SvgRuins from '@/components/UI/Icons/SvgRuins';
import SvgUnknown from '@/components/UI/Icons/SvgUnknown';

import SvgWave from '@/components/UI/Icons/SvgWave';
import SvgBonfire from '@/components/UI/Icons/SvgBonfire';
import SvgCave from '@/components/UI/Icons/SvgCave';
import SvgRain from '@/components/UI/Icons/SvgRain';
import SvgStorm from '@/components/UI/Icons/SvgStorm';
import SvgNight from '@/components/UI/Icons/SvgNight';
import SvgHeart from '@/components/UI/Icons/SvgHeart';
import SvgEnemy from '@/components/UI/Icons/SvgEnemy';
import SvgMap from '@/components/UI/Icons/SvgMap';
import SvgBird from '@/components/UI/Icons/SvgBird';
import SvgWind from '@/components/UI/Icons/SvgWind';
import SvgSong from '@/components/UI/Icons/SvgSong';

export const itemsTypeUbgSvg: { [key: string]: React.ComponentType<any> } = {
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
    'typeU': SvgUnknown
};

export const itemsSoundsSvg: { [key: string]: React.ComponentType<any> } = {
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
    'soundSo': SvgSong
}; 