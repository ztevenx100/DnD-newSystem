import React, { useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";
import { DBPersonajesUsuario } from '../../interfaces/dbTypes';

import { List, ListItem, Card, ListItemPrefix, Avatar, Typography } from "@material-tailwind/react";
import "@unocss/reset/tailwind.css";
import "uno.css";
import "./UserCharacters.css";

const supabase = createClient("https://ynychsxivuperghypqpz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlueWNoc3hpdnVwZXJnaHlwcXB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ0Nzk4NDksImV4cCI6MjAyMDA1NTg0OX0.tEQmoz7kM5J0P6USutj1e3gp4hLvpNyAjOzwxNy_R8k");

const UserCharacters: React.FC = () => {
    
    const [list, setList] = useState<DBPersonajesUsuario[]>([]);

    useEffect(() => {
        getList();
    }, []);

    async function getList() {
        const { data } = await supabase.from("psu_personajes_usuario").select('*');
        if (data !== null) {
            setList(data as DBPersonajesUsuario[]);
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
                */}
                <Card className="w-full p-5 row-span-4" placeholder = ''>
                    <List  placeholder = ''>
                        {list.map((elem) => (
                            <ListItem placeholder = '' key={elem.psu_id}>
                                <ListItemPrefix placeholder = ''>
                                    <Avatar variant="circular" alt="candice" src="https://docs.material-tailwind.com/img/face-1.jpg"  placeholder = ''/>
                                </ListItemPrefix>
                                <div>
                                    <Typography variant="h6" color="blue-gray" placeholder = ''>
                                        {elem.psu_nombre}
                                    </Typography>
                                    <Typography variant="small" color="gray" className="font-normal" placeholder = ''>
                                        Azar de las dos manos
                                    </Typography>
                                </div>
                            </ListItem>
                        ))}
                    </List>
                </Card>
            </article>
        </>
    );
}

export default UserCharacters;