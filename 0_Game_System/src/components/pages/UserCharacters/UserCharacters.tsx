import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, CardBody } from "@nextui-org/react";
import "./UserCharacters.css";

import ListUserCharacter from './ListUserCharacter/ListUserCharacter';

// Images
import SvgAddCharacter from '@Icons/SvgAddCharacter';
import ListUserCharacterSkeleton from '@/components/UI/Skeleton/ListUserCharacterSkeleton';

const UserCharacters: React.FC = () => {
    const [user, setUser] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getUser();
    }, []);

    async function getUser(): Promise<string> {
        // const user = '43c29fa1-d02c-4da5-90ea-51f451ed8951';
        const user = '43c29fa1-d02c-4da5-90ea-51f451ed8952';
        setUser(user);
        return user;
    }

    const handleOpenCharacter = () => {
        navigate('/CharacterSheet/' + user);
    }

    return (
        <>
            <section className="min-h-screen grid grid-cols-1 grid-rows-6 gap-x-0 gap-y-4 py-4 mb-3">
                <header className='bg-white shadow-lg rounded py-2 grid items-center'>
                    <h1 className='title-list'>Listado de personajes</h1>
                </header>
                <Card className="w-full px-10 py-5 row-span-6" >
                    <CardBody>
                        <Suspense fallback={<ListUserCharacterSkeleton />} >
                            <ListUserCharacter user={user} />
                        </Suspense>
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
