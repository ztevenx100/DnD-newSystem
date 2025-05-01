import { v4 as uuidv4 } from "uuid";
import { getDataQueryPus, deleteDataQueryPus, getDataQueryUsu, getDataQueryHad, getDataQuerySju, getDataQueryEpe, getDataQueryHpe, getDataQueryInp, updateDataPus, updateDataEpe, insertDataPus, deleteDataQueryInp, insertDataEpe, upsertDataHpe, upsertDataInp } from '@database/dbTables';
import { addStorageCharacter, getUrlCharacter } from '@database/dbStorage';
import { DBPersonajesUsuario, DBEstadisticaPersonaje, DBHabilidad, DBHabilidadPersonaje, DBInventarioPersonaje } from '@core/types/characters/characterDbTypes';
import { initialPersonajesUsuario } from '@interfaces/dbTypes';
import { DBSistemaJuego } from '@core/types/gameSystem/gameSystemDbTypes';
import { InputStats, InventoryObject, SkillFields, SkillsAcquired } from '../types';

export const characterService = {
    async getCharactersList(userId: string): Promise<DBPersonajesUsuario[]> {
        try {
            const data = await getDataQueryPus(
                'pus_id, pus_usuario, pus_nombre, pus_clase, pus_raza, pus_trabajo, pus_nivel, pus_descripcion, usu_usuario(usu_id, usu_nombre), sju_sistema_juego(sju_id, sju_nombre)',
                {'pus_usuario': userId}
            );
            
            if (data) {
                await Promise.all(data.map(async (character) => {
                    character.url_character_image = await this.getCharacterImage(character.pus_usuario, character.pus_id);
                }));
            }
            
            return data || [];
        } catch (error) {
            console.error('Error fetching characters:', error);
            return [];
        }
    },

    async getCharacter(id: string): Promise<DBPersonajesUsuario | null> {
        try {
            const data = await getDataQueryPus(
                'pus_id, pus_usuario, pus_nombre, pus_clase, pus_raza, pus_trabajo, pus_nivel, pus_descripcion, pus_conocimientos, pus_arma_principal, pus_arma_secundaria'
                + ', pus_cantidad_oro, pus_cantidad_plata, pus_cantidad_bronce, pus_puntos_suerte, pus_vida, pus_alineacion, pus_sistema_juego'
                + ', sju_sistema_juego(sju_id,sju_nombre)',
                { 'pus_id': id }
            );

            return data?.[0] || null;
        } catch (error) {
            console.error('Error fetching character:', error);
            return null;
        }
    },

    async getCharacterImage(userId: string, characterId: string): Promise<string> {
        try {
            const url = await getUrlCharacter(userId, characterId);
            return url + "?" + Math.random().toString(36).substring(7);
        } catch (error) {
            console.error('Error fetching character image:', error);
            return '';
        }
    },

    async getCharacterStats(characterId: string): Promise<DBEstadisticaPersonaje[]> {
        try {
            const data = await getDataQueryEpe(
                'epe_personaje, epe_usuario, epe_sigla, epe_nombre, epe_num_dado, epe_num_clase, epe_num_nivel',
                { 'epe_personaje': characterId }
            );
            return data || [];
        } catch (error) {
            console.error('Error fetching character stats:', error);
            return [];
        }
    },

    async getInventoryItems(characterId: string): Promise<DBInventarioPersonaje[]> {
        try {
            const data = await getDataQueryInp(
                'inp_id, inp_nombre, inp_descripcion, inp_cantidad',
                { 'inp_personaje': characterId }
            );
            return data || [];
        } catch (error) {
            console.error('Error fetching inventory:', error);
            return [];
        }
    },

    async getSkillList(): Promise<DBHabilidad[]> {
        try {
            const data = await getDataQueryHad(
                'hab_id, hab_nombre, had_estadistica_base, hab_siglas, hab_tipo',
                { 'hab_tipo': ['C','E','R'] },
                { 'hab_tipo': true, 'had_estadistica_base': true }
            );
            return data || [];
        } catch (error) {
            console.error('Error fetching skills:', error);
            return [];
        }
    },

    async getGameSystems(): Promise<DBSistemaJuego[]> {
        try {
            const data = await getDataQuerySju(
                'sju_id, sju_nombre',
                { 'sju_estado': 'A' }
            );
            return data || [];
        } catch (error) {
            console.error('Error fetching game systems:', error);
            return [];
        }
    },

    async uploadCharacterImage(userId: string, characterId: string, file: File): Promise<{path?: string, error?: string}> {
        try {
            const result = await addStorageCharacter(userId, characterId, file);
            return { 
                path: result.path, 
                error: typeof result.error === 'string' ? result.error : undefined 
            };
        } catch (error) {
            console.error('Error uploading character image:', error);
            return { path: undefined, error: 'Error uploading image' };
        }
    },

    async saveCharacter(character: DBPersonajesUsuario, isNew: boolean): Promise<string> {
        try {
            if (isNew) {
                const data = await insertDataPus(character);
                return data[0]?.pus_id || '';
            } else {
                const data = await updateDataPus(character);
                return data[0]?.pus_id || '';
            }
        } catch (error) {
            console.error('Error saving character:', error);
            return '';
        }
    },

    async saveCharacterStats(stats: InputStats[], characterId: string, userId: string, isNew: boolean) {
        try {
            if (isNew) {
                const saveStats: DBEstadisticaPersonaje[] = stats.map(stat => ({
                    epe_usuario: userId,
                    epe_personaje: characterId,
                    epe_sigla: stat.id,
                    epe_nombre: stat.label,
                    epe_num_dado: stat.valueDice,
                    epe_num_clase: stat.valueClass,
                    epe_num_nivel: stat.valueLevel,
                }));
                await insertDataEpe(saveStats);
            } else {
                await Promise.all(stats.map(stat => 
                    updateDataEpe({
                        epe_usuario: userId,
                        epe_personaje: characterId,
                        epe_sigla: stat.id,
                        epe_nombre: stat.label,
                        epe_num_dado: stat.valueDice,
                        epe_num_clase: stat.valueClass,
                        epe_num_nivel: stat.valueLevel,
                    })
                ));
            }
        } catch (error) {
            console.error('Error saving character stats:', error);
        }
    },

    async saveCharacterSkills(skills: SkillsAcquired[], fieldSkills: SkillFields[], characterId: string, userId: string) {
        try {
            const saveSkill: DBHabilidadPersonaje[] = [];

            // Add main and extra skills
            fieldSkills.forEach(field => {
                if (field.skill) {
                    saveSkill.push({
                        hpe_habilidad: field.skill,
                        hpe_usuario: userId,
                        hpe_personaje: characterId,
                        hpe_campo: field.field,
                        hpe_alineacion: null,
                        hab_habilidad: null,
                    });
                }
            });

            // Add ring skills
            skills.forEach(skill => {
                if (skill.id) {
                    saveSkill.push({
                        hpe_habilidad: skill.id,
                        hpe_usuario: userId,
                        hpe_personaje: characterId,
                        hpe_campo: "skillRing" + skill.value,
                        hpe_alineacion: null,
                        hab_habilidad: null,
                    });
                }
            });

            await upsertDataHpe(saveSkill);
        } catch (error) {
            console.error('Error saving character skills:', error);
        }
    },

    async saveInventory(items: InventoryObject[], characterId: string, userId: string, deleteItems: string[]) {
        try {
            const saveItems: DBInventarioPersonaje[] = items.map(item => ({
                inp_usuario: userId,
                inp_personaje: characterId,
                inp_id: item.id,
                inp_nombre: item.name,
                inp_descripcion: item.description,
                inp_cantidad: item.count,
            }));

            await Promise.all([
                upsertDataInp(saveItems),
                deleteItems.length > 0 ? this.deleteInventoryItems(deleteItems) : Promise.resolve()
            ]);
        } catch (error) {
            console.error('Error saving inventory:', error);
        }
    },

    async deleteInventoryItems(items: string[]) {
        try {
            await deleteDataQueryInp({'inp_id': items});
        } catch (error) {
            console.error('Error deleting inventory items:', error);
        }
    },

    async deleteCharacter(id: string) {
        try {
            await deleteDataQueryPus({'pus_id': id});
        } catch (error) {
            console.error('Error deleting character:', error);
        }
    },

    createNewCharacter(userId: string): DBPersonajesUsuario {
        return {
            ...initialPersonajesUsuario,
            pus_id: uuidv4(),
            pus_usuario: userId
        };
    }
};