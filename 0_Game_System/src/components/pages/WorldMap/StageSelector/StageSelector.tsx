import React from 'react'

import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react"
import "./StageSelector.css"

// Interfaces
import { stageImageList } from '@interfaces/typesCharacterSheet'
// Images
import SvgChangeItem from '@Icons/SvgChangeItem'

interface StageSelectorProps{
    title: string;
    imageList: stageImageList[];
    onImageChange: (id: string) => void;
}

const StageSelector: React.FC<StageSelectorProps> = ({title, imageList, onImageChange}) => {

    return (
        <>
            <Popover placement='left-start'>
                <PopoverTrigger className='btn-stage-selector'>
                    <button type="button" ><SvgChangeItem height={30} width={30} /></button>
                </PopoverTrigger>
                <PopoverContent >
                    <aside className='panel-stage p-0'>
                        <header className='border-b-1 border-black mb-4 text-center'>{title}</header>
                        <menu className='menu-selector'>
                            {imageList.map((elem, index) => (
                                <li key={index} className='stage-item mb-1'>
                                    <img src={elem.url} alt="Escenario" onClick={() => onImageChange(elem.id)}/>
                                </li>
                            ))}
                        </menu>
                    </aside>
                </PopoverContent>
            </Popover>
        </>
    );
};

export default StageSelector