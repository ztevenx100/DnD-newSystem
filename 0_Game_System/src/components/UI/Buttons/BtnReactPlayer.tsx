import React, { useState } from 'react'
import ReactPlayer from 'react-player/youtube'

import './BtnReactPlayer.css'

interface BtnReactPlayerProps{
    url: string;
  }

/**
 * Componente que genera un panel con varias opciones de sonido.
 * 
 * @component BtnMenuSound
 * @param {BtnMenuSoundProps} props - Las props del componente.
 * @returns {JSX.Element} El componente renderizado.
 */
const BtnReactPlayer: React.FC<BtnReactPlayerProps> = ({url}) => {
    const [playing, setPlaying] = useState(false)
    const [volume, setVolume] = useState(0.8)
  
    const handlePlay = () => {
        setPlaying(prevPlaying => !prevPlaying);
        handleVolumeChange('0.8')
    };

    const handleVolumeChange = (vol: string) => {
        setVolume(parseFloat(vol));
    };

    return (
      <>
        <button className='btn-sound' onClick={handlePlay}>
            Play Audio
        </button>
        <ReactPlayer
            url={url}
            playing={playing}
            volume={volume}
            controls={false}
            width="0"
            height="0"
            config={{
            }}
        />
      </>
    );
};

export default BtnReactPlayer
