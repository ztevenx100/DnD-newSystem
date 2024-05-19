import React, {useState, ChangeEvent} from 'react';

import { Popover, PopoverHandler, PopoverContent, Tooltip, Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import "@unocss/reset/tailwind.css";
import "uno.css";
import "./DiceThrower.css";

// Funciones
import {validateNumeric} from '@utils/utilConversions';

// Images
import SvgRollDice from '@Icons/SvgRollDice';
import SvgDice04 from '@Icons/SvgDice04';
import SvgDice06 from '@Icons/SvgDice06';
import SvgDice08 from '@Icons/SvgDice08';
import SvgDice20 from '@Icons/SvgDice20';

interface DiceThrowerProps{
    title: string;
}

const DiceThrower: React.FC<DiceThrowerProps> = ({title}) => {

    //const [list, setList] = useState<DBSonidoUbicacion[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [countDices, setCountDices] = useState<number[]>([0,0,0,0]);
    const [dices, setDices] = useState<diceInfo[]>([]);
    const handleOpen = () => setOpen(!open);
    
    interface diceInfo{
        id: string;
        count: number;
        style:string;
        value:number;
    }

    const getRandomInt = (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const handleOpenModal = () => {
        let updatedDices = [];

        for (let i = 0; i < countDices[0]; i++) {
            updatedDices.push({id:'D4', count: countDices[0], style: "dice-container d4", value: getRandomInt(1,4)});
        }

        for (let i = 0; i < countDices[1]; i++) {
            updatedDices.push({id:'D6', count: countDices[1], style: "dice-container d6", value: getRandomInt(1,6)});
        }

        for (let i = 0; i < countDices[2]; i++) {
            updatedDices.push({id:'D8', count: countDices[2], style: "dice-container d8", value: getRandomInt(1,4)});
        }

        for (let i = 0; i < countDices[3]; i++) {
            updatedDices.push({id:'D20', count: countDices[3], style: "dice-container d20", value: getRandomInt(1,20)});
        }
        
        setDices(updatedDices);
        handleOpen();
    }

    const handleCountDice = (index: number, value: string) => {
        let numericValue = validateNumeric(value);
        const updatedDices = [...countDices];
        updatedDices[index] = numericValue;
        //console.log(updatedDices);
        setCountDices(updatedDices);
        
    }
  
    return (
        <>
            <Popover placement='left-start'>
                <PopoverHandler className='btn-dice-thrower-selector'>
                    <button type="button" ><SvgRollDice height={30} width={30} /></button>
                </PopoverHandler>
                <PopoverContent placeholder=''>
                    <aside className='panel-sounds p-0'>
                        <header className='border-b-1 border-black mb-4 text-center'>{title}</header>
                        <menu className='menu-selector'>
                            <input 
                                type='text' 
                                name='txtD4' 
                                id='txtD4'
                                placeholder='D4'
                                className=''
                                maxLength={1}
                                value={countDices[0]} 
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleCountDice(0, e.target.value)} 
                            />
                            <Tooltip className="bg-dark text-light px-2 py-1" placement="top" content="D4" >
                                <button 
                                    type="button" 
                                    className={'sounds-item flex justify-center items-center ' }
                                    onClick={() => handleOpenModal()}
                                >
                                    <SvgDice04 height={30} width={30} />
                                </button>
                            </Tooltip>
                            <input 
                                type='text'
                                name='txtD6'
                                id='txtD6'
                                placeholder='D6'
                                className=''
                                maxLength={1}
                                value={countDices[1]} 
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleCountDice(1, e.target.value)} 
                            />
                            <Tooltip className="bg-dark text-light px-2 py-1" placement="top" content="D6" >
                                <button 
                                    type="button" 
                                    className={'sounds-item flex justify-center items-center ' }
                                    onClick={() => handleOpenModal()}
                                >
                                    <SvgDice06 height={30} width={30} />
                                </button>
                            </Tooltip>
                            <input 
                                type='text'
                                name='txtD8'
                                id='txtD8'
                                placeholder='D8'
                                className=''
                                maxLength={2}
                                value={countDices[2]} 
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleCountDice(2, e.target.value)} 
                            />
                            <Tooltip className="bg-dark text-light px-2 py-1" placement="top" content="D8" >
                                <button 
                                    type="button" 
                                    className={'sounds-item flex justify-center items-center ' }
                                    onClick={() => handleOpenModal()}
                                >
                                    <SvgDice08 height={30} width={30} />
                                </button>
                            </Tooltip>
                            <input 
                                type='text'
                                name='txtD20'
                                id='txtD20'
                                placeholder='D20'
                                className=''
                                maxLength={2}
                                value={countDices[3]} 
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleCountDice(3, e.target.value)} 
                            />
                            <Tooltip className="bg-dark text-light px-2 py-1" placement="top" content="D20" >
                                <button 
                                    type="button" 
                                    className={'sounds-item flex justify-center items-center ' }
                                    onClick={() => handleOpenModal()}
                                >
                                    <SvgDice20 height={30} width={30} />
                                </button>
                            </Tooltip>
                            <button 
                                type="button" 
                                className={'btn-dice flex justify-center items-center ' }
                                onClick={() => handleOpenModal()}
                            >
                                Lanzar dados
                            </button>
                        </menu>
                    </aside>
                </PopoverContent>
            </Popover>
            
         {/* Modal/Dialog */}
         <Dialog
            open={ open }
            size={"sm"}
            handler={handleOpenModal}
            className="dialogDice "
            placeholder=''
        >
            <DialogHeader placeholder='' >Dados lanzados</DialogHeader>
            <DialogBody className='dialog-body grid grid-cols-3 gap-4' placeholder=''>
                <article className='flex justify-between gap-1 col-span-3'>
                {dices?.map((dice, index) => (
                    <div key={index} className={dice.style} >
                        <p>{dice.value}</p>
                    </div>
                ))}
                </article>
            </DialogBody>
            <DialogFooter placeholder='' >
               <Button
                  variant='text'
                  color='red'
                  onClick={() => handleOpen()}
                  className=''
                  placeholder = ''
               >
                  <span>Cerrar</span>
               </Button>
            </DialogFooter>
         </Dialog>
        </>
    );
};

export default DiceThrower;