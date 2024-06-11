import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import dbConnection from '@database/dbConnection'
import { getUrlCharacter } from '@database/dbStorage'

import { Card, CardBody, Listbox, ListboxItem, Avatar, Chip } from "@nextui-org/react";
import "@unocss/reset/tailwind.css"
import "uno.css"
import "./UserCharacters.css"

// Interfaces
import { DBPersonajesUsuario } from '@interfaces/dbTypes'
// Images
import SvgAddCharacter from '@Icons/SvgAddCharacter'
import SvgDeleteItem from '@Icons/SvgDeleteItem'
import { getDataQueryPus } from '@/components/database/dbTables'

const UserCharacters: React.FC = () => {
    const [list, setList] = useState<DBPersonajesUsuario[]>([]);
    const [user, setUser] = useState('');
    const navigate = useNavigate();
    const randomValueRefreshImage = Math.random().toString(36).substring(7);

    useEffect(() => {
        getUser().then((user) => {
            getList(user);
        });
    }, []);

    async function getUser(): Promise<string> {
        const user = '43c29fa1-d02c-4da5-90ea-51f451ed8952';
        setUser(user);
        //console.log('getUser: ', user);
        return user;
    }

    async function getList(user:string) {
        if(user === '' || user === null) return;
        
        const data = await Promise.resolve(
            getDataQueryPus(
                'pus_id, pus_usuario, pus_nombre, pus_clase, pus_raza, pus_trabajo, pus_nivel, pus_descripcion, usu_usuario(usu_id, usu_nombre), sju_sistema_juego(sju_id, sju_nombre)'
                , {'pus_usuario': user}
            )
        )
        if (data !== null) {

            await Promise.all(
                data.map(async (elem) => {
                    elem.url_character_image = await getUrlImage(elem);
                })
            );

            setList(data);
            //console.log("getList - data: " , data);
        }
    }

    async function getUrlImage(character:DBPersonajesUsuario) {
        const url = await getUrlCharacter(character.pus_usuario, character.pus_id);
        
        return url + '?' + randomValueRefreshImage;
    }

    async function handleDeleteCharacter (id: string) {
        if(!confirm('¿Seguro de que desea eliminar el personaje?')) return;

        if(id === null || id === '') return;
        
        // Eliminar objeto db
        const { error } = await dbConnection
        .from('pus_personajes_usuario')
        .delete()
        .eq('pus_id', id);

        if(error) alert('Error eliminado personaje');

        setList((prevObjects) => prevObjects.filter((obj) => obj.pus_id !== id));
    };

    const handleOpenCharacter = () => {
        navigate('/CharacterSheet/'+user);
    }

    return (
        <>
            
            <section className="min-h-screen grid grid-cols-1 grid-rows-6 gap-x-0 gap-y-4 py-4 mb-3">
                <header className='bg-white shadow-lg rounded py-2 grid items-center'>
                    <h1 className='title-list'>Listado de personajes</h1>
                </header>
                <Card className="w-full px-10 py-5 row-span-6" >
                    <CardBody>
                    <Listbox variant="flat" className='' aria-label='Listado de personajes' onAction={(key) => navigate('/CharacterSheet/'+key)}>
                        {list.map((elem) => (
                            <ListboxItem
                                key={`${elem.usu_usuario.usu_id}/${elem.pus_id}`}
                                description={elem.sju_sistema_juego.sju_nombre}
                                className='character-item flex'
                                textValue={"0"}
                                >
                                <header className='flex gap-2 items-center px-2'>
                                    <Avatar alt={elem.pus_nombre} className="flex-shrink-0" size="sm" src={elem.url_character_image} />
                                    <h1 color="dark-3" className='block antialiased tracking-normal font-sans text-2xl leading-snug text-blue-gray-900 font-black mb-1' >
                                        {elem.pus_nombre}
                                    </h1>
                                    <Chip>
                                        {elem.pus_nivel}
                                    </Chip>
                                </header>
                                <footer className=''>
                                    <p className='w-full'>
                                        {elem.pus_descripcion}
                                    </p>
                                </footer>
                            </ListboxItem>
                        ))}
                    </Listbox>
                    </CardBody>
                </Card>
            </section>
            <aside className='panel-save'>
                <button className='btn-save-character' onClick={() => handleOpenCharacter()} >
                    <SvgAddCharacter className='icon' width={40} height={40} />
                </button>
            </aside>
        </>
    );
}

export default UserCharacters;


                            {/* <Listm key={elem.pus_id} ripple={false} className='character-item flex' placeholder=''>
                                <Link to={`/CharacterSheet/${elem.usu_usuario.usu_id}/${elem.pus_id}`} className='flex flex-1'>
                                    <ListItemPrefix className='image-space' placeholder=''>
                                        <Avatar variant="circular" alt={"character Image"} src={elem.url_character_image} placeholder = ''/>
                                    </ListItemPrefix>
                                    <div className='px-2'>
                                        <Typography variant="h4" color="blue-gray" className='font-black mb-1' placeholder=''>
                                            {elem.pus_nombre}
                                        </Typography>
                                        <Typography variant="small" color="gray" className="font-normal mb-1 " placeholder=''>
                                            {elem.pus_descripcion}
                                        </Typography>
                                        <Typography variant="h6" color="gray" className="font-semibold " placeholder=''>
                                            {elem.sju_sistema_juego.sju_nombre}
                                        </Typography>
                                    </div>
                                </Link>
                                <ListItemSuffix className='flex gap-4' placeholder=''>
                                    <Chip
                                        value={elem.pus_nivel}
                                        variant="ghost"
                                        size="md"
                                        className="rounded-lg lbl-level"
                                        />
                                    <IconButton variant="text" className="btn-delete-object " onClick={() => handleDeleteCharacter(elem.pus_id)} placeholder=''>
                                        <SvgDeleteItem width={30} fill='var(--required-color)'/>
                                    </IconButton>
                                </ListItemSuffix>
                            </ListItem>Ite */}