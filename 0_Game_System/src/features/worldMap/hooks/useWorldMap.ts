import { useState, useCallback } from 'react';
import { DBEscenario, DBMapamundi } from '@core/types';
import { WorldMapHookResult, StageImageList } from '../types';
import { worldMapService } from '../services/worldMapService';

const emptyTemplate: DBMapamundi = {
    mmu_id: '', 
    mmu_sju: '', 
    mmu_esc: '',
    esc_escenario: null,
    mmu_ubi: '', 
    ubi_ubicacion: null,
    mmu_pos_x: 0, 
    mmu_pos_y: 0,
    lista_sonidos: [],
    lista_pnj: [],
    lista_enemigo: [],
    lista_mision: [],
};

export function useWorldMap(systemId: string): WorldMapHookResult {
    const [geographicalMap, setGeographicalMap] = useState<DBMapamundi[][]>([]);
    const [listItemsMap, setListItemsMap] = useState<DBMapamundi[]>([]);
    const [currentStage, setCurrentStage] = useState<DBEscenario>({
        esc_id:'', 
        esc_tipo:'', 
        esc_nombre:'', 
        esc_orden: 0
    });
    const [imageStage, setImageStage] = useState<string>('');
    const [imageStageList, setImageStageList] = useState<StageImageList[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const buildTemplateMap = useCallback(() => {
        const templateMap: DBMapamundi[][] = [];
        for (let i = 0; i < 7; i++) {
            templateMap.push([]);
            for (let j = 0; j < 11; j++) {
                templateMap[i].push({...emptyTemplate});
            }
        }
        return templateMap;
    }, []);

    const initializeMap = useCallback(async () => {
        const templateMap = buildTemplateMap();
        try {
            const data = await worldMapService.getMapData(systemId);
            if (data) {
                const stage = data[0].esc_escenario as DBEscenario;
                const updatedImageStageList = [...imageStageList];

                await Promise.all(
                    data.map(async (elem) => {
                        if (!updatedImageStageList.some(list => list.id === elem.mmu_esc)) {
                            updatedImageStageList.push({id: elem.mmu_esc, url:''});
                        }

                        elem.lista_sonidos = await worldMapService.getSoundList(elem.mmu_ubi);
                        elem.lista_pnj = await worldMapService.getNPCList(elem.mmu_ubi);
                        elem.lista_enemigo = await worldMapService.getEnemyList(elem.mmu_ubi);
                        elem.lista_mision = await worldMapService.getMissionList(elem.mmu_ubi);

                        if (stage.esc_id === elem.mmu_esc) {
                            templateMap[elem.mmu_pos_y][elem.mmu_pos_x] = elem;
                        }
                    })
                );

                await worldMapService.enrichStageImages(updatedImageStageList);

                setListItemsMap(data);
                setCurrentStage(stage);
                setImageStageList(updatedImageStageList);
                setGeographicalMap(templateMap);

                const currentStageImage = updatedImageStageList.find(img => img.id === stage.esc_id)?.url;
                if (currentStageImage) {
                    setImageStage(currentStageImage);
                }
            }
        } catch (error) {
            console.error('Error initializing map:', error);
        } finally {
            setLoading(false);
        }
    }, [systemId, buildTemplateMap, imageStageList]);

    const handleStageChange = useCallback((stageId: string) => {
        const stageItems = listItemsMap.filter(elem => elem.mmu_esc === stageId);
        const newStageImage = imageStageList.find(elem => elem.id === stageId)?.url;
        const newStage = stageItems[0]?.esc_escenario as DBEscenario;
        
        if (newStageImage) {
            setImageStage(newStageImage);
        }
        
        if (newStage) {
            setCurrentStage(newStage);
        }

        // Update map with new stage items
        const templateMap = geographicalMap.map(row => 
            row.map(col => (col.mmu_id !== '' ? {...emptyTemplate} : col))
        );

        stageItems.forEach(elem => {
            templateMap[elem.mmu_pos_y][elem.mmu_pos_x] = elem;
        });

        setGeographicalMap(templateMap);
    }, [listItemsMap, imageStageList, geographicalMap]);

    return {
        // State
        geographicalMap,
        listItemsMap,
        currentStage,
        imageStage,
        imageStageList,
        loading,
        // Actions
        setGeographicalMap,
        setListItemsMap,
        setCurrentStage,
        setImageStage,
        setImageStageList,
        setLoading,
    };
}