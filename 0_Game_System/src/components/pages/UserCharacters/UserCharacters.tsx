import React, { useState, useEffect } from 'react';
import supabase from '../../database/supabase';
import { Link, useNavigate } from 'react-router-dom';

import { DBPersonajesUsuario } from '../../interfaces/dbTypes';

import SvgAddCharacter from '../../../components/UI/Icons/SvgAddCharacter';
import SvgDeleteItem from '../../../components/UI/Icons/SvgDeleteItem';

import { List, ListItem, Card, ListItemPrefix, Avatar, Typography, Chip, ListItemSuffix, IconButton } from "@material-tailwind/react";
import "@unocss/reset/tailwind.css";
import "uno.css";
import "./UserCharacters.css";

const UserCharacters: React.FC = () => {
    const [list, setList] = useState<DBPersonajesUsuario[]>([]);
    const [user, setUser] = useState('');
    const navigate = useNavigate();
    const randomValueRefreshImage = Math.random().toString(36).substring(7);

    useEffect(() => {
        getUser().then((user) => {
            //console.log('user: ', user);
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

        const { data } = await supabase.from("pus_personajes_usuario").select('pus_id, pus_usuario, pus_nombre, pus_clase, pus_raza, pus_trabajo, pus_nivel, pus_descripcion, usu_usuario(usu_id, usu_nombre), sju_sistema_juego(sju_id, sju_nombre)')
        .eq('pus_usuario', user)
        .returns<DBPersonajesUsuario[]>();
        //console.log("getList - data: " , data);
        if (data !== null) {
            //setList(data as unknown as DBPersonajesUsuario[]);
            setList(data);
            console.log("getList - data: " , data);
        }
    }

    function getUrlImage(character:DBPersonajesUsuario) {
        const path:string = character.pus_usuario + '/' + character.pus_id + '.webp';
        const { data } = supabase
        .storage
        .from('dnd-system')
        .getPublicUrl(path);
        //console.log('getUrlImage', data);

        if (data !== null) {
            return data.publicUrl;
        }
        return '';
    }

    async function handleDeleteCharacter (id: string) {
        if(!confirm('¿Seguro de que desea eliminar el personaje?')) return;

        if(id === null || id === '') return;
        //console.log('handleDeleteCharacter', id);
        
        // Eliminar objeto db
        const { error } = await supabase
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
                {/* 
                    <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md w-full" /> 
                    <div className="flex flex-col gap-1 min-w-[240px] p-2 font-sans text-base font-normal text-blue-gray-700" /> 
                    <div className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 focus:bg-blue-gray-50 focus:bg-opacity-80 active:bg-blue-gray-50 active:bg-opacity-80 hover:text-blue-gray-900 focus:text-blue-gray-900 active:text-blue-gray-900 outline-none" /> 
                    <div className="inline-block relative object-cover object-center !rounded-full w-12 h-12 rounded-lg" /> 
                    <div className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900" /> 
                    <div className="block antialiased font-sans text-sm leading-normal text-gray-700 font-normal" /> 
                    <div className="grid place-items-center ml-auto justify-self-end" /> 
                    <div className="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-gray-900/10 text-gray-900 py-1.5 px-3 text-xs rounded-lg" />
                    <div className="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20 btn-delete-object" /> 
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform" />
                */}
                <Card className="w-full px-10 py-5 row-span-6" placeholder=''>
                    <List placeholder = ''>
                        {list.map((elem) => (
                            <ListItem key={elem.pus_id} ripple={false} className='character-item flex' placeholder=''>
                                <Link to={`/CharacterSheet/${elem.usu_usuario.usu_id}/${elem.pus_id}`} className='flex flex-1'>
                                    <ListItemPrefix className='image-space' placeholder=''>
                                        <Avatar variant="circular" alt={"character Image"} src={getUrlImage(elem) + '?' + randomValueRefreshImage} placeholder = ''/>
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
                            </ListItem>
                        ))}
                    </List>
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