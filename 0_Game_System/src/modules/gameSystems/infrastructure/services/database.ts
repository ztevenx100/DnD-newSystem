import { getDataQuery } from '@/services/database/dbTables';
import { DBSistemaJuego } from '@/interfaces';

const TABLE_SJU = 'sju_sistema_juego';

export const getGameSystem = async (id: string) => {
    return getDataQuery<DBSistemaJuego>(TABLE_SJU, '*', { sju_id: id });
};

export const getGameSystems = async () => {
    return getDataQuery<DBSistemaJuego>(TABLE_SJU, '*');
}; 