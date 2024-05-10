import React, {useEffect, useState, ChangeEvent} from 'react';
import supabase from '@database/supabase';

import { Popover, PopoverHandler, PopoverContent, Tooltip } from "@material-tailwind/react";
import "./AmbientSoundsSelector.css";

// Interfaces
import { DBSonidoUbicacion } from '@interfaces/dbTypes';
import { itemsSoundsSvg } from '@interfaces/iconInterface';

// Funciones
import {getIcon} from '@utils/utilIcons';

// Images
import SvgWeather from '@Icons/SvgWeather';

interface AmbientSoundsSelectorProps{
    title: string;
}

const AmbientSoundsSelector: React.FC<AmbientSoundsSelectorProps> = ({title}) => {

    const [list, setList] = useState<DBSonidoUbicacion[]>([]);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [buttonActive, setButtonActive] = useState<boolean>(false);
    const [currentAudioIndex, setCurrentAudioIndex] = useState<string>('');
    const [sound, setSound] = useState<HTMLAudioElement>();
    const [volumen, setVolumen] = useState<number>(1);

    useEffect(() => {
        getList();
    }, []);

    async function getList() {
        const { data } = await supabase.from("sub_sonido_ubicacion").select('sub_son, sub_tipo, sub_icon, son_sonidos(son_id, son_nombre) ')
        .eq('sub_tipo','G')
        .eq('sub_estado','A')
        .returns<DBSonidoUbicacion[]>();
        //console.log("getList - data: " , data);
        if (data !== null) {
            await getSonuds(data);
            setList(data);
        }
    }

    async function getSonuds(soundsList:DBSonidoUbicacion[]) {
        await soundsList.map(async (sound) => {
            const { data } = await supabase
            .storage
            .from('dnd-system')
            .getPublicUrl('sonidos/' + sound.sub_son + '.mp3');
            if(data) sound.sub_sound_url = data.publicUrl ;
        })
        //console.log('getSonuds - soundsList: ', soundsList);
    }

    const playSound = (soundUrl:string, type:string) => {
        if (soundUrl) {
            try {
                const audio = new Audio(soundUrl);
                //console.log('playSound ', audio, ' type ', type);
                setSound(audio);
                
                if (!isPlaying) {
                    audio.volume = volumen;
                    audio.loop = true;
                    audio.play();
                    setIsPlaying(true);
                    setButtonActive(true);
                    setCurrentAudioIndex(type);
                } else {
                    audio.pause();
                    audio.currentTime = 0;
                    setIsPlaying(false);
                    setButtonActive(false);
                    setCurrentAudioIndex('');
                    if(sound){
                        let currentVolume = sound.volume;
                        
                        const fadeInterval = setInterval(() => {
                            currentVolume -= 0.05;
                            if (currentVolume <= 0){
                                clearInterval(fadeInterval);
                                sound.pause();
                                sound.currentTime = 0;
                            } else {
                                sound.volume = currentVolume;
                            }
                        }, 200);
                    }
                }
            } catch (error) {
                console.error('Error loading audio:', error);
            }
        }
    }

    const handleVolumeChange = (value: number) => {
        const newValue = value/100;
        console.log('sound', sound, ' volume ', value);
        
        if (sound) sound.volume = newValue;
        setVolumen(newValue);
    };

    return (
        <>
            <Popover placement='left-start'>
                <PopoverHandler className='btn-ambient-sounds-selector'>
                    <button type="button" ><SvgWeather height={30} width={30} /></button>
                </PopoverHandler>
                <PopoverContent placeholder=''>
                    <aside className='panel-sounds p-0'>
                        <header className='border-b-1 border-black mb-2 text-center'>{title}</header>
                        <label className='mb-2'>
                            <p>Volumen: {volumen*100}</p>
                            <input type="range" className='range-selector' min={0} max={100} step={10} value={volumen*100} onChange={(e: ChangeEvent<HTMLInputElement>) => handleVolumeChange(parseInt(e.target.value))} />
                        </label>
                        <menu className='menu-selector'>
                            {list.map((elem, index) => (
                                <Tooltip key={index} className="bg-dark text-light px-2 py-1" placement="top" content={ elem.son_sonidos?.son_nombre } >
                                    <button 
                                        type="button" 
                                        key={elem.sub_icon} 
                                        className={'sounds-item flex justify-center items-center ' + (buttonActive && currentAudioIndex === elem.sub_icon ? 'active':'')} 
                                        onClick={() => playSound(elem.sub_sound_url, elem.sub_icon)}
                                    >
                                        {getIcon('type' + elem.sub_icon, itemsSoundsSvg)}
                                    </button>
                                </Tooltip>
                            ))}
                        </menu>
                    </aside>
                </PopoverContent>
            </Popover>
        </>
    );
};

export default AmbientSoundsSelector;