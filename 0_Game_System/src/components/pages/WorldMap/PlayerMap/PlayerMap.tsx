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
            const textMap = newTabRef.current.document.getElementById('textStage') as HTMLBodyElement | null
            if(textMap) textMap.innerHTML = title
            
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
                        <body id='bgNewTab' style='background-image: url("${bgTab}") ' >
                            <article class='max-h-screen max-w-screen grid grid-rows-12 gap-y-4 p-5 '>
                                <section class='w-full flex overflow-hidden row-span-12 row-start-1 col-start-1 ' >
                                    <img 
                                        src='${imageStage}'
                                        id='bgStage'
                                        class='w-full object-cover object-center rounded-lg overflow-hidden '
                                        alt='Escenario' 
                                    />
                                </section>
                                <section class='lbl-stage row-span-2 row-start-11 col-start-1 bg-white rounded-lg border-b-black z-1 mx-48 my-5' >
                                    <h1 id='textStage' class='h-full text-center content-center font-bold text-3xl ' >${title}</h1>
                                </section>
                            </article>
                            <style>
                                .lbl-stage{
                                    animation: 2s ease 0s normal forwards 1 fadein;
                                }
                                @keyframes fadein{
                                    0% { opacity:0; }
                                    66% { opacity:0; }
                                    100% { opacity:1; }
                                }
                            </style>
                        </body>
                    </html>
                `);
                const bgImg = newTab.document.getElementById('bgNewTab') as HTMLBodyElement | null
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