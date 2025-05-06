export const ROUTES = {
    HOME: '/',
    CHARACTERS: {
        LIST: '/characters',
        SHEET: '/characters/:id',
        CREATE: '/characters/create'
    },
    WORLD: {
        MAP: '/world-map'
    },
    GAME_SYSTEMS: {
        LIST: '/game-systems',
        DETAIL: '/game-systems/:id'
    },
    ERROR: '*'
} as const; 