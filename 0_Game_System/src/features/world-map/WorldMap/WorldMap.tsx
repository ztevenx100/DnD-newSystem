import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getDataQueryMmu, getDataQuerySub, getDataQueryPnj, getDataQueryEne, getDataQueryMis } from '@database/models/dbTables';
import { getUrlStage, getUrlSound } from '@database/storage/dbStorage';

import "@unocss/reset/tailwind.css"
import "uno.css"
import "./WorldMap.css"

// Interfaces
import { stageImageList } from '@features/world-map/domain/types';
import { DBEscenario, DBMapamundi, DBSonidoUbicacion, DBPersonajeNoJugable, DBEnemigo, DBMision } from '@shared/utils/types/dbTypes';

// Components
import ScreenLoader from '@UI/ScreenLoader/ScreenLoader'
import StageSelector from './StageSelector/StageSelector'
import AmbientSoundsSelector from './AmbientSoundsSelector/AmbientSoundsSelector'
import PlayerMap from './PlayerMap/PlayerMap'
import DiceThrower from './DiceThrower/DiceThrower'
import ItemUbi from './ItemUbi/ItemUbi'

// Images
import bgMapWorld from '@/assets/img/webp/bg-mapWorld.webp'

interface WorldMapProps {
    changeBackground: (newBackground: string) => void
}

// Funciones de transformación de datos
const transformMission = (mission: any): DBMision => ({
    ...mission,
    mis_cumplido: mission.mis_cumplido === 'true'
})

const transformSound = (sound: any): DBSonidoUbicacion => ({
    ...sound,
    son_sonidos: sound.son_sonidos ? {
        ...sound.son_sonidos,
        son_url: sound.son_sonidos.son_url || undefined
    } : null
})

const transformMapamundi = (mapamundi: any): DBMapamundi => ({
    ...mapamundi,
    lista_sonidos: mapamundi.lista_sonidos?.map(transformSound) || [],
    lista_mision: mapamundi.lista_mision?.map(transformMission) || []
})

const WorldMap: React.FC<WorldMapProps> = ({ changeBackground }) => {
    
    const [geographicalMap, setGeographicalMap] = useState<DBMapamundi[][]>([])
    const [listItemsMap, setListItemsMap] = useState<DBMapamundi[]>([])
    const [currentStage, setCurrentStage] = useState<DBEscenario>({esc_id:'', esc_tipo:'', esc_nombre:'', esc_orden: 0})
    const [imageStage, setImagetStage] = useState<string>('')
    const [imageStageList, setImageStageList] = useState<stageImageList[]>([])

    const params = useParams()
    const [loading, setLoading] = useState<boolean>(true)
    const randomValueRefreshImage = Math.random().toString(36).substring(7)

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
    }

    useEffect(() => {
        changeBackground(bgMapWorld);

        const loadInfo = async () => {
            const templateMap: DBMapamundi[][] = buildTemplateMap()
            console.log('params: ',params)
            
            Promise.all ([
                getMap(templateMap),
            ]).finally(() => {
                setLoading(false)
            });
        }

        loadInfo()
    }, []);

    /**
     * Inicializar matriz del mapa.
     * @returns {DBMapamundi[][]} Retorna el mapa vacio.
     */
    const buildTemplateMap = (): DBMapamundi[][] => {
        const templateMap: DBMapamundi[][] = [...geographicalMap]
        
        for (let i = 0; i < 7; i++) {
            templateMap.push([])
            for (let j = 0; j < 11; j++) {
                templateMap[i].push(emptyTemplate)
            }
        }
        //console.log('templateMap', templateMap);
        return templateMap
    }

    /**
     * Llenar el mapa con informacion de base de datos
     * @param {DBMapamundi[][]} templateMap - Mapa vacio.
     */
    const getMap = async(templateMap: DBMapamundi[][]): Promise<void> => {
        const data = await Promise.resolve(
            getDataQueryMmu(
                'mmu_id, mmu_sju, mmu_esc, esc_escenario(esc_id, esc_tipo, esc_nombre, esc_orden), mmu_ubi, ubi_ubicacion(ubi_id, ubi_tipo, ubi_nombre),mmu_pos_x, mmu_pos_y'
                , { 'mmu_sju': 'd127c085-469a-4627-8801-77dc7262d41b' }
                , { 'esc_orden': {'esc_escenario': true}, 'mmu_esc':true , 'mmu_pos_x': true, 'mmu_pos_y':true }
            )
        )
        console.log('getMap - data: ',data)
  
        if (data !== null) {
            let stage:DBEscenario = data[0].esc_escenario as DBEscenario
            const updatedImageStageList = [...imageStageList]

            await Promise.all(
                data.map(async (elem: any) => {
                    let npcList: DBPersonajeNoJugable[] = []
                    
                    if(updatedImageStageList.length === 0){
                        updatedImageStageList.push({id: elem.mmu_esc, url:''})
                    }else{
                        if( !updatedImageStageList.some(list => list.id === elem.mmu_esc) ) updatedImageStageList.push({id: elem.mmu_esc, url:''})
                    }
                    try {
                        elem.lista_sonidos = await getSoundList(elem.mmu_ubi)
                        npcList = await getNpcList(elem.mmu_ubi)
                        elem.lista_pnj = npcList
                        elem.lista_enemigo = await getEnemyList(elem.mmu_ubi)
                        elem.lista_mision = await getMissionList(elem.mmu_ubi)
                    } catch (error) {
                        console.error('Error al cargar datos:', error)
                    }
                    if(stage.esc_id === elem.mmu_esc){
                        templateMap[elem.mmu_pos_y][elem.mmu_pos_x] = transformMapamundi(elem)
                    }
                    getMapImage(updatedImageStageList, stage.esc_id)
                })
            )

            setListItemsMap(data.map(transformMapamundi))
            setCurrentStage(stage)
            setImageStageList(updatedImageStageList)
            //console.log('getMap - stage: ',stage)
            //console.log('getMap - data: ',data)
        }
        //console.log('getMap - ',templateMap)
        setGeographicalMap(templateMap)
    }

    /**
     * Llenar listado de escenarios con las URL de imagen.
     * @param {stageImageList[]} imageList - Listado de escenarios.
     * @param {string} idEsc - Identificador del escenario.
     */
    const getMapImage = async(imageList:stageImageList[], idEsc:string): Promise<void> => {
        imageList.map(async (image) => {
            const url:string = await Promise.resolve(getUrlStage(image.id))
            image.url = url + '?' + randomValueRefreshImage
        })
        
        if(idEsc !== null && idEsc !== undefined && imageList) {
            setImagetStage(imageList.find(elem => elem.id === idEsc)?.url || '')
        }
    }
    
    /**
     * Llenar listado de URL de los sonidos por ubicacion.
     * @param {string} ubiId - Identificador de la ubicacion.
     * @returns {DBSonidoUbicacion[]} Retorna el listado de sonidos por ubicacion.
     */
    const getSoundList = async(ubiId:string): Promise<DBSonidoUbicacion[]> => {
        let list: DBSonidoUbicacion[] = []
        
        if (!ubiId) return list

        const data =  await Promise.resolve( 
            getDataQuerySub(
                'sub_son, sub_tipo, sub_icon, son_sonidos(son_id, son_nombre, son_url)'
                , { 'sub_tipo': ['U','UL'], 'sub_estado': 'A', 'sub_ubi': ubiId }
            )
        )
        if (data !== null) {
            await getSounds(data)
            // Use the transformSound function to ensure consistent structure
            list = data.map(transformSound)
        }
        return list
    }

    const getSounds = async(soundsList: any[]): Promise<void> => {
        soundsList.forEach(async (sound) => {
            if (sound.sub_tipo === 'U') {
                const url: string = await Promise.resolve(getUrlSound(sound.sub_son))
                sound.sub_sound_url = url + '?' + randomValueRefreshImage
            } else if (sound.sub_tipo === 'UL') {
                // Make sure son_sonidos exists and has the correct structure
                if (sound.son_sonidos) {
                    sound.sub_sound_url = sound.son_sonidos.son_url || ''
                } else {
                    sound.sub_sound_url = ''
                }
            }
        })
    }

    /**
     * Llenar listado de personajes no jugables por ubicacion.
     * @param {string} ubiId - Identificador de la ubicacion.
     * @returns {DBPersonajeNoJugable[]} Retorna el listado de personajes no jugables por ubicacion.
     */
    const getNpcList = async(ubiId:string): Promise<DBPersonajeNoJugable[]> => {
        let characterList: DBPersonajeNoJugable[] = []
        
        if (!ubiId) return characterList

        const data = await Promise.resolve(
            getDataQueryPnj(
                'pnj_id, pnj_nombre, pnj_raza, pnj_clase, pnj_trabajo, pnj_edad, pnj_tipo, pnj_str, pnj_int, pnj_dex, pnj_con, pnj_cha, pnj_per, pnj_vida'
                , {'pnj_estado': 'A', 'pnj_ubi': ubiId}
                , {'pnj_tipo': true}
            )
        )

        if (data !== null) {
            // The data is already in shared type format (DBPersonajeNoJugable[])
            characterList = data as DBPersonajeNoJugable[];
        }

        return characterList
    }

    /**
     * Llenar listado de enemigos por ubicacion.
     * @param {string} ubiId - Identificador de la ubicacion.
     * @returns {DBEnemigo[]} Retorna el listado de enemigos por ubicacion.
     */
    const getEnemyList = async(ubiId:string): Promise<DBEnemigo[]> => {
        let enemyList: DBEnemigo[] = []
        
        if (!ubiId) return enemyList

        const data = await Promise.resolve(
            getDataQueryEne(
                'ene_id, ene_nombre, ene_raza, ene_clase, ene_trabajo, ene_edad, ene_tipo, ene_str, ene_int, ene_dex, ene_con, ene_cha, ene_per, ene_vida'
                , {'ene_estado': 'A', 'ene_ubi': ubiId}
                , {'ene_tipo': true}
            )
        )

        if (data !== null) {
            // The data is already in shared type format (DBEnemigo[])
            enemyList = data as DBEnemigo[];
        }

        return enemyList
    }

    /**
     * Llenar listado de misiones por ubicacion.
     * @param {string} ubiId - Identificador de la ubicacion.
     * @returns {DBPersonajeNoJugable[]} Retorna el listado de misiones por ubicacion.
     */
    const getMissionList = async (ubiId:string): Promise<DBMision[]> => {
        let missionList: DBMision[] = []
        
        if (!ubiId) return missionList

        const data =  await Promise.resolve(
            getDataQueryMis(
                'mis_id, mis_nombre, mis_tipo, mis_cumplido'
                , {'mis_estado':'A', 'mis_ubi': ubiId}
                , {'mis_tipo': true}
            )
        )

        if (data !== null) {
            missionList = data.map(transformMission)
        }

        return missionList
    }

    const handleImageStageChange = (idEsc: string): void => {
        let listItemsByStage = listItemsMap.filter(elem => elem.mmu_esc === idEsc)

        setImagetStage(imageStageList.find(elem => elem.id === idEsc)?.url || '')
        setCurrentStage(listItemsByStage[0]?.esc_escenario as DBEscenario)
        mapChange(listItemsByStage)
    }

    const mapChange = (list: DBMapamundi[]): void => {
        const templateMap = geographicalMap.map((row) => 
            row.map((col) => (col.mmu_id !== '' ? emptyTemplate : col))
        )

        list.map((elem) => {
            templateMap[elem.mmu_pos_y][elem.mmu_pos_x] = elem;
        })
        
        setGeographicalMap(templateMap)
    }

    return (
        <>
            {loading && (
                <ScreenLoader/>
            )}
            <section className="min-h-screen grid grid-cols-1 grid-rows-[80px_repeat(3,minmax(0,_1fr))] gap-x-0 gap-y-0 py-2">
                {/* Selecionar escenarios */}
                {/* Botones */}
                <StageSelector title='Listados de escenarios' imageList={imageStageList} onImageChange={handleImageStageChange}/>
                <AmbientSoundsSelector title='Lista de sonidos' />
                <DiceThrower title='Lanzador de dados' />
                <header className='bg-white shadow-lg rounded py-0 grid items-center mb-2'>
                    <h1 className='title-list'>Mapamundi</h1>
                    <h2 className='subtitle-list'>{currentStage.esc_nombre}</h2>
                </header>

                <article className="map-grid relative grid grid-rows-7 rounded-xl bg-blue-900 text-gray-700 shadow-md w-full px-12 py-2 row-span-5 " style={{backgroundImage: `url("${imageStage}")`}}>
                    <PlayerMap imageStage={imageStage} title={currentStage.esc_nombre} />
                    {geographicalMap.map((row, rowIndex) => (
                        <div key={rowIndex} className='map-grid-row grid-rows-1 grid grid-cols-11 '>
                            {row.map((elem, colIndex) => (
                                (elem.mmu_id !== '') ? (
                                    <ItemUbi key={rowIndex + colIndex} item={elem} row={rowIndex} col={colIndex} />
                                ) : (
                                    <div key={rowIndex + colIndex} className='map-grid-col-empty grid-cols-1 border-dashed border-[#000c] border-1 text-light'></div>
                                )
                            ))}
                        </div>
                    ))}
                </article>
            </section>
        </>
    )
}

export default WorldMap;