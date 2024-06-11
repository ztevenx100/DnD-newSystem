import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDataQuerySju } from '@/components/database/dbTables'

// Interfaces
import { DBSistemaJuego } from '@interfaces/dbTypes'

import { Card, CardBody, Listbox, ListboxItem } from "@nextui-org/react"
import "@unocss/reset/tailwind.css"
import "uno.css"
import "./SystemsGameList.css"

const SystemsGameList: React.FC = () => {
    const [list, setList] = useState<DBSistemaJuego[]>([])
    const navigate = useNavigate();

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
            setList(data)
        }
    }

    return (
        <>
            <section className="min-h-screen grid grid-cols-1 grid-rows-6 gap-x-0 gap-y-4 py-4 mb-3">
                <header className='bg-white shadow-lg rounded py-2 grid items-center'>
                    <h1 className='title-list'>Listado de sistemas de juego</h1>
                </header>
                <Card className="w-full px-10 py-5 row-span-6" >
                    <CardBody>
                        <div className="w-full max-w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
                            <Listbox variant="flat" className='character-item flex' aria-label='Listado de sistemas de juego' onAction={(key) => navigate('/SystemGameElement/'+key)}>
                                {list.map((elem, index) => (
                                    <ListboxItem
                                        key={elem.sju_id}
                                        description={elem.sju_descripcion}
                                        textValue={""+index}
                                    >
                                        <header className='flex flex-1 px-2'>
                                            <div className="grid place-items-center mr-4 image-space item-prefix rounded-lg">{index}</div>
                                            <h1 color="dark-3" className='block antialiased tracking-normal font-sans text-2xl leading-snug text-blue-gray-900 font-black mb-1' >
                                                {elem.sju_nombre}
                                            </h1>
                                        </header>
                                    </ListboxItem>
                                ))}
                            </Listbox>
                        </div>
                    </CardBody>
                </Card>
            </section>
        </>
    );
}

export default SystemsGameList