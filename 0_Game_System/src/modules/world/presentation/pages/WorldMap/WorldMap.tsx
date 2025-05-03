import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "@unocss/reset/tailwind.css";
import "uno.css";
import "./WorldMap.css";

import { ScreenLoader } from '@/shared/components';
import { 
  DBEscenario, 
  DBMapamundi, 
  DBSonidoUbicacion, 
  DBPersonajeNoJugable, 
  DBEnemigo, 
  DBMision,
  stageImageList 
} from '@/modules/world/domain/types';
import { 
  getMapData, 
  getSoundList, 
  getNpcList, 
  getEnemyList, 
  getMissionList 
} from '@/modules/world/infrastructure/services/world';
import { getUrlStage, getUrlSound } from '@/modules/world/infrastructure/services/storage';

import StageSelector from './StageSelector/StageSelector';
import AmbientSoundsSelector from './AmbientSoundsSelector/AmbientSoundsSelector';
import PlayerMap from './PlayerMap/PlayerMap';
import DiceThrower from './DiceThrower/DiceThrower';
import ItemUbi from './ItemUbi/ItemUbi';

import bgMapWorld from '@/assets/images/webp/bg-mapWorld.webp';

interface WorldMapProps {
  changeBackground: (newBackground: string) => void;
}

const WorldMap: React.FC<WorldMapProps> = ({ changeBackground }) => {
  const [geographicalMap, setGeographicalMap] = useState<DBMapamundi[][]>([]);
  const [listItemsMap, setListItemsMap] = useState<DBMapamundi[]>([]);
  const [currentStage, setCurrentStage] = useState<DBEscenario>({
    esc_id: '',
    esc_tipo: '',
    esc_nombre: '',
    esc_orden: 0
  });
  const [imageStage, setImagetStage] = useState<string>('');
  const [imageStageList, setImageStageList] = useState<stageImageList[]>([]);

  const params = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const randomValueRefreshImage = Math.random().toString(36).substring(7);

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

  useEffect(() => {
    changeBackground(bgMapWorld);

    const loadInfo = async () => {
      const templateMap: DBMapamundi[][] = buildTemplateMap();
      console.log('params: ', params);

      Promise.all([
        getMap(templateMap),
      ]).finally(() => {
        setLoading(false);
      });
    };

    loadInfo();
  }, []);

  const buildTemplateMap = () => {
    const templateMap: DBMapamundi[][] = [...geographicalMap];

    for (let i = 0; i < 7; i++) {
      templateMap.push([]);
      for (let j = 0; j < 11; j++) {
        templateMap[i].push(emptyTemplate);
      }
    }
    return templateMap;
  };

  const getMap = async (templateMap: DBMapamundi[][]) => {
    const data = await getMapData();
    console.log('getMap - data: ', data);

    if (data !== null && data.length > 0) {
      let stage: DBEscenario = data[0].esc_escenario as DBEscenario;
      const updatedImageStageList = [...imageStageList];

      await Promise.all(
        data.map(async (elem) => {
          let npcList: DBPersonajeNoJugable[] = [];

          if (updatedImageStageList.length === 0) {
            updatedImageStageList.push({ id: elem.mmu_esc, url: '' });
          } else {
            if (!updatedImageStageList.some(list => list.id === elem.mmu_esc)) {
              updatedImageStageList.push({ id: elem.mmu_esc, url: '' });
            }
          }

          try {
            elem.lista_sonidos = await getSoundList(elem.mmu_ubi);
            npcList = await getNpcList(elem.mmu_ubi);
            elem.lista_pnj = npcList;
            elem.lista_enemigo = await getEnemyList(elem.mmu_ubi);
            elem.lista_mision = await getMissionList(elem.mmu_ubi);
          } catch (error) {
            console.error('Error loading data:', error);
          }

          if (stage.esc_id === elem.mmu_esc) {
            templateMap[elem.mmu_pos_y][elem.mmu_pos_x] = elem;
          }
          getMapImage(updatedImageStageList, stage.esc_id);
        })
      );

      setListItemsMap(data);
      setCurrentStage(stage);
      setImageStageList(updatedImageStageList);
    }
    setGeographicalMap(templateMap);
  };

  const getMapImage = async (imageList: stageImageList[], idEsc: string) => {
    imageList.map(async (image) => {
      const url: string = await getUrlStage(image.id);
      image.url = url + '?' + randomValueRefreshImage;
    });

    if (idEsc !== null && idEsc !== undefined && imageList) {
      setImagetStage(imageList.find(elem => elem.id === idEsc)?.url || '');
    }
  };

  const handleImageStageChange = (idEsc: string) => {
    setImagetStage(imageStageList.find(elem => elem.id === idEsc)?.url || '');
  };

  const mapChange = (list: DBMapamundi[]) => {
    setListItemsMap(list);
  };

  if (loading) {
    return <ScreenLoader />;
  }

  return (
    <div className="world-map">
      <StageSelector
        currentStage={currentStage}
        imageStageList={imageStageList}
        onImageStageChange={handleImageStageChange}
      />
      <AmbientSoundsSelector />
      <PlayerMap
        geographicalMap={geographicalMap}
        imageStage={imageStage}
        listItemsMap={listItemsMap}
        onMapChange={mapChange}
      />
      <DiceThrower />
      <ItemUbi />
    </div>
  );
};

export default WorldMap; 