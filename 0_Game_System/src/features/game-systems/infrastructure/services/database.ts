import { getDataQuery } from '@database/models/dbTables';
import { DBSistemaJuego } from '@shared/utils/types';

const TABLE_SJU = 'sju_sistema_juego';

export const getGameSystem = async (id: string) => {
    return getDataQuery<DBSistemaJuego>(TABLE_SJU, '*', { sju_id: id });
};

export const getGameSystems = async () => {
    return getDataQuery<DBSistemaJuego>(TABLE_SJU, '*');
}; 