import React from 'react';

import { Popover, PopoverHandler, PopoverContent } from "@material-tailwind/react";
import "./StageSelector.css";

import { stageImageList } from '../../../interfaces/typesCharacterSheet';

import SvgChangeItem from '../../../../components/UI/Icons/SvgChangeItem';

interface StageSelectorProps{
    title: string;
    imageList: stageImageList[];
    onImageChange: (id: string) => void;
}

const StageSelector: React.FC<StageSelectorProps> = ({title, imageList, onImageChange}) => {

    return (
        <>
            <Popover placement='left-start'>
                <PopoverHandler className='btn-stage-selector'>
                    <button type="button" ><SvgChangeItem height={30} width={30} /></button>
                </PopoverHandler>
                <PopoverContent placeholder=''>
                    <aside className='p-1'>
                        <header>{title}</header>
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

export default StageSelector;