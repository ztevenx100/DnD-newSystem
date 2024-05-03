import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../database/supabase';

import { useBackground } from '../../../App';
import { Popover, PopoverHandler, PopoverContent, Tooltip } from "@material-tailwind/react";
import "@unocss/reset/tailwind.css";
import "uno.css";
import "./WorldMap.css";

// Interfaces
import { stageImageList } from '../../interfaces/typesCharacterSheet';
import { DBEscenario, DBMapamundi, DBSonidoUbicacion } from '../../interfaces/dbTypes';
import { itemsTypeUbgSvg, itemsSoundsSvg } from '../../interfaces/iconInterface';
// Components
import ScreenLoader from '../../../components/UI/ScreenLoader/ScreenLoader';
import StageSelector from './StageSelector/StageSelector';
import AmbientSoundsSelector from './AmbientSoundsSelector/AmbientSoundsSelector';
import BtnMenuSound from '../../../components/UI/Buttons/BtnMenuSound';

// Funciones
import {getIcon} from '../../utils/utilIcons';

// Images
import bgMapWorld from '../../../assets/img/webp/bg-mapWorld.webp';
import SvgPerson from '../../../components/UI/Icons/SvgPerson';
import SvgLookImage from '../../../components/UI/Icons/SvgLookImage';
import SvgSong from '../../../components/UI/Icons/SvgSong';
import SvgEnemy from '../../../components/UI/Icons/SvgEnemy';
import SvgGroup from '../../../components/UI/Icons/SvgGroup';
import SvgTaskList from '../../../components/UI/Icons/SvgTaskList';

const WorldMap: React.FC = () => {
    // Cambia la imagen de fondo cuando el componente se monta
    const { setBackgroundImage } = useBackground();
    
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
    };

    useEffect(() => {
        setBackgroundImage(bgMapWorld);

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
                    if(updatedImageStageList.length === 0){
                        updatedImageStageList.push({id: elem.mmu_esc, url:''});
                    }else{
                        if(updatedImageStageList[updatedImageStageList.length-1].id !== elem.mmu_esc) updatedImageStageList.push({id: elem.mmu_esc, url:''});
                    }
                    if(stage.esc_id === elem.mmu_esc){
                        templateMap[elem.mmu_pos_y][elem.mmu_pos_x] = elem;
                        try {
                            templateMap[elem.mmu_pos_y][elem.mmu_pos_x].lista_sonidos = await getSoundList(elem.mmu_ubi);
                        } catch (error) {
                            //templateMap[elem.mmu_pos_y][elem.mmu_pos_x].lista_sonidos = [];
                        }
                    }
                })
            );

            setListItemsMap(data);
            setCurrentStage(stage);
            await getMapImage(updatedImageStageList, stage.esc_id);
            setImageStageList(updatedImageStageList);
            //console.log('getMap - stage: ',stage);
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
                                                        <Popover placement="right" offset={{mainAxis: 100, crossAxis: 0, alignmentAxis:10}}>
                                                            <PopoverHandler>
                                                                <button type="button" className='btn-card-ubi'><SvgPerson width={20} height={20} /></button>
                                                            </PopoverHandler>
                                                            <PopoverContent className='popover-panel' placeholder=''>
                                                                <aside className='card-info-character'>
                                                                    <header className='flex justify-between items-center border-b border-black py-1 mb-1'>
                                                                        <h6 className='text-black font-semibold '>Encargado del local</h6>
                                                                        <button type="button" className='btn-card-character' onClick={() => openNewWindowImageUbi(elem.mmu_ubi)} >
                                                                            <SvgLookImage width={20} height={20} />
                                                                        </button>
                                                                    </header>
                                                                    <h6 className='text-center'>Nombre</h6>
                                                                    <p>Raza: </p>
                                                                    <p>Clase: </p>
                                                                    <p>Trabajo: </p>
                                                                    <p>Edad: </p>
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
                                                                                <td>0</td>
                                                                                <td>0</td>
                                                                                <td>0</td>
                                                                                <td>0</td>
                                                                                <td>0</td>
                                                                                <td>0</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </aside>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>
                                                    <div className='flex justify-between py-1' >
                                                        <Popover placement="right" offset={{mainAxis: 100, crossAxis: 0, alignmentAxis:10}}>
                                                            <PopoverHandler>
                                                                <button type="button" className='btn-card-ubi'><SvgTaskList height={20} width={20} /></button>
                                                            </PopoverHandler>
                                                            <PopoverContent className='popover-panel' placeholder=''>
                                                                <aside className='card-ubi-info'>
                                                                    <header className='flex justify-between items-center border-b border-black py-1'>
                                                                        <h6 className='text-black font-semibold '>Listado de misiones</h6>
                                                                    </header>
                                                                </aside>
                                                            </PopoverContent>
                                                        </Popover>
                                                        <button type="button" className='btn-card-ubi'><SvgEnemy height={20} width={20} /></button>
                                                        <button type="button" className='btn-card-ubi'><SvgGroup height={20} width={20} /></button>
                                                    </div>
                                                    <div className='flex justify-between py-1' >
                                                        <Popover placement="right" offset={{mainAxis: 100, crossAxis: 0, alignmentAxis:10}}>
                                                            <PopoverHandler>
                                                                <button type="button" className='btn-card-ubi'><SvgSong height={20} width={20} /></button>
                                                            </PopoverHandler>
                                                            <PopoverContent className='popover-panel' placeholder=''>
                                                                <aside className='card-ubi-info'>
                                                                    <header className='flex justify-between items-center border-b border-black py-1'>
                                                                        <h6 className='text-black font-semibold '>Listado de canciones</h6>
                                                                    </header>
                                                                    <BtnMenuSound list={elem.lista_sonidos} iconList={itemsSoundsSvg} />
                                                                </aside>
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