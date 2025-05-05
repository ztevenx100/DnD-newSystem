import React from 'react';
import dbConnection from '@/services/database/dbConnection'
import { getUrlLocation, getUrlNpc, getUrlEnemy } from '@/services/database/dbStorage'

import { Popover, PopoverTrigger, PopoverContent, Tooltip } from "@nextui-org/react"
import "./ItemUbi.css"

import { DBMapamundi } from '@/interfaces/dbTypes'
import BtnMenuSound from '@/components/UI/Buttons/BtnMenuSound'
import { getIcon } from '@utils/helpers/utilIcons';
import { itemsTypeUbgSvg, itemsSoundsSvg } from '@/components/utils/iconTypes'

// Images
import SvgPerson from '@/components/UI/Icons/SvgPerson'
import SvgLookImage from '@/components/UI/Icons/SvgLookImage'
import SvgSong from '@/components/UI/Icons/SvgSong'
import SvgEnemy from '@/components/UI/Icons/SvgEnemy'
import SvgGroup from '@/components/UI/Icons/SvgGroup'
import SvgTaskList from '@/components/UI/Icons/SvgTaskList'
import SvgHeart from '@/components/UI/Icons/SvgHeart';

interface ItemUbiProps{
    item: DBMapamundi;
    row: number;
    col: number;
    //onImageChange: (id: string) => void;
}

const ItemUbi: React.FC<ItemUbiProps> = ({item, row, col}) => {
    const [isOpenUbi, setIsOpenUbi] = React.useState(false)
    const [isOpenMainPnj, setIsOpenMainPnj] = React.useState(false)
    const [isOpenMis, setIsOpenMis] = React.useState(false)
    const [isOpenEne, setIsOpenEne] = React.useState(false)
    const [isOpenPnj, setIsOpenPnj] = React.useState(false)
    const [isOpenSub, setIsOpenSub] = React.useState(false)
    const randomValueRefreshImage = Math.random().toString(36).substring(7)

    const handleCloseUbi = () => {
        if (isOpenMainPnj) {
            setIsOpenUbi(true)
        } else if (isOpenMis) {
            setIsOpenUbi(true)
        } else if (isOpenEne) {
            setIsOpenUbi(true)
        } else if (isOpenPnj) {
            setIsOpenUbi(true)
        } else if (isOpenSub) {
            setIsOpenUbi(true)
        } else {
            setIsOpenUbi(false)
        }
    }

    /**
     * Obtener la URL de la imagen de la ubicación 
     * @param {string} idUbi - codigo de la ubicación.
     */
    const openNewWindowImageUbi = async(idUbi:string) => {
        if(idUbi === undefined) return
        const url:string = await Promise.resolve(getUrlLocation(idUbi))
        openNewWindowImage(url)
    }
    /**
     * Obtener la URL de la imagen de los personajes no jugables 
     * @param {string} idUbi - codigo de la ubicación.
     */
    const openNewWindowImageNpc = async(idNpc:string) => {
        if(idNpc === undefined) return
        const url:string = await Promise.resolve(getUrlNpc(idNpc))
        openNewWindowImage(url)
    }
    /**
     * Obtener la URL de la imagen de los enemigos 
     * @param {string} idUbi - codigo de la ubicación.
     */
    const openNewWindowImageEnemy = async(idEnemy:string) => {
        if(idEnemy === undefined) return
        const url:string = await Promise.resolve(getUrlEnemy(idEnemy))
        openNewWindowImage(url)
    }
    /**
     * Abre una ventana emergente con una imagen del URL enviado.
     * @param {string} url - url de la imagen.
     */
    const openNewWindowImage = (url: string) => {
        const myWindow = window.open("", "MsgWindow", "width=800,height=800");
        let imageHtml = 
            `<img 
                src='${url}?${randomValueRefreshImage}' 
                style='position: absolute; top:0; left:0; width:100%; height: 100%; object-fit: cover; object-position: center top; overflow:hidden; margin: 0;' 
                alt='Ubicacion' 
            />`
        myWindow?.document.write(imageHtml)
    }

    const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
        let isCompleted = event.target.checked
        
        const { error } = await dbConnection
        .from('mis_mision')
        .update({
            mis_cumplido: isCompleted ? 'S' : 'N',
        })
        .eq("mis_id", id)
        .select()
        if(error) alert('Stat not upload.')
    };

    return (
        <>
        {/*Location panel*/}
            <Popover key={row + col} placement="bottom" offset={5} isOpen={isOpenUbi} onOpenChange={(open) => setIsOpenUbi(open)} onClose={handleCloseUbi} >
                <PopoverTrigger>
                    <div className='map-grid-col grid-cols-1 border-dashed border-white border-2 text-light'>
                        {getIcon('type' + item.ubi_ubicacion?.ubi_tipo, itemsTypeUbgSvg, 50, 50)}
                    </div>
                </PopoverTrigger>
                <PopoverContent className='p-2' >
                    <aside className='card-ubi-info'>
                        <header className='flex justify-between items-center border-b border-black py-1'>
                            <h6 className='text-black font-semibold '>{item.ubi_ubicacion?.ubi_nombre}</h6>
                            <Tooltip className="bg-dark text-light px-2 py-1" placement="top" content={ "Imagen de la ubicación" } >
                                <button type="button" className='btn-card-ubi-header' onClick={() => openNewWindowImageUbi(item.mmu_ubi)} >
                                    <SvgLookImage width={20} height={20} />
                                </button>
                            </Tooltip>
                        </header>
                        <menu className='py-0'>
                            <div className='flex justify-between py-1' >
                                {/*PNJ main panel*/}
                                {item.lista_pnj && item.lista_pnj.length > 0 && (
                                    <Popover placement="right" offset={30} isOpen={isOpenMainPnj} onOpenChange={(open) => setIsOpenMainPnj(open)} >
                                        <PopoverTrigger>
                                            <button type="button" className='btn-card-ubi'><SvgPerson width={20} height={20} /></button>
                                        </PopoverTrigger>
                                        <PopoverContent className='popover-panel' >
                                            <article className='card-info-character'>
                                                <header className='flex justify-between items-center border-b border-black py-1 mb-1'>
                                                    <h6 className='text-black font-semibold '>Encargado del local</h6>
                                                    <button type="button" className='btn-card-character' onClick={() => openNewWindowImageNpc(item.lista_pnj[0].pnj_id)} >
                                                        <SvgLookImage width={20} height={20} />
                                                    </button>
                                                </header>
                                                <h6 className='text-center text-black font-bold ' >{item.lista_pnj[0].pnj_nombre}</h6>
                                                <h6 className='text-center text-black font-bold flex' ><SvgHeart width={20} fill='red' ></SvgHeart>{item.lista_pnj[0].pnj_vida}</h6>
                                                <p>Raza: {item.lista_pnj[0].pnj_raza}</p>
                                                <p>Clase: {item.lista_pnj[0].pnj_clase}</p>
                                                <p>Trabajo: {item.lista_pnj[0].pnj_trabajo}</p>
                                                <p>Edad: {item.lista_pnj[0].pnj_edad}</p>
                                                <table className='mt-1'>
                                                    <thead>
                                                        <tr>
                                                            <th>STR</th>
                                                            <th>INT</th>
                                                            <th>DEX</th>
                                                            <th>CON</th>
                                                            <th>PER</th>
                                                            <th>CHA</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>{item.lista_pnj[0].pnj_str}</td>
                                                            <td>{item.lista_pnj[0].pnj_int}</td>
                                                            <td>{item.lista_pnj[0].pnj_dex}</td>
                                                            <td>{item.lista_pnj[0].pnj_con}</td>
                                                            <td>{item.lista_pnj[0].pnj_per}</td>
                                                            <td>{item.lista_pnj[0].pnj_cha}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </article>
                                        </PopoverContent>
                                    </Popover>
                                )}
                            </div>
                            <div className='flex justify-between py-1' >
                                {/*MIS panel*/}
                                {item.lista_mision && item.lista_mision.length > 0 && (
                                    <Popover placement="right" offset={30} isOpen={isOpenMis} onOpenChange={(open) => setIsOpenMis(open)} >
                                        <PopoverTrigger>
                                            <button type="button" className='btn-card-ubi'><SvgTaskList height={20} width={20} /></button>
                                        </PopoverTrigger>
                                        <PopoverContent className='popover-panel' >
                                            <article className='card-ubi-info character-popover'>
                                                <header className='flex justify-between items-center border-b border-black py-1'>
                                                    <h6 className='text-black font-semibold '>Listado de misiones</h6>
                                                </header>
                                                {item.lista_mision.map((mission, index) => (
                                                    <label
                                                        htmlFor={`mission-${index}`}
                                                        key={index}
                                                        className="flex w-full cursor-pointer items-center p-1"
                                                    >
                                                        <input 
                                                            type='checkbox'
                                                            id={`mission-${index}`}
                                                            className="p-0 mr-2"
                                                            checked={mission.mis_cumplido}
                                                            onChange={(e) => handleCheckboxChange(e, mission.mis_id)}
                                                        />
                                                        {mission.mis_nombre}
                                                    </label>
                                                ))}
                                            </article>
                                        </PopoverContent>
                                    </Popover>
                                )}
                                {/*ENE panel*/}
                                {item.lista_enemigo && item.lista_enemigo.length > 0 && (
                                    <Popover placement="right" offset={30} isOpen={isOpenEne} onOpenChange={(open) => setIsOpenEne(open)} >
                                        <PopoverTrigger>
                                            <button type="button" className='btn-card-ubi'><SvgEnemy height={20} width={20} /></button>
                                        </PopoverTrigger>
                                        <PopoverContent className='popover-panel' >
                                            <article className='card-ubi-info character-popover'>
                                                <header className='flex justify-between items-center border-b border-black py-1 mb-2'>
                                                    <h6 className='text-black font-semibold '>Listado de enemigos</h6>
                                                </header>
                                                {item.lista_enemigo.map((enemy, index) => (
                                                    <Tooltip 
                                                        key={index} 
                                                        className="bg-dark text-light px-2 py-1" 
                                                        placement="bottom" 
                                                        content={ 
                                                            <div className="w-50 p-2">
                                                                <header className='flex' ><SvgHeart width={20} fill='red' ></SvgHeart>{enemy.ene_vida}</header>
                                                                <p>Raza: {enemy.ene_raza}</p>
                                                                <p>Clase: {enemy.ene_clase}</p>
                                                                <p>Trabajo: {enemy.ene_trabajo}</p>
                                                                <p>Edad: {enemy.ene_edad}</p>
                                                                <table className='w-full mt-1'>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>STR</th>
                                                                            <th>INT</th>
                                                                            <th>DEX</th>
                                                                            <th>CON</th>
                                                                            <th>PER</th>
                                                                            <th>CHA</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>{enemy.ene_str}</td>
                                                                            <td>{enemy.ene_int}</td>
                                                                            <td>{enemy.ene_dex}</td>
                                                                            <td>{enemy.ene_con}</td>
                                                                            <td>{enemy.ene_per}</td>
                                                                            <td>{enemy.ene_cha}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        } 
                                                    >
                                                        <button type="button" className='btn-character' onClick={() => openNewWindowImageEnemy(enemy.ene_id)} >
                                                            {enemy.ene_nombre}
                                                        </button>
                                                    </Tooltip>
                                                ))}
                                            </article>
                                        </PopoverContent>
                                    </Popover>
                                )}
                                {/*PNJ panel*/}
                                {item.lista_pnj && item.lista_pnj.length > 1 && (
                                    <Popover placement="right" offset={30} isOpen={isOpenPnj} onOpenChange={(open) => setIsOpenPnj(open)} >
                                        <PopoverTrigger>
                                            <button type="button" className='btn-card-ubi'><SvgGroup height={20} width={20} /></button>
                                        </PopoverTrigger>
                                        <PopoverContent className='popover-panel' >
                                            <article className='card-ubi-info character-popover'>
                                                <header className='flex justify-between items-center border-b border-black py-1 mb-2'>
                                                    <h6 className='text-black font-semibold '>Listado de personajes</h6>
                                                </header>
                                                {item.lista_pnj.slice(1)?.map((character, index) => (
                                                    <Tooltip 
                                                        key={index} 
                                                        className="bg-dark text-light px-2 py-1" 
                                                        placement="bottom" 
                                                        content={ 
                                                            <div className="w-50 p-2">
                                                                <header className='flex' ><SvgHeart width={20} fill='red' ></SvgHeart>{character.pnj_vida}</header>
                                                                <p>Raza: {character.pnj_raza}</p>
                                                                <p>Clase: {character.pnj_clase}</p>
                                                                <p>Trabajo: {character.pnj_trabajo}</p>
                                                                <p>Edad: {character.pnj_edad}</p>
                                                                <table className='w-full mt-1'>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>STR</th>
                                                                            <th>INT</th>
                                                                            <th>DEX</th>
                                                                            <th>CON</th>
                                                                            <th>PER</th>
                                                                            <th>CHA</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>{character.pnj_str}</td>
                                                                            <td>{character.pnj_int}</td>
                                                                            <td>{character.pnj_dex}</td>
                                                                            <td>{character.pnj_con}</td>
                                                                            <td>{character.pnj_per}</td>
                                                                            <td>{character.pnj_cha}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        } 
                                                    >
                                                        <button type="button" className='btn-character' onClick={() => openNewWindowImageNpc(character.pnj_id)} >
                                                            {character.pnj_nombre}
                                                        </button>
                                                    </Tooltip>
                                                ))}
                                            </article>
                                        </PopoverContent>
                                    </Popover>
                                )}
                            </div>
                            <div className='flex justify-between py-1' >
                                {item.lista_sonidos && item.lista_sonidos.length > 0 && (
                                    <Popover placement="right" offset={30} isOpen={isOpenSub} onOpenChange={(open) => setIsOpenSub(open)} >
                                        <PopoverTrigger>
                                            <button type="button" className='btn-card-ubi'><SvgSong height={20} width={20} /></button>
                                        </PopoverTrigger>
                                        <PopoverContent className='popover-panel' >
                                            <article className='card-ubi-info'>
                                                <header className='flex justify-between items-center border-b border-black py-1'>
                                                    <h6 className='text-black font-semibold '>Listado de canciones</h6>
                                                </header>
                                                <BtnMenuSound list={item.lista_sonidos} iconList={itemsSoundsSvg} />
                                            </article>
                                        </PopoverContent>
                                    </Popover>
                                )}
                            </div>
                        </menu>
                    </aside>
                </PopoverContent>
            </Popover>
        </>
    );
};

export default ItemUbi