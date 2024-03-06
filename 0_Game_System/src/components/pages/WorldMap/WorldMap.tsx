import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../database/supabase';
//import supabase from '../../database/supabase';

import { useBackground } from '../../../App';
//import { List, ListItem, Card, ListItemPrefix, Typography} from "@material-tailwind/react";
import "@unocss/reset/tailwind.css";
import "uno.css";
import "./WorldMap.css";

// Interfaces
import { DBMapamundi } from '../../interfaces/dbTypes';

import ScreenLoader from '../../../components/UI/ScreenLoader/ScreenLoader';

import bgMapWorld from '../../../assets/img/jpg/bg-mapWorld.webp';

const WorldMap: React.FC = () => {
    // Cambia la imagen de fondo cuando el componente se monta
    const { setBackgroundImage } = useBackground();
    setBackgroundImage(bgMapWorld);

    const params = useParams();
    //const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [map, setMap] = useState<DBMapamundi[][]>([]);
    //const [newRecord, setNewRecord] = useState<boolean>(true);
    //const handleOpen = () => setOpen(!open);

    useEffect(() => {
        const loadInfo = async () => {
            const templateMap: DBMapamundi[][] = buildTemplateMap();

            await getMap(templateMap);

            setLoading(false);
        }
  
        loadInfo();
     }, []);

    function buildTemplateMap(){
        const templateMap: DBMapamundi[][] = [...map];
        const temp:DBMapamundi = {
            mmu_id: '', 
            mmu_sju: '', 
            mmu_esc: '',
            mmu_ubi: '', 
            mmu_pos_x: 0, 
            mmu_pos_y: 0,
        };
        for (let i = 0; i < 7; i++) {
            templateMap.push([]);
            for (let j = 0; j < 10; j++) {
                templateMap[i].push(temp);
            }
        }
        //console.log('templateMap', templateMap);
        return templateMap;
    }

    async function getMap(templateMap: DBMapamundi[][]) {
        const { data } = await supabase.from("mmu_mapamundi").select('mmu_sju, mmu_esc, mmu_ubi, mmu_pos_x, mmu_pos_y')
           .eq("mmu_sju",'d127c085-469a-4627-8801-77dc7262d41b')
            //.eq("mmu_id",'036bd999-f79e-4203-bc93-ecce0bfdca35')
            .order('mmu_pos_x', {ascending: true})
            .returns<DBMapamundi[]>();
        console.log('getMap - data: ',data);
  
        if (data !== null) {
            data.map((elem) => (
                templateMap[elem.mmu_pos_y][elem.mmu_pos_x] = elem
            ));
            console.log('getMap ',templateMap);
            
            //const nombre = data[0].usu_nombre;
        }
        setMap(templateMap);
     }

    return (
        <>

        {loading && (
            <ScreenLoader/>
        )}
        <section className="min-h-screen grid grid-cols-1 grid-rows-6 gap-x-0 gap-y-4 py-4 mb-3">
            <header className='bg-white shadow-lg rounded py-2 grid items-center'>
                <h1 className='title-list'>Mapamundi</h1>
            </header>
            <article className="map-grid relative grid grid-rows-7 rounded-xl bg-blue-900 text-gray-700 shadow-md w-full px-10 py-5 row-span-6">
                {map.map((fila, rowIndex) => (
                    <div key={rowIndex} className='map-grid-row grid-rows-1 grid grid-cols-10 '>
                        {fila.map((elemento, colIndex) => (
                            <div key={colIndex} className='map-grid-col grid-cols-1 border-dashed border-black border-1 text-light'>
                                {elemento.mmu_ubi}
                            </div>
                        ))}
                    </div>
                ))}
            </article>
        </section>

        </>
    )
}

export default WorldMap;