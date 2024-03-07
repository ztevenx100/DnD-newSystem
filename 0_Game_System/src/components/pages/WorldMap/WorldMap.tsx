import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../database/supabase';
//import supabase from '../../database/supabase';

import { useBackground } from '../../../App';
import { Popover, PopoverHandler, PopoverContent } from "@material-tailwind/react";
import "@unocss/reset/tailwind.css";
import "uno.css";
import "./WorldMap.css";

// Interfaces
import { Components } from '../../interfaces/typesCharacterSheet';
import { DBEscenario, DBMapamundi } from '../../interfaces/dbTypes';

import ScreenLoader from '../../../components/UI/ScreenLoader/ScreenLoader';

import bgMapWorld from '../../../assets/img/jpg/bg-mapWorld.webp';
import SvgUnknown from '../../../components/UI/Icons/SvgUnknown';
import SvgTavern from '../../../components/UI/Icons/SvgTavern';
import SvgArmory from '../../../components/UI/Icons/SvgArmory';

const WorldMap: React.FC = () => {
    // Cambia la imagen de fondo cuando el componente se monta
    const { setBackgroundImage } = useBackground();
    setBackgroundImage(bgMapWorld);
    
    const [geographicalMap, setGeographicalMap] = useState<DBMapamundi[][]>([]);
    const [listItemsMap, setListItemsMap] = useState<DBMapamundi[]>([]);
    const [currentStage, setCurrentStage] = useState<DBEscenario>({esc_id:'', esc_tipo:'', esc_nombre:''});
    const [imageStage, setImagetStage] = useState<string>('');

    const params = useParams();
    //const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const randomValueRefreshImage = Math.random().toString(36).substring(7);
    //const [newRecord, setNewRecord] = useState<boolean>(true);
    //const handleOpen = () => setOpen(!open);

    const itemsTipoUbgSvg: Components = {
        typeA: SvgArmory,
        typeT: SvgTavern,
    }

    useEffect(() => {
        const loadInfo = async () => {
            const templateMap: DBMapamundi[][] = buildTemplateMap();
            console.log('params: ',params);
            
            await getMap(templateMap);
            console.log('listItemsMap: ',listItemsMap);

            setLoading(false);
        }

        loadInfo();
     }, []);

    function buildTemplateMap(){
        const templateMap: DBMapamundi[][] = [...geographicalMap];
        const temp:DBMapamundi = {
            mmu_id: '', 
            mmu_sju: '', 
            mmu_esc: '',
            esc_escenario: null,
            mmu_ubi: '', 
            ubi_ubicacion: null,
            mmu_pos_x: 0, 
            mmu_pos_y: 0,
        };
        for (let i = 0; i < 7; i++) {
            templateMap.push([]);
            for (let j = 0; j < 11; j++) {
                templateMap[i].push(temp);
            }
        }
        //console.log('templateMap', templateMap);
        return templateMap;
    }

    async function getMap(templateMap: DBMapamundi[][]) {
        const { data } = await supabase.from("mmu_mapamundi").select('mmu_sju, mmu_esc, esc_escenario(esc_id, esc_tipo, esc_nombre), mmu_ubi, ubi_ubicacion(ubi_id, ubi_tipo, ubi_nombre),mmu_pos_x, mmu_pos_y')
           .eq("mmu_sju",'d127c085-469a-4627-8801-77dc7262d41b')
            //.eq("mmu_id",'036bd999-f79e-4203-bc93-ecce0bfdca35')
            .order('mmu_pos_x', {ascending: true})
            .order('mmu_pos_y', {ascending: true})
            .returns<DBMapamundi[]>();
        console.log('getMap - data: ',data);
  
        if (data !== null) {
            let stage:DBEscenario = data[0].esc_escenario as DBEscenario;
            data.map((elem) => (
                templateMap[elem.mmu_pos_y][elem.mmu_pos_x] = elem
            ));

            setListItemsMap(data);
            setCurrentStage(stage);
            await getMapImage(stage.esc_id);
            console.log('getMap - stage: ',stage);
        }
        console.log('getMap - ',templateMap);
        setGeographicalMap(templateMap);
    }

    async function getMapImage(idEsc:string) {
        if(idEsc === null || idEsc ===  undefined) return;
        const { data } = await supabase
        .storage
        .from('dnd-system')
        .getPublicUrl('escenarios/' + idEsc + '.webp');
        //console.log('getMapImage: ', data);
        
        setImagetStage(data.publicUrl+ '?' + randomValueRefreshImage);
    }

    const getIconUbi = (component:string): React.ReactElement => {
        const componentSeleted = itemsTipoUbgSvg[component];

        if (componentSeleted) {
            return React.createElement(componentSeleted, { width: 50, height: 50 });
        } else {
            return <SvgUnknown width={50} height={50} />;
        }
    }

    return (
        <>

        {loading && (
            <ScreenLoader/>
        )}
        <section className="min-h-screen grid grid-cols-1 grid-rows-[100px_repeat(3,minmax(0,_1fr))] gap-x-0 gap-y-0 py-4">
            <header className='bg-white shadow-lg rounded py-0 grid items-center mb-2'>
                <h1 className='title-list'>Mapamundi</h1>
                <h2 className='subtitle-list'>{currentStage.esc_nombre}</h2>
            </header>
            <article className="map-grid relative grid grid-rows-7 rounded-xl bg-blue-900 text-gray-700 shadow-md w-full px-12 py-5 row-span-5" style={{backgroundImage: `url("${imageStage}")`}}>
                {geographicalMap.map((fila, rowIndex) => (
                    <div key={rowIndex} className='map-grid-row grid-rows-1 grid grid-cols-11 '>
                        {fila.map((elemento, colIndex) => {
                            if (elemento.mmu_id !== '') {
                                return (
                                    <Popover key={rowIndex + colIndex} placement="bottom">
                                        <PopoverHandler>
                                            <div className='map-grid-col grid-cols-1 border-dashed border-white border-2 text-light'>
                                                {/* {elemento.mmu_ubi} */}
                                                {getIconUbi('type' + elemento.ubi_ubicacion?.ubi_tipo)}
                                            </div>
                                        </PopoverHandler>
                                        <PopoverContent placeholder=''>
                                            <aside className='card-ubi-info'>
                                                <header>{elemento.ubi_ubicacion?.ubi_nombre}</header>
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