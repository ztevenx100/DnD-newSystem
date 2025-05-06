export const ERROR_MESSAGES = {
    COMMON: {
        UNEXPECTED: 'Ha ocurrido un error inesperado',
        NETWORK: 'Error de conexión. Por favor, verifica tu conexión a internet',
        TIMEOUT: 'La operación ha tardado demasiado. Por favor, intenta nuevamente',
    },
    CHARACTERS: {
        NOT_FOUND: 'Personaje no encontrado',
        CREATE_FAILED: 'Error al crear el personaje',
        UPDATE_FAILED: 'Error al actualizar el personaje',
        DELETE_FAILED: 'Error al eliminar el personaje',
    },
    WORLD: {
        MAP_NOT_FOUND: 'Mapa no encontrado',
        SOUND_NOT_FOUND: 'Sonido no encontrado',
        NPC_NOT_FOUND: 'NPC no encontrado',
        ENEMY_NOT_FOUND: 'Enemigo no encontrado',
        MISSION_NOT_FOUND: 'Misión no encontrada',
    },
    GAME_SYSTEMS: {
        NOT_FOUND: 'Sistema de juego no encontrado',
        LIST_FAILED: 'Error al cargar la lista de sistemas de juego',
    },
} as const; 