import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../database/supabase';

import { useBackground } from '../../../App';
import { Popover, PopoverHandler, PopoverContent, Tooltip } from "@material-tailwind/react";
import "@unocss/reset/tailwind.css";
import "uno.css";
import "./WorldMap.css";

// Interfaces
import { Components, stageImageList } from '../../interfaces/typesCharacterSheet';
import { DBEscenario, DBMapamundi } from '../../interfaces/dbTypes';
// Components
import ScreenLoader from '../../../components/UI/ScreenLoader/ScreenLoader';
import StageSelector from './StageSelector/StageSelector';
// Images
import bgMapWorld from '../../../assets/img/jpg/bg-mapWorld.webp';
import SvgPerson from '../../../components/UI/Icons/SvgPerson';
import SvgLookImage from '../../../components/UI/Icons/SvgLookImage';
import SvgSong from '../../../components/UI/Icons/SvgSong';
import SvgEnemy from '../../../components/UI/Icons/SvgEnemy';
import SvgGroup from '../../../components/UI/Icons/SvgGroup';
import SvgTaskList from '../../../components/UI/Icons/SvgTaskList';
import SvgUnknown from '../../../components/UI/Icons/SvgUnknown';
import SvgArmory from '../../../components/UI/Icons/SvgArmory';
import SvgCave from '../../../components/UI/Icons/SvgCave';
import SvgRuins from '../../../components/UI/Icons/SvgRuins';
import SvgTavern from '../../../components/UI/Icons/SvgTavern';

const WorldMap: React.FC = () => {
    // Cambia la imagen de fondo cuando el componente se monta
    const { setBackgroundImage } = useBackground();
    setBackgroundImage(bgMapWorld);
    
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

    const itemsTipoUbgSvg: Components = {
        typeA: SvgArmory,
        typeC: SvgCave,
        typeR: SvgRuins,
        typeT: SvgTavern,
    }

    const emptyTemplate: DBMapamundi = {
        mmu_id: '', 
        mmu_sju: '', 
        mmu_esc: '',
        esc_escenario: null,
        mmu_ubi: '', 
        ubi_ubicacion: null,
        mmu_pos_x: 0, 
        mmu_pos_y: 0,
    };

    useEffect(() => {
        const loadInfo = async () => {
            const templateMap: DBMapamundi[][] = buildTemplateMap();
            console.log('params: ',params);
            
            await getMap(templateMap);

            setLoading(false);
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

            data.map((elem) => {
                if(updatedImageStageList.length === 0){
                    updatedImageStageList.push({id: elem.mmu_esc, url:''});
                }else{
                    if(updatedImageStageList[updatedImageStageList.length-1].id !== elem.mmu_esc) updatedImageStageList.push({id: elem.mmu_esc, url:''});
                }
                if(stage.esc_id === elem.mmu_esc){
                    templateMap[elem.mmu_pos_y][elem.mmu_pos_x] = elem;
                }
            });

            
            
            setListItemsMap(data);
            setCurrentStage(stage);
            setImageStageList(updatedImageStageList);
            await getMapImage(updatedImageStageList, stage.esc_id);
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

    const getIconUbi = (component:string): React.ReactElement => {
        const componentSeleted = itemsTipoUbgSvg[component];

        if (componentSeleted) {
            return React.createElement(componentSeleted, { width: 50, height: 50 });
        } else {
            return <SvgUnknown width={50} height={50} />;
        }
    }

    function openNewWindowImage(idUbi:string | undefined){
        if(idUbi === undefined) return;
        
        const path:string = 'ubicaciones/' + idUbi + '.webp';
        const { data } = supabase
        .storage
        .from('dnd-system')
        .getPublicUrl(path);
        //console.log('openNewWindowImage :', data);

        if (data !== null) {
            let myWindow = window.open("", "MsgWindow", "width=800,height=800");
            let imageHtml = "<img src='" + data.publicUrl + '?' + randomValueRefreshImage + "' style='position: absolute; top:0; left:0; width:100%; height: 100%; object-fit: cover; object-position: center top; overflow:hidden; margin: 0;' alt='Ubicacion' />";
            myWindow?.document.write(imageHtml);
        }
        return true;
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
            <StageSelector title='Listados de escenarios' imageList={imageStageList} onImageChange={handleImageStageChange}/>
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
                                                {getIconUbi('type' + elem.ubi_ubicacion?.ubi_tipo)}
                                            </div>
                                        </PopoverHandler>
                                        <PopoverContent className='p-2' placeholder=''>
                                            <aside className='card-ubi-info'>
                                                <header className='flex justify-between items-center border-b border-black py-1'>
                                                    <h6 className='text-black font-semibold '>{elem.ubi_ubicacion?.ubi_nombre}</h6>
                                                    <Tooltip className="bg-dark text-light px-2 py-1" placement="top" content={ "Encargado del local" } >
                                                        <button type="button" className='btn-card-ubi-header'>
                                                            <SvgPerson width={20} height={20} />
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip className="bg-dark text-light px-2 py-1" placement="top" content={ "Imagen de la ubicación" } >
                                                        <button type="button" className='btn-card-ubi-header' onClick={() => openNewWindowImage(elem.mmu_ubi)} >
                                                            <SvgLookImage width={20} height={20} />
                                                        </button>
                                                    </Tooltip>
                                                </header>
                                                <menu className='py-0'>
                                                    <div className='flex justify-between py-1' >
                                                        <Popover key={rowIndex + colIndex} placement="left" offset={{mainAxis: 170, crossAxis: 0, alignmentAxis:10}}>
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
                                                        <button type="button" className='btn-card-ubi'><SvgSong height={20} width={20} /></button>
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