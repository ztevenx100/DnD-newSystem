import { Tooltip
   , Checkbox
   , Card
   , List
   , ListItem
   , ListItemPrefix
   , Typography
  } from "@material-tailwind/react";

import "@unocss/reset/tailwind.css";
import "uno.css";
import "./Home.css";

export function Home () {
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
               <label htmlFor="characterClass" className="form-lbl col-start-1 col-end-2 bg-grey-lighter ">Clase</label>
               <select 
                  id="characterClass" 
                  className="form-input col-start-2 col-end-3 mr-2"
                  required
               >
                  <option value=""/>
                  <option value="guerrero">Guerrero</option>
                  <option value="mago">Mago</option>
                  <option value="explorador">Explorador</option>
                  <option value="medico">Médico</option>
                  <option value="investigador">Investigador</option>
                  <option value="actor">Actor</option>
               </select>
               <label htmlFor="characterRace" className="form-lbl col-start-1 col-end-2 bg-grey-lighter ">Raza</label>
               <select 
                  id="characterRace" 
                  className="form-input col-start-2 col-end-3 mr-2"
                  required
               >
                  <option value=""/>
                  <option value="humano">Humano</option>
                  <option value="elfo">Elfo</option>
                  <option value="enano">Enano</option>
                  <option value="aasimars">Aasimars</option>
                  <option value="tieflings">Tieflings</option>
               </select>
               <label htmlFor="characterJob" className="form-lbl col-start-1 col-end-2 bg-grey-lighter ">Trabajo</label>
               <select 
                  id="characterJob" 
                  className="form-input col-start-2 col-end-3 mr-2"
                  required
               >
                  <option value=""/>
                  <option value="cazador">Cazador</option>
                  <option value="herrero">Herrero</option>
                  <option value="artista">Artista</option>
                  <option value="sabio">Sabio</option>
                  <option value="sacerdote">Sacerdote</option>
                  <option value="estratega">Estratega</option>
               </select>
               <label htmlFor="characterLevel" className="form-lbl-y col-start-1 md:col-start-3 row-start-2 md:row-start-1 bg-grey-lighter ">Nivel</label>
               <input type="number" 
                  id="characterLevel" 
                  placeholder="Nivel"
                  min="1" 
                  max="10"
                  className="form-input-y col-start-1 md:col-start-3 row-start-3 md:row-start-2 row-span-4 focus:border-black focus:shadow"
                  required
               />
               <label htmlFor="characterDescription" className="form-lbl-y col-start-2 md:col-start-4 row-start-2 md:row-start-1 bg-grey-lighter ">Descripcion</label>
               <textarea 
                  id="characterDescription" 
                  placeholder="Descripcion del personaje" 
                  className="form-input-y col-start-2 md:col-start-4 row-start-3 md:row-start-2 row-span-4 focus:border-black focus:shadow"
                  required
               />
               <label htmlFor="characterDescription" className="form-lbl-y col-start-1 md:row-start-6 col-span-2 md:col-span-4 bg-grey-lighter ">Conocimientos</label>
               <Card className="flex flex-row flex-wrap flex justify-around col-start-1 col-span-2 md:col-span-4 row-span-2 ml-2 mr-2 border-1 border-black">

                  <List className="flex-row">
                     <ListItem className="p-0">
                        <label htmlFor="jobHIS" className="flex w-full cursor-pointer items-center " >
                           <ListItemPrefix className="mr-2">
                              <Checkbox id="jobHIS" ripple={false} className="hover:before:opacity-0" crossOrigin="" value="HIS" />
                           </ListItemPrefix>
                           <Typography color="blue-gray" className="font-medium mr-2">Historia</Typography>
                        </label>
                     </ListItem>
                  </List>
                  <List className="flex-row">
                     <ListItem className="p-0">
                        <label htmlFor="jobALQ" className="flex w-full cursor-pointer items-center " >
                           <ListItemPrefix className="mr-2">
                              <Checkbox id="jobALQ" ripple={false} className="hover:before:opacity-0" crossOrigin="" value="ALQ" />
                           </ListItemPrefix>
                           <Typography color="blue-gray" className="font-medium mr-2">Alquimia</Typography>
                        </label>
                     </ListItem>
                  </List>
                  <List className="flex-row">
                     <ListItem className="p-0">
                        <label htmlFor="jobBOT" className="flex w-full cursor-pointer items-center " >
                           <ListItemPrefix className="mr-2">
                              <Checkbox id="jobBOT" ripple={false} className="hover:before:opacity-0" crossOrigin="" value="BOT" />
                           </ListItemPrefix>
                           <Typography color="blue-gray" className="font-medium mr-2">Botánica</Typography>
                        </label>
                     </ListItem>
                  </List>
                  <List className="flex-row">
                     <ListItem className="p-0">
                        <label htmlFor="jobOCU" className="flex w-full cursor-pointer items-center " >
                           <ListItemPrefix className="mr-2">
                              <Checkbox id="jobOCU" ripple={false} className="hover:before:opacity-0" crossOrigin="" value="OCU" />
                           </ListItemPrefix>
                           <Typography color="blue-gray" className="font-medium mr-2">Ocultismo</Typography>
                        </label>
                     </ListItem>
                  </List>
                  <List className="flex-row">
                     <ListItem className="p-0">
                        <label htmlFor="jobCRI" className="flex w-full cursor-pointer items-center " >
                           <ListItemPrefix className="mr-2">
                              <Checkbox id="jobCRI" ripple={false} className="hover:before:opacity-0" crossOrigin="" value="CRI" />
                           </ListItemPrefix>
                           <Typography color="blue-gray" className="font-medium mr-2">Criptozoología</Typography>
                        </label>
                     </ListItem>
                  </List>
                  <List className="flex-row">
                     <ListItem className="p-0">
                        <label htmlFor="jobFOR" className="flex w-full cursor-pointer items-center " >
                           <ListItemPrefix className="mr-2">
                              <Checkbox id="jobFOR" ripple={false} className="hover:before:opacity-0" crossOrigin="" value="FOR" />
                           </ListItemPrefix>
                           <Typography color="blue-gray" className="font-medium mr-2">Fortaleza</Typography>
                        </label>
                     </ListItem>
                  </List>
                  <List className="flex-row">
                     <ListItem className="p-0">
                        <label htmlFor="jobMED" className="flex w-full cursor-pointer items-center " >
                           <ListItemPrefix className="mr-2">
                              <Checkbox id="jobMED" ripple={false} className="hover:before:opacity-0" crossOrigin="" value="MED" />
                           </ListItemPrefix>
                           <Typography color="blue-gray" className="font-medium mr-2">Medium</Typography>
                        </label>
                     </ListItem>
                  </List>
                  <List className="flex-row">
                     <ListItem className="p-0">
                        <label htmlFor="jobCAN" className="flex w-full cursor-pointer items-center " >
                           <ListItemPrefix className="mr-2">
                              <Checkbox id="jobCAN" ripple={false} className="hover:before:opacity-0" crossOrigin="" value="CAN" />
                           </ListItemPrefix>
                           <Typography color="blue-gray" className="font-medium mr-2">Control Animal</Typography>
                        </label>
                     </ListItem>
                  </List>
                  <List className="flex-row">
                     <ListItem className="p-0">
                        <label htmlFor="jobARC" className="flex w-full cursor-pointer items-center " >
                           <ListItemPrefix className="mr-2">
                              <Checkbox id="jobARC" ripple={false} className="hover:before:opacity-0" crossOrigin="" value="ARC" />
                           </ListItemPrefix>
                           <Typography color="blue-gray" className="font-medium mr-2">Arcano</Typography>
                        </label>
                     </ListItem>
                  </List>
                  <List className="flex-row">
                     <ListItem className="p-0">
                        <label htmlFor="jobPSI" className="flex w-full cursor-pointer items-center " >
                           <ListItemPrefix className="mr-2">
                              <Checkbox id="jobPSI" ripple={false} className="hover:before:opacity-0" crossOrigin="" value="PSI" />
                           </ListItemPrefix>
                           <Typography color="blue-gray" className="font-medium mr-2">Psicología</Typography>
                        </label>
                     </ListItem>
                  </List>
                  <List className="flex-row">
                     <ListItem className="p-0">
                        <label htmlFor="jobCNA" className="flex w-full cursor-pointer items-center " >
                           <ListItemPrefix className="mr-2">
                              <Checkbox id="jobCNA" ripple={false} className="hover:before:opacity-0" crossOrigin="" value="CNA" />
                           </ListItemPrefix>
                           <Typography color="blue-gray" className="font-medium mr-2">Ciencias Naturales</Typography>
                        </label>
                     </ListItem>
                  </List>
                  <List className="flex-row">
                     <ListItem className="p-0">
                        <label htmlFor="jobTAS" className="flex w-full cursor-pointer items-center " >
                           <ListItemPrefix className="mr-2">
                              <Checkbox id="jobTAS" ripple={false} className="hover:before:opacity-0" crossOrigin="" value="TAS" />
                           </ListItemPrefix>
                           <Typography color="blue-gray" className="font-medium mr-2">Tasación</Typography>
                        </label>
                     </ListItem>
                  </List>

               </Card>
                
            </fieldset>
            {/* Estadisticas del personaje */}
            <fieldset className="fieldset-form stats-player row-span-3 col-span-1 col-start-1 bg-white shadow-md rounded">
               
               <legend>Estadisticas del personaje</legend>

               {/* STRENGTH */}
               <Tooltip content={
                  <div className="w-80">
                     <Typography color="blue-gray" className="font-medium">
                        Material Tailwind
                     </Typography>
                     <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal opacity-80"
                     >
                        Material Tailwind is an easy to use components library for Tailwind
                        CSS and Material Design.
                     </Typography>
                  </div>
                  } 
                  className="bg-dark text-light px-2 py-1" placement="top"
               >
                  <label htmlFor="strengthMain" className="form-lbl col-span-3 bg-grey-lighter ">Fuerza</label>
               </Tooltip>
               <input type="number" 
                  id="strengthMain" 
                  placeholder="STR" 
                  min="1"
                  className="form-input stats-main col-span-3 focus:border-black focus:shadow"
                  readOnly
               />
               <input type="number" 
                  id="strengthDice" 
                  placeholder="Dado" 
                  min="1" 
                  className="form-input stats-sub ml-2 col-start-1 col-end-2 focus:border-black focus:shadow"
               />
               <input type="number" 
                  id="strengthClass" 
                  placeholder="Clase" 
                  min="1" 
                  className="form-input stats-sub col-start-2 col-end-3 focus:border-black focus:shadow"
                  readOnly
               />
               <input type="number" 
                  id="strengthLevel" 
                  placeholder="Nivel" 
                  min="1" 
                  className="form-input stats-sub-end mr-2 col-start-3 col-end-4 focus:border-black focus:shadow"
               />
               {/* INTELLIGENCE */}
               <label htmlFor="intelligenceMain" className="form-lbl col-span-3 bg-grey-lighter ">Inteligencia</label>
               <input type="number" 
                  id="intelligenceMain" 
                  placeholder="INT" 
                  min="1" 
                  className="form-input stats-main col-span-3 focus:border-black focus:shadow"
                  readOnly
               />
               <input type="number" 
                  id="intelligenceDice" 
                  placeholder="Dado" 
                  min="1" 
                  className="form-input stats-sub ml-2 col-start-1 col-end-2 focus:border-black focus:shadow"
               />
               <input type="number" 
                  id="intelligenceClass" 
                  placeholder="Clase" 
                  min="1" 
                  className="form-input stats-sub col-start-2 col-end-3 focus:border-black focus:shadow"
                  readOnly
               />
               <input type="number" 
                  id="intelligenceLevel" 
                  placeholder="Nivel" 
                  min="1" 
                  className="form-input stats-sub-end mr-2 col-start-3 col-end-4 focus:border-black focus:shadow"
               />
               {/* DEXTERITY */}
               <label htmlFor="dexterityMain" className="form-lbl col-span-3 bg-grey-lighter ">Destreza</label>
               <input type="number" 
                  id="dexterityMain" 
                  placeholder="DEX" 
                  min="1" 
                  className="form-input stats-main col-span-3 focus:border-black focus:shadow"
                  readOnly
               />
               <input type="number" 
                  id="dexterityDice" 
                  placeholder="Dado" 
                  min="1" 
                  className="form-input stats-sub ml-2 col-start-1 col-end-2 focus:border-black focus:shadow"
               />
               <input type="number" 
                  id="dexterityClass" 
                  placeholder="Clase" 
                  min="1" 
                  className="form-input stats-sub col-start-2 col-end-3 focus:border-black focus:shadow"
                  readOnly
               />
               <input type="number" 
                  id="dexterityLevel" 
                  placeholder="Nivel" 
                  min="1" 
                  className="form-input stats-sub-end mr-2 col-start-3 col-end-4 focus:border-black focus:shadow"
               />
               {/* CONSTITUTION */}
               <label htmlFor="constitutionMain" className="form-lbl col-span-3 bg-grey-lighter ">Constitucion</label>
               <input type="number" 
                  id="constitutionMain" 
                  placeholder="CON" 
                  min="1" 
                  className="form-input stats-main col-span-3 focus:border-black focus:shadow"
                  readOnly
               />
               <input type="number" 
                  id="constitutionDice" 
                  placeholder="Dado" 
                  min="1" 
                  className="form-input stats-sub ml-2 col-start-1 col-end-2 focus:border-black focus:shadow"
               />
               <input type="number" 
                  id="constitutionClass" 
                  placeholder="Clase" 
                  min="1" 
                  className="form-input stats-sub col-start-2 col-end-3 focus:border-black focus:shadow"
                  readOnly
               />
               <input type="number" 
                  id="constitutionLevel" 
                  placeholder="Nivel" 
                  min="1" 
                  className="form-input stats-sub-end mr-2 col-start-3 col-end-4 focus:border-black focus:shadow"
               />
               {/* PERCEPTION */}
               <label htmlFor="perceptionMain" className="form-lbl col-span-3 bg-grey-lighter ">Percepcion</label>
               <input type="number" 
                  id="perceptionMain" 
                  placeholder="PER" 
                  min="1" 
                  className="form-input stats-main col-span-3 focus:border-black focus:shadow"
                  readOnly
               />
               <input type="number" 
                  id="perceptionDice" 
                  placeholder="Dado" 
                  min="1" 
                  className="form-input stats-sub ml-2 col-start-1 col-end-2 focus:border-black focus:shadow"
               />
               <input type="number" 
                  id="perceptionClass" 
                  placeholder="Clase" 
                  min="1" 
                  className="form-input stats-sub col-start-2 col-end-3 focus:border-black focus:shadow"
                  readOnly
               />
               <input type="number" 
                  id="perceptionLevel" 
                  placeholder="Nivel" 
                  min="1" 
                  className="form-input stats-sub-end mr-2 col-start-3 col-end-4 focus:border-black focus:shadow"
               />
               {/* CHARISMA */}
               <label htmlFor="charismaMain" className="form-lbl col-span-3 bg-grey-lighter ">Carisma</label>
               <input type="number" 
                  id="charismaMain" 
                  placeholder="CHA" 
                  min="1" 
                  className="form-input stats-main col-span-3 focus:border-black focus:shadow"
                  readOnly
               />
               <input type="number" 
                  id="charismaDice" 
                  placeholder="Dado" 
                  min="1" 
                  className="form-input stats-sub ml-2 col-start-1 col-end-2 focus:border-black focus:shadow"
               />
               <input type="number" 
                  id="charismaClass" 
                  placeholder="Clase" 
                  min="1" 
                  className="form-input stats-sub col-start-2 col-end-3 focus:border-black focus:shadow"
                  readOnly
               />
               <input type="number" 
                  id="charismaLevel" 
                  placeholder="Nivel" 
                  min="1" 
                  className="form-input stats-sub-end mr-2 col-start-3 col-end-4 focus:border-black focus:shadow"
               />
                
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
               <label htmlFor="skillClass" className="form-lbl bg-grey-lighter ">Habilidad innata</label>
               <select 
                  id="skillClass"  
                  className="form-input mr-2"
               >
                  <option value=""/>
                  <option value="SSTR">Ataque de aura</option>
                  <option value="SINT">Procesamiento rápido</option>
                  <option value="SDEX">Golpe certero</option>
                  <option value="SHEA">Primeros auxilios</option>
                  <option value="SCRE">Transmutación básica</option>
                  <option value="SSUP">Interpretación</option>
               </select>
               <label htmlFor="skillExtra" className="form-lbl bg-grey-lighter ">Habilidad extra</label>
               <select 
                  id="skillExtra"  
                  className="form-input mr-2"
               >
                  <option value=""/>
                  <option value="SE01">Defensa con múltiples armas</option>
                  <option value="SE02">Ataque de oportunidad</option>
                  <option value="SE03">Ataque mágico</option>
                  <option value="SE04">Potenciador de magia</option>
                  <option value="SE05">Ataque con arma arrojadiza</option>
                  <option value="SE06">Supervivencia</option>
                  <option value="SE07">Reanimación</option>
                  <option value="SE08">Primeros auxilios</option>
                  <option value="SE09">Manitas</option>
                  <option value="SE10">Desarme de trampas</option>
                  <option value="SE11">Agudeza social</option>
                  <option value="SE12">Persuasión</option>
               </select>
                
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