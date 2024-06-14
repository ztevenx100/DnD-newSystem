import React, { useRef, useState } from 'react'
import ReactPlayer from 'react-player/youtube'

import './BtnReactPlayer.css'

interface BtnReactPlayerProps{
    url: string;
    icon: React.ReactElement;
  }

/**
 * Componente que genera un boton que reproduce musica de un link.
 * 
 * @component BtnReactPlayer
 * @param {BtnReactPlayerProps} props - Las props del componente.
 * @returns {JSX.Element} El componente renderizado.
 */
const BtnReactPlayer: React.FC<BtnReactPlayerProps> = ({url, icon}) => {
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [buttonActive, setButtonActive] = useState<boolean>(false)
  const audioRef = useRef<ReactPlayer>(null)

  const handlePlay = () => {
      setPlaying(prevPlaying => !prevPlaying);
      setButtonActive(prevButtonActive => !prevButtonActive);
      handleVolumeChange('0.8')

      if(audioRef.current) audioRef.current.seekTo(0)
  };

  const handleVolumeChange = (vol: string) => {
      setVolume(parseFloat(vol));
  };

  return (
    <>
      <button 
        type="button" 
        className={'btn-sound ' + (buttonActive ? 'active':'')} 
        onClick={handlePlay}
      >
        {icon}
      </button>
      <ReactPlayer
        ref={audioRef}
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
