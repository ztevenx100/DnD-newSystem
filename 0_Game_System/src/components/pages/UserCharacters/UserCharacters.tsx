import React, { useState, useEffect } from 'react';
import supabase from '../../database/supabase';
import { Link, useParams, useNavigate } from 'react-router-dom';

import { DBPersonajesUsuario, DBSistemaJuego } from '../../interfaces/dbTypes';

import SvgAddCharacter from '../../../components/UI/Icons/SvgAddCharacter';
import SvgDeleteItem from '../../../components/UI/Icons/SvgDeleteItem';

import { List, ListItem, Card, ListItemPrefix, Avatar, Typography, Chip, ListItemSuffix, IconButton, Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import "@unocss/reset/tailwind.css";
import "uno.css";
import "./UserCharacters.css";

const UserCharacters: React.FC = () => {
    const [list, setList] = useState<DBPersonajesUsuario[]>([]);
    const [systemGameList, setSystemGameList] = useState<DBSistemaJuego[]>([]);
    const [user, setUser] = useState('');
    const [open, setOpen] = useState<boolean>(false);
    const [systemGameValue, setSystemGameValue] = useState<string>('');

    const handleOpen = () => setOpen(!open);
    const navigate = useNavigate();

    useEffect(() => {
        getUser().then((user) => {
            //console.log('user: ', user);
            getList(user);
        });
        getGameSystemList();
    }, []);

    async function getUser(): Promise<string> {
        const user = '43c29fa1-d02c-4da5-90ea-51f451ed8952';
        setUser(user);
        //console.log('getUser: ', user);
        return user;
    }

    async function getList(user:string) {
        if(user === '' || user === null) return;

        const { data } = await supabase.from("pus_personajes_usuario").select('pus_id, pus_usuario, pus_nombre, pus_clase, pus_raza, pus_trabajo, pus_nivel, pus_descripcion, usu_usuario(usu_id, usu_nombre), sju_sistema_juego(sju_id,sju_nombre)')
        .eq('pus_usuario', user);
        console.log("data: " , data);
        if (data !== null) {
            setList(data as unknown as DBPersonajesUsuario[]);
        }
    }

    async function getGameSystemList() {
        const { data } = await supabase.from("sju_sistema_juego").select('sju_id, sju_nombre')
        .eq('sju_estado', 'A')
        .returns<DBSistemaJuego[]>();
        console.log("getGameSystemList - data: ", data);
        if (data !== null) {
            setSystemGameList(data);
        }
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

    const handleOpenModal = () => {
        handleOpen();
    }
    const handleOpenCharacter = () => {
        navigate('/CharacterSheet/'+user);
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
                    <div className="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-gray-900/10 text-gray-900 py-1.5 px-3 text-xs rounded-lg" />
                    <div className="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-blue-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 btn-delete-object" />
                */}
                <Card className="w-full p-5 row-span-6" placeholder=''>
                    <List placeholder = ''>
                        {list.map((elem) => (
                            <ListItem key={elem.pus_id} placeholder='' ripple={false} className='character-item flex'>
                                    <Link to={`/CharacterSheet/${elem.usu_usuario.usu_id}/${elem.pus_id}`} className='flex flex-1'>
                                        <ListItemPrefix placeholder=''>
                                            <Avatar variant="circular" alt="candice" src="https://docs.material-tailwind.com/img/face-1.jpg"  placeholder = ''/>
                                        </ListItemPrefix>
                                        <div className=''>
                                            <Typography variant="h4" color="blue-gray" placeholder=''>
                                                {elem.pus_nombre}
                                            </Typography>
                                            <Typography variant="small" color="gray" className="font-normal mb-1" placeholder=''>
                                                {elem.pus_descripcion}
                                            </Typography>
                                            <Typography variant="h6" color="gray" className="font-normal" placeholder=''>
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
                                        <IconButton variant="text" className="btn-delete-object" onClick={() => handleDeleteCharacter(elem.pus_id)} placeholder=''>
                                            <SvgDeleteItem width={30} fill='var(--required-color)'/>
                                        </IconButton>
                                    </ListItemSuffix>
                                </ListItem>
                        ))}
                    </List>
                </Card>
            </article>
            <aside className='panel-save'>
                <button className='btn-save-character' onClick={() => handleOpenModal()} >
                    <SvgAddCharacter className='icon' width={40} height={40} />
                </button>
            </aside>

            {/* Modal/Dialog */}
            {/* 
                <div className='grid place-items-center fixed w-screen h-screen bg-black bg-opacity-60 backdrop-blur-sm'/>
                <div className='relative bg-white m-4 rounded-lg shadow-2xl text-blue-gray-500 antialiased font-sans text-base font-light leading-relaxed w-full md:w-2/3 lg:w-2/4 2xl:w-1/3 min-w-[80%] md:min-w-[66.666667%] lg:min-w-[50%] 2xl:min-w-[33.333333%] max-w-[80%] md:max-w-[66.666667%] lg:max-w-[50%] 2xl:max-w-[33.333333%] dialog'/>
                <div className='align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg text-red-500 hover:bg-red-500/10 active:bg-red-500/30 mr-1 '/>
                <div className='align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gradient-to-tr from-green-600 to-green-400 text-white shadow-lg shadow-green-500/20 hover:shadow-lg hover:shadow-green-500/40 active:opacity-[0.85] '> 
                <div className='h-[28rem] overflow-scroll'/> 
            */}
            <Dialog
                open={ open }
                size={"sm"}
                handler={handleOpenModal}
                className="dialog"
                placeholder=''
                >
                <DialogHeader  placeholder = '' >Crear hoja de personaje</DialogHeader>
                <DialogBody className='dialog-body grid grid-cols-3 gap-4' placeholder = ''>
                    <label htmlFor="form-lbl systemGame" className=''>Sistema de juego</label>
                    <select 
                        id='systemGame' 
                        className="form-input col-span-2"
                        value={systemGameValue}
                        onChange={(e) => setSystemGameValue(e.target.value)}
                        required
                    >
                    <option value=""/>
                    {systemGameList.map((option, index) => (
                        <option key={index} value={option.sju_id}>
                            {option.sju_nombre}
                        </option>
                    ))}
            </select>
                </DialogBody>
                <DialogFooter placeholder = '' >
                    <Button
                        variant='text'
                        color='red'
                        onClick={() => handleOpen()}
                        className='mr-1'
                        placeholder = ''
                    >
                        <span>Cancelar</span>
                    </Button>
                    <Button
                        variant='gradient'
                        className='btn-dialog-accept'
                        onClick={() => handleOpenCharacter()}
                        placeholder=''
                        id='btnSaveData'
                    >
                        <span>Crear personaje</span>
                    </Button>
                </DialogFooter>
            </Dialog>

        </>
    );
}

export default UserCharacters;