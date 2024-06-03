import React, { useRef } from 'react';

import "@unocss/reset/tailwind.css";
import "uno.css";
import "./PlayerMap.css";

// Images
import SvgPlayerMap from '@UI/Icons/SvgPlayerMap';

// Images
import bgTab from '@img/webp/bg-tab.webp';

interface PlayerMapProps{
    imageStage: string;
    title: string;
}

const PlayerMap: React.FC<PlayerMapProps> = ({imageStage, title}) => {

    const newTabRef = useRef<Window | null>(null);
    //console.log(process.env.PUBLIC_URL);
    
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
                        <body id='bg-new-tab' style='background-image: url("${bgTab}") ' >
                            <article class='max-h-screen max-w-screen grid grid-rows-11 gap-y-4 p-5 '>
                                <section class='w-full flex overflow-hidden row-span-10 ' >
                                    <img 
                                        src='${imageStage}'
                                        id='bgStage'
                                        class='w-full object-cover object-center rounded-lg overflow-hidden '
                                        alt='Escenario' 
                                    />
                                </section>
                                <section class='row-span-1 bg-white rounded-lg' >
                                    <h1 class='h-full text-center content-center font-bold text-3xl ' >${title}</h1>
                                </section>
                            </article>
                        </body>
                    </html>
                `);
                const bgImg = newTab.document.getElementById('bg-new-tab') as HTMLBodyElement | null
                //console.log(bgTab);
                
                if(bgImg) bgImg.style.backgroundImage = `url(${bgTab})`
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