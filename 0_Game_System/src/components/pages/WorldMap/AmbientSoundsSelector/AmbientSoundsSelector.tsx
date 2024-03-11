import React, {useEffect, useState} from 'react';
import supabase from '../../../database/supabase';

import { Popover, PopoverHandler, PopoverContent } from "@material-tailwind/react";
import "./AmbientSoundsSelector.css";

// Interfaces
import { Components } from '../../../interfaces/typesCharacterSheet';
import { DBSonidoUbicacion } from '../../../interfaces/dbTypes';
// Images
import SvgWeather from '../../../UI/Icons/SvgWeather';
import SvgUnknown from '../../../UI/Icons/SvgUnknown';
import SvgRain from '../../../UI/Icons/SvgRain';
import SvgStorm from '../../../UI/Icons/SvgStorm';
import SvgWind from '../../../UI/Icons/SvgWind';
import SvgNight from '../../../UI/Icons/SvgNight';
import SvgBonfire from '../../../UI/Icons/SvgBonfire';

interface AmbientSoundsSelectorProps{
    title: string;
    //imageList: stageImageList[];
    //onImageChange: (id: string) => void;
}

const AmbientSoundsSelector: React.FC<AmbientSoundsSelectorProps> = ({title}) => {

    const [list, setList] = useState<DBSonidoUbicacion[]>([]);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [buttonActive, setButtonActive] = useState<boolean>(false);
    const [currentAudioIndex, setCurrentAudioIndex] = useState<string>('');
    const [sound, setSound] = useState<HTMLAudioElement>();

    const itemsSoundsSvg: Components = {
        typeF: SvgBonfire,
        typeL: SvgRain,
        typeN: SvgNight,
        typeT: SvgStorm,
        typeV: SvgWind,
    }

    useEffect(() => {
        getList();
    }, []);

    async function getList() {
        const { data } = await supabase.from("sub_sonido_ubicacion").select('sub_son, sub_tipo, sub_icon, son_sonidos(son_id, son_nombre) ')
        .eq('sub_tipo','G')
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
            .getPublicUrl('sonidos/' + sound.sub_son + '.wav');
            if(data) sound.sub_sound_url = data.publicUrl ;
        })
        //console.log('getSonuds - soundsList: ', soundsList);
        
    }

    const getIconSonds = (component:string): React.ReactElement => {
        const componentSeleted = itemsSoundsSvg[component];

        if (componentSeleted) {
            return React.createElement(componentSeleted, { width: 30, height: 30 });
        } else {
            return <SvgUnknown width={30} height={30} />;
        }
    }

    const playSound = (soundUrl:string, type:string) => {
        if (soundUrl) {
            const audio = new Audio(soundUrl);
            //console.log('playSound ', audio, ' type ', type);
            setSound(audio);
            
            if (!isPlaying) {
                audio.volume = 1;
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
        }
    }

    return (
        <>
            <Popover placement='left-start'>
                <PopoverHandler className='btn-ambient-sounds-selector'>
                    <button type="button" ><SvgWeather height={30} width={30} /></button>
                </PopoverHandler>
                <PopoverContent placeholder=''>
                    <aside className='panel-sounds p-0'>
                        <header className='border-b-1 border-black mb-4 text-center'>{title}</header>
                        <menu className='menu-selector'>
                            {list.map((elem) => (
                                <button key={elem.sub_icon} className={'sounds-item flex justify-center ' + (buttonActive && currentAudioIndex === elem.sub_icon ? 'active':'')} type="button" onClick={() => playSound(elem.sub_sound_url, elem.sub_icon)}>{getIconSonds('type' + elem.sub_icon)}</button>
                            ))}
                        </menu>
                    </aside>
                </PopoverContent>
            </Popover>
        </>
    );
};

export default AmbientSoundsSelector;