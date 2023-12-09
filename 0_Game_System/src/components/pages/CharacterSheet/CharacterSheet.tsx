import React, { useState, ChangeEvent } from 'react';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { v4 as uuidv4 } from 'uuid';

import "@unocss/reset/tailwind.css";
import "uno.css";
import "./CharacterSheet.css";
import homeBackground from '../../../assets/img/jpg/bg-home-01.jpg';
import SvgCharacter from '../../../components/UI/Icons/SvgCharacter';
import SvgSaveCharacter from '../../../components/UI/Icons/SvgSaveCharacter';

import { InputStats, SkillTypes, SkillsAcquired, InventoryObject } from '../../interfaces/typesCharacterSheet';

import { useBackground } from '../../../App';
import FormSelectInfoPlayer from './FormSelectInfoPlayer/FormSelectInfoPlayer';
import FormCardCheckbox from './FormCardCheckbox/FormCardCheckbox';
import FormInputStats from './FormInputStats/FormInputStats';
import FormInputSkillsRing from './FormInputSkillsRing/FormInputSkillsRing';

const CharacterSheet: React.FC = () => {
   // Cambia la imagen de fondo cuando el componente se monta
   const { setBackgroundImage } = useBackground();
   setBackgroundImage(homeBackground);
   
   const [playerName, setPlayerName] = useState<string>('');
   const [characterName, setCharacterName] = useState<string>('');
   const [characterLevel,setCharacterLevel] = useState(1);
   const [characterDescription, setCharacterDescription] = useState<string>('');
   const [selectedClassValue, setSelectedClassValue] = useState<string>('');
   const [selectedRaceValue, setSelectedRaceValue] = useState<string>('');
   const [selectedJobValue, setSelectedJobValue] = useState<string>(''); 
   const [selectedCheckValues, setSelectedCheckValues] = useState<string[]>([]);
   
   // Definir el estado para las habilidades
   const [mainWeapon, setMainWeapon] = useState<string>(''); 
   const [secondaryWeapon, setSecondaryWeapon] = useState<string>(''); 
   const [alignmentValue, setAlignmentValue] = useState<string>(''); 
   const [selectedSkillValue, setSelectedSkillValue] = useState<string>(''); 
   const [selectedExtraSkillValue, setSelectedExtraSkillValue] = useState<string>(''); 
   const [skillsAcquired, setSkillsAcquired] = useState<SkillsAcquired[]>([{id:'0', name:'', description: '', ring:''},{id:'1', name:'', description: '', ring:''},{id:'2', name:'', description: '', ring:''}]);
   
   const [coins,setCoins] = useState<number[]>([0,3,0]);
   const [invObjects, setInvObjects] = useState<InventoryObject[]>([{id:0, name:'Gema', description:'Articulo del elegido', count: 1, readOnly: true}]);
   const [newObjectName, setNewObjectName] = useState<string>('');
   const [newObjectCount, setNewObjectCount] = useState<number>(1);

   const [open, setOpen] = React.useState(false);
   const handleOpen = () => setOpen(!open);

   interface DataCharacter{
      id: string;
      player: string;
      name: string;
      class: string;
      race: string;
      job:string;
      level: number;
      description: string;
      knowledge: string[];
      str: [{ dice: number, class:number, level: number }];
      int: [{ dice: number, class:number, level: number }];
      dex: [{ dice: number, class:number, level: number }];
      con: [{ dice: number, class:number, level: number }];
      per: [{ dice: number, class:number, level: number }];
      cha: [{ dice: number, class:number, level: number }];
      mainWeapon: string;
      secondaryWeapon: string;
      alignment: string;
      mainSkill: string;
      extraSkill: string,
      skills: SkillsAcquired[];
      coinsInv: number[];
      inv: InventoryObject[];
   }
   const [dataCharacter, setDataCharacter] = useState<DataCharacter>();


   // Listado del select characterClass
   const optionsCharacterClass = [
      { value: 'WAR', name: 'Guerrero', work: 'FOR', mainStat: 'STR' },
      { value: 'MAG', name: 'Mago', work: 'ARC', mainStat: 'INT' },
      { value: 'SCO', name: 'Explorador', work: 'NSC', mainStat: 'DEX' },
      { value: 'MED', name: 'Médico', work: 'BOT', mainStat: 'CON' },
      { value: 'RES', name: 'Investigador', work: 'ALC', mainStat: 'PER' },
      { value: 'ACT', name: 'Actor', work: 'PSY', mainStat: 'CHA' },
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

   // Listado de stats
   const [inputsStatsData, setInputsStatsData] = useState<InputStats[]>([
      { id: 'STR', label: 'Fuerza', description: 'Su capacidad física excepcional lo distingue como un héroe. Este individuo supera los desafíos con determinación, llevando a cabo hazañas que van más allá de los límites convencionales', valueDice: 0, valueClass: 0, valueLevel: 0 },
      { id: 'INT', label: 'Inteligencia', description: 'Su capacidad para absorber conocimiento, procesar información y forjar juicios fundamentados. Este individuo enfrenta cada desafío con resolución, una destreza mental que va más allá de la normal', valueDice: 0, valueClass: 0, valueLevel: 0 },
      { id: 'DEX', label: 'Destreza', description: 'Su capacidad se manifiesta con maestría en diversas actividades, como agilidad, equilibrio, elasticidad, fuerza y coordinación. Este individuo enfrentando desafíos demostrando agilidad en cualquier tarea, se erige como un sello distintivo en todas las actividades emprendidas.', valueDice: 0, valueClass: 0, valueLevel: 0 },
      { id: 'CON', label: 'Constitucion', description: 'La estructura física, o constitución corporal, se define como el conjunto de características que conforman el cuerpo y que establecen las limitaciones y posibilidades individuales. A través de esta constitución, se revelan las distintivas fortalezas y potenciales, dando forma a las habilidades y oportunidades que definen la singularidad de cada individuo.', valueDice: 0, valueClass: 0, valueLevel: 0 },
      { id: 'PER', label: 'Percepcion', description: 'Su capacidad para interpretar las sensaciones recibidas a través de los sentidos, dando lugar a una impresión, ya sea consciente o inconsciente, de la realidad física del entorno. Se erige como el faro que guía al héroe a través del tejido de la realidad, revelando sus misterios y desafíos con una claridad incomparable.', valueDice: 0, valueClass: 0, valueLevel: 0 },
      { id: 'CHA', label: 'Carisma', description: 'Su capacidad se manifiesta como la capacidad natural para cautivar a los demás a través de su presencia, su palabra y su encantadora personalidad. Se convierte en la fuerza que une a las personas, dejando una huella indeleble en cada interacción y dejando una impresión imborrable en quienes se cruzan su camino.', valueDice: 0, valueClass: 0, valueLevel: 0 },
   ]);

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

   // Listado del select skillTypeRing
   const optionsRingTypes = [
      { value: 'STR', name: 'Fuerza' },
      { value: 'INT', name: 'Inteligencia' },
      { value: 'DEX', name: 'Destreza' },
      { value: 'HEA', name: 'Sanidad' },
      { value: 'CRE', name: 'Creación' },
      { value: 'SUP', name: 'Soporte' },
   ];

   // Listado del select skillTypeRing
   const skillsTypes: SkillTypes[] = [
      { id: 'STR', 
         skills: [
            {id: 1, name: 'Golpe aplastante', description: '', dice: ''},
            {id: 2, name: 'Frenesí', description: '', dice: ''},
            {id: 3, name: 'Fuerza elemental', description: '', dice: ''},
            {id: 4, name: 'Embate destructor', description: '', dice: ''},
            {id: 5, name: 'Resistencia sobrehumana', description: '', dice: ''},
            {id: 6, name: 'Grito de guerra', description: '', dice: '1D4'},
            {id: 7, name: 'Impulso', description: '', dice: ''},
            {id: 8, name: 'Resistencia de Hierro', description: '', dice: ''},
            {id: 9, name: 'Embate Cegador', description: '', dice: ''},
         ] },
      { id: 'INT', 
         skills: [
            {id: 1, name: 'Rayo de conocimiento', description: '', dice: ''},
            {id: 2, name: 'Sabiduría ancestral', description: '', dice: ''},
            {id: 3, name: 'Escudo mental', description: '', dice: ''},
            {id: 4, name: 'Ilusión perfecta', description: '', dice: ''},
            {id: 5, name: 'Control de energía', description: '', dice: ''},
            {id: 6, name: 'Lectura de mentes', description: '', dice: ''},
            {id: 7, name: 'Rayo Arcano', description: '', dice: ''},
            {id: 8, name: 'Mente Aguda', description: '', dice: ''},
            {id: 9, name: 'Conocimiento Arcano', description: '', dice: ''},
         ] },
      { id: 'DEX', 
         skills: [
            {id: 1, name: 'Ataque sigiloso', description: '', dice: ''},
            {id: 2, name: 'Agilidad felina', description: '', dice: ''},
            {id: 3, name: 'Golpe certero', description: '', dice: ''},
            {id: 4, name: 'Camuflaje', description: '', dice: ''},
            {id: 5, name: 'Danza de las sombras', description: '', dice: ''},
            {id: 6, name: 'Vista de águila', description: '', dice: ''},
            {id: 7, name: 'Golpe Mortal', description: '', dice: ''},
            {id: 8, name: 'Reflejo Veloz', description: '', dice: ''},
            {id: 9, name: 'Sigilo Perfecto', description: '', dice: ''},
         ] },
      { id: 'HEA', 
         skills: [
            {id: 1, name: 'Toque curativo', description: '', dice: ''},
            {id: 2, name: 'Aura de curación', description: '', dice: ''},
            {id: 3, name: 'Purificación', description: '', dice: ''},
            {id: 4, name: 'Toxicología', description: '', dice: ''},
            {id: 5, name: 'Inyección', description: '', dice: ''},
            {id: 6, name: 'Corazon de hierro', description: '', dice: ''},
            {id: 7, name: 'Herramienta elemental', description: '', dice: ''},
            {id: 8, name: 'Escudo de Vida', description: '', dice: ''},
            {id: 9, name: 'Destreza del cirujano', description: '', dice: ''},
         ] },
      { id: 'CRE', 
         skills: [
            {id: 1, name: 'Invocación de creación', description: '', dice: ''},
            {id: 2, name: 'Maestría artesanal', description: '', dice: ''},
            {id: 3, name: 'Potenciador mágico', description: '', dice: ''},
            {id: 4, name: 'Transmutación', description: '', dice: ''},
            {id: 5, name: 'Trampero experto', description: '', dice: ''},
            {id: 6, name: 'Cólera del artífice', description: '', dice: ''},
            {id: 7, name: 'Forja Mágica', description: '', dice: ''},
            {id: 8, name: 'Invocar Armamento', description: '', dice: ''},
            {id: 9, name: 'Ojo clínico', description: '', dice: ''},
         ] },
      { id: 'SUP', 
         skills: [
            {id: 1, name: 'Arte bendito', description: '', dice: ''},
            {id: 2, name: 'Acción de inspiración', description: '', dice: ''},
            {id: 3, name: 'Protección divina', description: '', dice: ''},
            {id: 4, name: 'Distracción', description: '', dice: ''},
            {id: 5, name: 'Coaching', description: '', dice: ''},
            {id: 6, name: 'Intimidación', description: '', dice: ''},
            {id: 7, name: 'Ataque a traición', description: '', dice: ''},
            {id: 8, name: 'Maldición Mortal', description: '', dice: ''},
            {id: 9, name: 'Bizarro', description: '', dice: ''},
         ] },
   ];


   const handleChangeCharacterLevel = (newLevel: number) => {
      // Actualizar el estado con el nuevo valor ingresado por el usuario
      setCharacterLevel(newLevel);
   };
   // Manejar el cambio en la selección
   const handleSelectRaceChange = (value: string) => {
      setSelectedRaceValue(value);
   };
   
   const handleSelectSkillChange = (currentSkill: string) => {
      // Actualizar el estado con el nuevo valor ingresado por el usuario
      setSelectedSkillValue(currentSkill);
   };
   const handleSelectExtraSkillChange = (currentSkill: string) => {
      // Actualizar el estado con el nuevo valor ingresado por el usuario
      setSelectedExtraSkillValue(currentSkill);
   };

   // Poner todos los valores de valueClass en cero
   const setAllValueClassesToZero = () => {
      setInputsStatsData(prevItems  => prevItems.map(item => ({ ...item, valueClass: 0 })));
   };

   const sumarTresVariables = (): number => {
      return 2;
   };
   
   // Manejar el cambio en la selección characterClass
   const handleCharacterClassChange = (value: string) => {
      setSelectedClassValue(value);
      
      // selectedCheckValues - Usar el método find para obtener el objeto con el valor específico
      const selectedOption = optionsCharacterClass.find(option => option.value === value);
      setSelectedCheckValues((selectedOption)?[selectedOption.work]:[]);
      
      // inputsStatsData - Poner todos los valores de valueClass en cero
      setAllValueClassesToZero();
      const sumStats:number = sumarTresVariables() ;
      setInputsStatsData(prevItems => prevItems.map(item => item.id === selectedOption?.mainStat ? { ...item, valueClass: sumStats } : item ));
      
      // skillClass - Llenar el valor de la habilidad principal
      setSelectedSkillValue("S"+selectedOption?.mainStat);

   };
   
   // Manejar el cambio en la selección characterJob
   const handleCharacterJobSelectChange = (value: string) => {
      setSelectedJobValue(value);
   };


   const handleSelectedCheckValuesChange = (newValues: string[]) => {
      setSelectedCheckValues(newValues);
    };

   const handleStatsInputChange = (newInputStats: InputStats) => {
      setInputsStatsData(prevItems => prevItems.map( item => item.id === newInputStats.id ? { ...item, item: newInputStats} : item ))
   }

   const handleSelectedRingSkillChange = (id: string, ring: string, name: string) => {
      const description = '';
      const existingSkillIndex = skillsAcquired.findIndex(elem => elem.id === id);

      if (existingSkillIndex !== -1) {
         // Si la habilidad ya existe, actualizarla
         const updatedSkills = [...skillsAcquired];
         updatedSkills[existingSkillIndex] = { id, name, description, ring };

         setSkillsAcquired(updatedSkills);
      } else {
         // Si la habilidad no existe, añadirla
         setSkillsAcquired(prevSkills => [...prevSkills, { id, name, description, ring }]);
      }
      
   };

   // Funcion para editar la cantidad de monedas
   const handleCoinsChange = (index: number, value: number) => {
      const updatedCoins = [...coins];
      updatedCoins[index] = value || 0; // Parse input value as integer or default to 0
      setCoins(updatedCoins);
   };

   // Funciones para adicionar, editar o eliminar objetos de la lista de inventario
   const handleAddObject = () => {
      const newObject: InventoryObject = {
         id: invObjects.length,
         name: newObjectName || 'Nuevo Objeto',
         description: 'Descripción del nuevo objeto',
         count: newObjectCount,
         readOnly: false,
      };

      setInvObjects((prev) => [...prev, newObject]);
      setNewObjectName('');
      setNewObjectCount(1);
   };
  
   const handleDeleteObject = (id: number) => {
      setInvObjects((prevObjects) => prevObjects.filter((obj) => obj.id !== id));
   };
  
    const handleEditCount = (id: number, newCount: number) => {
      setInvObjects((prevObjects) =>
         prevObjects.map((obj) =>
            obj.id === id ? { ...obj, count: newCount } : obj
         )
      );
    };

    const handleOpenModal = () => {

      const newCharacter: DataCharacter = {
         id: uuidv4(),
         player: playerName,
         name: characterName,
         class: selectedClassValue,
         race: selectedRaceValue,
         job: selectedJobValue,
         level: characterLevel,
         description: characterDescription,
         knowledge: selectedCheckValues,
         str: [{ dice: inputsStatsData[0].valueDice, class: inputsStatsData[0].valueClass, level: inputsStatsData[0].valueLevel }],
         int: [{ dice: inputsStatsData[1].valueDice, class: inputsStatsData[1].valueClass, level: inputsStatsData[1].valueLevel }],
         dex: [{ dice: inputsStatsData[2].valueDice, class: inputsStatsData[2].valueClass, level: inputsStatsData[2].valueLevel }],
         con: [{ dice: inputsStatsData[3].valueDice, class: inputsStatsData[3].valueClass, level: inputsStatsData[3].valueLevel }],
         per: [{ dice: inputsStatsData[4].valueDice, class: inputsStatsData[4].valueClass, level: inputsStatsData[4].valueLevel }],
         cha: [{ dice: inputsStatsData[5].valueDice, class: inputsStatsData[5].valueClass, level: inputsStatsData[5].valueLevel }],
         mainWeapon: mainWeapon,
         secondaryWeapon: secondaryWeapon,
         alignment: alignmentValue,
         mainSkill: selectedSkillValue,
         extraSkill: selectedExtraSkillValue,
         skills: skillsAcquired,
         coinsInv: coins,
         inv: invObjects,
      };

      setDataCharacter(newCharacter);

      console.log(skillsAcquired);
      

      handleOpen();
    }

   const getClassName = (id: string|undefined): string | undefined  => {
      return optionsCharacterClass.find(elem => elem.value === id)?.name;
   }

   const getRaceName = (id: string|undefined): string | undefined  => {
      return optionsCharacterRace.find(elem => elem.value === id)?.name;
   }

   const getJobName = (id: string|undefined): string | undefined  => {
      return optionsCharacterJob.find(elem => elem.value === id)?.name;
   }
   
   const getKnowledgeName = (ids: string[]|undefined): string | undefined  => {
      var names = '';
      
      ids?.forEach((know) => {
         names += checkboxesData.find(elem => elem.value === know)?.name + ', ';
      });
      names= (names.length > 2)?names.substring(0,names.length-2):names;
      
      return names;
   }
   
   const getMainSkillName = (id: string|undefined): string | undefined  => {
      return optionsSkillClass.find(elem => elem.value === id)?.name;
   }
   const getExtraSkillName = (id: string|undefined): string | undefined  => {
      return optionsSkillExtra.find(elem => elem.value === id)?.name;
   }
   
   const getSkillName = (ring: string, id: number): string | undefined  => {
      return skillsTypes.find(skill => skill.id === ring)?.skills.find(ele => ele.id === id)?.name;
   }

   
    return (
        <form className="min-h-screen form-sheet grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-0 gap-y-4 md:gap-x-4 p-4 bg-gray-2">
            
            {/* Informacion del jugador */}
            <fieldset className="fieldset-form info-player col-span-2 md:col-span-2 lg:col-span-3 bg-white shadow-md rounded">
               <legend><SvgCharacter width={20} height={20} className={"inline"} /> Informacion del jugador </legend>

               <label htmlFor="player" className="form-lbl col-start-1 col-end-2 bg-grey-lighter ">Jugador</label>
               <input type="text" 
                  id="player" 
                  placeholder="Nombre del jugador" 
                  className="form-input col-start-2 col-end-3 mr-2 focus:border-black focus:shadow"
                  onChange={(e) => setPlayerName(e.target.value)}
                  required
               />
               <label htmlFor="character" className="form-lbl col-start-1 col-end-2 bg-grey-lighter ">Personaje</label>
               <input type="text" 
                  id="character" 
                  placeholder="Nombre del personaje" 
                  className="form-input col-start-2 col-end-3 mr-2 focus:border-black focus:shadow"
                  onChange={(e) => setCharacterName(e.target.value)}
                  required
               />

               <FormSelectInfoPlayer id="characterClass" label="Clase" options={optionsCharacterClass} selectedValue={selectedClassValue} onSelectChange={handleCharacterClassChange} ></FormSelectInfoPlayer>
               
               <FormSelectInfoPlayer id="characterRace" label="Raza" options={optionsCharacterRace} selectedValue={selectedRaceValue} onSelectChange={handleSelectRaceChange} ></FormSelectInfoPlayer>
               
               <FormSelectInfoPlayer id="characterJob" label="Trabajo" options={optionsCharacterJob} selectedValue={selectedJobValue} onSelectChange={handleCharacterJobSelectChange} ></FormSelectInfoPlayer>

               <label htmlFor="characterLevel" className="form-lbl-y col-start-1 md:col-start-3 row-start-2 md:row-start-1 bg-grey-lighter ">Nivel</label>
               <input type="number" 
                  id="characterLevel" 
                  placeholder="Nivel"
                  min="1" 
                  max="10"
                  className="form-input-y col-start-1 md:col-start-3 row-start-3 md:row-start-2 row-span-4 focus:border-black focus:shadow"
                  value={characterLevel}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeCharacterLevel(parseInt(e.target.value))}
                  required
               />
               <label htmlFor="characterDescription" className="form-lbl-y col-start-2 md:col-start-4 row-start-2 md:row-start-1 bg-grey-lighter ">Descripción</label>
               <textarea
                  id="characterDescription" 
                  name='characterDescription'
                  placeholder="Descripcion del personaje" 
                  className="form-input-y col-start-2 md:col-start-4 row-start-3 md:row-start-2 row-span-4 focus:border-black focus:shadow"
                  onChange={(e) => setCharacterDescription(e.target.value)}
                  required
               />
               
               <FormCardCheckbox id="characterKnowledge" label="Conocimientos" checkboxes={checkboxesData} selectedValues={selectedCheckValues} onSelectedValuesChange={handleSelectedCheckValuesChange} />
                
            </fieldset>

            {/* Estadisticas del personaje */}
            <fieldset className="fieldset-form stats-player row-span-3 col-span-1 col-start-1 bg-white shadow-md rounded">
               <legend>Estadisticas del personaje</legend>

               {/* STRENGTH */}
               <FormInputStats inputStats={inputsStatsData[0]} onSelectedValuesChange={handleStatsInputChange} />
               
               {/* INTELLIGENCE */}
               <FormInputStats inputStats={inputsStatsData[1]} onSelectedValuesChange={handleStatsInputChange} />
               
               {/* DEXTERITY */}
               <FormInputStats inputStats={inputsStatsData[2]} onSelectedValuesChange={handleStatsInputChange} />

               {/* CONSTITUTION */}
               <FormInputStats inputStats={inputsStatsData[3]} onSelectedValuesChange={handleStatsInputChange} />
               
               {/* PERCEPTION */}
               <FormInputStats inputStats={inputsStatsData[4]} onSelectedValuesChange={handleStatsInputChange} />

               {/* CHARISMA */}
               <FormInputStats inputStats={inputsStatsData[5]} onSelectedValuesChange={handleStatsInputChange} />
                
            </fieldset>

            {/* Armamento inicial */}
            <fieldset className="fieldset-form initial-armament col-span-1 row-span-1 col-start-1 md:col-start-2 bg-white shadow-md rounded">
               <legend>Armamento inicial</legend>

               <label htmlFor="mainWeapon" className="form-lbl bg-grey-lighter ">Arma principal</label>
               <input type="text" 
                  id="mainWeapon" 
                  placeholder="Arma principal" 
                  className="form-input mr-2 focus:border-black focus:shadow"
                  onChange={(e) => setMainWeapon(e.target.value)}
               />
               <label htmlFor="secondaryWeapon" className="form-lbl bg-grey-lighter ">Arma secundaria</label>
               <input type="text" 
                  id="secondaryWeapon" 
                  placeholder="Arma secondaria" 
                  className="form-input mr-2 focus:border-black focus:shadow"
                  onChange={(e) => setSecondaryWeapon(e.target.value)}
               />

               <FormSelectInfoPlayer id="skillClass" label="Habilidad innata" options={optionsSkillClass} selectedValue={selectedSkillValue} onSelectChange={handleSelectSkillChange} ></FormSelectInfoPlayer>
               
               <FormSelectInfoPlayer id="skillExtra" label="Habilidad extra" options={optionsSkillExtra} selectedValue={selectedExtraSkillValue} onSelectChange={handleSelectExtraSkillChange} ></FormSelectInfoPlayer>
                
            </fieldset>

            {/* Habilidades */}
            <fieldset className="fieldset-form skills-player col-span-1 row-span-2 col-start-1 md:col-start-2 bg-white shadow-md rounded">
               <legend>Habilidades</legend>

               <label htmlFor="alignment" className="form-lbl mt-2 ">Alineación</label>
               <select 
                  id="alignment"  
                  className="form-input mr-2"
                  onChange={(e) => setAlignmentValue(e.target.value)}
               >
                  <option value=""/>
                  <option value="orden">Orden</option>
                  <option value="caos">Caos</option>
               </select>
               <label className="form-lbl-skills ml-2 mb-1 ">Nivel</label>
               <label className="form-lbl-skills mr-2 mb-1 ">Anillo de poder</label>

               <FormInputSkillsRing id={'0'} level={characterLevel} levelEvaluated={3} ringTypes={optionsRingTypes} skillForType={skillsTypes} values={skillsAcquired[0]} onSelectChange={handleSelectedRingSkillChange} />

               <FormInputSkillsRing id={'1'} level={characterLevel} levelEvaluated={6} ringTypes={optionsRingTypes} skillForType={skillsTypes} values={skillsAcquired[1]} onSelectChange={handleSelectedRingSkillChange} />

               <FormInputSkillsRing id={'2'} level={characterLevel} levelEvaluated={9} ringTypes={optionsRingTypes} skillForType={skillsTypes} values={skillsAcquired[2]} onSelectChange={handleSelectedRingSkillChange} />
                
            </fieldset>

            {/* Inventario */}
            <fieldset className="fieldset-form inventory-player row-span-3 col-span-1 col-start-1 lg:col-start-3 lg:row-start-2 bg-white shadow-md rounded">
               <legend>Inventario</legend>

               <label htmlFor="goldCoins" className="form-lbl col-span-3 bg-grey-lighter ">Monedero</label>
               <label htmlFor="goldCoins" className="form-lbl-coins ml-2 col-span-1 bg-grey-lighter ">Oro</label>
               <label htmlFor="silverCoins" className="form-lbl-coins col-span-1 bg-grey-lighter ">Plata</label>
               <label htmlFor="bronzeCoins" className="form-lbl-coins mr-2 col-span-1 bg-grey-lighter ">Bronce</label>
               <input type="number" 
                  id="goldCoins" 
                  placeholder="Oro" 
                  className="form-input ml-2 col-span-1 focus:border-black focus:shadow"
                  value={coins[0]}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleCoinsChange(0, parseInt(e.target.value))}
               />
               <input type="number" 
                  id="silverCoins" 
                  placeholder="Plata" 
                  className="form-input col-span-1 focus:border-black focus:shadow"
                  value={coins[1]}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleCoinsChange(1, parseInt(e.target.value))}
               />
               <input type="number" 
                  id="bronzeCoins" 
                  placeholder="Bronce" 
                  className="form-input mr-2 col-span-1 focus:border-black focus:shadow"
                  value={coins[2]}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleCoinsChange(2, parseInt(e.target.value))}
               />

               <label htmlFor="objectInput" className="form-lbl mb-2 col-span-3 bg-grey-lighter ">Bolsa</label>
               {invObjects.map((elem) => (
                  <label htmlFor={"object"+elem.id} key={"object"+elem.id} className="form-lbl object-item col-span-3 bg-grey-lighter "> {elem.name} 
                     <input type="hidden" value={elem.id} />
                     <input type="number" 
                        id={"object"+elem.id} 
                        placeholder="Cantidad" 
                        className="form-input-count focus:border-black focus:shadow"
                        value={elem.count}
                        onChange={(e) => handleEditCount(elem.id, parseInt(e.target.value, 10))}
                        readOnly={elem.readOnly}
                     />
                     <button type="button" className="btn-delete-object" onClick={() => handleDeleteObject(elem.id)} >X</button>
                  </label>
               ))}
               <input type="text" 
                  id="objectInput" 
                  placeholder="Objeto" 
                  className="form-input ml-2 col-span-2 row-span-2 focus:border-black focus:shadow"
                  value={newObjectName}
                  onChange={(e) => setNewObjectName(e.target.value)}
               />
               <input type="number" 
                  id="countObject" 
                  placeholder="Cantidad" 
                  className="form-input mr-2 col-span-1 focus:border-black focus:shadow"
                  value={newObjectCount}
                  onChange={(e) => setNewObjectCount(parseInt(e.target.value, 10))}
               />
               <button type="button" className="btn-add-object mr-2" onClick={() => handleAddObject()} >Añadir</button>
                
            </fieldset>

            <aside className='panel-save'>
               <button className='btn-save-character' onClick={() => handleOpenModal()} >
                  <SvgSaveCharacter className='icon' width={50} height={50} />
               </button>
            </aside>
            {/* <div className='grid place-items-center fixed w-screen h-screen bg-black bg-opacity-60 backdrop-blur-sm ' style={{display:'none'}}/>
            <div className='relative bg-white m-4 rounded-lg shadow-2xl text-blue-gray-500 antialiased font-sans text-base font-light leading-relaxed w-full md:w-5/6 lg:w-3/4 2xl:w-3/5 min-w-[90%] md:min-w-[83.333333%] lg:min-w-[75%] 2xl:min-w-[60%] max-w-[90%] md:max-w-[83.333333%] lg:max-w-[75%] 2xl:max-w-[60%] dialog' style={{display:'none'}}/>
            <div className='align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg text-red-500 hover:bg-red-500/10 active:bg-red-500/30 mr-1 ' style={{display:'none'}}/>
            <div className='align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gradient-to-tr from-green-600 to-green-400 text-white shadow-md shadow-green-500/20 hover:shadow-lg hover:shadow-green-500/40 active:opacity-[0.85] ' style={{display:'none'}}/> */}
            {/* Modal/Dialog */}
            <Dialog
               open={ open }
               size={"lg"}
               handler={handleOpenModal}
               className="dialog "
               >
               <DialogHeader>Resumen de hoja de personaje</DialogHeader>
               <DialogBody>
                  <ul className='my-4 grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-4 '>
                     <li className='col-span-2'><strong>Jugador: </strong>{dataCharacter?.player}</li>
                     <li className='col-span-2'><strong>Personaje: </strong>{dataCharacter?.name}</li>
                     <li><strong>Nivel: </strong>{dataCharacter?.level}</li>
                     <li><strong>Clase: </strong>{getClassName(dataCharacter?.class)}</li>
                     <li><strong>Raza: </strong>{getRaceName(dataCharacter?.race)}</li>
                     <li><strong>Trabajo: </strong>{getJobName(dataCharacter?.job)}</li>
                     <li className='col-span-2'><strong>Descripcion: </strong>{dataCharacter?.description}</li>
                     <li className='col-span-2'><strong>Conocimientos: </strong>{getKnowledgeName(dataCharacter?.knowledge)}</li>
                  </ul>
                  <ul className='my-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-4 gap-x-4 '>
                     <li><strong>Fuerza: </strong>{(dataCharacter?.str[0].dice||0) + (dataCharacter?.str[0].class||0) + (dataCharacter?.str[0].level||0) }</li>
                     <li><strong>Inteligencia: </strong>{(dataCharacter?.int[0].dice||0) + (dataCharacter?.int[0].class||0) + (dataCharacter?.int[0].level||0) }</li>
                     <li><strong>Destreza: </strong>{(dataCharacter?.dex[0].dice||0) + (dataCharacter?.dex[0].class||0) + (dataCharacter?.dex[0].level||0) }</li>
                     <li><strong>Constitucion: </strong>{(dataCharacter?.con[0].dice||0) + (dataCharacter?.con[0].class||0) + (dataCharacter?.con[0].level||0) }</li>
                     <li><strong>Percepcion: </strong>{(dataCharacter?.per[0].dice||0) + (dataCharacter?.per[0].class||0) + (dataCharacter?.per[0].level||0) }</li>
                     <li><strong>Carisma: </strong>{(dataCharacter?.cha[0].dice||0) + (dataCharacter?.cha[0].class||0) + (dataCharacter?.cha[0].level||0) }</li>
                  </ul>
                  <ul className='my-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-4 '>
                     <li><strong>Habilidad principal: </strong>{getMainSkillName(dataCharacter?.mainSkill)}</li>
                     <li><strong>Habilidad extra: </strong>{getExtraSkillName(dataCharacter?.extraSkill)}</li>
                     <li className='md:col-span-2 lg:col-span-3'><strong>Alineacion: </strong>{dataCharacter?.alignment}</li>
                     {dataCharacter?.skills.map((elem) => (
                        <li key={elem.id}><strong>Habilidad: </strong>{getSkillName(elem.ring,parseInt(elem.name))}</li>
                        ))}
                  </ul>
                  <ul className='my-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-4 '>
                     <li><strong>Arma principal: </strong>{dataCharacter?.mainWeapon}</li>
                     <li><strong>Arma secundaria: </strong>{dataCharacter?.secondaryWeapon}</li>
                     <li className='md:col-span-2 lg:col-span-3'><strong>Dinero: </strong> </li>
                     <li>Oro: {dataCharacter?.coinsInv[0]}</li>
                     <li>Plata: {dataCharacter?.coinsInv[1]}</li>
                     <li>Cobre: {dataCharacter?.coinsInv[2]}</li>
                     <li className='md:col-span-2 lg:col-span-3'>Inventario: </li>
                     {dataCharacter?.inv.map((elem) => (
                        <li key={elem.id}><strong>{elem.name}: </strong>{elem.count}</li>
                     ))}
                  </ul>
               </DialogBody>
               <DialogFooter>
                  <Button
                     variant="text"
                     color="red"
                     onClick={() => handleOpen()}
                     className="mr-1"
                  >
                     <span>Cancelar</span>
                  </Button>
                  <Button
                     variant="gradient"
                     className='btn-dialog-accept'
                     onClick={() => handleOpen()}
                  >
                     <span>Guardar información</span>
                  </Button>
               </DialogFooter>
            </Dialog>
            
        </form>
    )
}

export default CharacterSheet;