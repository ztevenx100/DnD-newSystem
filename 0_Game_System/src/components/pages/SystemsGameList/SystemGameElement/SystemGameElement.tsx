import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../../database/supabase';

import { DBSistemaJuego } from '../../../interfaces/dbTypes';

import { Card } from "@material-tailwind/react";
import "@unocss/reset/tailwind.css";
import "uno.css";
import "./SystemGameElement.css";

const SystemGameElement: React.FC = () => {
    const [game, setGame] = useState<DBSistemaJuego>();
    // Cargue de informacion de base de datos
    const params = useParams();
    
    useEffect(() => {
        getGame();
    }, []);

    async function getGame() {
        const { data } = await supabase.from("sju_sistema_juego").select('sju_id, sju_nombre, sju_descripcion ')
        .eq("sju_id",params.id)
        .returns<DBSistemaJuego[]>();
        //console.log("getGame - data: " , data);
        if (data !== null) {
            setGame(data[0]);
            //console.log("getGame - data: " , data);
        }
    }

    return (
        <>
            <article className="min-h-screen grid grid-cols-2 grid-rows-6 gap-x-0 gap-y-4 py-4 mb-3">
                <header className='bg-white shadow-lg rounded py-2 grid items-center col-span-2'>
                    <h1 className='title-list'>{game?.sju_nombre}</h1>
                </header>
                <Card className="w-full px-10 py-5 row-span-2" placeholder=''>
                    {game?.sju_descripcion}
                </Card>
            </article>
        </>
    );
}

export default SystemGameElement;