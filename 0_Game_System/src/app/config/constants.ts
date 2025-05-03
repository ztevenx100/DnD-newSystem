export const CONSTANTS = {
    STORAGE: {
        THEME: 'theme',
        CHARACTERS: 'characters',
        WORLD: 'world',
        GAME_SYSTEMS: 'game-systems',
    },
    PAGINATION: {
        DEFAULT_PAGE_SIZE: 10,
        MAX_PAGE_SIZE: 100,
    },
    VALIDATION: {
        MIN_NAME_LENGTH: 3,
        MAX_NAME_LENGTH: 50,
        MIN_DESCRIPTION_LENGTH: 10,
        MAX_DESCRIPTION_LENGTH: 500,
    },
    UI: {
        TOAST_DURATION: 3000,
        LOADING_DELAY: 500,
        ANIMATION_DURATION: 300,
    },
} as const; 