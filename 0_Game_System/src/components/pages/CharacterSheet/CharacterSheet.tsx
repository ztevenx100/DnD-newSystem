import React, { useEffect, useState } from 'react';
import { Tooltip, Typography } from "@material-tailwind/react";

import FormSelectInfoPlayer from './FormSelectInfoPlayer/FormSelectInfoPlayer';
import FormCardCheckbox from './FormCardCheckbox/FormCardCheckbox';
import FornInputSkill from './FornInputSkill/FornInputSkill';

import "@unocss/reset/tailwind.css";
import "uno.css";
import "./CharacterSheet.css";

export function CharacterSheet () {
   const [characterLevel,setCharacterLevel] = useState(1);
   // Definir el estado para la selección
  const [selectedValue, setSelectedValue] = useState<string>(''); // Tipo de dato depende de lo que necesites

   const handleChangeCharacterLevel = (event: any) => {
      // Actualizar el estado con el nuevo valor ingresado por el usuario
      setCharacterLevel(event.target.value);
   };

    // Manejar el cambio en la selección
   const handleSelectChange = (value: string) => {
      setSelectedValue(value);
      // Realizar otras acciones según sea necesario
   };

   // Listado del select characterClass
    const optionsCharacterClass = [
      { value: 'WAR', name: 'Guerrero' },
      { value: 'MAG', name: 'Mago' },
      { value: 'SCO', name: 'Explorador' },
      { value: 'MED', name: 'Médico' },
      { value: 'RES', name: 'Investigador' },
      { value: 'ACT', name: 'Actor' },
    ];

   // Listado del select characterRace
    const optionsCharacterRace = [
      { value: 'HUM', name: 'Humano' },
      { value: 'ELF', name: 'Elfo' },
      { value: 'DWA', name: 'Enano' },
      { value: 'AAS', name: 'Aasimars' },
      { value: 'TIE', name: 'Tieflings' },
    ];

   // Listado del select characterJob
    const optionsCharacterJob = [
      { value: 'HUN', name: 'Cazador' },
      { value: 'BLA', name: 'Herrero' },
      { value: 'ART', name: 'Artista' },
      { value: 'SAG', name: 'Sabio' },
      { value: 'PRI', name: 'Sacerdote' },
      { value: 'STR', name: 'Estratega' },
    ];

    // Listado de characterKnowledge
   const checkboxesData = [
      { id: 'KHIS', name: 'Historia', value: 'HIS' },
      { id: 'KALC', name: 'Alquimia', value: 'ALC' },
      { id: 'KBOT', name: 'Botánica', value: 'BOT' },
      { id: 'KOCC', name: 'Ocultismo', value: 'OCC' },
      { id: 'KCRY', name: 'Criptozoología', value: 'CRY' },
      { id: 'KFOR', name: 'Fortaleza', value: 'FOR' },
      { id: 'KMED', name: 'Medium', value: 'MED' },
      { id: 'KACO', name: 'Control Animal', value: 'ACO' },
      { id: 'KARC', name: 'Arcano', value: 'ARC' },
      { id: 'KPSY', name: 'Psicología', value: 'PSY' },
      { id: 'KNSC', name: 'Ciencias Naturales', value: 'NSC' },
      { id: 'KAPP', name: 'Tasación', value: 'APP' },
   ];

   // Listado de skills
   const InputsSkillData = [
      { id: 'str', label: 'Fuerza', description: 'Su capacidad física excepcional lo distingue como un héroe. Este individuo supera los desafíos con determinación, llevando a cabo hazañas que van más allá de los límites convencionales' },
      { id: 'int', label: 'Inteligencia', description: 'Su capacidad para absorber conocimiento, procesar información y forjar juicios fundamentados. Este individuo enfrenta cada desafío con resolución, una destreza mental que va más allá de la normal' },
      { id: 'dex', label: 'Destreza', description: 'Su capacidad se manifiesta con maestría en diversas actividades, como agilidad, equilibrio, elasticidad, fuerza y coordinación. Este individuo enfrentando desafíos demostrando agilidad en cualquier tarea, se erige como un sello distintivo en todas las actividades emprendidas.' },
      { id: 'con', label: 'Constitucion', description: 'La estructura física, o constitución corporal, se define como el conjunto de características que conforman el cuerpo y que establecen las limitaciones y posibilidades individuales. A través de esta constitución, se revelan las distintivas fortalezas y potenciales, dando forma a las habilidades y oportunidades que definen la singularidad de cada individuo.' },
      { id: 'per', label: 'Percepcion', description: 'Su capacidad para interpretar las sensaciones recibidas a través de los sentidos, dando lugar a una impresión, ya sea consciente o inconsciente, de la realidad física del entorno. Se erige como el faro que guía al héroe a través del tejido de la realidad, revelando sus misterios y desafíos con una claridad incomparable.' },
      { id: 'cha', label: 'Carisma', description: 'Su capacidad se manifiesta como la capacidad natural para cautivar a los demás a través de su presencia, su palabra y su encantadora personalidad. Se convierte en la fuerza que une a las personas, dejando una huella indeleble en cada interacción y dejando una impresión imborrable en quienes se cruzan su camino.' },
   ];

   // Listado del select skillClass
   const optionsSkillClass = [
      { value: 'SSTR', name: 'Ataque de aura' },
      { value: 'SINT', name: 'Procesamiento rápido' },
      { value: 'SDEX', name: 'Golpe certero' },
      { value: 'SHEA', name: 'Primeros auxilios' },
      { value: 'SCRE', name: 'Transmutación básica' },
      { value: 'SSUP', name: 'Interpretación' },
   ];
   // Listado del select skillExtra
   const optionsSkillExtra = [
      { value: 'SE01', name: 'Defensa con múltiples armas' },
      { value: 'SE02', name: 'Ataque de oportunidad' },
      { value: 'SE03', name: 'Ataque mágico' },
      { value: 'SE04', name: 'Primeros auxilios' },
      { value: 'SE05', name: 'Transmutación básica' },
      { value: 'SE06', name: 'Supervivencia' },
      { value: 'SE07', name: 'Reanimación' },
      { value: 'SE08', name: 'Primeros auxilios' },
      { value: 'SE09', name: 'Manitas' },
      { value: 'SE10', name: 'Desarme de trampas' },
      { value: 'SE11', name: 'Agudeza social' },
      { value: 'SE12', name: 'Persuasión' },
   ];

    return (
        <form className="min-h-screen grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-3 bg-gray-2">
            
            {/* Informacion del jugador */}
            <fieldset className="fieldset-form info-player col-span-2 sm:col-span-3 bg-white shadow-md rounded">
               
               <legend>Informacion del jugador</legend>

               <label htmlFor="player" className="form-lbl col-start-1 col-end-2 bg-grey-lighter ">Jugador</label>
               <input type="text" 
                  id="player" 
                  placeholder="Nombre del jugador" 
                  className="form-input col-start-2 col-end-3 mr-2 focus:border-black focus:shadow"
                  required
               />
               <label htmlFor="character" className="form-lbl col-start-1 col-end-2 bg-grey-lighter ">Personaje</label>
               <input type="text" 
                  id="character" 
                  placeholder="Nombre del personaje" 
                  className="form-input col-start-2 col-end-3 mr-2 focus:border-black focus:shadow"
                  required
               />

               <FormSelectInfoPlayer id="characterClass" label="Clase" options={optionsCharacterClass} onSelectChange={handleSelectChange} ></FormSelectInfoPlayer>
               
               <FormSelectInfoPlayer id="characterRace" label="Raza" options={optionsCharacterRace} onSelectChange={handleSelectChange} ></FormSelectInfoPlayer>
               
               <FormSelectInfoPlayer id="characterJob" label="Trabajo" options={optionsCharacterJob} onSelectChange={handleSelectChange} ></FormSelectInfoPlayer>

               <label htmlFor="characterLevel" className="form-lbl-y col-start-1 md:col-start-3 row-start-2 md:row-start-1 bg-grey-lighter ">Nivel</label>
               <input type="number" 
                  id="characterLevel" 
                  placeholder="Nivel"
                  min="1" 
                  max="10"
                  className="form-input-y col-start-1 md:col-start-3 row-start-3 md:row-start-2 row-span-4 focus:border-black focus:shadow"
                  value={characterLevel}
                  onChange={handleChangeCharacterLevel}
                  required
               />
               <label htmlFor="characterDescription" className="form-lbl-y col-start-2 md:col-start-4 row-start-2 md:row-start-1 bg-grey-lighter ">Descripcion</label>
               <textarea 
                  id="characterDescription" 
                  placeholder="Descripcion del personaje" 
                  className="form-input-y col-start-2 md:col-start-4 row-start-3 md:row-start-2 row-span-4 focus:border-black focus:shadow"
                  required
               />
               
               <FormCardCheckbox id="characterKnowledge" label="Conocimientos" checkboxes={checkboxesData} />
                
            </fieldset>
            {/* Estadisticas del personaje */}
            <fieldset className="fieldset-form stats-player row-span-3 col-span-1 col-start-1 bg-white shadow-md rounded">
               
               <legend>Estadisticas del personaje</legend>

               {/* STRENGTH */}
               <FornInputSkill inputskill={InputsSkillData[0]} />
               
               {/* INTELLIGENCE */}
               <FornInputSkill inputskill={InputsSkillData[1]} />
               
               {/* DEXTERITY */}
               <FornInputSkill inputskill={InputsSkillData[2]} />

               {/* CONSTITUTION */}
               <FornInputSkill inputskill={InputsSkillData[3]} />
               
               {/* PERCEPTION */}
               <FornInputSkill inputskill={InputsSkillData[4]} />

               {/* CHARISMA */}
               <FornInputSkill inputskill={InputsSkillData[5]} />
                
            </fieldset>
            {/* Armamento inicial */}
            <fieldset className="fieldset-form initial-armament col-span-1 row-span-1 col-start-1 sm:col-start-2 bg-white shadow-md rounded">
               
               <legend>Armamento inicial</legend>

               <label htmlFor="mainWeapon" className="form-lbl bg-grey-lighter ">Arma principal</label>
               <input type="text" 
                  id="mainWeapon" 
                  placeholder="Arma principal" 
                  className="form-input mr-2 focus:border-black focus:shadow"
               />
               <label htmlFor="secondaryWeapon" className="form-lbl bg-grey-lighter ">Arma secundaria</label>
               <input type="text" 
                  id="secondaryWeapon" 
                  placeholder="Arma secondaria" 
                  className="form-input mr-2 focus:border-black focus:shadow"
               />

               <FormSelectInfoPlayer id="skillClass" label="Habilidad innata" options={optionsSkillClass} onSelectChange={handleSelectChange} ></FormSelectInfoPlayer>
               
               <FormSelectInfoPlayer id="skillExtra" label="Habilidad extra" options={optionsSkillExtra} onSelectChange={handleSelectChange} ></FormSelectInfoPlayer>
                
            </fieldset>
            {/* Inventario */}
            <fieldset className="fieldset-form inventory-player row-span-3 col-span-1 col-start-1 sm:col-start-3 bg-white shadow-md rounded">
               
               <legend>Inventario</legend>

               <label htmlFor="objectInput" className="form-lbl mb-2 col-span-3 bg-grey-lighter ">Bolsa</label>
               <label htmlFor="object" className="form-lbl object-item col-span-3 bg-grey-lighter "> Gema 
                  <input type="number" 
                     id="object" 
                     placeholder="Cantidad" 
                     className="form-input-count focus:border-black focus:shadow"
                  />
                  <button type="button" className="btn-delete-object">X</button>
               </label>
               <label htmlFor="object" className="form-lbl object-item col-span-3 bg-grey-lighter "> Gema 
                  <input type="number" 
                     id="object" 
                     placeholder="Cantidad" 
                     className="form-input-count focus:border-black focus:shadow"
                  />
                  <button type="button" className="btn-delete-object">X</button>
               </label>
               <input type="text" 
                  id="objectInput" 
                  placeholder="Objeto" 
                  className="form-input ml-2 col-span-2 row-span-2 focus:border-black focus:shadow"
               />
               <input type="number" 
                  id="countObject" 
                  placeholder="Cantidad" 
                  className="form-input mr-2 col-span-1 focus:border-black focus:shadow"
               />
               <button type="button" className="btn-add-object mr-2" >Añadir</button>

               <label htmlFor="goldCoins" className="form-lbl col-span-3 bg-grey-lighter ">Monedero</label>
               <label htmlFor="goldCoins" className="form-lbl-coins ml-2 col-span-1 bg-grey-lighter ">Oro</label>
               <label htmlFor="silverCoins" className="form-lbl-coins col-span-1 bg-grey-lighter ">Plata</label>
               <label htmlFor="bronzeCoins" className="form-lbl-coins mr-2 col-span-1 bg-grey-lighter ">Bronce</label>
               <input type="number" 
                  id="goldCoins" 
                  placeholder="Oro" 
                  className="form-input ml-2 col-span-1 focus:border-black focus:shadow"
               />
               <input type="number" 
                  id="silverCoins" 
                  placeholder="Plata" 
                  className="form-input col-span-1 focus:border-black focus:shadow"
               />
               <input type="number" 
                  id="bronzeCoins" 
                  placeholder="Bronce" 
                  className="form-input mr-2 col-span-1 focus:border-black focus:shadow"
               />
                
            </fieldset>
            {/* Habilidades */}
            <fieldset className="fieldset-form skills-player col-span-1 col-start-1 sm:col-start-2 bg-white shadow-md rounded">
               
               <legend>Habilidades</legend>

               <label htmlFor="alineacion" className="form-lbl mt-2 ">Alineación</label>
               <select 
                  id="alineacion"  
                  className="form-input mr-2"
               >
                  <option value=""/>
                  <option value="orden">Orden</option>
                  <option value="caos">Caos</option>
               </select>
               <label className="form-lbl-skills ml-2 mb-1 ">Nivel</label>
               <label className="form-lbl-skills mr-2 mb-1 ">Anillo de poder</label>
               <input type="text" 
                  id="levelSkill1" 
                  placeholder="Nivel"
                  className="form-input skill-level ml-2 row-span-2 focus:border-black focus:shadow"
                  value={3}
                  readOnly
               />
               <select 
                  id="skillRing1"  
                  className="form-input stats-sub mr-2"
               >
                  <option value=""/>
                  <option value="STR">Fuerza</option>
                  <option value="INT">Inteligencia</option>
                  <option value="DEX">Destreza</option>
                  <option value="HEA">Sanidad</option>
                  <option value="CRE">Creación</option>
                  <option value="SUP">Soporte</option>
               </select>
               <select 
                  id="skill1"  
                  className="form-input stats-sub mr-2"
               >
                  <option value=""/>
               </select>
               <input type="text" 
                  id="levelSkill2" 
                  placeholder="Nivel"
                  className="form-input skill-level ml-2 row-span-2 focus:border-black focus:shadow"
                  value={6}
                  readOnly
               />
               <select 
                  id="skillRing2"  
                  className="form-input stats-sub mr-2"
               >
                  <option value=""/>
                  <option value="STR">Fuerza</option>
                  <option value="INT">Inteligencia</option>
                  <option value="DEX">Destreza</option>
                  <option value="HEA">Sanidad</option>
                  <option value="CRE">Creación</option>
                  <option value="SUP">Soporte</option>
               </select>
               <select 
                  id="skill2"  
                  className="form-input stats-sub mr-2"
               >
                  <option value=""/>
               </select>
               <input type="text" 
                  id="levelSkill3" 
                  placeholder="Nivel"
                  className="form-input skill-level ml-2 row-span-2 focus:border-black focus:shadow"
                  value={9}
                  readOnly
               />
               <select 
                  id="skillRing3"  
                  className="form-input stats-sub mr-2"
               >
                  <option value=""/>
                  <option value="STR">Fuerza</option>
                  <option value="INT">Inteligencia</option>
                  <option value="DEX">Destreza</option>
                  <option value="HEA">Sanidad</option>
                  <option value="CRE">Creación</option>
                  <option value="SUP">Soporte</option>
               </select>
               <select 
                  id="skill3"  
                  className="form-input stats-sub mr-2"
               >
                  <option value=""/>
               </select>
                
            </fieldset>
            
        </form>
    )
}