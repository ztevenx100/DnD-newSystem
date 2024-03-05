import React, { useState, useEffect } from 'react';
//import supabase from '../../database/supabase';

import { useBackground } from '../../../App';
//import { List, ListItem, Card, ListItemPrefix, Typography} from "@material-tailwind/react";
import "@unocss/reset/tailwind.css";
import "uno.css";
import "./WorldMap.css";

import bgMapWorld from '../../../assets/img/jpg/bg-mapWorld.webp';

const WorldMap: React.FC = () => {
    // Cambia la imagen de fondo cuando el componente se monta
    const { setBackgroundImage } = useBackground();
    setBackgroundImage(bgMapWorld);

    //const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [map, setMap] = useState<string[][]>([]);
    //const [newRecord, setNewRecord] = useState<boolean>(true);
    //const handleOpen = () => setOpen(!open);

    useEffect(() => {
        const loadInfo = async () => {
            buildMap();
            setLoading(false);

        }
  
        loadInfo();
     }, []);

    function buildMap(){
        const templateMap: string[][] = [...map];
        for (let i = 0; i < 7; i++) {
            templateMap.push([]);
            for (let j = 0; j < 8; j++) {
                templateMap[i].push(' - ');
                //templateMap[i][j] = '';
            }
        }
        console.log('templateMap', templateMap);
        setMap(templateMap);
    }

    return (
        <>

        {loading && (
            <aside className='screen-loader'>
                <span className='loader'></span>
            </aside>
        )}
        <section className="min-h-screen grid grid-cols-1 grid-rows-6 gap-x-0 gap-y-4 py-4 mb-3">
            <header className='bg-white shadow-lg rounded py-2 grid items-center'>
                <h1 className='title-list'>Mapamundi</h1>
            </header>
            <article className="relative grid grid-rows-7 rounded-xl bg-blue-900 text-gray-700 shadow-md w-full px-10 py-5 row-span-6">
                {map.map((fila, rowIndex) => (
                    <div key={rowIndex} className='grid-rows-1 grid grid-cols-8 '>
                        {fila.map((elemento, colIndex) => (
                            <div key={colIndex} className='grid-cols-1 border-dashed border-black border-2'>{elemento}</div>
                        ))}
                    </div>
                ))}
            </article>
        </section>

        </>
    )
}

export default WorldMap;