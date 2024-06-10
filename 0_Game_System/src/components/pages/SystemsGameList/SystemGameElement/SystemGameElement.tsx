import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDataQuerySju } from '@/components/database/dbTables';

// Interfaces
import { DBSistemaJuego } from '@interfaces/dbTypes';

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
        if (params.id == undefined || params.id == null) return

        const data =  await Promise.resolve(
            getDataQuerySju(
                'sju_id, sju_nombre, sju_descripcion '
                , { 'sju_id': params.id }
            )
        )
        if (data !== null) {
            setGame(data[0]);
        }
    }

    return (
        <>
            <section className="min-h-screen grid grid-cols-2 grid-rows-6 gap-x-0 gap-y-4 py-4 mb-3">
                <header className='bg-white shadow-lg rounded py-2 grid items-center col-span-2'>
                    <h1 className='title-list'>{game?.sju_nombre}</h1>
                </header>
                <Card className="w-full px-10 py-5 row-span-2" placeholder=''>
                    {game?.sju_descripcion}
                </Card>
            </section>
        </>
    );
}

export default SystemGameElement;