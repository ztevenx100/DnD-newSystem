import React, { useState, ChangeEvent, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import dbConnection from '@database/dbConnection';
import { getUrlCharacter } from '@database/dbStorage';
import { getDataQueryEpe, getDataQueryHad, getDataQueryHpe, getDataQueryInp, getDataQueryPus, getDataQuerySju, getDataQueryUsu } from '@database/dbTables';

import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Tooltip } from "@material-tailwind/react";
import "@unocss/reset/tailwind.css";
import "uno.css";
import "./CharacterSheet.css";

// Interfaces
import { InputStats, SkillTypes, SkillsAcquired, InventoryObject,SkillFields, Option } from '@interfaces/typesCharacterSheet';
import { DBSistemaJuego } from '@interfaces/dbTypes';
// Components
import FormSelectInfoPlayer from './FormSelectInfoPlayer/FormSelectInfoPlayer';
import FormCardCheckbox from './FormCardCheckbox/FormCardCheckbox';
import FormInputStats from './FormInputStats/FormInputStats';
import FormInputSkillsRing from './FormInputSkillsRing/FormInputSkillsRing';
import FormImageFile from './FormImageFile/FormImageFile';
// Funciones
import {validateNumeric} from '@utils/utilConversions';
// Images
import mainBackground from '@img/webp/bg-home-02.webp';
import ScreenLoader from '@UI/ScreenLoader/ScreenLoader';
import SvgCharacter from '@Icons/SvgCharacter';
import SvgSaveCharacter from '@Icons/SvgSaveCharacter';
import SvgD4Roll from '@Icons/SvgD4Roll';
import SvgDeleteItem from '@Icons/SvgDeleteItem';

interface CharacterSheetProps {
   changeBackground: (newBackground: string) => void;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ changeBackground }) => {

   // Varibles - estados
   const [playerName, setPlayerName] = useState<string>('');
   const [characterName, setCharacterName] = useState<string>('');
   const [characterLevel,setCharacterLevel] = useState(1);
   const [characterDescription, setCharacterDescription] = useState<string>('');
   const [characterImage, setCharacterImage] = useState<string | undefined>(undefined);
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
   const [skillsAcquired, setSkillsAcquired] = useState<SkillsAcquired[]>([{id:'', value:'0', name:'', description: '', ring:''},{id:'', value:'1',name:'', description: '', ring:''},{id:'', value:'2', name:'', description: '', ring:''}]);
   const [coins,setCoins] = useState<number[]>([0,3,0]);
   const [luckyPoints,setLuckyPoints] = useState<number>(1);
   
   const [invObjects, setInvObjects] = useState<InventoryObject[]>([]);
   const [systemGame, setSystemGame] = useState<DBSistemaJuego>({sju_id: '', sju_nombre: ''});
   const [skillsRingList, setSkillsRingList] = useState<SkillTypes[]> ([{id:'0', skills: []},{id:'1', skills: []},{id:'2', skills: []}]);
   const [fieldSkill, setFieldSkill] = useState<SkillFields[]> ([{id:'',skill:'',field:'skillClass'},{id:'',skill:'',field:'skillExtra'}]) ;
   const [newObjectName, setNewObjectName] = useState<string>('');
   const [newObjectDescription, setNewObjectDescription] = useState<string>('');
   const [newObjectCount, setNewObjectCount] = useState<number>(1);
   const [SystemGameList, setSystemGameList] = useState<Option[]>([]);
   const [deleteItems, setDeleteItems] = useState<String[]>([]);

   // Listado del select skillClass
   const [optionsSkillClass, setOptionsSkillClass] = useState<Option[]>([]);
   // Listado del select skillExtra
   const [optionsSkillExtra, setOptionsSkillExtra] = useState<Option[]>([]);
   // Listado del select skillTypeRing
   const [skillsTypes, setSkillsTypes] = useState<SkillTypes[]>([]);

   const [open, setOpen] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(true);
   const [newRecord, setNewRecord] = useState<boolean>(true);
   const randomValueRefreshImage = Math.random().toString(36).substring(7);
   const handleOpen = () => setOpen(!open);
   const navigate = useNavigate();
   const params = useParams();

   interface DataCharacter{
      id: string;
      player: string;
      name: string;
      class: string;
      race: string;
      job: string;
      level: number;
      luckyPoints: number;
      description: string;
      knowledge: string[];
      str: [{ dice: number, class: number, level: number }];
      int: [{ dice: number, class: number, level: number }];
      dex: [{ dice: number, class: number, level: number }];
      con: [{ dice: number, class: number, level: number }];
      per: [{ dice: number, class: number, level: number }];
      cha: [{ dice: number, class: number, level: number }];
      mainWeapon: string;
      secondaryWeapon: string;
      alignment: string;
      mainSkill: string;
      extraSkill: string;
      skills: SkillsAcquired[];
      coinsInv: number[];
      inv: InventoryObject[];
   }
   const [dataCharacter, setDataCharacter] = useState<DataCharacter>();


   useEffect(() => {
      getSkills()
    }, [skillsTypes]);

   useEffect(() => {
      changeBackground(mainBackground);
      
      const loadInfo = async () => {
         document.documentElement.scrollTop = 0;
         if(params.user === null || params.user ===  undefined){
            navigate('/UserCharacters');
         }
         if(params.id === null || params.id ===  undefined){
            setNewRecord(true);
         } else {
            setNewRecord(false);
         }
         
         await getUser();
         await getListSkill();
         await getGameSystemList();
         await getCharacter();
         await getCharacterImage();
         
         Promise.all ([
            getStats(),
            getInventory(),
         ]).finally(() => {
            setLoading(false);
         });
      }

      loadInfo();
   }, []);

   async function getUser() {
      if (params.user == undefined || params.user == null) return

      const data = await Promise.resolve(
         getDataQueryUsu(
            'usu_id, usu_nombre'
            , { 'usu_id': params.user }
         )
      )
      //console.log('getUser ',data);

      if (data !== null) {
         const nombre = data[0].usu_nombre;
         setPlayerName(nombre);
      }
   }
   async function getListSkill() {
      const data = await Promise.resolve(
         getDataQueryHad(
            'hab_id, hab_nombre, had_estadistica_base, hab_siglas, hab_tipo'
            , { 'hab_tipo': ['C','E','R'] }
            , { 'hab_tipo': true, 'had_estadistica_base': true }
         )
      )

      if (data !== null){
         const updatedOptionsSkillClass = [];
         const updatedOptionsSkillExtra = [];
         const otherSkills: SkillTypes[] = [];
         
         for (let i = 0; i < data.length; i++) {
            if (data[i].hab_tipo === 'C'){
               updatedOptionsSkillClass.push({id: data[i].hab_id, value: data[i].hab_siglas, name: data[i].hab_nombre});
            } else if (data[i].hab_tipo === 'E'){
               updatedOptionsSkillExtra.push({id: data[i].hab_id, value: data[i].hab_siglas, name: data[i].hab_nombre});
            } else if (data[i].hab_tipo === 'R'){
               let countSkill: number = otherSkills.filter(option => option.id === data[i].had_estadistica_base).length;
               if (countSkill === 0) {
                  otherSkills.push({id: data[i].had_estadistica_base, skills: [{id: data[i].hab_id, value: data[i].hab_siglas, name: data[i].hab_nombre}]});
               } else {
                  otherSkills.find(option => option.id === data[i].had_estadistica_base)?.skills.push({id: data[i].hab_id, value: data[i].hab_siglas, name: data[i].hab_nombre});
               }
            }
         }
         setOptionsSkillClass(updatedOptionsSkillClass);
         setOptionsSkillExtra(updatedOptionsSkillExtra);
         setSkillsTypes(otherSkills);
      }
   }
   async function getGameSystemList() {
      const data = await Promise.resolve(
         getDataQuerySju(
            'sju_id, sju_nombre'
            , { 'sju_estado': 'A' }
         )
      )
      if (data !== null) {
         const updatedSystemGameList = [];
         for (let i = 0; i < data.length; i++) {
            updatedSystemGameList.push({value:data[0].sju_id,name:data[0].sju_nombre});
         }
         setSystemGameList(updatedSystemGameList);
      }
  }
   async function getCharacter() {
      if(params.id === null || params.id ===  undefined) return;
      
      const data = await Promise.resolve(
         getDataQueryPus(
            'pus_id, pus_usuario, pus_nombre, pus_clase, pus_raza, pus_trabajo, pus_nivel, pus_descripcion, pus_conocimientos, pus_arma_principal, pus_arma_secundaria,pus_cantidad_oro,pus_cantidad_plata,pus_cantidad_bronce, pus_puntos_suerte, sju_sistema_juego(sju_id,sju_nombre)'
            , { 'pus_id': params.id }
         )
      )

      if (data !== null) {
         const updatedCoins = [...coins];
         setCharacterName(data[0].pus_nombre);
         setSelectedClassValue(data[0].pus_clase ?? '');
         setSelectedRaceValue(data[0].pus_raza ?? '');
         setSelectedJobValue(data[0].pus_trabajo ?? '');
         setCharacterLevel(data[0].pus_nivel);
         setCharacterDescription(data[0].pus_descripcion);
         let knowledge:string[] = data[0]?.pus_conocimientos.split(',') ?? [];
         setSelectedCheckValues(knowledge);

         setMainWeapon(data[0].pus_arma_principal);
         setSecondaryWeapon(data[0].pus_arma_secundaria);
         updatedCoins[0] = data[0].pus_cantidad_oro;
         updatedCoins[1] = data[0].pus_cantidad_plata;
         updatedCoins[2] = data[0].pus_cantidad_bronce;
         setCoins(updatedCoins);
         let updateSystemGame = systemGame;
         updateSystemGame.sju_id = data[0].sju_sistema_juego.sju_id;
         updateSystemGame.sju_nombre = data[0].sju_sistema_juego.sju_nombre;
         setSystemGame(updateSystemGame);
         setLuckyPoints(data[0].pus_puntos_suerte);
      }
   }
   async function getCharacterImage() {
      if(params.user === null || params.user ===  undefined) return;
      if(params.id === null || params.id ===  undefined) return;
      
      const url = await getUrlCharacter(params.user, params.id);

      setCharacterImage(url + '?' + randomValueRefreshImage);
   }

   async function getStats() {
      if(params.id === null || params.id === undefined) return;

      const data = await Promise.resolve(
         getDataQueryEpe(
            'epe_personaje, epe_sigla, epe_nombre, epe_num_dado, epe_num_clase, epe_num_nivel'
            , { 'epe_personaje': params.id }
         )
      )

      if (data !== null) {
         const updatedInputsStatsData = [...inputsStatsData];
         for (let i = 0; i < data.length; i++) {
            updatedInputsStatsData[i].valueDice = data[i].epe_num_dado;
            updatedInputsStatsData[i].valueClass = data[i].epe_num_clase;
            updatedInputsStatsData[i].valueLevel = data[i].epe_num_nivel;
         }
         setInputsStatsData(updatedInputsStatsData);
      }

   }
   async function getSkills() {
      if(params.id === null || params.id === undefined) return;
      
      const data = await Promise.resolve(
         getDataQueryHpe(
            'hpe_habilidad, hpe_campo, hpe_alineacion, hab_habilidad(hab_id, hab_nombre, had_estadistica_base, hab_siglas)'
            , { 'hpe_personaje': params.id }
            , { 'hpe_campo': true }
         )
      )
      
      if (data !== null) {
         let acronym: string = '';
         const updatedSkills = [...skillsAcquired];
         const updatedFieldSkill = [...fieldSkill];
         data.forEach(elem => {
            acronym = (Array.isArray(elem.hab_habilidad) ? elem.hab_habilidad[0]?.hab_siglas : elem.hab_habilidad?.hab_siglas) ?? '';
            if (elem.hpe_campo === 'skillClass') {
               setSelectedSkillValue(acronym);
               updatedFieldSkill.filter(skill => skill.field === 'skillClass')[0].id = acronym;
               updatedFieldSkill.filter(skill => skill.field === 'skillClass')[0].skill = elem.hpe_habilidad;
            } else if (elem.hpe_campo === 'skillExtra') {
               setSelectedExtraSkillValue(acronym);
               updatedFieldSkill.filter(skill => skill.field === 'skillExtra')[0].id = acronym;
               updatedFieldSkill.filter(skill => skill.field === 'skillExtra')[0].skill = elem.hpe_habilidad;
            } else if (elem.hpe_campo.includes('skillRing')) {
               const numCampo: string = elem.hpe_campo.replace('skillRing', '');
               let estadisticaBase: string = (Array.isArray(elem.hab_habilidad) ? elem.hab_habilidad[0]?.had_estadistica_base : elem.hab_habilidad?.had_estadistica_base) ?? '';
               
               const selectTypeRing = document.getElementById('skillTypeRing' + numCampo) as HTMLSelectElement;
               selectTypeRing.value = estadisticaBase;
               
               handleSelectedTypeRingSkillChange(numCampo,estadisticaBase);
               updatedSkills[Number(numCampo)] = { id: elem.hpe_habilidad, value: numCampo,  name: acronym, description: '', ring: estadisticaBase };
            }
         });
         setSkillsAcquired(updatedSkills);
         setFieldSkill(updatedFieldSkill);
      }
   }
   async function getInventory() {
      const updatedInvObjects = [...invObjects];
      
      if(params.id === null || params.id ===  undefined){
         updatedInvObjects.push({id:uuidv4(), name:'Gema', description:'Articulo del elegido', count: 1, readOnly: true})
         setInvObjects(updatedInvObjects);
         return;
      }
      
      const data = await Promise.resolve(
         getDataQueryInp(
            'inp_id, inp_nombre, inp_descripcion, inp_cantidad'
            , { 'inp_personaje': params.id }
         )
      )

      if (data !== null) {
         data.forEach(elem => {
            updatedInvObjects.push({ id: elem.inp_id, name: elem.inp_nombre, description: elem.inp_descripcion, count: elem.inp_cantidad, readOnly: false })
         });
         setInvObjects(updatedInvObjects);
      }
   }
   
   const optionsCharacterClass = [
      { value: 'WAR', name: 'Guerrero', work: 'FOR', mainStat: 'STR' },
      { value: 'MAG', name: 'Mago', work: 'ARC', mainStat: 'INT' },
      { value: 'SCO', name: 'Explorador', work: 'NSC', mainStat: 'DEX' },
      { value: 'MED', name: 'Médico', work: 'BOT', mainStat: 'CON' },
      { value: 'RES', name: 'Investigador', work: 'ALC', mainStat: 'PER' },
      { value: 'ACT', name: 'Actor', work: 'PSY', mainStat: 'CHA' },
    ];
   const optionsCharacterRace = [
      { value: 'HUM', name: 'Humano' },
      { value: 'ELF', name: 'Elfo' },
      { value: 'DWA', name: 'Enano' },
      { value: 'AAS', name: 'Aasimars' },
      { value: 'TIE', name: 'Tieflings' },
    ];
   const optionsCharacterJob = [
      { value: 'HUN', name: 'Cazador', extraPoint:'DEX,PER' },
      { value: 'BLA', name: 'Herrero', extraPoint:'STR,DEX' },
      { value: 'ART', name: 'Artista', extraPoint:'INT,CHA'},
      { value: 'SAG', name: 'Sabio', extraPoint:'INT,PER' },
      { value: 'PRI', name: 'Sacerdote', extraPoint:'CON,CHA' },
      { value: 'STR', name: 'Estratega', extraPoint:'INT,CON' },
    ];
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
   const [inputsStatsData, setInputsStatsData] = useState<InputStats[]>([
      { id: 'STR', label: 'Fuerza', description: 'Su capacidad física excepcional lo distingue como un héroe. Este individuo supera los desafíos con determinación, llevando a cabo hazañas que van más allá de los límites convencionales', valueDice: 0, valueClass: 0, valueLevel: 0 },
      { id: 'INT', label: 'Inteligencia', description: 'Su capacidad para absorber conocimiento, procesar información y forjar juicios fundamentados. Este individuo enfrenta cada desafío con resolución, una destreza mental que va más allá de la normal', valueDice: 0, valueClass: 0, valueLevel: 0 },
      { id: 'DEX', label: 'Destreza', description: 'Su capacidad se manifiesta con maestría en diversas actividades, como agilidad, equilibrio, elasticidad, fuerza y coordinación. Este individuo enfrentando desafíos demostrando agilidad en cualquier tarea, se erige como un sello distintivo en todas las actividades emprendidas.', valueDice: 0, valueClass: 0, valueLevel: 0 },
      { id: 'CON', label: 'Constitucion', description: 'La estructura física, o constitución corporal, se define como el conjunto de características que conforman el cuerpo y que establecen las limitaciones y posibilidades individuales. A través de esta constitución, se revelan las distintivas fortalezas y potenciales, dando forma a las habilidades y oportunidades que definen la singularidad de cada individuo.', valueDice: 0, valueClass: 0, valueLevel: 0 },
      { id: 'PER', label: 'Percepcion', description: 'Su capacidad para interpretar las sensaciones recibidas a través de los sentidos, dando lugar a una impresión, ya sea consciente o inconsciente, de la realidad física del entorno. Se erige como el faro que guía al héroe a través del tejido de la realidad, revelando sus misterios y desafíos con una claridad incomparable.', valueDice: 0, valueClass: 0, valueLevel: 0 },
      { id: 'CHA', label: 'Carisma', description: 'Su capacidad se manifiesta como la capacidad natural para cautivar a los demás a través de su presencia, su palabra y su encantadora personalidad. Se convierte en la fuerza que une a las personas, dejando una huella indeleble en cada interacción y dejando una impresión imborrable en quienes se cruzan su camino.', valueDice: 0, valueClass: 0, valueLevel: 0 },
   ]);
   const optionsRingTypes = [
      { id: 'STR', name: 'Fuerza', stat:'STR' },
      { id: 'INT', name: 'Inteligencia', stat:'INT' },
      { id: 'DEX', name: 'Destreza', stat:'DEX' },
      { id: 'HEA', name: 'Sanidad', stat:'CON' },
      { id: 'CRE', name: 'Creación', stat:'PER' },
      { id: 'SUP', name: 'Soporte', stat:'CHA' },
   ];

   const listWearpons = [
      'Arco corto',
      'Arco largo',
      'Baculo',
      'Ballesta',
      'Bastón',
      'Cuchillo de combate',
      'Daga',
      'Espada corta',
      'Espada larga',
      'Glaive',
      'Hacha de mano',
      'Hacha grande',
      'Katana',
      'Kunai',
      'Lanza',
      'Mancuernas',
      'Martillo de guerra',
      'Pico de curvo',
      'Pike',
      'Sable',
      'Sai',
      'Shuriken',
      'Tomfas',
   ];

   // Actualizar el nivel del personaje
   const handleChangeCharacterLevel = (newLevel: string) => {
      let level = validateNumeric(newLevel,1);
      setCharacterLevel(level);
   };
   const handleChangeLuckyPoints = (newPoints: string) => {
      let value = validateNumeric(newPoints,1);
      setLuckyPoints(value);
   };
   // Manejar el cambio en la selección
   const handleSelectRaceChange = (value: string) => {
      setSelectedRaceValue(value);
   };
   // Actualizar el systema de juego
   const handleSystemGameChange = (currentSystem: string) => {
      let option = SystemGameList.filter(elem => elem.value === currentSystem);
      setSystemGame({sju_id: option[0].value, sju_nombre: option[0].name});
   };
   // Actualizar la habilidad principal del personaje
   const handleSelectSkillChange = (currentSkill: string) => {
      let option = optionsSkillClass.filter(skill => skill.value === currentSkill);
      setFieldSkill(prevItems => prevItems.map( item => item.field === 'skillClass' ? { ...item, id: option[0].value, skill: option[0].id||'' } : item ));
      setSelectedSkillValue(currentSkill);
      
   };
   // Actualizar la habilidad extra del personaje
   const handleSelectExtraSkillChange = (currentSkill: string) => {
      let option = optionsSkillExtra.filter(skill => skill.value === currentSkill);
      setFieldSkill(prevItems => prevItems.map( item => item.field === 'skillExtra' ? { ...item, id: option[0].value, skill: option[0].id||'' } : item ));
      setSelectedExtraSkillValue(currentSkill);
   };

   const setAllValueClassesToZero = () => {
      setInputsStatsData(prevItems  => prevItems.map(item => ({ ...item, valueClass: 0 })));
   };
   
   const updStatsPoints = (selectedClass : string, selectedJob : string): void =>{
      const updatedInputsStatsData = [...inputsStatsData];
      const extraPoints = optionsCharacterJob.find(option => option.value === selectedJob)?.extraPoint || '';

      updatedInputsStatsData[0].valueClass = ( selectedClass === 'WAR' ? 2 : 0 ) + ( extraPoints.includes('STR') ? 1 : 0 );
      updatedInputsStatsData[1].valueClass = ( selectedClass === 'MAG' ? 2 : 0 ) + ( extraPoints.includes('INT') ? 1 : 0 );
      updatedInputsStatsData[2].valueClass = ( selectedClass === 'SCO' ? 2 : 0 ) + ( extraPoints.includes('DEX') ? 1 : 0 );
      updatedInputsStatsData[3].valueClass = ( selectedClass === 'MED' ? 2 : 0 ) + ( extraPoints.includes('CON') ? 1 : 0 );
      updatedInputsStatsData[4].valueClass = ( selectedClass === 'RES' ? 2 : 0 ) + ( extraPoints.includes('PER') ? 1 : 0 );
      updatedInputsStatsData[5].valueClass = ( selectedClass === 'ACT' ? 2 : 0 ) + ( extraPoints.includes('CHA') ? 1 : 0 );
      
      setInputsStatsData(updatedInputsStatsData);
   };
   
   const handleCharacterClassChange = (value: string) => {
      setSelectedClassValue(value);
      
      // selectedCheckValues - Usar el método find para obtener el objeto con el valor específico
      const selectedOption = optionsCharacterClass.find(option => option.value === value);
      setSelectedCheckValues((selectedOption)?[selectedOption.work]:[]);
      
      // inputsStatsData - Poner todos los valores de valueClass en cero
      setAllValueClassesToZero();
      updStatsPoints(value, selectedJobValue);
      
      // skillClass - Llenar el valor de la habilidad principal
      setSelectedSkillValue("S" + selectedOption?.mainStat);
      handleSelectSkillChange("S" + selectedOption?.mainStat);
   };

   // Manejar el cambio en la selección characterJob
   const handleCharacterJobSelectChange = (value: string) => {
      setSelectedJobValue(value);
      updStatsPoints(selectedClassValue, value);
   };

   // Manejar el cambio de la URL de la imagen en characterImage
   const handleCharacterImageFileChange = async (value: string, file: File) => {
      const { data, error } = await dbConnection
      .storage
      .from('dnd-system')
      .upload('usuarios/' + params.user + '/' + params.id + '.webp', file, {
         cacheControl: '3600',
         upsert: true
      });
      
      if(error) alert(alert);
      
      if(data) setCharacterImage(value);
   };

   const handleSelectedCheckValuesChange = (newValues: string[]) => {
      setSelectedCheckValues(newValues);
    };

   const handleStatsInputChange = (newInputStats: InputStats) => {
      setInputsStatsData(prevItems => prevItems.map( item => item.id === newInputStats.id ? { ...item, item: newInputStats} : item ));
   }

   const handleAlingmentChange = (value: string) => {
      setAlignmentValue(value);
      
      const formElement = document.getElementById('form-sheet');
      if (value === 'O') {
         formElement?.classList.add('orden');
         formElement?.classList.remove('caos');
      } else if (value === 'C') {
         formElement?.classList.add('caos');
         formElement?.classList.remove('orden');
      } else {
         formElement?.classList.remove('caos');
         formElement?.classList.remove('orden');
      }
   };

   const handleSelectedTypeRingSkillChange = async (id: string, type: string) => {
      const updatedSetSkillsRingList = [...skillsRingList];
      updatedSetSkillsRingList[Number(id)].skills = (skillsTypes.find(option => option.id === type) || {}).skills || [];
      setSkillsRingList( updatedSetSkillsRingList );
   };

   const handleSelectedRingSkillChange = async (value: string, ring: string, name: string, stat: string) => {
      const description = '';
      const existingSkillIndex = skillsAcquired.findIndex(elem => elem.value === value);
      const id:string = skillsTypes.find(item => item.id === ring)?.skills.find(item => item.value === stat)?.id || '';
      console.log(' handleSelectedRingSkillChange: ', existingSkillIndex, '- ring:', ring, '- id:', id, '- value:', value, '- skillsTypes:', skillsTypes);

      if (existingSkillIndex !== -1) {
         const updatedSkills = [...skillsAcquired];
         updatedSkills[existingSkillIndex] = { id, value, name, description, ring, stat };
         
         setSkillsAcquired(updatedSkills);
         console.log('handleSelectedRingSkillChange - updatedSkills', updatedSkills);
      } else {
         setSkillsAcquired(prevSkills => [...prevSkills, { id, value, name, description, ring, stat }]);
      }
      
   };

   const handleCoinsChange = (index: number, value: string) => {
      let numericValue = validateNumeric(value);
      const updatedCoins = [...coins];
      updatedCoins[index] = numericValue;
      setCoins(updatedCoins);
   };

   const handleAddObject = () => {
      if(!newObjectName || newObjectName === '' ){
         alert('Por favor digitar este campo');
         document.getElementById('objectName')?.focus();
         return;
      }

      const newObject: InventoryObject = {
         id: uuidv4(),
         name: newObjectName,
         description: newObjectDescription || 'Descripción del nuevo objeto',
         count: newObjectCount,
         readOnly: false,
      };

      setInvObjects((prev) => [...prev, newObject]);
      setNewObjectName('');
      setNewObjectDescription('');
      setNewObjectCount(1);
   };
  
   async function handleDeleteObject (id: string) {
      setInvObjects((prevObjects) => prevObjects.filter((obj) => obj.id !== id));
      const updatedDeleteItems = [...deleteItems];
      updatedDeleteItems.push(id);
      setDeleteItems(updatedDeleteItems);
   };
  
   const handleEditCount = (id: string, newCount: string) => {
      let numericValue = validateNumeric(newCount, 1);
      setInvObjects((prevObjects) =>
         prevObjects.map((obj) =>
            obj.id === id ? { ...obj, count: numericValue } : obj
         )
      );
   };

   const handleNewCount = (value: string) => {
      let numericValue = validateNumeric(value, 1);
      setNewObjectCount(numericValue);
   }

   const handleOpenModal = () => {
      // Obtener todos los elementos con el atributo required
      let requiredElements = Array.from(document.querySelectorAll('[required]')) as HTMLInputElement[];
      let hayCamposVacios = false;
      let fieldsRequired: string[] = [];

      // Iterar sobre los elementos y verificar si están vacíos
      for (var i = 0; i < requiredElements.length; i++) {
         if (requiredElements[i].value.trim() === '') {
            hayCamposVacios = true;
            requiredElements[i].classList.add('required-input');
            fieldsRequired.push(requiredElements[i].id);
         } else {
            requiredElements[i].classList.remove('required-input');
         }
      }
      
      // Si hay campos vacíos, no enviar el formulario
      if (hayCamposVacios) {
         alert('Por favor, digite todos los campos obligatorios.');
         return;
      }

      const newCharacter: DataCharacter = {
         id: uuidv4(),
         player: playerName,
         name: characterName,
         class: selectedClassValue,
         race: selectedRaceValue,
         job: selectedJobValue,
         level: characterLevel,
         luckyPoints: luckyPoints,
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
      handleOpen();
   }

   const randomRoll = () => {
      if (characterLevel > 1) return;

      const updatedInputsStatsData = [...inputsStatsData];
      let randomNumber = Math.floor(Math.random() * 4) + 1;
      updatedInputsStatsData[0].valueDice = randomNumber;
      randomNumber = Math.floor(Math.random() * 4) + 1;
      updatedInputsStatsData[1].valueDice = randomNumber;
      randomNumber = Math.floor(Math.random() * 4) + 1;
      updatedInputsStatsData[2].valueDice = randomNumber;
      randomNumber = Math.floor(Math.random() * 4) + 1;
      updatedInputsStatsData[3].valueDice = randomNumber;
      randomNumber = Math.floor(Math.random() * 4) + 1;
      updatedInputsStatsData[4].valueDice = randomNumber;
      randomNumber = Math.floor(Math.random() * 4) + 1;
      updatedInputsStatsData[5].valueDice = randomNumber;
      
      setInputsStatsData(updatedInputsStatsData);
      return;
   }

   const getClassName = (id: string|undefined): string | undefined  => {
      return optionsCharacterClass.find(elem => elem.value === id)?.name
   }
   const getRaceName = (id: string|undefined): string | undefined  => {
      return optionsCharacterRace.find(elem => elem.value === id)?.name
   }
   const getJobName = (id: string|undefined): string | undefined  => {
      return optionsCharacterJob.find(elem => elem.value === id)?.name
   }
   const getKnowledgeName = (ids: string[]|undefined): string | undefined  => {
      let names = '';
      if (ids === undefined) return names;
      ids.forEach((know) => {
         names += checkboxesData.find(elem => elem.value === know)?.name + ', ';
      });
      names= (names.length > 2)?names.substring(0,names.length-2):names;
      
      return names;
   }
   const getMainSkillName = (id: string|undefined): string | undefined  => {
      return optionsSkillClass.find(elem => elem.value === id)?.name
   }
   const getExtraSkillName = (id: string|undefined): string | undefined  => {
      return optionsSkillExtra.find(elem => elem.value === id)?.name
   }
   const getSkillName = (id: string, stat: string): string | undefined  => {
      return skillsTypes.find(skill => skill.id === stat)?.skills.find(ele => ele.value === id)?.name
   }

   async function saveData() {
      let character:string = await uploadInfoCharacter(newRecord);
      //console.log('saveData ', character);
      Promise.all ([
         uploadStats(newRecord, character),
         uploadSkill(character),
         uploadInventory(character),
      ]).finally(() => {
         setNewRecord(false);
      })
      
      document.documentElement.scrollTop = 0;
      handleOpen();
      reloadPage(character);
   }
   
   const reloadPage = (character: string) => {
      navigate('/CharacterSheet/'+params.user+'/'+character)
   };

   async function uploadInfoCharacter(newRecord: boolean) {
      if (!newRecord) {
         const { data, error } = await dbConnection
         .from('pus_personajes_usuario')
         .update({
            pus_nombre: dataCharacter?.name,
            pus_clase: dataCharacter?.class,
            pus_raza: dataCharacter?.race,
            pus_trabajo: dataCharacter?.job,
            pus_nivel: dataCharacter?.level,
            pus_descripcion: dataCharacter?.description,
            pus_conocimientos: dataCharacter?.knowledge.join(),
            pus_arma_principal: dataCharacter?.mainWeapon,
            pus_arma_secundaria: dataCharacter?.secondaryWeapon,
            pus_cantidad_oro: dataCharacter?.coinsInv[0],
            pus_cantidad_plata: dataCharacter?.coinsInv[1],
            pus_cantidad_bronce: dataCharacter?.coinsInv[2],
            pus_puntos_suerte: dataCharacter?.luckyPoints,
         })
         .eq("pus_id",params.id)
         .select();
         
         if(data !== null){
            return data[0].pus_id;
         } 
         
         if(error)return '';
      } else {
         const { data, error } = await dbConnection
         .from('pus_personajes_usuario')
         .insert({ 
            pus_usuario: params.user,
            pus_id: dataCharacter?.id,
            pus_nombre: dataCharacter?.name,
            pus_clase: dataCharacter?.class,
            pus_raza: dataCharacter?.race,
            pus_trabajo: dataCharacter?.job,
            pus_nivel: dataCharacter?.level,
            pus_descripcion: dataCharacter?.description,
            pus_conocimientos: dataCharacter?.knowledge.join(),
            pus_arma_principal: dataCharacter?.mainWeapon,
            pus_arma_secundaria: dataCharacter?.secondaryWeapon,
            pus_cantidad_oro: dataCharacter?.coinsInv[0],
            pus_cantidad_plata: dataCharacter?.coinsInv[1],
            pus_cantidad_bronce: dataCharacter?.coinsInv[2],
            pus_sistema_juego: systemGame.sju_id,
            pus_puntos_suerte: dataCharacter?.luckyPoints,
         })
         .select();
         if(data !== null) return data[0].pus_id;
         
         if(error)return '';
      }
   }
   async function uploadStats(isNewCharacter: boolean, character: string) {
      if(character === '') return;
      
      if (!isNewCharacter) {
         for(const element of inputsStatsData) {
            const { error } = await dbConnection
            .from('epe_estadistica_personaje')
            .update({ 
               epe_nombre: element?.label,
               epe_num_dado: element?.valueDice,
               epe_num_clase: element?.valueClass,
               epe_num_nivel: element?.valueLevel,
            })
            .eq("epe_personaje",params.id)
            .eq("epe_sigla",element.id)
            .select();
            if(error) alert('Stat not upload.');
         }
      } else {
         let saveStats = [];
         for(const element of inputsStatsData) {
            saveStats.push({
               epe_usuario: params.user,
               epe_personaje: character,
               epe_sigla: element?.id,
               epe_nombre: element?.label,
               epe_num_dado: element?.valueDice,
               epe_num_clase: element?.valueClass,
               epe_num_nivel: element?.valueLevel,
            });
         }
         const { error } = await dbConnection
         .from('epe_estadistica_personaje')
         .insert(saveStats)
         .select();
         
         if(error) alert('Stat not upload.');
      }
   }
   async function uploadSkill(character: string) {
      if(character === '') return;

      let saveSkill = [];
      saveSkill.push({
         hpe_habilidad: fieldSkill.filter(skill => skill.field === 'skillClass')[0].skill,
         hpe_usuario: params.user, 
         hpe_personaje: character,
         hpe_campo: 'skillClass',
         hpe_alineacion: null,
      });
      saveSkill.push({
         hpe_habilidad: fieldSkill.filter(skill => skill.field === 'skillExtra')[0].skill,
         hpe_usuario: params.user, 
         hpe_personaje: character,
         hpe_campo: 'skillExtra',
         hpe_alineacion: null,
      });
      
      for(let index = 0; index < skillsAcquired.length; index++) {
         if(skillsAcquired[index].id === '') continue;
         saveSkill.push({
            hpe_habilidad: skillsAcquired[index].id,
            hpe_usuario: params.user, 
            hpe_personaje: character,
            hpe_campo: 'skillRing'+skillsAcquired[index].value,
            hpe_alineacion: null,
         });
      }
      //console.log('saveSkill ', saveSkill);
      
      const { error } = await dbConnection
      .from('hpe_habilidad_personaje')
      .upsert(saveSkill)
      .select();

      if(error) alert('Skill not upload.');
   }
   async function uploadInventory(character: string) {
      if(character === '') return;

      let saveItems = [];

      for(let index = 0; index < invObjects.length; index++) {
         saveItems.push({
            inp_usuario: params.user, 
            inp_personaje: character,
            inp_id: invObjects[index].id, 
            inp_nombre: invObjects[index].name, 
            inp_descripcion: invObjects[index].description, 
            inp_cantidad: invObjects[index].count,
         });
      }

      const { error } = await dbConnection
      .from('inp_inventario_personaje')
      .upsert(saveItems)
      .select();
   
      if(error) alert('Items not upload.');

      // Eliminar objeto db
      const { error: deleteError } = await dbConnection
      .from('inp_inventario_personaje')
      .delete()
      .in('inp_id', deleteItems);

      if(deleteError) alert('Error eliminado items del inventario');
   }

   return (
      <>
      {loading && (
         <ScreenLoader/>
      )}
      <form id='form-sheet' className="form-sheet min-h-screen grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-0 gap-y-4 md:gap-x-4 p-4">
         
         {/* Titulo */}
         <fieldset className="fieldset-form form-title col-span-2 md:col-span-2 lg:col-span-3 shadow-lg rounded">
            {(!newRecord) ? (
               <h1 className='col-span-2 text-center font-bold'>{systemGame.sju_nombre}</h1>
            ):(
               <><FormSelectInfoPlayer id="systemGame" label="Sistema de juego" options={SystemGameList} selectedValue={systemGame.sju_id} onSelectChange={handleSystemGameChange} ></FormSelectInfoPlayer></>
            )}
         </fieldset>
         {/* Informacion del jugador */}
         <fieldset className="fieldset-form info-player col-span-2 md:col-span-2 lg:col-span-3 bg-white shadow-lg rounded">
            <legend><SvgCharacter width={20} height={20} className={"inline"} /> Informacion del jugador </legend>

            <label htmlFor="player" className="form-lbl col-start-1 bg-grey-lighter ">Jugador</label>
            <input type="text" 
               id="player" 
               placeholder="Nombre del jugador" 
               className="form-input col-start-2 col-end-3 col-span-1 mr-2 focus:border-black focus:shadow"
               value={playerName}
               onChange={(e) => setPlayerName(e.target.value)}
               required
               readOnly
            />
            <label htmlFor="character" className="form-lbl col-start-1 bg-grey-lighter ">Personaje</label>
            <input type="text" 
               id="character" 
               placeholder="Nombre del personaje" 
               className="form-input col-start-2 mr-2 focus:border-black focus:shadow"
               value={characterName}
               maxLength={50}
               onChange={(e) => setCharacterName(e.target.value)}
               required
            />

            <FormSelectInfoPlayer id="characterClass" label="Clase" options={optionsCharacterClass} selectedValue={selectedClassValue} onSelectChange={handleCharacterClassChange} ></FormSelectInfoPlayer>
            
            <FormSelectInfoPlayer id="characterRace" label="Raza" options={optionsCharacterRace} selectedValue={selectedRaceValue} onSelectChange={handleSelectRaceChange} ></FormSelectInfoPlayer>
            
            <FormSelectInfoPlayer id="characterJob" label="Trabajo" options={optionsCharacterJob} selectedValue={selectedJobValue} onSelectChange={handleCharacterJobSelectChange} ></FormSelectInfoPlayer>

            <label htmlFor="characterLevel" className="form-lbl-y col-start-1 md:col-start-3 col-span-1 row-start-2 md:row-start-1 bg-grey-lighter ">Nivel</label>
            <input type="text"
               id="characterLevel"
               placeholder="Nivel"
               min="1"
               max="10"
               className="form-input-y numeric-input col-start-1 md:col-start-3 col-span-1 row-start-3 md:row-start-2 row-span-1 md:row-span-4 focus:border-black focus:shadow"
               value={characterLevel}
               maxLength={2}
               onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeCharacterLevel(e.target.value)}
               required
            />
            <label htmlFor="luckyPoints" className="form-lbl-y col-start-2 md:col-start-4 col-span-1 row-start-2 md:row-start-1 bg-grey-lighter ">Puntos de suerte</label>
            <input type="text"
               id="luckyPoints"
               placeholder="Puntos de suerte"
               min="1"
               max="10"
               className="form-input-y numeric-input col-start-2 md:col-start-4 col-span-1 row-start-3 md:row-start-2 row-span-1 md:row-span-4 focus:border-black focus:shadow"
               value={luckyPoints}
               maxLength={2}
               onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeLuckyPoints(e.target.value)}
               required
            />
            <label htmlFor="characterImage" className="form-lbl-y col-start-1 md:col-start-5 col-span-2 md:col-span-1 row-start-4 md:row-start-1 bg-grey-lighter ">Imagen</label>
            <FormImageFile externalStyles={'col-start-1 md:col-start-5 col-span-2 md:col-span-1 row-start-5 md:row-start-2 row-span-3 md:row-span-4 mr-2 ml-2'} locationImage={characterImage} onFormImageFileChange={handleCharacterImageFileChange} />

            <label htmlFor="characterDescription" className="form-lbl-y col-start-1 md:col-start-1 col-span-5 row-start-12 md:row-start-6 bg-grey-lighter ">Descripción</label>
            <textarea
               id="characterDescription" 
               name='characterDescription'
               placeholder="Descripcion del personaje" 
               className="form-input-y col-start-1 md:col-start-1 col-span-5 row-start-13 md:row-start-7 row-span-1 focus:border-black focus:shadow"
               value={characterDescription}
               maxLength={500}
               onChange={(e) => setCharacterDescription(e.target.value)}
               required
            />
            
            <FormCardCheckbox id="characterKnowledge" label="Conocimientos" checkboxes={checkboxesData} selectedValues={selectedCheckValues} onSelectedValuesChange={handleSelectedCheckValuesChange} />
         </fieldset>

         {/* Estadisticas del personaje */}
         <fieldset className="fieldset-form stats-player row-span-3 col-span-1 col-start-1 bg-white shadow-lg rounded">
            <legend>Estadisticas del personaje</legend>
            <header className='stats-player-header col-span-3 col-start-3'>
               <Tooltip className="bg-dark text-light px-2 py-1" placement="top" content={ "Estadisticas al azar" } >
                  <button type='button' className='btn-save-character' onClick={randomRoll} >
                     <SvgD4Roll className='btn-roll' width={30} height={30} />
                  </button>
               </Tooltip>
            </header>

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
         <fieldset className="fieldset-form initial-armament col-span-1 row-span-1 col-start-1 md:col-start-2 bg-white shadow-lg rounded">
            <legend>Armamento inicial</legend>

            <label htmlFor="mainWeapon" className="form-lbl bg-grey-lighter ">Arma principal</label>
            <input type="text" 
               id="mainWeapon" 
               placeholder="Arma principal" 
               className="form-input mr-2 focus:border-black focus:shadow"
               list='wearpons'
               onChange={(e) => setMainWeapon(e.target.value)}
               value={mainWeapon}
               required
            />
            <datalist id="wearpons">
               {listWearpons?.map((elem, index) => (
                  <option key={index} value={elem}>{elem}</option>
               ))}
            </datalist>
            <label htmlFor="secondaryWeapon" className="form-lbl bg-grey-lighter ">Arma secundaria</label>
            <input type="text" 
               id="secondaryWeapon" 
               placeholder="Arma secondaria" 
               className="form-input mr-2 focus:border-black focus:shadow"
               list='wearpons'
               onChange={(e) => setSecondaryWeapon(e.target.value)}
               value={secondaryWeapon}
            />

            <FormSelectInfoPlayer id="skillClass" label="Habilidad innata" options={optionsSkillClass} selectedValue={selectedSkillValue} onSelectChange={handleSelectSkillChange} ></FormSelectInfoPlayer>
            
            <FormSelectInfoPlayer id="skillExtra" label="Habilidad extra" options={optionsSkillExtra} selectedValue={selectedExtraSkillValue} onSelectChange={handleSelectExtraSkillChange} ></FormSelectInfoPlayer>
         </fieldset>

         {/* Habilidades */}
         <fieldset className="fieldset-form skills-player col-span-1 row-span-2 col-start-1 md:col-start-2 bg-white shadow-lg rounded">
            <legend>Habilidades</legend>
            { characterLevel >= 3 ? (
               <>
                  <label htmlFor="alignment" className="form-lbl mt-2 ">Alineación</label>
                  <select 
                     id="alignment"
                     className="form-input mr-2"
                     onChange={(e) => handleAlingmentChange(e.target.value)}
                     >
                     <option value=""/>
                     <option value="O">Orden</option>
                     <option value="C">Caos</option>
                  </select>

                  <label className="form-lbl-skills ml-2 mb-0 ">Nivel</label>
                  <label className="form-lbl-skills mr-2 mb-0 ">Anillo de poder</label>

                  <FormInputSkillsRing id={'0'} level={characterLevel} levelEvaluated={3} ringTypes={optionsRingTypes} skillList={skillsRingList[0]} values={skillsAcquired[0]} onSelectChange={handleSelectedRingSkillChange} onSelectTypeChange={handleSelectedTypeRingSkillChange} />

                  <FormInputSkillsRing id={'1'} level={characterLevel} levelEvaluated={6} ringTypes={optionsRingTypes} skillList={skillsRingList[1]} values={skillsAcquired[1]} onSelectChange={handleSelectedRingSkillChange} onSelectTypeChange={handleSelectedTypeRingSkillChange} />

                  <FormInputSkillsRing id={'2'} level={characterLevel} levelEvaluated={9} ringTypes={optionsRingTypes} skillList={skillsRingList[2]} values={skillsAcquired[2]} onSelectChange={handleSelectedRingSkillChange} onSelectTypeChange={handleSelectedTypeRingSkillChange} />
               </>
            ) : (<></>)}
         </fieldset>

         {/* Inventario */}
         <fieldset className="fieldset-form inventory-player row-span-3 col-span-1 col-start-1 lg:col-start-3 lg:row-start-3 bg-white shadow-lg rounded">
            <legend>Inventario</legend>

            <label htmlFor="goldCoins" className="form-lbl col-span-3 mb-1 bg-grey-lighter ">Monedero</label>
            <label htmlFor="goldCoins" className="form-lbl-coins ml-2 col-span-1 bg-grey-lighter ">Oro</label>
            <label htmlFor="silverCoins" className="form-lbl-coins col-span-1 bg-grey-lighter ">Plata</label>
            <label htmlFor="bronzeCoins" className="form-lbl-coins mr-2 col-span-1 bg-grey-lighter ">Bronce</label>
            <input type="text" 
               id="goldCoins" 
               placeholder="Oro" 
               className="form-input ml-2 col-span-1 focus:border-black focus:shadow"
               value={coins[0]}
               maxLength={3}
               onChange={(e: ChangeEvent<HTMLInputElement>) => handleCoinsChange(0, e.target.value)}
            />
            <input type="text" 
               id="silverCoins" 
               placeholder="Plata" 
               className="form-input col-span-1 focus:border-black focus:shadow"
               value={coins[1]}
               maxLength={3}
               onChange={(e: ChangeEvent<HTMLInputElement>) => handleCoinsChange(1, e.target.value)}
            />
            <input type="text" 
               id="bronzeCoins" 
               placeholder="Bronce" 
               className="form-input mr-2 col-span-1 focus:border-black focus:shadow"
               value={coins[2]}
               maxLength={3}
               onChange={(e: ChangeEvent<HTMLInputElement>) => handleCoinsChange(2, e.target.value)}
            />

            <label htmlFor="objectInput" className="form-lbl mb-1 col-span-3 bg-grey-lighter ">Bolsa</label>
            {/* Listado de objetos */}
            {invObjects.map((elem) => (
               <Tooltip className="bg-dark text-light px-2 py-1" key={"object"+elem.id} placement="left" content={ elem.description } >
                  <label htmlFor={"object"+elem.id} className="form-lbl object-item col-span-3 bg-grey-lighter "> {elem.name} 
                     <input type="hidden" value={elem.id} />
                     <input type="text" 
                        id={"object"+elem.id} 
                        placeholder="Cantidad" 
                        className="form-input-count focus:border-black focus:shadow"
                        value={elem.count}
                        maxLength={2}
                        onChange={(e) => handleEditCount(elem.id, e.target.value)}
                        readOnly={elem.readOnly}
                     />
                     <button type="button" className="btn-delete-object" onClick={() => handleDeleteObject(elem.id)} >
                        <SvgDeleteItem width={25} fill='var(--required-color)'/>
                     </button>
                  </label>
               </Tooltip>
            ))}

            <input type="text" 
               id="objectName" 
               placeholder="Objeto" 
               className="form-input ml-2 col-span-2 row-span-1 focus:border-black focus:shadow"
               value={newObjectName}
               maxLength={50}
               onChange={(e) => setNewObjectName(e.target.value)}
            />
            <input type="text" 
               id="objectCount" 
               placeholder="Cantidad" 
               className="form-input mr-2 col-span-1 focus:border-black focus:shadow"
               value={newObjectCount}
               maxLength={2}
               onChange={(e) => handleNewCount(e.target.value)}
            />
            <input type="text" 
               id="objectDescription" 
               placeholder="Descripción" 
               className="form-input mx-2 col-span-3 row-span-2 focus:border-black focus:shadow"
               value={newObjectDescription}
               maxLength={100}
               onChange={(e) => setNewObjectDescription(e.target.value)}
            />
            <button type="button" className="btn-add-object col-span-3 mx-2" onClick={() => handleAddObject()} >Añadir</button>
            
         </fieldset>

         <aside className='panel-save'>
            <button type='button' className='btn-save-character' onClick={() => handleOpenModal()} >
               <SvgSaveCharacter className='icon' width={40} height={40} />
            </button>
         </aside>

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
               <ul className='dialog-card col-span-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                  <li className='col-span-2'><strong>Jugador: </strong>{dataCharacter?.player}</li>
                  <li className='col-span-2'><strong>Personaje: </strong>{dataCharacter?.name}</li>
                  <li><strong>Nivel: </strong>{dataCharacter?.level}</li>
                  <li><strong>Clase: </strong>{getClassName(dataCharacter?.class)}</li>
                  <li><strong>Raza: </strong>{getRaceName(dataCharacter?.race)}</li>
                  <li><strong>Trabajo: </strong>{getJobName(dataCharacter?.job)}</li>
                  <li className='col-span-2'><strong>Descripcion: </strong>{dataCharacter?.description}</li>
                  <li className='col-span-2'><strong>Conocimientos: </strong>{getKnowledgeName(dataCharacter?.knowledge)}</li>
               </ul>
               <table className='dialog-table '>
                  <thead>
                     <tr><th colSpan={2}>Estadisticas</th></tr>
                  </thead>
                  <tbody>
                     <tr>
                        <td>Fuerza</td>
                        <td>{(dataCharacter?.str[0].dice||0) + (dataCharacter?.str[0].class||0) + (dataCharacter?.str[0].level||0) }</td>
                     </tr>
                     <tr>
                        <td>Inteligencia</td>
                        <td>{(dataCharacter?.int[0].dice||0) + (dataCharacter?.int[0].class||0) + (dataCharacter?.int[0].level||0) }</td>
                     </tr>
                     <tr>
                        <td>Destreza</td>
                        <td>{(dataCharacter?.dex[0].dice||0) + (dataCharacter?.dex[0].class||0) + (dataCharacter?.dex[0].level||0) }</td>
                     </tr>
                     <tr>
                        <td>Constitucion</td>
                        <td>{(dataCharacter?.con[0].dice||0) + (dataCharacter?.con[0].class||0) + (dataCharacter?.con[0].level||0) }</td>
                     </tr>
                     <tr>
                        <td>Percepcion</td>
                        <td>{(dataCharacter?.per[0].dice||0) + (dataCharacter?.per[0].class||0) + (dataCharacter?.per[0].level||0) }</td>
                     </tr>
                     <tr>
                        <td>Carisma</td>
                        <td>{(dataCharacter?.cha[0].dice||0) + (dataCharacter?.cha[0].class||0) + (dataCharacter?.cha[0].level||0) }</td>
                     </tr>
                  </tbody>
               </table>
               <ul className='dialog-card grid grid-cols-1 gap-3 col-start-1 row-start-2 items-center '>
                  <li className=''><strong>Alineacion: </strong>{dataCharacter?.alignment}</li>
               </ul>
               <ul className='dialog-card grid grid-cols-1 gap-3 col-start-1'>
                  <li><strong>Habilidad principal: </strong>{getMainSkillName(dataCharacter?.mainSkill)}</li>
                  <li><strong>Habilidad extra: </strong>{getExtraSkillName(dataCharacter?.extraSkill)}</li>
                  {dataCharacter?.skills.map((elem) => (
                     <li key={elem.value}><strong>Habilidad: </strong>{getSkillName(elem.name,elem.stat||'')}</li>
                  ))}
               </ul>
               <ul className='dialog-card grid grid-cols-1 gap-3 col-start-2 row-start-2 items-center'>
                  <li><strong>Arma principal: </strong>{dataCharacter?.mainWeapon}</li>
               </ul>
               <ul className='dialog-card grid grid-cols-1 gap-3 col-start-2'>
                  <li><strong>Arma secundaria: </strong>{dataCharacter?.secondaryWeapon}</li>
               </ul>
               <ul className='dialog-card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 col-start-3 row-start-2'>
                  <li className='md:col-span-2 lg:col-span-3'><strong>Dinero: </strong> </li>
                  <li>Oro: {dataCharacter?.coinsInv[0]}</li>
                  <li>Plata: {dataCharacter?.coinsInv[1]}</li>
                  <li>Cobre: {dataCharacter?.coinsInv[2]}</li>
               </ul>
               <ul className='dialog-card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 col-start-3'>
                  <li className='md:col-span-2 lg:col-span-3'>Inventario: </li>
                  {dataCharacter?.inv.map((elem) => (
                     <li key={elem.id}><strong>{elem.name}: </strong>{elem.count}</li>
                  ))}
               </ul>
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
            
      </form>
      </>
    )
}

export default CharacterSheet;