import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Listbox, ListboxItem, Avatar, Chip, Button } from "@nextui-org/react";

import { deleteCharacter } from '@services/UserCharactersServices';

// Interfaces
import { DBPersonajesUsuario } from '@interfaces/dbTypes';

// Images
import SvgDeleteItem from '@Icons/SvgDeleteItem';

interface ListUserCharacterProps {
    listCharacters: DBPersonajesUsuario[];
}

const ListUserCharacter: React.FC<ListUserCharacterProps> = ({listCharacters }) => {
    const navigate = useNavigate();
    const [list, setList] = useState<DBPersonajesUsuario[]>(listCharacters);

    async function handleDeleteCharacter (id: string) {
        if(!confirm('¿Seguro de que desea eliminar el personaje?')) return;

        if(id === null || id === '') return;
        
        // Eliminar objeto db
        await deleteCharacter(id);

        setList((prevObjects) => prevObjects.filter((obj) => obj.pus_id !== id));
    };

    return (
        <>
            <Listbox 
                variant="flat" 
                className='' 
                classNames={{list: 'gap-y-2'}} 
                aria-label='Listado de personajes' 
                onAction={(key) => navigate('/CharacterSheet/' + key)} 
            >
                {list.map((elem) => (
                    <ListboxItem
                        key={`${elem.usu_usuario.usu_id}/${elem.pus_id}`}
                        description={elem.sju_sistema_juego.sju_nombre}
                        className='character-item flex'
                        textValue={"0"}
                        classNames={{
                            description: '',
                            title: 'w-full whitespace-normal'
                        }}
                    >
                        <header className='flex gap-2 items-center justify-between mb-2'>
                            <div className='flex gap-2'>
                                <Avatar alt={elem.pus_nombre} className="flex-shrink-0" size="sm" src={elem.url_character_image} />
                                <h1 color="dark-3" className='block antialiased tracking-normal text-2xl leading-snug text-blue-gray-900 font-black mb-1' >
                                    {elem.pus_nombre}
                                </h1>
                            </div>
                            <div className='flex items-center'>
                                <Chip radius="sm" classNames={{base: 'lbl-level'}}>
                                    {elem.pus_nivel}
                                </Chip>
                                <Button isIconOnly className='btn-delete-object' aria-label="Like" onClick={() => handleDeleteCharacter(elem.pus_id)}>
                                    <SvgDeleteItem width={30} fill='var(--required-color)'/>
                                </Button>
                            </div>
                        </header>
                        <footer className=' '>
                            <p>
                                {elem.pus_descripcion}
                            </p>
                        </footer>
                    </ListboxItem>
                ))}
            </Listbox>
        </>
    );
}

export default ListUserCharacter;