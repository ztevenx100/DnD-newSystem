import React, { useState }  from 'react'

import { Tooltip } from "@nextui-org/react"
import './BtnMenuSound.css'

// Interfaces
import { Components } from '@shared/utils/types/typesCharacterSheet';
import { DBSonidoUbicacion } from '@shared/utils/types';

// Components
import BtnReactPlayer from '@UI/Buttons/BtnReactPlayer';

// Funciones
import { getIcon } from '@utils/helpers/utilIcons';

interface BtnMenuSoundProps{
    list: DBSonidoUbicacion[];
    iconList:Components;
  }

/**
 * Componente que genera un panel con varias opciones de sonido.
 * 
 * @component BtnMenuSound
 * @param {BtnMenuSoundProps} props - Las props del componente.
 * @returns {JSX.Element} El componente renderizado.
 */
const BtnMenuSound: React.FC<BtnMenuSoundProps> = ({list, iconList}) => {

    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [buttonActive, setButtonActive] = useState<boolean>(false)
    const [currentAudioIndex, setCurrentAudioIndex] = useState<string>('')
    const [sound, setSound] = useState<HTMLAudioElement>()

    const playSound = (soundUrl:string, type:string, vol?:number) => {
        vol = (vol !== null && vol !== undefined)?vol:1

        if (soundUrl) {
            const audio = new Audio(soundUrl)
            setSound(audio)
            
            if (!isPlaying) {
                audio.volume = vol
                audio.loop = true
                audio.play()
                
                setIsPlaying(true)
                setButtonActive(true)
                setCurrentAudioIndex(type)
            } else {
                audio.pause()
                audio.currentTime = 0
                setIsPlaying(false)
                setButtonActive(false)
                setCurrentAudioIndex('')
                if(sound){
                    let currentVolume = sound.volume
                    
                    const fadeInterval = setInterval(() => {
                        currentVolume -= 0.05
                        if (currentVolume <= 0){
                            clearInterval(fadeInterval)
                            sound.pause()
                            sound.currentTime = 0
                        } else {
                            sound.volume = currentVolume
                        }
                    }, 200)
                }
            }
        }
    }

    return (
      <>
        <menu className='menu-sound-selector mt-2'>
            {list.map((elem, index) => (
                elem.sub_tipo === 'U' ? (
                    <Tooltip key={index} className="bg-dark text-light px-2 py-1" placement="top" content={ elem.son_sonidos?.son_nombre } >
                        <button 
                            type="button" 
                            key={elem.sub_icon} 
                            className={'sounds-item flex justify-center items-center ' + (buttonActive && currentAudioIndex === elem.sub_icon ? 'active':'')} 
                            onClick={() => elem.sub_sound_url && playSound(elem.sub_sound_url, elem.sub_icon)}
                        >
                            {getIcon('type' + elem.sub_icon, iconList)}
                        </button>
                    </Tooltip>
                ) : (
                    elem.sub_sound_url && <BtnReactPlayer key={index} url={elem.sub_sound_url} icon={getIcon('type' + elem.sub_icon, iconList)} />
                )
            ))}
        </menu>
      </>
    );
};

export default BtnMenuSound
