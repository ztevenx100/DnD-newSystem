import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '@database/supabase';

import { Popover, PopoverHandler, PopoverContent, Tooltip } from "@material-tailwind/react";
import "@unocss/reset/tailwind.css";
import "uno.css";
import "./WorldMap.css";

// Interfaces
import { stageImageList } from '@interfaces/typesCharacterSheet';
import { DBEscenario, DBMapamundi, DBSonidoUbicacion, DBPersonajeNoJugable, DBEnemigo, DBMision } from '@interfaces/dbTypes';
import { itemsTypeUbgSvg, itemsSoundsSvg } from '@interfaces/iconInterface';
// Components
import ScreenLoader from '@UI/ScreenLoader/ScreenLoader';
import StageSelector from './StageSelector/StageSelector';
import AmbientSoundsSelector from './AmbientSoundsSelector/AmbientSoundsSelector';
import BtnMenuSound from '@UI/Buttons/BtnMenuSound';

// Funciones
import {getIcon} from '@utils/utilIcons';

// Images
import bgMapWorld from '@img/webp/bg-mapWorld.webp';
import SvgPerson from '@UI/Icons/SvgPerson';
import SvgLookImage from '@UI/Icons/SvgLookImage';
import SvgSong from '@UI/Icons/SvgSong';
import SvgEnemy from '@UI/Icons/SvgEnemy';
import SvgGroup from '@UI/Icons/SvgGroup';
import SvgTaskList from '@UI/Icons/SvgTaskList';

interface WorldMapProps {
    changeBackground: (newBackground: string) => void;
}

const WorldMap: React.FC<WorldMapProps> = ({ changeBackground }) => {
    
    const [geographicalMap, setGeographicalMap] = useState<DBMapamundi[][]>([]);
    const [listItemsMap, setListItemsMap] = useState<DBMapamundi[]>([]);
    const [currentStage, setCurrentStage] = useState<DBEscenario>({esc_id:'', esc_tipo:'', esc_nombre:''});
    const [imageStage, setImagetStage] = useState<string>('');
    const [imageStageList, setImageStageList] = useState<stageImageList[]>([]);

    const params = useParams();
    //const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const randomValueRefreshImage = Math.random().toString(36).substring(7);
    //const [newRecord, setNewRecord] = useState<boolean>(true);
    //const handleOpen = () => setOpen(!open);


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
            console.log('params: ',params);
            //await getMap(templateMap);

            Promise.all ([
                getMap(templateMap),
             ]).finally(() => {
                setLoading(false);
             });
        }

        loadInfo();
     }, []);

    function buildTemplateMap(){
        const templateMap: DBMapamundi[][] = [...geographicalMap];
        
        for (let i = 0; i < 7; i++) {
            templateMap.push([]);
            for (let j = 0; j < 11; j++) {
                templateMap[i].push(emptyTemplate);
            }
        }
        //console.log('templateMap', templateMap);
        return templateMap;
    }

    async function getMap(templateMap: DBMapamundi[][]) {
        const { data } = await supabase.from("mmu_mapamundi").select('mmu_id, mmu_sju, mmu_esc, esc_escenario(esc_id, esc_tipo, esc_nombre), mmu_ubi, ubi_ubicacion(ubi_id, ubi_tipo, ubi_nombre),mmu_pos_x, mmu_pos_y')
           .eq("mmu_sju",'d127c085-469a-4627-8801-77dc7262d41b')
            //.eq("mmu_id",'036bd999-f79e-4203-bc93-ecce0bfdca35')
            .order('mmu_pos_x', {ascending: true})
            .order('mmu_pos_y', {ascending: true})
            .returns<DBMapamundi[]>();
        //console.log('getMap - data: ',data);
  
        if (data !== null) {
            let stage:DBEscenario = data[0].esc_escenario as DBEscenario;
            const updatedImageStageList = [...imageStageList];

            await Promise.all(
                data.map(async (elem) => {
                    // console.log('elem', elem.mmu_ubi);
                    let npcList: DBPersonajeNoJugable[] = [];
                    
                    if(updatedImageStageList.length === 0){
                        updatedImageStageList.push({id: elem.mmu_esc, url:''});
                    }else{
                        if(updatedImageStageList[updatedImageStageList.length-1].id !== elem.mmu_esc) updatedImageStageList.push({id: elem.mmu_esc, url:''});
                    }
                    try {
                        elem.lista_sonidos = await getSoundList(elem.mmu_ubi);
                        npcList = await getNpc(elem.mmu_ubi);
                        elem.lista_pnj = npcList;
                        elem.lista_enemigo = await getEnemy(elem.mmu_ubi);
                        elem.lista_mision = await getMission(elem.mmu_ubi);
                        //console.log('getMap - pnj_encargado: ',templateMap[elem.mmu_pos_y][elem.mmu_pos_x].pnj_encargado);
                    } catch (error) {
                        //templateMap[elem.mmu_pos_y][elem.mmu_pos_x].lista_sonidos = [];
                    }
                    if(stage.esc_id === elem.mmu_esc){
                        templateMap[elem.mmu_pos_y][elem.mmu_pos_x] = elem;
                    }
                })
            );

            setListItemsMap(data);
            setCurrentStage(stage);
            await getMapImage(updatedImageStageList, stage.esc_id);
            setImageStageList(updatedImageStageList);
            //console.log('getMap - stage: ',stage);
            //console.log('getMap - data: ',data);
            //console.log('getMap - updatedImageStageList: ',updatedImageStageList);
        }
        //console.log('getMap - ',templateMap);
        setGeographicalMap(templateMap);
    }

    async function getMapImage(imageList:stageImageList[], idEsc:string) {

        await imageList.map(async (image) => {
            const { data } = await supabase
            .storage
            .from('dnd-system')
            .getPublicUrl('escenarios/' + image.id + '.webp');
    
            if(data) image.url = data.publicUrl + '?' + randomValueRefreshImage;
        })
        //console.log('getMapImage - imageList: ', imageList, ' , idEsc:', idEsc);
        
        if(idEsc !== null && idEsc !== undefined && imageList){
            setImagetStage(imageList.find(elem => elem.id === idEsc)?.url || '');
        }
    }
    
    async function getSoundList(ubiId:string): Promise<DBSonidoUbicacion[]>{
        let list: DBSonidoUbicacion[] = [];
        //console.log('ubiId: ', ubiId);
        
        if (ubiId == undefined || ubiId == null) return list;

        const { data } = await supabase.from("sub_sonido_ubicacion").select('sub_son, sub_tipo, sub_icon, son_sonidos(son_id, son_nombre) ')
        .eq('sub_tipo','U')
        .eq('sub_estado','A')
        .eq('sub_ubi',ubiId)
        .returns<DBSonidoUbicacion[]>();
        //console.log("getSoundList - data: " , data);
        if (data !== null) {
            await getSounds(data);
            list = data;
        }
        //console.log(list);
        return list;
    }

    async function getSounds(soundsList:DBSonidoUbicacion[]) {
        await soundsList.map(async (sound) => {
            const { data } = await supabase
            .storage
            .from('dnd-system')
            .getPublicUrl('sonidos/' + sound.sub_son + '.mp3');
            if(data) sound.sub_sound_url = data.publicUrl ;
        })
        //console.log('getSonuds - soundsList: ', soundsList);
    }

    async function getNpc(ubiId:string): Promise<DBPersonajeNoJugable[]>{
        let character: DBPersonajeNoJugable[] = [];
        
        if (ubiId == undefined || ubiId == null) return character;

        const { data } = await supabase.from("pnj_personaje_no_jugable").select('pnj_id, pnj_nombre, pnj_raza, pnj_clase, pnj_trabajo, pnj_edad, pnj_tipo, pnj_str, pnj_int, pnj_dex, pnj_con, pnj_cha, pnj_per')
        //.eq('pnj_tipo','M')
        .eq('pnj_estado','A')
        .eq('pnj_ubi',ubiId)
        .order('pnj_tipo', {ascending: true})
        .returns<DBPersonajeNoJugable[]>();

        if (data !== null) {
            //console.log("getMainNpc - data: " , data, ' idUbi: ', ubiId);
            character = data;
        }

        return character;
    }

    async function getEnemy(ubiId:string): Promise<DBEnemigo[]>{
        let enemy: DBEnemigo[] = [];
        
        if (ubiId == undefined || ubiId == null) return enemy;

        const { data } = await supabase.from("ene_enemigo").select('ene_id, ene_nombre, ene_raza, ene_clase, ene_trabajo, ene_edad, ene_tipo, ene_str, ene_int, ene_dex, ene_con, ene_cha, ene_per')
        //.eq('pnj_tipo','M')
        .eq('ene_estado','A')
        .eq('ene_ubi',ubiId)
        .order('ene_tipo', {ascending: true})
        .returns<DBEnemigo[]>();

        if (data !== null) {
            //console.log("getMainNpc - data: " , data, ' idUbi: ', ubiId);
            enemy = data;
        }

        return enemy;
    }

    async function getMission(ubiId:string): Promise<DBMision[]>{
        let mission: DBMision[] = [];
        
        if (ubiId == undefined || ubiId == null) return mission;

        const { data } = await supabase.from("mis_mision").select('mis_id, mis_nombre, mis_tipo, mis_cumplido')
        //.eq('pnj_tipo','M')
        .eq('mis_estado','A')
        .eq('mis_ubi',ubiId)
        .order('mis_tipo', {ascending: true})
        .returns<DBMision[]>();

        if (data !== null) {
            //console.log("getMainNpc - data: " , data, ' idUbi: ', ubiId);
            mission = data;
        }

        return mission;
    }

    function openNewWindowImageUbi(idUbi:string | undefined){
        if(idUbi === undefined) return;
        
        const path:string = 'ubicaciones/' + idUbi + '.webp';
        const { data } = supabase
        .storage
        .from('dnd-system')
        .getPublicUrl(path);
        //console.log('openNewWindowImage :', data);

        if (data !== null) {
            openNewWindowImage(data.publicUrl);
        }
        return true;
    }

    function openNewWindowImagePnj(idPnj:string | undefined){
        if(idPnj === undefined) return;
        
        const path:string = 'personajes/' + idPnj + '.webp';
        const { data } = supabase
        .storage
        .from('dnd-system')
        .getPublicUrl(path);
        //console.log('openNewWindowImage :', data);

        if (data !== null) {
            openNewWindowImage(data.publicUrl);
        }
        return true;
    }

    function openNewWindowImageEnemy(idEnemy:string | undefined){
        if(idEnemy === undefined) return;
        
        const path:string = 'enemigos/' + idEnemy + '.webp';
        const { data } = supabase
        .storage
        .from('dnd-system')
        .getPublicUrl(path);
        //console.log('openNewWindowImage :', data);

        if (data !== null) {
            openNewWindowImage(data.publicUrl);
        }
        return true;
    }

    function openNewWindowImage(url: string){
        const myWindow = window.open("", "MsgWindow", "width=800,height=800");
        let imageHtml = "<img src='" + url + '?' + randomValueRefreshImage + "' style='position: absolute; top:0; left:0; width:100%; height: 100%; object-fit: cover; object-position: center top; overflow:hidden; margin: 0;' alt='Ubicacion' />";
        myWindow?.document.write(imageHtml);
    }

    const handleImageStageChange = (idEsc: string) => {
        let listItemsByStage = listItemsMap.filter(elem => elem.mmu_esc === idEsc);

        setImagetStage(imageStageList.find(elem => elem.id === idEsc)?.url || '');
        setCurrentStage(listItemsByStage[0]?.esc_escenario as DBEscenario);
        mapChange(listItemsByStage);
    }

    const mapChange = (list: DBMapamundi[]) => {
        const templateMap = geographicalMap.map((row) => 
            row.map((col) => (col.mmu_id !== '' ? emptyTemplate : col))
        );

        list.map((elem) => {
            templateMap[elem.mmu_pos_y][elem.mmu_pos_x] = elem;
        })
        
        //console.log('mapChange :', templateMap);
        setGeographicalMap(templateMap);
    }

    const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
        let isCompleted = event.target.checked;
        //console.log('handleCheckboxChange', isCompleted);
        
        const { error } = await supabase
        .from('mis_mision')
        .update({
            mis_cumplido: ((isCompleted)?'S':'N'),
        })
        .eq("mis_id", id)
        .select();
        if(error) alert('Stat not upload.');
        
      };

    return (
        <>

        {loading && (
            <ScreenLoader/>
        )}
        <section className="min-h-screen grid grid-cols-1 grid-rows-[100px_repeat(3,minmax(0,_1fr))] gap-x-0 gap-y-0 py-4">
            {/* selecionar escenarios */}
            <StageSelector title='Listados de escenarios' imageList={imageStageList} onImageChange={handleImageStageChange}/>
            <AmbientSoundsSelector title='Lista de sonidos' />
            <header className='bg-white shadow-lg rounded py-0 grid items-center mb-2'>
                <h1 className='title-list'>Mapamundi</h1>
                <h2 className='subtitle-list'>{currentStage.esc_nombre}</h2>
            </header>
            <article className="map-grid relative grid grid-rows-7 rounded-xl bg-blue-900 text-gray-700 shadow-md w-full px-12 py-2 row-span-5" style={{backgroundImage: `url("${imageStage}")`}}>
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
                                                                            <button type="button" className='btn-card-character' onClick={() => openNewWindowImagePnj(elem.lista_pnj[0].pnj_id)} >
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
                                                                                <button type="button" className='btn-character' onClick={() => openNewWindowImagePnj(character.pnj_id)} >
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
                                                    </div>
                                                </menu>
                                            </aside>
                                        </PopoverContent>
                                    </Popover>
                                );
                            } else {
                                return (
                                    <div key={rowIndex + colIndex} className='map-grid-col-empty grid-cols-1 border-dashed border-[#000c] border-1 text-light'></div>
                                );
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