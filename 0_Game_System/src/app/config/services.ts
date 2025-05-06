import { APP_CONFIG } from './app';

export const SERVICES_CONFIG = {
    CHARACTERS: {
        BASE_URL: `${APP_CONFIG.API.BASE_URL}/characters`,
        ENDPOINTS: {
            LIST: '/list',
            DETAIL: '/detail',
            CREATE: '/create',
            UPDATE: '/update',
            DELETE: '/delete',
        },
    },
    WORLD: {
        BASE_URL: `${APP_CONFIG.API.BASE_URL}/world`,
        ENDPOINTS: {
            MAP: '/map',
            SOUNDS: '/sounds',
            NPCS: '/npcs',
            ENEMIES: '/enemies',
            MISSIONS: '/missions',
        },
    },
    GAME_SYSTEMS: {
        BASE_URL: `${APP_CONFIG.API.BASE_URL}/game-systems`,
        ENDPOINTS: {
            LIST: '/list',
            DETAIL: '/detail',
        },
    },
} as const; 