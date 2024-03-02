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
    //const [newRecord, setNewRecord] = useState<boolean>(true);
    //const handleOpen = () => setOpen(!open);

    useEffect(() => {
        const loadInfo = async () => {
            setLoading(false);
        }
  
        loadInfo();
     }, []);

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
            <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md w-full px-10 py-5 row-span-6">

            </div>
        </section>

        </>
    )
}

export default WorldMap;