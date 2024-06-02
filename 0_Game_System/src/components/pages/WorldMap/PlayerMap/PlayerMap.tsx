import React, { useRef } from 'react';

import "@unocss/reset/tailwind.css";
import "uno.css";
import "./PlayerMap.css";

// Images
import SvgPlayerMap from '@UI/Icons/SvgPlayerMap';

interface PlayerMapProps{
    imageStage: string;
}

const PlayerMap: React.FC<PlayerMapProps> = ({imageStage}) => {

    const newTabRef = useRef<Window | null>(null);
    const openUserStage = () =>{
        let data = {url:imageStage,title:'imagen'}
        if (newTabRef.current && !newTabRef.current.closed) {
            // Si la pestaña ya está abierta, actualiza la imagen
            
            const imgElement = newTabRef.current.document.getElementById('bgStage') as HTMLImageElement | null;
            if (imgElement) imgElement.src = imageStage;
            
            newTabRef.current.postMessage(data, window.location.origin);
          } else {
            // Si la pestaña no está abierta, ábrela
            const newTab = window.open(imageStage, '_blank');
            if (newTab) {
                newTab.document.write(`
                    <!DOCTYPE html>
                    <html lang="en">
                        <head>
                            <meta charset="UTF-8" />
                            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                            <title>Mapa del jugador</title>
                            <script src="https://cdn.tailwindcss.com"></script>
                        </head>
                        <body>
                            <article class='max-h-screen max-w-screen' >
                                <section class='w-full m-10' >
                                    <img 
                                        src='${imageStage}'
                                        id='bgStage'
                                        class='relative top-0 left-0 w-full h-full object-cover object-top overflow-hidden m-0 '
                                        alt='Escenario' 
                                    />
                                </section>
                                <section>
                                    <h1></h1>
                                </section>
                            </article>
                        </body>
                    </html>
                `);
                //newTab.document.close();
            }
            newTabRef.current = newTab;
          }
    }

    return (
        <>
        
            <button 
                type="button" 
                className='btn-link-player-map'
                onClick={openUserStage}
            >
                <SvgPlayerMap height={30} width={30}/>
            </button>

        </>
    );
};

export default PlayerMap;