import { DBSistemaJuego } from '../../domain/types';

export const getDataQuerySju = async (fields: string): Promise<DBSistemaJuego[]> => {
    try {
        const response = await fetch(`/api/game-systems?fields=${fields}`);
        if (!response.ok) {
            throw new Error('Error al obtener los sistemas de juego');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}; 