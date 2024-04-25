import React, { useState }  from 'react';

import { Tooltip } from "@material-tailwind/react";
import './BtnMenuSound.css';

// Interfaces
import { Components } from '../../interfaces/typesCharacterSheet';
import { DBSonidoUbicacion } from '../../interfaces/dbTypes';

// Funciones
import {getIcon} from '../../utils/utilIcons';

interface BtnMenuSoundProps{
    list: DBSonidoUbicacion[];
    iconList:Components;
    //onFormImageFileChange: (value: string, file: File) => void;
  }

const BtnMenuSound: React.FC<BtnMenuSoundProps> = ({list, iconList}) => {

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [buttonActive, setButtonActive] = useState<boolean>(false);
    const [currentAudioIndex, setCurrentAudioIndex] = useState<string>('');
    const [sound, setSound] = useState<HTMLAudioElement>();
    const [volumen, setVolumen] = useState<number>(1);

    const playSound = (soundUrl:string, type:string, vol?:number) => {
        vol = (vol !== null && vol !== undefined)?vol:(volumen !== null && volumen !== undefined)?volumen:1;

        if (soundUrl) {
            const audio = new Audio(soundUrl);
            //console.log('playSound ', audio, ' type ', type);
            setSound(audio);
            
            if (!isPlaying) {
                audio.volume = vol;
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
        }
    }

    return (
      <>
        <menu className='menu-selector'>
            {list.map((elem, index) => (
                <Tooltip key={index} className="bg-dark text-light px-2 py-1" placement="top" content={ elem.son_sonidos?.son_nombre } >
                    <button 
                        type="button" 
                        key={elem.sub_icon} 
                        className={'sounds-item flex justify-center items-center ' + (buttonActive && currentAudioIndex === elem.sub_icon ? 'active':'')} 
                        onClick={() => playSound(elem.sub_sound_url, elem.sub_icon)}
                    >
                        {getIcon('type' + elem.sub_icon, iconList)}
                    </button>
                </Tooltip>
            ))}
        </menu>
      </>
    );
};

export default BtnMenuSound;
