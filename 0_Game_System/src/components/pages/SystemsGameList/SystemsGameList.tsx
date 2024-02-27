import React, { useState, useEffect } from 'react';
import supabase from '../../database/supabase';
import { Link, useNavigate } from 'react-router-dom';

import { DBSistemaJuego } from '../../interfaces/dbTypes';

import { List, ListItem, Card, ListItemPrefix, Avatar, Typography, Chip, ListItemSuffix, IconButton} from "@material-tailwind/react";
import "@unocss/reset/tailwind.css";
import "uno.css";
import "./SystemsGameList.css";

const SystemsGameList: React.FC = () => {
    const [list, setList] = useState<DBSistemaJuego[]>([]);

    useEffect(() => {
        getList();
    }, []);

    async function getList() {
        const { data } = await supabase.from("sju_sistema_juego").select('sju_id, sju_nombre, sju_descripcion ')
        .returns<DBSistemaJuego[]>();
        //console.log("getList - data: " , data);
        if (data !== null) {
            //setList(data as unknown as DBPersonajesUsuario[]);
            setList(data);
            console.log("getList - data: " , data);
        }
    }

    return (
        <>
            <article className="min-h-screen grid grid-cols-1 grid-rows-6 gap-x-0 gap-y-4 py-4 mb-3">
                <header className='bg-white shadow-lg rounded py-2 grid items-center'>
                    <h1 className='title-list'>Listado de sistemas de juego</h1>
                </header>
                <Card className="w-full px-10 py-5 row-span-6" placeholder=''>
                    <List placeholder = ''>
                        {list.map((elem) => (
                            <ListItem placeholder='' ripple={false} className='character-item flex'>
                                <Link to={``} className='flex flex-1'>
                                    <div className='px-2'>
                                        <Typography variant="h4" color="blue-gray" className='font-black mb-1' placeholder=''>
                                            {elem.sju_nombre}
                                        </Typography>
                                        <Typography variant="small" color="gray" className="font-normal mb-1 " placeholder=''>
                                            {elem.sju_descripcion}
                                        </Typography>
                                    </div>
                                </Link>
                            </ListItem>
                        ))}
                    </List>
                </Card>
            </article>
        </>
    );
}

export default SystemsGameList;