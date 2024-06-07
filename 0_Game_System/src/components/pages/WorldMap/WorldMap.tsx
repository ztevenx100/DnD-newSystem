import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import dbConnection from '@database/dbConnection'
import { getDataQueryMmu, getDataQuerySub, getDataQueryPnj, getDataQueryEne, getDataQueryMis } from '@database/dbTables'
import { getUrlStage, getUrlSound, getUrlLocation, getUrlNpc, getUrlEnemy } from '@database/dbStorage'

import { Popover, PopoverHandler, PopoverContent, Tooltip } from "@material-tailwind/react"
import "@unocss/reset/tailwind.css"
import "uno.css"
import "./WorldMap.css"

// Interfaces
import { stageImageList } from '@interfaces/typesCharacterSheet'
import { DBEscenario, DBMapamundi, DBSonidoUbicacion, DBPersonajeNoJugable, DBEnemigo, DBMision } from '@interfaces/dbTypes'
import { itemsTypeUbgSvg, itemsSoundsSvg } from '@interfaces/iconInterface'

// Components
import ScreenLoader from '@UI/ScreenLoader/ScreenLoader'
import BtnMenuSound from '@UI/Buttons/BtnMenuSound'
import StageSelector from './StageSelector/StageSelector'
import AmbientSoundsSelector from './AmbientSoundsSelector/AmbientSoundsSelector'
import PlayerMap from './PlayerMap/PlayerMap'
import DiceThrower from './DiceThrower/DiceThrower'

// Funciones
import {getIcon} from '@utils/utilIcons'

// Images
import bgMapWorld from '@img/webp/bg-mapWorld.webp'
import SvgPerson from '@UI/Icons/SvgPerson'
import SvgLookImage from '@UI/Icons/SvgLookImage'
import SvgSong from '@UI/Icons/SvgSong'
import SvgEnemy from '@UI/Icons/SvgEnemy'
import SvgGroup from '@UI/Icons/SvgGroup'
import SvgTaskList from '@UI/Icons/SvgTaskList'

interface WorldMapProps {
    changeBackground: (newBackground: string) => void
}

const WorldMap: React.FC<WorldMapProps> = ({ changeBackground }) => {
    
    const [geographicalMap, setGeographicalMap] = useState<DBMapamundi[][]>([])
    const [listItemsMap, setListItemsMap] = useState<DBMapamundi[]>([])
    const [currentStage, setCurrentStage] = useState<DBEscenario>({esc_id:'', esc_tipo:'', esc_nombre:''})
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
    const buildTemplateMap = () => {
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
    const getMap = async(templateMap: DBMapamundi[][]) => {
        const data = await Promise.resolve(
            getDataQueryMmu(
                'mmu_id, mmu_sju, mmu_esc, esc_escenario(esc_id, esc_tipo, esc_nombre), mmu_ubi, ubi_ubicacion(ubi_id, ubi_tipo, ubi_nombre),mmu_pos_x, mmu_pos_y'
                , {'mmu_sju': 'd127c085-469a-4627-8801-77dc7262d41b'}
                , { 'mmu_pos_x': true, 'mmu_pos_y':true }
            )
        )
  
        if (data !== null) {
            let stage:DBEscenario = data[0].esc_escenario as DBEscenario
            const updatedImageStageList = [...imageStageList]

            await Promise.all(
                data.map(async (elem) => {
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
                    }
                    if(stage.esc_id === elem.mmu_esc){
                        templateMap[elem.mmu_pos_y][elem.mmu_pos_x] = elem
                    }
                    getMapImage(updatedImageStageList, stage.esc_id)
                })
            )

            setListItemsMap(data)
            setCurrentStage(stage)
            setImageStageList(updatedImageStageList)
            //console.log('getMap - updatedImageStageList: ',updatedImageStageList)
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
    const getMapImage = async(imageList:stageImageList[], idEsc:string) => {

        imageList.map(async (image) => {
            const url:string = await Promise.resolve(getUrlStage(image.id))
            image.url = url + '?' + randomValueRefreshImage
        })
        
        if(idEsc !== null && idEsc !== undefined && imageList) setImagetStage(imageList.find(elem => elem.id === idEsc)?.url || '')

    }
    
    /**
     * Llenar listado de URL de los sonidos por ubicacion.
     * @param {string} ubiId - Identificador de la ubicacion.
     * @returns {DBSonidoUbicacion[]} Retorna el listado de sonidos por ubicacion.
     */
    const getSoundList = async(ubiId:string): Promise<DBSonidoUbicacion[]> => {
        let list: DBSonidoUbicacion[] = []
        
        if (ubiId == undefined || ubiId == null) return list

        const data =  await Promise.resolve( 
            getDataQuerySub(
                'sub_son, sub_tipo, sub_icon, son_sonidos(son_id, son_nombre) '
                , {'sub_tipo': 'U', 'sub_estado': 'A', 'sub_ubi': ubiId}
            )
        )

        //console.log("getSoundList - data: " , data);
        if (data !== null) {
            await getSounds(data)
            list = data
        }
        //console.log(list);
        return list
    }

    const getSounds = async(soundsList:DBSonidoUbicacion[]) => {
        await soundsList.map(async (sound) => {
            const url:string = await Promise.resolve(getUrlSound(sound.sub_son))
            sound.sub_sound_url = url + '?' + randomValueRefreshImage
        })
    }

    /**
     * Llenar listado de personajes no jugables por ubicacion.
     * @param {string} ubiId - Identificador de la ubicacion.
     * @returns {DBPersonajeNoJugable[]} Retorna el listado de personajes no jugables por ubicacion.
     */
    const getNpcList = async(ubiId:string): Promise<DBPersonajeNoJugable[]> => {
        let characterList: DBPersonajeNoJugable[] = []
        
        if (ubiId == undefined || ubiId == null) return characterList

        const data =  await Promise.resolve(
            getDataQueryPnj(
                'pnj_id, pnj_nombre, pnj_raza, pnj_clase, pnj_trabajo, pnj_edad, pnj_tipo, pnj_str, pnj_int, pnj_dex, pnj_con, pnj_cha, pnj_per'
                , {'pnj_estado': 'A', 'pnj_ubi': ubiId}
                , {'pnj_tipo': true}
            )
        )

        if (data !== null) {
            //console.log("getMainNpc - data: " , data, ' idUbi: ', ubiId);
            characterList = data
        }

        return characterList
    }

    /**
     * Llenar listado de enemigos por ubicacion.
     * @param {string} ubiId - Identificador de la ubicacion.
     * @returns {DBPersonajeNoJugable[]} Retorna el listado de enemigos por ubicacion.
     */
    const getEnemyList = async(ubiId:string): Promise<DBEnemigo[]> => {
        let enemyList: DBEnemigo[] = []
        
        if (ubiId == undefined || ubiId == null) return enemyList

        const data =  await Promise.resolve(
            getDataQueryEne(
                'ene_id, ene_nombre, ene_raza, ene_clase, ene_trabajo, ene_edad, ene_tipo, ene_str, ene_int, ene_dex, ene_con, ene_cha, ene_per'
                , {'ene_estado': 'A', 'ene_ubi': ubiId}
                , {'ene_tipo': true}
            )
        )

        if (data !== null) {
            //console.log("getMainNpc - data: " , data, ' idUbi: ', ubiId);
            enemyList = data
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
        
        if (ubiId == undefined || ubiId == null) return missionList

        const data =  await Promise.resolve(
            getDataQueryMis(
                'mis_id, mis_nombre, mis_tipo, mis_cumplido'
                , {'mis_estado':'A', 'mis_ubi': ubiId}
                , {'mis_tipo': true}
            )
        )

        if (data !== null) {
            //console.log("getMainNpc - data: " , data, ' idUbi: ', ubiId);
            missionList = data
        }

        return missionList
    }

    const openNewWindowImageUbi = async(idUbi:string | undefined) => {
        if(idUbi === undefined) return

        const url:string = await Promise.resolve(getUrlLocation(idUbi))
        openNewWindowImage(url)
    }

    const openNewWindowImageNpc = async(idNpc:string | undefined) => {
        if(idNpc === undefined) return

        const url:string = await Promise.resolve(getUrlNpc(idNpc))
        openNewWindowImage(url)
    }

    const openNewWindowImageEnemy = async(idEnemy:string | undefined) => {
        if(idEnemy === undefined) return

        const url:string = await Promise.resolve(getUrlEnemy(idEnemy))
        openNewWindowImage(url)
    }

    const openNewWindowImage = (url: string) => {
        const myWindow = window.open("", "MsgWindow", "width=800,height=800");
        let imageHtml = `<img src='${url}?${randomValueRefreshImage}' style='position: absolute; top:0; left:0; width:100%; height: 100%; object-fit: cover; object-position: center top; overflow:hidden; margin: 0;' alt='Ubicacion' />`
        myWindow?.document.write(imageHtml)
    }

    const handleImageStageChange = (idEsc: string) => {
        let listItemsByStage = listItemsMap.filter(elem => elem.mmu_esc === idEsc)

        setImagetStage(imageStageList.find(elem => elem.id === idEsc)?.url || '')
        setCurrentStage(listItemsByStage[0]?.esc_escenario as DBEscenario)
        mapChange(listItemsByStage)
    }

    const mapChange = (list: DBMapamundi[]) => {
        const templateMap = geographicalMap.map((row) => 
            row.map((col) => (col.mmu_id !== '' ? emptyTemplate : col))
        )

        list.map((elem) => {
            templateMap[elem.mmu_pos_y][elem.mmu_pos_x] = elem;
        })
        
        //console.log('mapChange :', templateMap)
        setGeographicalMap(templateMap)
    }

    const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
        let isCompleted = event.target.checked
        
        const { error } = await dbConnection
        .from('mis_mision')
        .update({
            mis_cumplido: ((isCompleted)?'S':'N'),
        })
        .eq("mis_id", id)
        .select()
        if(error) alert('Stat not upload.')
        
    };

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
                        {row.map((elem, colIndex) => {
                            if (elem.mmu_id !== '') {
                                
                                return (
                                    // Location panel
                                    <Popover key={rowIndex + colIndex} placement="bottom" offset={5}>
                                        <PopoverHandler>
                                            <div className='map-grid-col grid-cols-1 border-dashed border-white border-2 text-light'>
                                                {getIcon('type' + elem.ubi_ubicacion?.ubi_tipo, itemsTypeUbgSvg, 50, 50)}
                                            </div>
                                        </PopoverHandler>
                                        <PopoverContent className='p-2' placeholder=''>
                                            <aside className='card-ubi-info'>
                                                <header className='flex justify-between items-center border-b border-black py-1'>
                                                    <h6 className='text-black font-semibold '>{elem.ubi_ubicacion?.ubi_nombre}</h6>
                                                    <Tooltip className="bg-dark text-light px-2 py-1" placement="top" content={ "Imagen de la ubicación" } >
                                                        <button type="button" className='btn-card-ubi-header' onClick={() => openNewWindowImageUbi(elem.mmu_ubi)} >
                                                            <SvgLookImage width={20} height={20} />
                                                        </button>
                                                    </Tooltip>
                                                </header>
                                                <menu className='py-0'>
                                                    <div className='flex justify-between py-1' >
                                                        {elem.lista_pnj && elem.lista_pnj.length > 0 && (
                                                            <Popover placement="right" offset={{mainAxis: 100, crossAxis: 0, alignmentAxis:10}}>
                                                                <PopoverHandler>
                                                                    <button type="button" className='btn-card-ubi'><SvgPerson width={20} height={20} /></button>
                                                                </PopoverHandler>
                                                                <PopoverContent className='popover-panel' placeholder=''>
                                                                    <article className='card-info-character'>
                                                                        <header className='flex justify-between items-center border-b border-black py-1 mb-1'>
                                                                            <h6 className='text-black font-semibold '>Encargado del local</h6>
                                                                            <button type="button" className='btn-card-character' onClick={() => openNewWindowImageNpc(elem.lista_pnj[0].pnj_id)} >
                                                                                <SvgLookImage width={20} height={20} />
                                                                            </button>
                                                                        </header>
                                                                        <h6 className='text-center text-black font-bold'>{elem.lista_pnj[0].pnj_nombre}</h6>
                                                                        <p>Raza: {elem.lista_pnj[0].pnj_raza}</p>
                                                                        <p>Clase: {elem.lista_pnj[0].pnj_clase}</p>
                                                                        <p>Trabajo: {elem.lista_pnj[0].pnj_trabajo}</p>
                                                                        <p>Edad: {elem.lista_pnj[0].pnj_edad}</p>
                                                                        <table className='mt-1'>
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>STR</th>
                                                                                    <th>INT</th>
                                                                                    <th>DEX</th>
                                                                                    <th>CON</th>
                                                                                    <th>PER</th>
                                                                                    <th>CHA</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td>{elem.lista_pnj[0].pnj_str}</td>
                                                                                    <td>{elem.lista_pnj[0].pnj_int}</td>
                                                                                    <td>{elem.lista_pnj[0].pnj_dex}</td>
                                                                                    <td>{elem.lista_pnj[0].pnj_con}</td>
                                                                                    <td>{elem.lista_pnj[0].pnj_per}</td>
                                                                                    <td>{elem.lista_pnj[0].pnj_cha}</td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </article>
                                                                </PopoverContent>
                                                            </Popover>
                                                        )}
                                                    </div>
                                                    <div className='flex justify-between py-1' >
                                                        {elem.lista_mision && elem.lista_mision.length > 0 && (
                                                            <Popover placement="right" offset={{mainAxis: 100, crossAxis: 0, alignmentAxis:10}}>
                                                                <PopoverHandler>
                                                                    <button type="button" className='btn-card-ubi'><SvgTaskList height={20} width={20} /></button>
                                                                </PopoverHandler>
                                                                <PopoverContent className='popover-panel' placeholder=''>
                                                                    <article className='card-ubi-info character-popover'>
                                                                        <header className='flex justify-between items-center border-b border-black py-1'>
                                                                            <h6 className='text-black font-semibold '>Listado de misiones</h6>
                                                                        </header>
                                                                        {elem.lista_mision.map((mission, index) => (
                                                                            <label
                                                                                htmlFor="vertical-list-react"
                                                                                key={index}
                                                                                className="flex w-full cursor-pointer items-center p-1"
                                                                            >
                                                                                <input 
                                                                                    type='checkbox'
                                                                                    id="vertical-list-react"
                                                                                    className="p-0 mr-2"
                                                                                    value={mission.mis_cumplido}
                                                                                    onChange={(e) => handleCheckboxChange(e, mission.mis_id)}
                                                                                />
                                                                                {mission.mis_nombre}
                                                                            </label>
                                                                        ))}
                                                                    </article>
                                                                </PopoverContent>
                                                            </Popover>
                                                            
                                                        )}
                                                        {elem.lista_enemigo && elem.lista_enemigo.length > 0 && (
                                                            <Popover placement="right" offset={{mainAxis: 50, crossAxis: 0, alignmentAxis:10}}>
                                                                <PopoverHandler>
                                                                    <button type="button" className='btn-card-ubi'><SvgEnemy height={20} width={20} /></button>
                                                                </PopoverHandler>
                                                                <PopoverContent className='popover-panel' placeholder=''>
                                                                    <article className='card-ubi-info character-popover'>
                                                                        <header className='flex justify-between items-center border-b border-black py-1 mb-2'>
                                                                            <h6 className='text-black font-semibold '>Listado de enemigos</h6>
                                                                        </header>
                                                                        {elem.lista_enemigo.map((enemy, index) => (
                                                                            <Tooltip key={index} className="bg-dark text-light px-2 py-1" placement="bottom" 
                                                                                content={ 
                                                                                    <div className="w-50 p-2">
                                                                                        <p>Raza: {enemy.ene_raza}</p>
                                                                                        <p>Clase: {enemy.ene_clase}</p>
                                                                                        <p>Trabajo: {enemy.ene_trabajo}</p>
                                                                                        <p>Edad: {enemy.ene_edad}</p>
                                                                                        <table className='w-full mt-1'>
                                                                                            <thead>
                                                                                                <tr>
                                                                                                    <th>STR</th>
                                                                                                    <th>INT</th>
                                                                                                    <th>DEX</th>
                                                                                                    <th>CON</th>
                                                                                                    <th>PER</th>
                                                                                                    <th>CHA</th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td>{enemy.ene_str}</td>
                                                                                                    <td>{enemy.ene_int}</td>
                                                                                                    <td>{enemy.ene_dex}</td>
                                                                                                    <td>{enemy.ene_con}</td>
                                                                                                    <td>{enemy.ene_per}</td>
                                                                                                    <td>{enemy.ene_cha}</td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </div>
                                                                                } 
                                                                            >
                                                                                <button type="button" className='btn-character' onClick={() => openNewWindowImageEnemy(enemy.ene_id)} >
                                                                                    {enemy.ene_nombre}
                                                                                </button>
                                                                            </Tooltip>
                                                                        ))}
                                                                    </article>
                                                                </PopoverContent>
                                                            </Popover>
                                                        )}
                                                        {elem.lista_pnj && elem.lista_pnj.length > 1 && (
                                                            <Popover placement="right" offset={{mainAxis: 30, crossAxis: 0, alignmentAxis:10}}>
                                                                <PopoverHandler>
                                                                    <button type="button" className='btn-card-ubi'><SvgGroup height={20} width={20} /></button>
                                                                </PopoverHandler>
                                                                <PopoverContent className='popover-panel' placeholder=''>
                                                                    <article className='card-ubi-info character-popover'>
                                                                        <header className='flex justify-between items-center border-b border-black py-1 mb-2'>
                                                                            <h6 className='text-black font-semibold '>Listado de personajes</h6>
                                                                        </header>
                                                                        {elem.lista_pnj.slice(1)?.map((character, index) => (
                                                                            <Tooltip key={index} className="bg-dark text-light px-2 py-1" placement="bottom" 
                                                                                content={ 
                                                                                    <div className="w-50 p-2">
                                                                                        <p>Raza: {character.pnj_raza}</p>
                                                                                        <p>Clase: {character.pnj_clase}</p>
                                                                                        <p>Trabajo: {character.pnj_trabajo}</p>
                                                                                        <p>Edad: {character.pnj_edad}</p>
                                                                                        <table className='w-full mt-1'>
                                                                                            <thead>
                                                                                                <tr>
                                                                                                    <th>STR</th>
                                                                                                    <th>INT</th>
                                                                                                    <th>DEX</th>
                                                                                                    <th>CON</th>
                                                                                                    <th>PER</th>
                                                                                                    <th>CHA</th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td>{character.pnj_str}</td>
                                                                                                    <td>{character.pnj_int}</td>
                                                                                                    <td>{character.pnj_dex}</td>
                                                                                                    <td>{character.pnj_con}</td>
                                                                                                    <td>{character.pnj_per}</td>
                                                                                                    <td>{character.pnj_cha}</td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </div>
                                                                                } 
                                                                            >
                                                                                <button type="button" className='btn-character' onClick={() => openNewWindowImageNpc(character.pnj_id)} >
                                                                                    {character.pnj_nombre}
                                                                                </button>
                                                                            </Tooltip>
                                                                        ))}
                                                                    </article>
                                                                </PopoverContent>
                                                            </Popover>
                                                        )}
                                                    </div>
                                                    <div className='flex justify-between py-1' >
                                                        {elem.lista_sonidos && elem.lista_sonidos.length > 0 && (
                                                            <Popover placement="right" offset={{mainAxis: 100, crossAxis: 0, alignmentAxis:10}}>
                                                                <PopoverHandler>
                                                                    <button type="button" className='btn-card-ubi'><SvgSong height={20} width={20} /></button>
                                                                </PopoverHandler>
                                                                <PopoverContent className='popover-panel' placeholder=''>
                                                                    <article className='card-ubi-info'>
                                                                        <header className='flex justify-between items-center border-b border-black py-1'>
                                                                            <h6 className='text-black font-semibold '>Listado de canciones</h6>
                                                                        </header>
                                                                        <BtnMenuSound list={elem.lista_sonidos} iconList={itemsSoundsSvg} />
                                                                    </article>
                                                                </PopoverContent>
                                                            </Popover>
                                                        )}
                                                    </div>
                                                </menu>
                                            </aside>
                                        </PopoverContent>
                                    </Popover>
                                );
                            } else {
                                return (
                                    <div key={rowIndex + colIndex} className='map-grid-col-empty grid-cols-1 border-dashed border-[#000c] border-1 text-light'></div>
                                )
                            }
                        })}
                    </div>
                ))}
            </article>
        </section>

        </>
    )
}

export default WorldMap;