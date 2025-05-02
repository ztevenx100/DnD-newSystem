import React, { useEffect } from 'react';
import "@unocss/reset/tailwind.css";
import "uno.css";
import "./WorldMap.css";

// Types
import { DBMapamundi } from '@components/interfaces/dbTypes';

// Feature
import { useWorldMap } from '@features/worldMap';

// Components
import ScreenLoader from '@UI/ScreenLoader/ScreenLoader';
import StageSelector from './StageSelector/StageSelector';
import AmbientSoundsSelector from './AmbientSoundsSelector/AmbientSoundsSelector';
import PlayerMap from './PlayerMap/PlayerMap';
import DiceThrower from './DiceThrower/DiceThrower';
import ItemUbi from './ItemUbi/ItemUbi';

// Images
import bgMapWorld from '@img/webp/bg-mapWorld.webp';

interface WorldMapProps {
    changeBackground: (newBackground: string) => void;
}

const WorldMap: React.FC<WorldMapProps> = ({ changeBackground }) => {
    //const params = useParams();
    const systemId = 'd127c085-469a-4627-8801-77dc7262d41b'; // TODO: Get this from params or context

    const {
        geographicalMap,
        currentStage,
        imageStage,
        imageStageList,
        loading,
        handleStageChange,
        initializeMap
    } = useWorldMap(systemId);

    useEffect(() => {
        changeBackground(bgMapWorld);
        initializeMap();
    }, [changeBackground, initializeMap]);

    return (
        <>
            {loading && <ScreenLoader/>}
            <section className="min-h-screen grid grid-cols-1 grid-rows-[80px_repeat(3,minmax(0,_1fr))] gap-x-0 gap-y-0 py-2">
                <StageSelector 
                    title='Listados de escenarios' 
                    imageList={imageStageList} 
                    onImageChange={handleStageChange}
                />
                <AmbientSoundsSelector title='Lista de sonidos' />
                <DiceThrower title='Lanzador de dados' />

                <header className='bg-white shadow-lg rounded py-0 grid items-center mb-2'>
                    <h1 className='title-list'>Mapamundi</h1>
                    <h2 className='subtitle-list'>{currentStage?.esc_nombre ?? 'Sin nombre'}</h2>
                </header>

                <article 
                    className="map-grid relative grid grid-rows-7 rounded-xl bg-blue-900 text-gray-700 shadow-md w-full px-12 py-2 row-span-5" 
                    style={{backgroundImage: imageStage ? `url("${imageStage}")` : 'none'}}
                >
                    <PlayerMap 
                        imageStage={imageStage ?? ''} 
                        title={currentStage?.esc_nombre ?? 'Sin nombre'} 
                    />
                    {geographicalMap?.map((row: DBMapamundi[], rowIndex: number) => (
                        <div key={rowIndex} className='map-grid-row grid-rows-1 grid grid-cols-11'>
                            {row?.map((elem: DBMapamundi, colIndex: number) => (
                                elem?.mmu_id !== '' ? (
                                    <ItemUbi 
                                        key={rowIndex + colIndex} 
                                        item={elem} 
                                        row={rowIndex} 
                                        col={colIndex} 
                                    />
                                ) : (
                                    <div 
                                        key={rowIndex + colIndex} 
                                        className='map-grid-col-empty grid-cols-1 border-dashed border-[#000c] border-1 text-light'
                                    />
                                )
                            ))}
                        </div>
                    ))}
                </article>
            </section>
        </>
    );
};

export default WorldMap;