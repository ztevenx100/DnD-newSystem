import React, { useState, useEffect } from 'react';
import supabase from '../../database/supabase';
import {Link} from 'react-router-dom';

import { DBPersonajesUsuario } from '../../interfaces/dbTypes';

import { List, ListItem, Card, ListItemPrefix, Avatar, Typography, Chip, ListItemSuffix } from "@material-tailwind/react";
import SvgAddCharacter from '../../../components/UI/Icons/SvgAddCharacter';
import "@unocss/reset/tailwind.css";
import "uno.css";
import "./UserCharacters.css";


const UserCharacters: React.FC = () => {
    
    const [list, setList] = useState<DBPersonajesUsuario[]>([]);
    const [user,setUser] = useState('');

    useEffect(() => {
        getList();
        getUser();
    }, []);

    async function getUser() {
        setUser('43c29fa1-d02c-4da5-90ea-51f451ed8952');
    }
    async function getList() {
        const { data } = await supabase.from("pus_personajes_usuario").select('pus_id, pus_usuario, pus_nombre, pus_clase, pus_raza, pus_trabajo, pus_nivel, usu_usuario(usu_id, usu_nombre)');
        console.log("data: " , data);
        if (data !== null) {
            setList(data as unknown as DBPersonajesUsuario[]);
        }
    }

    return (
        <>
            
            <article className="min-h-screen grid grid-cols-1 grid-rows-6 gap-x-0 gap-y-4 py-4 mb-3">
                <header className='bg-white shadow-lg rounded py-2 grid items-center'>
                    <h1 className='title-list'>Listado de personajes</h1>
                </header>
                {/* 
                    <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md w-full" /> 
                    <div className="flex flex-col gap-1 min-w-[240px] p-2 font-sans text-base font-normal text-blue-gray-700" /> 
                    <div className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 focus:bg-blue-gray-50 focus:bg-opacity-80 active:bg-blue-gray-50 active:bg-opacity-80 hover:text-blue-gray-900 focus:text-blue-gray-900 active:text-blue-gray-900 outline-none" /> 
                    <div className="grid place-items-center mr-4" /> 
                    <div className="inline-block relative object-cover object-center !rounded-full w-12 h-12 rounded-lg" /> 
                    <div className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900" /> 
                    <div className="block antialiased font-sans text-sm leading-normal text-gray-700 font-normal" /> 
                    <div className="grid place-items-center ml-auto justify-self-end" /> 
                    <div className="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-gray-900/10 text-gray-900 py-1 px-2 text-xs rounded-full" /> 
                */}
                <Card className="w-full p-5 row-span-4" placeholder = ''>
                    <List  placeholder = ''>
                        {list.map((elem) => (
                            <Link key={elem.pus_id} to={`/CharacterSheet/${elem.usu_usuario.usu_id}/${elem.pus_id}`}>
                                <ListItem placeholder = ''>
                                    <ListItemPrefix placeholder = ''>
                                        <Avatar variant="circular" alt="candice" src="https://docs.material-tailwind.com/img/face-1.jpg"  placeholder = ''/>
                                    </ListItemPrefix>
                                    <div className=''>
                                        <Typography variant="h5" color="blue-gray" placeholder = ''>
                                            {elem.pus_nombre}
                                        </Typography>
                                        <Typography variant="small" color="gray" className="font-normal" placeholder = ''>
                                            Azar de las dos manos
                                        </Typography>
                                        <Typography variant="h6" color="gray" className="font-normal" placeholder = ''>
                                            Azar de las dos manos
                                        </Typography>
                                    </div>
                                    <ListItemSuffix placeholder = ''>
                                        <Chip
                                        value={elem.pus_nivel}
                                        variant="ghost"
                                        size="sm"
                                        className="rounded-full"
                                        />
                                    </ListItemSuffix>
                                </ListItem>
                            </Link>
                        ))}
                    </List>
                </Card>
            </article>
            <aside className='panel-save'>
                <Link className='btn-save-character' to={`/CharacterSheet/${user}`} >
                    <SvgAddCharacter className='icon' width={50} height={50} />
                </Link>
            </aside>
        </>
    );
}

export default UserCharacters;