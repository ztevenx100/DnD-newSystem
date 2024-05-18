import React, {useState} from 'react';

import { Popover, PopoverHandler, PopoverContent, Tooltip, Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import "@unocss/reset/tailwind.css";
import "uno.css";
import "./DiceThrower.css";

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
    const handleOpen = () => setOpen(!open);

    
   const handleOpenModal = () => {
        handleOpen();
    }
  
    async function saveData() {
        handleOpen();
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
                            <Tooltip className="bg-dark text-light px-2 py-1" placement="top" content="D4" >
                                <button 
                                    type="button" 
                                    className={'sounds-item flex justify-center items-center ' }
                                    onClick={() => handleOpenModal()}
                                >
                                    <SvgDice04 height={30} width={30} />
                                </button>
                            </Tooltip>
                            <Tooltip className="bg-dark text-light px-2 py-1" placement="top" content="D6" >
                                <button 
                                    type="button" 
                                    className={'sounds-item flex justify-center items-center ' }
                                    onClick={() => handleOpenModal()}
                                >
                                    <SvgDice06 height={30} width={30} />
                                </button>
                            </Tooltip>
                            <Tooltip className="bg-dark text-light px-2 py-1" placement="top" content="D8" >
                                <button 
                                    type="button" 
                                    className={'sounds-item flex justify-center items-center ' }
                                    onClick={() => handleOpenModal()}
                                >
                                    <SvgDice08 height={30} width={30} />
                                </button>
                            </Tooltip>
                            <Tooltip className="bg-dark text-light px-2 py-1" placement="top" content="D20" >
                                <button 
                                    type="button" 
                                    className={'sounds-item flex justify-center items-center ' }
                                    onClick={() => handleOpenModal()}
                                >
                                    <SvgDice20 height={30} width={30} />
                                </button>
                            </Tooltip>
                        </menu>
                    </aside>
                </PopoverContent>
            </Popover>
            
         {/* Modal/Dialog */}
         <Dialog
            open={ open }
            size={"lg"}
            handler={handleOpenModal}
            className="dialog "
            placeholder=''
            >
            <DialogHeader  placeholder = '' >Resumen de hoja de personaje</DialogHeader>
            <DialogBody className='dialog-body grid grid-cols-3 gap-4' placeholder = ''>
                <header></header>
            </DialogBody>
            <DialogFooter placeholder = '' >
               <Button
                  variant='text'
                  color='red'
                  onClick={() => handleOpen()}
                  className='mr-1'
                  placeholder = ''
               >
                  <span>Cancelar</span>
               </Button>
               <Button
                  variant='gradient'
                  className='btn-dialog-accept'
                  onClick={() => saveData()}
                  placeholder=''
                  id='btnSaveData'
               >
                  <span>Guardar información</span>
               </Button>
            </DialogFooter>
         </Dialog>
        </>
    );
};

export default DiceThrower;