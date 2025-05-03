import { getDataQuery } from '@/services/database/dbTables';
import { DBEscenario, DBMapamundi, DBSonidoUbicacion, DBPersonajeNoJugable, DBEnemigo, DBMision } from '@/interfaces';

const TABLE_ESC = 'esc_escenario';
const TABLE_MMU = 'mmu_mapamundi';
const TABLE_SUB = 'sub_sonido_ubicacion';
const TABLE_PNJ = 'pnj_personaje_no_jugable';
const TABLE_ENE = 'ene_enemigo';
const TABLE_MIS = 'mis_mision';

export const getStage = async (id: string) => {
    return getDataQuery<DBEscenario>(TABLE_ESC, '*', { esc_id: id });
};

export const getMap = async (systemId: string) => {
    return getDataQuery<DBMapamundi>(TABLE_MMU, '*', { mmu_sju: systemId });
};

export const getSoundsByLocation = async (locationId: string) => {
    return getDataQuery<DBSonidoUbicacion>(TABLE_SUB, '*', { sub_ubi: locationId });
};

export const getNpcsByLocation = async (locationId: string) => {
    return getDataQuery<DBPersonajeNoJugable>(TABLE_PNJ, '*', { pnj_ubi: locationId });
};

export const getEnemiesByLocation = async (locationId: string) => {
    return getDataQuery<DBEnemigo>(TABLE_ENE, '*', { ene_ubi: locationId });
};

export const getMissionsByLocation = async (locationId: string) => {
    return getDataQuery<DBMision>(TABLE_MIS, '*', { mis_ubi: locationId });
}; 