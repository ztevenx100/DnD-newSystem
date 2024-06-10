import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { getDataQuerySju } from '@/components/database/dbTables'

// Interfaces
import { DBSistemaJuego } from '@interfaces/dbTypes'

import { List, ListItem, Card, ListItemPrefix, Typography } from "@material-tailwind/react"
import "@unocss/reset/tailwind.css";
import "uno.css";
import "./SystemsGameList.css";

const SystemsGameList: React.FC = () => {
    const [list, setList] = useState<DBSistemaJuego[]>([]);

    useEffect(() => {
        getList();
    }, []);

    async function getList() {
        const data =  await Promise.resolve(
            getDataQuerySju(
                'sju_id, sju_nombre, sju_descripcion '
            )
        )

        if (data !== null) {
            setList(data);
            //console.log("getList - data: " , data);
        }
    }

    return (
        <>
            <section className="min-h-screen grid grid-cols-1 grid-rows-6 gap-x-0 gap-y-4 py-4 mb-3">
                <header className='bg-white shadow-lg rounded py-2 grid items-center'>
                    <h1 className='title-list'>Listado de sistemas de juego</h1>
                </header>
                <Card className="w-full px-10 py-5 row-span-6" placeholder=''>
                    <List placeholder = ''>
                        {list.map((elem, index) => (
                            <ListItem key={index} placeholder='' ripple={false} className='character-item flex'>
                                <Link to={`/SystemGameElement/${elem.sju_id}`} className='flex flex-1'>
                                    <ListItemPrefix className='image-space item-prefix rounded-lg' placeholder=''>
                                        {index}
                                    </ListItemPrefix>
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
            </section>
        </>
    );
}

export default SystemsGameList;