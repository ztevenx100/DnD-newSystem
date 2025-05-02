import { getDataQueryMmu, getDataQuerySub, getDataQueryPnj, getDataQueryEne, getDataQueryMis } from '@database/dbTables';
import { getUrlStage, getUrlSound } from '@database/dbStorage';
import { DBSonidoUbicacion, DBPersonajeNoJugable, DBEnemigo, DBMision } from '@core/types';
import { StageImageList } from '../types';

export const worldMapService = {
    async getMapData(systemId: string) {
        return await getDataQueryMmu(
            'mmu_id, mmu_sju, mmu_esc, esc_escenario(esc_id, esc_tipo, esc_nombre, esc_orden), mmu_ubi, ubi_ubicacion(ubi_id, ubi_tipo, ubi_nombre),mmu_pos_x, mmu_pos_y',
            { 'mmu_sju': systemId },
            { 'esc_orden': {'esc_escenario': true}, 'mmu_esc':true , 'mmu_pos_x': true, 'mmu_pos_y':true }
        );
    },

    async getSoundList(locationId: string): Promise<DBSonidoUbicacion[]> {
        if (!locationId) return [];
        
        const data = await getDataQuerySub(
            'sub_son, sub_tipo, sub_icon, son_sonidos(son_id, son_nombre, son_url)',
            { 'sub_tipo': ['U','UL'], 'sub_estado': 'A', 'sub_ubi': locationId }
        );
        
        if (data) {
            await this.enrichSoundsWithUrls(data);
            return data;
        }
        return [];
    },

    async enrichSoundsWithUrls(sounds: DBSonidoUbicacion[]) {
        const randomRefresh = Math.random().toString(36).substring(7);
        await Promise.all(sounds.map(async (sound) => {
            if (sound.sub_tipo === 'U') {
                const url = await getUrlSound(sound.sub_son);
                sound.sub_sound_url = url + '?' + randomRefresh;
            } else if (sound.sub_tipo === 'UL') {
                sound.sub_sound_url = sound.son_sonidos?.son_url ?? '';
            }
        }));
    },

    async getNPCList(locationId: string): Promise<DBPersonajeNoJugable[]> {
        if (!locationId) return [];

        const data = await getDataQueryPnj(
            'pnj_id, pnj_nombre, pnj_raza, pnj_clase, pnj_trabajo, pnj_edad, pnj_tipo, pnj_str, pnj_int, pnj_dex, pnj_con, pnj_cha, pnj_per, pnj_vida',
            {'pnj_estado': 'A', 'pnj_ubi': locationId},
            {'pnj_tipo': true}
        );

        return data || [];
    },

    async getEnemyList(locationId: string): Promise<DBEnemigo[]> {
        if (!locationId) return [];

        const data = await getDataQueryEne(
            'ene_id, ene_nombre, ene_raza, ene_clase, ene_trabajo, ene_edad, ene_tipo, ene_str, ene_int, ene_dex, ene_con, ene_cha, ene_per, ene_vida',
            {'ene_estado': 'A', 'ene_ubi': locationId},
            {'ene_tipo': true}
        );

        return data || [];
    },

    async getMissionList(locationId: string): Promise<DBMision[]> {
        if (!locationId) return [];

        const data = await getDataQueryMis(
            'mis_id, mis_nombre, mis_tipo, mis_cumplido',
            {'mis_estado':'A', 'mis_ubi': locationId},
            {'mis_tipo': true}
        );

        return data || [];
    },

    async enrichStageImages(imageList: StageImageList[]) {
        const randomRefresh = Math.random().toString(36).substring(7);
        await Promise.all(imageList.map(async (image) => {
            const url = await getUrlStage(image.id);
            image.url = url + '?' + randomRefresh;
        }));
    }
};