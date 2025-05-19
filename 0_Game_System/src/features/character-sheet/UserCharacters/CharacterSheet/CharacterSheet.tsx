import React, { useState, ChangeEvent, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, useLoaderData } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";

// NextUI Components
import {
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import "./CharacterSheet.css";

// Database Services
import {
  addStorageCharacter,
  getUrlCharacter,
} from "@database/storage/dbStorage";
import {
  deleteItemInventory,
  getCharacter,
  getGameSystem,
  getCharacterStats,
  getListHad,
  getCharacterInventory,
  insertPus,
  updateCharacterStats,
  updateCharacter,
  getCharacterSkills,
} from "@features/character-sheet/infrastructure/services";
import {
  insertDataEpe,
  upsertDataHpe,
  upsertDataInp,
} from "@database/models/dbTables";

// Local Components
import FormSelectInfoPlayer from "./FormSelectInfoPlayer/FormSelectInfoPlayer";
import FormCardCheckbox from "./FormCardCheckbox/FormCardCheckbox";
import FormInputStats from "./FormInputStats/FormInputStats";
import FormInputSkillsRing from "./FormInputSkillsRing/FormInputSkillsRing";
import FormImageFile from "./FormImageFile/FormImageFile";

// Type Definitions
import {
  InputStats,
  SkillTypes,
  SkillsAcquired,
  InventoryObject,
  SkillFields,
  Option,
} from '@shared/utils/types/typesCharacterSheet';
import {
  DBEstadisticaPersonaje,
  DBHabilidad,
  DBHabilidadPersonaje,
  DBInventarioPersonaje,
  DBPersonajesUsuario,
  DBSistemaJuego,
  DBUsuario,
  initialPersonajesUsuario,
} from '@shared/utils/types';

// Utility Functions
import { validateNumeric } from "@shared/utils/helpers/utilConversions";
import { normalizeUser } from "@shared/utils/helpers/userHelpers";
import { mapSkillFields } from "./fixSkills";
import { 
  getCharacterProperty, 
  setCharacterProperty, 
  getGameSystemProperty,
  validateCharacter,
  validateCharacterStats,
  safeNumberConversion
} from "@shared/utils/helpers/characterHelpers";

// Assets and Icons
import mainBackground from "@img/webp/bg-home-02.webp";
import ScreenLoader from "@UI/ScreenLoader/ScreenLoader";
import SvgCharacter from "@Icons/SvgCharacter";
import SvgSaveCharacter from "@Icons/SvgSaveCharacter";
import SvgD4Roll from "@Icons/SvgD4Roll";
import SvgDeleteItem from "@Icons/SvgDeleteItem";

// Constants
import { 
  optionsCharacterClass, 
  optionsCharacterRace, 
  optionsCharacterJob, 
  optionsRingTypes, 
  listWearpons, 
  checkboxesData 
} from '../../constants/characterOptions';

interface CharacterSheetProps {
  changeBackground: (newBackground: string) => void;
}

interface CharacterForm {
  userName: string;
  name: string;
  class: string;
  level: number;
  luckyPoints: number;
  lifePoints: number;
  mainWeapon: string;
  secondaryWeapon: string;
  goldCoins: number;
  silverCoins: number;
  bronzeCoins: number;
  characterDescription: string;
  race: string;
  job: string;
  alignment: string;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({
  changeBackground,
}) => {
  const loaderData = useLoaderData() as {
    user: DBUsuario;
    character?: DBPersonajesUsuario;
  };
  
  const normalizedUser = normalizeUser(loaderData?.user);
    const safeData = {
    user: normalizedUser,
    character: loaderData?.character
  };
  
  const { user, character: initialCharacter } = safeData;

  // Evitar potenciales errores si user es nulo o undefined
  const userName = user?.usu_nombre || '';

  const defaultValues = useMemo(() => {
    return initialCharacter
      ? {
          userName: userName,
          name: getCharacterProperty(initialCharacter, 'pus_nombre', ''),
          class: getCharacterProperty(initialCharacter, 'pus_clase', ''),
          level: getCharacterProperty(initialCharacter, 'pus_nivel', 1),
          luckyPoints: getCharacterProperty(initialCharacter, 'pus_puntos_suerte', 0),
          lifePoints: getCharacterProperty(initialCharacter, 'pus_vida', 0),
          mainWeapon: getCharacterProperty(initialCharacter, 'pus_arma_principal', ''),
          secondaryWeapon: getCharacterProperty(initialCharacter, 'pus_arma_secundaria', ''),
          goldCoins: getCharacterProperty(initialCharacter, 'pus_cantidad_oro', 0),
          silverCoins: getCharacterProperty(initialCharacter, 'pus_cantidad_plata', 0),
          bronzeCoins: getCharacterProperty(initialCharacter, 'pus_cantidad_bronce', 0),
          characterDescription: getCharacterProperty(initialCharacter, 'pus_descripcion', ''),
          race: getCharacterProperty(initialCharacter, 'pus_raza', ''),
          job: getCharacterProperty(initialCharacter, 'pus_trabajo', ''),
          alignment: getCharacterProperty(initialCharacter, 'pus_alineacion', ''),
        }
      : {
          userName: userName,
          name: "",
          class: "",
          level: 1,
          luckyPoints: 0,
          lifePoints: 0,
          mainWeapon: "",
          secondaryWeapon: "",
          goldCoins: 0,
          silverCoins: 0,
          bronzeCoins: 0,
          characterDescription: "",
          race: "",
          job: "",
          alignment: "",
        };
  }, [initialCharacter, userName]);
  const {
    register,
    handleSubmit,
    setValue,
    getValues
  } = useForm<CharacterForm>({
    defaultValues: defaultValues,
    mode: "onSubmit"
  });
  const [characterImage, setCharacterImage] = useState<string | undefined>(
    undefined
  );
  const [selectedSkillValue, setSelectedSkillValue] = useState<string>("");
  const [selectedExtraSkillValue, setSelectedExtraSkillValue] =
    useState<string>("");
  const [skillsAcquired, setSkillsAcquired] = useState<SkillsAcquired[]>([
    { id: "", value: "0", name: "", description: "", ring: "" },
    { id: "", value: "1", name: "", description: "", ring: "" },
    { id: "", value: "2", name: "", description: "", ring: "" },
  ]);
  const [coins, setCoins] = useState<number[]>([0, 3, 0]);
  const [invObjects, setInvObjects] = useState<InventoryObject[]>([]);
  const [systemGame, setSystemGame] = useState<DBSistemaJuego>({
    sju_id: "",
    sju_nombre: "",
    sju_descripcion: ""
  });
  const [skillsRingList, setSkillsRingList] = useState<SkillTypes[]>([
    { id: "0", skills: [] },
    { id: "1", skills: [] },
    { id: "2", skills: [] },
  ]);
  const [fieldSkill, setFieldSkill] = useState<SkillFields[]>([
    { id: "", skill: "", field: "skillClass" },
    { id: "", skill: "", field: "skillExtra" },
  ]);
  const [newObjectName, setNewObjectName] = useState<string>("");
  const [newObjectDescription, setNewObjectDescription] = useState<string>("");
  const [newObjectCount, setNewObjectCount] = useState<number>(1);
  const [SystemGameList, setSystemGameList] = useState<Option[]>([]);
  const [deleteItems, setDeleteItems] = useState<string[]>([]);

  // Listado del select skillClass
  const [optionsSkillClass, setOptionsSkillClass] = useState<Option[]>([]);
  // Listado del select skillExtra
  const [optionsSkillExtra, setOptionsSkillExtra] = useState<Option[]>([]);
  // Listado del select skillTypeRing
  const [skillsTypes, setSkillsTypes] = useState<SkillTypes[]>([]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState<boolean>(true);
  const [newRecord, setNewRecord] = useState<boolean>(true);
  const [character, setCharacter] = useState<DBPersonajesUsuario>(
    initialPersonajesUsuario
  );
  const navigate = useNavigate();
  const params = useParams();

  const [inputsStatsData, setInputsStatsData] = useState<InputStats[]>([
    { id: 'STR', label: 'Fuerza', description: 'Fuerza física y potencia muscular', valueDice: 1, valueClass: 0, valueLevel: 0 },
    { id: 'INT', label: 'Inteligencia', description: 'Capacidad mental y conocimiento', valueDice: 1, valueClass: 0, valueLevel: 0 },
    { id: 'DEX', label: 'Destreza', description: 'Agilidad y precisión', valueDice: 1, valueClass: 0, valueLevel: 0 },
    { id: 'CON', label: 'Constitución', description: 'Resistencia y salud', valueDice: 1, valueClass: 0, valueLevel: 0 },
    { id: 'PER', label: 'Percepción', description: 'Atención y observación', valueDice: 1, valueClass: 0, valueLevel: 0 },
    { id: 'CHA', label: 'Carisma', description: 'Personalidad y liderazgo', valueDice: 1, valueClass: 0, valueLevel: 0 }
  ]);

  // Calculate total stats with useMemo to optimize performance
  const totalStats = useMemo(() => {
    return {
      str: inputsStatsData[0].valueDice + inputsStatsData[0].valueClass + inputsStatsData[0].valueLevel,
      int: inputsStatsData[1].valueDice + inputsStatsData[1].valueClass + inputsStatsData[1].valueLevel,
      dex: inputsStatsData[2].valueDice + inputsStatsData[2].valueClass + inputsStatsData[2].valueLevel,
      con: inputsStatsData[3].valueDice + inputsStatsData[3].valueClass + inputsStatsData[3].valueLevel,
      per: inputsStatsData[4].valueDice + inputsStatsData[4].valueClass + inputsStatsData[4].valueLevel,
      cha: inputsStatsData[5].valueDice + inputsStatsData[5].valueClass + inputsStatsData[5].valueLevel,
      total: inputsStatsData.reduce((sum, stat) => sum + stat.valueDice + stat.valueClass + stat.valueLevel, 0)
    };
  }, [inputsStatsData]);
  
  /**
   * Helper function to calculate the total value of a stat from inputsStatsData
   * Uses the cached totalStats when possible to avoid recalculations
   */
  const getStatTotal = useCallback((statId: string): number => {
    // Usar un objeto de mapeo para evitar el switch/case y mejorar la legibilidad
    const statsMap: Record<string, number | undefined> = {
      'STR': totalStats.str,
      'INT': totalStats.int,
      'DEX': totalStats.dex,
      'CON': totalStats.con,
      'PER': totalStats.per,
      'CHA': totalStats.cha,
      'total': totalStats.total
    };

    // Buscar primero en el mapa para rendimiento óptimo
    const mappedValue = statsMap[statId];
    if (mappedValue !== undefined) {
      return mappedValue;
    }

    // Fallback calculation solo si es necesario
    const stat = inputsStatsData.find(s => s.id === statId);
    if (!stat) return 0;
    
    // Calculamos y cacheamos el resultado para futuras llamadas
    const calculatedValue = stat.valueDice + stat.valueClass + stat.valueLevel;
    return calculatedValue;
  }, [totalStats, inputsStatsData]);

  interface DataCharacter {
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
    str: [{ dice: number; class: number; level: number }];
    int: [{ dice: number; class: number; level: number }];
    dex: [{ dice: number; class: number; level: number }];
    con: [{ dice: number; class: number; level: number }];
    per: [{ dice: number; class: number; level: number }];
    cha: [{ dice: number; class: number; level: number }];
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

  const getInventory = useCallback(async () => {
    const updatedInvObjects = [...invObjects];

    if (updatedInvObjects.length !== 0) return;

    if (params.id === null || params.id === undefined) {
      updatedInvObjects.push({
        id: uuidv4(),
        name: "Gema",
        description: "Articulo del elegido",
        count: 1,
        readOnly: true,
      });
      setInvObjects(updatedInvObjects);
      return;
    }

    const data = await getCharacterInventory(params.id);

    if (data !== null) {
      data.forEach((elem: DBInventarioPersonaje) => {
        updatedInvObjects.push({
          id: elem.inp_id,
          name: elem.inp_nombre,
          description: elem.inp_descripcion,
          count: elem.inp_cantidad,
          readOnly: false,
        });
      });
      setInvObjects(updatedInvObjects);
    }
  }, [invObjects, params.id]);

  const handleSelectedRingSkillChange = useCallback((
    id: string,
    ring: string,
    skill: string,
    stat: string
  ) => {
    console.log('handleSelectedRingSkillChange', {id, ring, skill, stat});
    setSkillsAcquired((prevItems) =>
      prevItems.map((item) =>
        item.value === id
          ? { ...item, name: skill, ring: ring, stat: stat, id: skill }
          : item
      )
    );
  }, []);

  const handleSelectedTypeRingSkillChange = useCallback(async (
    id: string,
    type: string
  ) => {
    console.log('handleSelectedTypeRingSkillChange', {id, type});
    setSkillsRingList(prevList => {
      const newList = [...prevList];
      const skills = skillsTypes.find(option => option.id === type)?.skills || [];
      console.log('New skills for ring', id, ':', skills.map(s => s.name).join(', '));
      
      // Log para depuración 
      if (skills.length === 0) {
        console.warn(`No se encontraron habilidades para el tipo ${type}. skillsTypes contiene:`, 
          skillsTypes.map(s => ({ id: s.id, numSkills: s.skills.length })));
      }
      
      newList[Number(id)] = {
        ...newList[Number(id)],
        skills: skills
      };
      
      // Reset the skill selection when changing the skill type
      setSkillsAcquired(prev => 
        prev.map((item) => 
          item.value === id
            ? { ...item, name: "", id: "", ring: type }
            : item
        )
      );
      
      return newList;
    });
  }, [skillsTypes]);

  const getSkills = useCallback(async () => {
    const data = await getListHad();
    
    if (data !== null) {
      const updatedFieldSkill = fieldSkill.map(item => ({...item}));
      const updatedSkills = skillsAcquired.map(item => ({...item}));

      let characterSkills: DBHabilidadPersonaje[] = [];
      if (params.id) {
        characterSkills = await getCharacterSkills(params.id);
        console.log("Habilidades cargadas:", characterSkills);
      }
      (data as DBHabilidad[]).forEach((rawElem: DBHabilidad) => {
        // Usar nuestro helper para mapear campos de manera segura
        const elem = mapSkillFields(rawElem);

        if (elem.tipo === "C") {
          const existingSkill = characterSkills.find(skill => 
            skill.hpe_campo === "skillClass" && skill.hpe_habilidad === elem.id);
          
          if (existingSkill) {
            setSelectedSkillValue(elem.sigla);
            const classSkill = updatedFieldSkill.find(skill => skill.field === "skillClass");
            if (classSkill) {
              classSkill.id = elem.sigla;
              classSkill.skill = elem.id;
            }
          }
        } else if (elem.tipo === "E") {
          const existingSkill = characterSkills.find(skill => 
            skill.hpe_campo === "skillExtra" && skill.hpe_habilidad === elem.id);
          
          if (existingSkill) {
            setSelectedExtraSkillValue(elem.sigla);
            const extraSkill = updatedFieldSkill.find(skill => skill.field === "skillExtra");
            if (extraSkill) {
              extraSkill.id = elem.sigla;
              extraSkill.skill = elem.id;
            }
          }
        } else if (elem.tipo === "R") {
          const existingRingSkill = characterSkills.find(skill => 
          skill.hpe_campo.startsWith("skillRing") && skill.hpe_habilidad === elem.id);
          if (existingRingSkill) {
            const ringNumber = existingRingSkill.hpe_campo.replace("skillRing", "");
            
            handleSelectedTypeRingSkillChange(ringNumber, elem.estadistica_base);
            
            const ringIndex = Number(ringNumber);
            if (ringIndex >= 0 && ringIndex < updatedSkills.length) {
              updatedSkills[ringIndex] = {
                id: elem.id,
                value: ringNumber,
                name: elem.sigla,
                description: elem.descripcion || "",
                ring: elem.estadistica_base,
                stat: elem.estadistica_base
              };
            }
          }
        }
      });
      
      setSkillsAcquired(updatedSkills);
      setFieldSkill(updatedFieldSkill);
    }
  }, [params.id, handleSelectedTypeRingSkillChange]);

  const getCharacterImage = useCallback(async () => {
    if (!user || !params.id) return;

    const normalizedUser = normalizeUser(user);

    if (!normalizedUser.usu_id) {
      console.error("User ID is undefined");
      return;
    }

    const url = await getUrlCharacter(normalizedUser.usu_id, params.id);
    if (url) {
      const refreshParam = Math.random().toString(36).substring(7);
      setCharacterImage(url + "?" + refreshParam);
    }
  }, [user, params.id]);

  const getStats = useCallback(async () => {
    if (params.id === null || params.id === undefined) return;

    const data = await getCharacterStats(params.id);

    if (data !== null) {
      const updatedInputsStatsData = inputsStatsData.map((item, index) => {
        if (index < data.length) {
          return {
            ...item,
            valueDice: data[index].epe_num_dado,
            valueClass: data[index].epe_num_clase,
            valueLevel: data[index].epe_num_nivel
          };
        }
        return item;
      });
      
      setInputsStatsData(updatedInputsStatsData);
    }
  }, [params.id]);
  const getInfoCharacter = useCallback(async () => {
    try {
      if (!user || !user.id) {
        console.error("User ID is undefined");
        return;
      }
      
      const userId = user.id;
      
      // For new characters, just initialize with defaults
      if (params.id === null || params.id === undefined) {
        setCharacter({
          ...initialPersonajesUsuario,
          pus_id: uuidv4(),
          pus_usuario: userId
        });
        return;
      }

      // Fetch character data with error handling
      const data = await withErrorHandling(
        () => getCharacter(params.id!), 
        "fetching character data"
      );
      
      if (!data || data.length === 0) {
        console.error("No character data found for ID:", params.id);
        alert(`No se encontró información del personaje con ID: ${params.id}`);
        return;
      }
      
      // Process character data
      try {
        const characterData = { ...data[0], pus_usuario: userId };
          // Validate key fields using type-safe property access
        const missingFields: string[] = [];
        if (!getCharacterProperty(characterData, 'pus_nombre')) missingFields.push('pus_nombre');
        if (!getCharacterProperty(characterData, 'pus_clase')) missingFields.push('pus_clase');
        if (!getCharacterProperty(characterData, 'pus_raza')) missingFields.push('pus_raza');
        if (!getCharacterProperty(characterData, 'pus_trabajo')) missingFields.push('pus_trabajo');
        
        if (missingFields.length > 0) {
          console.warn("Missing character fields:", missingFields);
        }
        
        // Set character data in state
        setCharacter(characterData as DBPersonajesUsuario);
        // Handle game system data
        if (characterData.sju_sistema_juego) {
          const gameSystem = characterData.sju_sistema_juego;
          
          if (!getGameSystemProperty(gameSystem, 'sju_id') || 
              !getGameSystemProperty(gameSystem, 'sju_nombre')) {
            console.warn("Game system data is incomplete:", gameSystem);
          }
          
          setSystemGame({
            sju_id: getGameSystemProperty(gameSystem, 'sju_id', ''),
            sju_nombre: getGameSystemProperty(gameSystem, 'sju_nombre', 'Sistema Desconocido'),
            sju_descripcion: getGameSystemProperty(gameSystem, 'sju_descripcion', '')
          });
        } else {
          console.warn("No game system found for character:", getCharacterProperty(characterData, 'pus_id'));
          // Set default game system if none found
          setSystemGame({
            sju_id: '',
            sju_nombre: 'Sistema por defecto',
            sju_descripcion: ""
          });
        }
      } catch (parseError) {
        console.error("Error processing character data:", parseError);
        alert("Error al procesar los datos del personaje. Algunos campos pueden no estar disponibles.");
      }
    } catch (error) {
      handleAsyncError(error, "fetching character info");
    }
  }, [params.id, user]);
  
  useEffect(() => {
    /*console.log("Actualizando valores de formulario desde character:", {
      nombre: character?.pus_nombre,
      descripcion: character?.pus_descripcion,
      clase: character?.pus_clase,
      raza: character?.pus_raza,
      trabajo: character?.pus_trabajo,
      usuario: user?.usu_nombre
    });*/
    
    if (character?.pus_nombre) setValue("name", character.pus_nombre);
    if (character?.pus_descripcion) setValue("characterDescription", character.pus_descripcion);
    if (character?.pus_clase) setValue("class", character.pus_clase);
    if (character?.pus_raza) setValue("race", character.pus_raza);
    if (character?.pus_trabajo) setValue("job", character.pus_trabajo);
    if (user?.usu_nombre) setValue("userName", user.usu_nombre);
  }, [character, setValue, user]);

  useEffect(() => {
    getSkills();
  }, [getSkills]);

  useEffect(() => {
    changeBackground(mainBackground);
    const loadInfo = async () => {
      document.documentElement.scrollTop = 0;
      const isNewRecord = params.id === null || params.id === undefined;
      setNewRecord(isNewRecord);
      setLoading(true);
      
      try {
        // Load initial data sequentially for better error handling
        console.log("Cargando datos iniciales...");
        
        // First fetch skill data which is needed for all characters
        await withErrorHandling(
          () => getListSkill(),
          "loading skill data"
        );
        
        // For existing characters, fetch character data
        if (!isNewRecord) {
          await withErrorHandling(
            () => getInfoCharacter(),
            "loading character information"
          );
        }
        
        // Load support data
        await withErrorHandling(
          () => getGameSystemList(),
          "loading game systems"
        );
        
        // Load optional data like character image
        if (!isNewRecord) {
          await withErrorHandling(
            () => getCharacterImage(),
            "loading character image"
          );
        }
        
        // Load remaining character data in parallel
        if (!isNewRecord) {
          await Promise.all([
            withErrorHandling(() => getStats(), "loading character stats"),
            withErrorHandling(() => getInventory(), "loading inventory")
          ]);
        }
      } catch (error) {
        handleAsyncError(error, "initializing character sheet");
      } finally {
        setLoading(false);
      }
    };
    
    loadInfo();
  }, [params.id, changeBackground]);
  
  async function getListSkill() {
    try {
      console.log("Fetching skill list data...");
      const data = await getListHad();
      console.log("Raw skill data received:", data);

      if (data !== null && Array.isArray(data) && data.length > 0) {
        const updatedOptionsSkillClass: Option[] = [];
        const updatedOptionsSkillExtra: Option[] = [];
        const otherSkills: SkillTypes[] = [];
        
        (data as DBHabilidad[]).forEach((rawElem) => {
          // Create consistent field mappings regardless of database field names
          const elem = {
            id: rawElem.hab_id || rawElem.id || '',
            nombre: rawElem.hab_nombre || rawElem.nombre || '',
            sigla: rawElem.hab_siglas || rawElem.sigla || '',
            tipo: rawElem.hab_tipo || rawElem.tipo || '',
            estadistica_base: rawElem.had_estadistica_base || rawElem.estadistica_base || '',
            descripcion: rawElem.hab_descripcion || rawElem.descripcion || ''
          };
          
          /*console.log("Mapped skill fields:", elem);*/
          
          if (!elem || !elem.tipo || !elem.id || !elem.sigla || !elem.nombre) {
            console.warn("Skipping invalid skill data:", elem);
            return;
          }
          
          if (elem.tipo === "C") {
            updatedOptionsSkillClass.push({
              id: elem.id,
              value: elem.sigla,
              name: elem.nombre,
            });
          } else if (elem.tipo === "E") {
            updatedOptionsSkillExtra.push({
              id: elem.id,
              value: elem.sigla,
              name: elem.nombre,
            });
          } else if (elem.tipo === "R" && elem.estadistica_base) {
            const countSkill = otherSkills.filter(
              (option: SkillTypes) => option.id === elem.estadistica_base
            ).length;
            if (countSkill === 0) {
              otherSkills.push({
                id: elem.estadistica_base,
                skills: [
                  {
                    id: elem.id,
                    value: elem.sigla,
                    name: elem.nombre,
                  },
                ],
              });
            } else {
              const existingSkill = otherSkills.find(
                (option: SkillTypes) => option.id === elem.estadistica_base
              );
              if (existingSkill) {
                existingSkill.skills.push({
                  id: elem.id,
                  value: elem.sigla,
                  name: elem.nombre,
                });
              }
            }
          }
        });
        
        // Only update state if we actually have options
        if (updatedOptionsSkillClass.length > 0) {
          setOptionsSkillClass(updatedOptionsSkillClass);
        } else {
          console.warn("No Class skill options processed from data");
        }
        
        if (updatedOptionsSkillExtra.length > 0) {
          setOptionsSkillExtra(updatedOptionsSkillExtra);
        } else {
          console.warn("No Extra skill options processed from data");
        }
        
        if (otherSkills.length > 0) {
          setSkillsTypes(otherSkills);
        }
      } else {
        console.error("Invalid or empty data received from getListHad():", data);
      }
    } catch (error) {
      console.error("Error in getListSkill:", error);
    }
  }
  
  async function getGameSystemList() {
    const data: DBSistemaJuego[] = await getGameSystem();
    if (data !== null) {
      const updatedSystemGameList = [];
      for (let i = 0; i < data.length; i++) {
        updatedSystemGameList.push({
          value: data[i].sju_id,
          name: data[i].sju_nombre,
        });
      }
      setSystemGameList(updatedSystemGameList);
    }
  }

  /*const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      
      setCharacter(
         prevState => ({
            ...prevState!,
            [name]: value
         })
      );
      
   };*/
   const handleSelectRaceChange = (value: string) => {
    clearValidationError('characterRace');
    console.log("Selecting race:", value);
    
    setCharacter((prevState) => {
      if (!prevState) return prevState;
      // Use the type-safe helper to update race property
      const updated = setCharacterProperty(prevState, 'pus_raza', value);
      console.log("Updated character state with race:", updated);
      return updated;
    });
  };

  const handleSystemGameChange = (currentSystem: string = "") => {
    if (!currentSystem) return;
    const option = SystemGameList.filter((elem) => elem.value === currentSystem);
    if (option.length === 0) return;
    
    console.log("Cambiando sistema de juego:", currentSystem, option[0].name);
    
    setSystemGame({
      sju_id: option[0].value,
      sju_nombre: option[0].name,
      sju_descripcion: systemGame.sju_descripcion
    });
      setCharacter((prevState) => {
      if (!prevState) return prevState;
      // Use the type-safe helper to update system game property
      return setCharacterProperty(prevState, 'pus_sistema_juego', currentSystem);
    });
  };
  const handleSelectSkillChange = (currentSkill: string) => {
    console.log("handleSelectSkillChange called with:", currentSkill);
    if (!currentSkill) {
      console.log("Empty skill value, skipping update");
      setSelectedSkillValue("");
      return;
    }
    
    const option = optionsSkillClass.filter(
      (skill) => skill.value === currentSkill
    );
    
    if (option.length > 0) {
      console.log("Found matching option for skillClass:", option[0]);
      setFieldSkill((prevItems) =>
        prevItems.map((item) =>
          item.field === "skillClass"
            ? { ...item, id: option[0].value, skill: option[0].id || "" }
            : item
        )
      );
      setSelectedSkillValue(currentSkill);
    } else {
      console.warn("No matching option found for skillClass:", currentSkill);
    }
  };

  const handleSelectExtraSkillChange = (currentSkill: string) => {
    console.log("handleSelectExtraSkillChange called with:", currentSkill);
    if (!currentSkill) {
      console.log("Empty extra skill value, skipping update");
      setSelectedExtraSkillValue("");
      return;
    }
    
    const option = optionsSkillExtra.filter(
      (skill) => skill.value === currentSkill
    );
    
    if (option.length > 0) {
      console.log("Found matching option for skillExtra:", option[0]);
      setFieldSkill((prevItems) =>
        prevItems.map((item) =>
          item.field === "skillExtra"
            ? { ...item, id: option[0].value, skill: option[0].id || "" }
            : item
        )
      );
      setSelectedExtraSkillValue(currentSkill);
    } else {
      console.warn("No matching option found for skillExtra:", currentSkill);
    }
  };

  const updStatsPoints = (selectedClass: string, selectedJob: string): void => {
    const updatedInputsStatsData = [...inputsStatsData];
    const extraPoints =
      optionsCharacterJob.find((option) => option.value === selectedJob)
        ?.extraPoint || "";

    updatedInputsStatsData[0].valueClass =
      (selectedClass === "WAR" ? 2 : 0) + (extraPoints.includes("STR") ? 1 : 0);
    updatedInputsStatsData[1].valueClass =
      (selectedClass === "MAG" ? 2 : 0) + (extraPoints.includes("INT") ? 1 : 0);
    updatedInputsStatsData[2].valueClass =
      (selectedClass === "SCO" ? 2 : 0) + (extraPoints.includes("DEX") ? 1 : 0);
    updatedInputsStatsData[3].valueClass =
      (selectedClass === "MED" ? 2 : 0) + (extraPoints.includes("CON") ? 1 : 0);
    updatedInputsStatsData[4].valueClass =
      (selectedClass === "RES" ? 2 : 0) + (extraPoints.includes("PER") ? 1 : 0);
    updatedInputsStatsData[5].valueClass =
      (selectedClass === "ACT" ? 2 : 0) + (extraPoints.includes("CHA") ? 1 : 0);

    setInputsStatsData(updatedInputsStatsData);
  };
  
  const handleCharacterClassChange = (value: string) => {
    clearValidationError('characterClass');
    
    const selectedOption = optionsCharacterClass.find(
      (option) => option.value === value
    );
    
    console.log("Selecting class:", value, "Option found:", selectedOption);
    
    // Asignar el conocimiento según la clase seleccionada
    let knowledgeValue = "";
    switch (value) {
      case 'WAR': knowledgeValue = "FOR"; break;
      case 'MAG': knowledgeValue = "SAB"; break;
      case 'SCO': knowledgeValue = "HER"; break;
      case 'MED': knowledgeValue = "ALC"; break;
      case 'RES': knowledgeValue = "ACO"; break;
      case 'ACT': knowledgeValue = "ART"; break;
    }
      setCharacter((prevState) => {
      if (!prevState) return prevState;
      // Usar nuestra función de utilidad para actualizar propiedades de manera segura
      let updated = setCharacterProperty(prevState, 'pus_clase', value);
      updated = setCharacterProperty(updated, 'pus_conocimientos', knowledgeValue);
      console.log("Updated character state with class:", updated);
      return updated;
    });

    // Use optional chaining to avoid non-null assertion
    updStatsPoints(value, character?.pus_trabajo || '');
    const skillValue = selectedOption?.mainStat ? "S" + selectedOption.mainStat : "";
    setSelectedSkillValue(skillValue);
    handleSelectSkillChange(skillValue);
  };
    const handleCharacterJobSelectChange = (value: string) => {
    clearValidationError('characterJob');
    console.log("Selecting job:", value);
      setCharacter((prevState) => {
      if (!prevState) return prevState;
      // Use the type-safe helper to update job property
      const updated = setCharacterProperty(prevState, 'pus_trabajo', value);
      console.log("Updated character state with job:", updated);
      return updated;
    });
    
    // Use optional chaining to avoid non-null assertion
    updStatsPoints(character?.pus_clase || '', value);
  };
  /**
   * Maneja el cambio de imagen del personaje
   * 
   * Esta función se encarga de subir la imagen seleccionada al almacenamiento
   * y actualizar la URL de la imagen en el estado del componente
   * 
   * @param value - URL de la imagen seleccionada
   * @param file - Archivo de imagen seleccionado
   * @returns {Promise<void>}
   */
  const handleCharacterImageFileChange = async (value: string, file: File) => {
    if (!user || !params.id) {
      console.log("No se puede subir la imagen: Usuario o ID de personaje no disponibles");
      return;
    }

    if (!user.id) {
      console.error("User ID is undefined");
      return;
    }

    // Subir la imagen al almacenamiento
    const { path, error } = await addStorageCharacter(
      user.id,
      params.id,
      file
    );

    if (error) {
      // Mostrar error al usuario
      alert(`Error al subir la imagen: ${error}`);
      return;
    }

    // Actualizar la URL de la imagen en el estado
    if (path) setCharacterImage(value);
  };
  const handleSelectedCheckValuesChange = (newValues: string[]) => {
    console.log("Conocimientos seleccionados:", newValues);
    setCharacter((prevState) => {
      if (!prevState) return prevState;
      // Use the type-safe helper to update knowledge property
      const updated = setCharacterProperty(prevState, 'pus_conocimientos', newValues.join(","));
      console.log("Estado actualizado con conocimientos:", updated);
      return updated;
    });
  };
  const handleStatsInputChange = (newInputStats: InputStats) => {
    setInputsStatsData((prevItems) =>
      prevItems.map((item) =>
        item.id === newInputStats.id ? { ...item, ...newInputStats } : item
      )
    );
  };

  const [formAlignment, setFormAlignment] = useState<string>("");
    const handleAlignmentChange = (value: string) => {
    setCharacter((prevState) => {
      if (!prevState) return prevState;
      // Use the type-safe helper to modify the property
      return setCharacterProperty(prevState, 'pus_alineacion', value);
    });
    setFormAlignment(value);
  };
  const handleCoinsChange = (index: number, value: string) => {
    const numericValue = validateNumeric(value);
    const updatedCoins = [...coins];
    updatedCoins[index] = numericValue;
    setCoins(updatedCoins);
  };
  
  /**
   * Validates an inventory object and ensures it has all required fields
   * @param object The inventory object to validate
   * @returns A valid inventory object with defaults for missing fields
   */
  const validateInventoryObject = (object: Partial<InventoryObject>): InventoryObject => {
    return {
      id: object.id || uuidv4(),
      name: object.name || '',
      description: object.description || 'Sin descripción',
      count: object.count !== undefined ? object.count : 1,
      readOnly: object.readOnly || false
    };
  };

  /**
   * Validates an inventory object and returns null if valid, or an error message if invalid
   */
  const validateInventoryItem = useCallback((name: string, count: number): string | null => {
    if (!name.trim()) {
      return "El nombre del objeto es obligatorio";
    }
    if (isNaN(count) || count < 1) {
      return "La cantidad debe ser un número mayor a 0";
    }
    return null;
  }, []);

  const handleAddObject = useCallback(() => {
    const errorMessage = validateInventoryItem(newObjectName, newObjectCount);
    if (errorMessage) {
      alert(errorMessage);
      document.getElementById("objectName")?.focus();
      return;
    }    // Use our validateInventoryObject function to ensure object has all required fields
    const newObject = validateInventoryObject({
      id: uuidv4(),
      name: newObjectName.trim(),
      description: newObjectDescription.trim(),
      count: newObjectCount,
      readOnly: false,
    });

    setInvObjects((prev) => [...prev, newObject]);
    setNewObjectName("");
    setNewObjectDescription("");
    setNewObjectCount(1);
  }, [newObjectName, newObjectCount, newObjectDescription, validateInventoryItem]);

  const handleDeleteObject = useCallback(async (id: string) => {
    setInvObjects((prevObjects) => prevObjects.filter((obj) => obj.id !== id));
    setDeleteItems((prevItems) => [...prevItems, id]);
  }, []);

  const handleEditCount = useCallback((id: string, newCount: string) => {
    // Convert input string to a valid number with default value of 1
    const numericValue = validateNumeric(newCount, 1);
    
    setInvObjects((prevObjects) =>
      prevObjects.map((obj) =>
        obj.id === id ? { ...obj, count: numericValue } : obj
      )
    );
  }, []);

  const handleNewCount = (value: string) => {
    const numericValue = validateNumeric(value, 1);
    setNewObjectCount(numericValue);
  };
  const [emptyRequiredFields, setEmptyRequiredFields] = useState<string[]>([]);

  const clearValidationError = (fieldId: string) => {
    if (emptyRequiredFields.includes(fieldId)) {
      setEmptyRequiredFields(prev => prev.filter(field => field !== fieldId));
    }
  };
    // Función para abrir el modal con validación manual  
  /**
   * Valida los campos requeridos para abrir el modal
   * @returns array de strings con los campos que faltan
   */
  const validateRequiredFields = (): string[] => {
    const fieldsRequired: string[] = [];
    
    // Validate required character properties
    if (!character?.pus_raza?.trim()) {
      console.log("Falta la raza");
      fieldsRequired.push('characterRace');
    }
    if (!character?.pus_trabajo?.trim()) {
      console.log("Falta el trabajo");
      fieldsRequired.push('characterJob');
    }
    if (!character?.pus_clase?.trim()) {
      console.log("Falta la clase");
      fieldsRequired.push('characterClass');
    }
    
    // Validate form fields
    const formValues = getValues();
    if (!formValues.name?.trim()) {
      console.log("Falta el nombre del personaje");
      fieldsRequired.push('name');
    }
    
    // Validate stats - use our getStatTotal helper
    const totalStatsSum = getStatTotal('total');
    if (totalStatsSum <= 0) {
      console.log("No hay estadísticas definidas");
      fieldsRequired.push('stats');
    }
    
    return fieldsRequired;
  };
  
  /**
   * Prepara los datos del personaje para el modal
   * @returns Un objeto DataCharacter con todos los datos del personaje
   */
  const prepareCharacterData = (): DataCharacter => {
    if (!character) {
      throw new Error("Character data is missing");
    }
    
    return {
      id: character.pus_id || '',
      player: character.pus_usuario || '',
      name: character.pus_nombre || '',
      class: character.pus_clase || '',
      race: character.pus_raza || '',
      job: character.pus_trabajo || '',
      level: character.pus_nivel || 1,
      luckyPoints: character.pus_puntos_suerte || 0,
      description: character.pus_descripcion || '',
      knowledge: character.pus_conocimientos ? character.pus_conocimientos.split(",").filter(Boolean) : [],
      str: [
        {
          dice: inputsStatsData[0].valueDice,
          class: inputsStatsData[0].valueClass,
          level: inputsStatsData[0].valueLevel,
        },
      ],
      int: [
        {
          dice: inputsStatsData[1].valueDice,
          class: inputsStatsData[1].valueClass,
          level: inputsStatsData[1].valueLevel,
        },
      ],
      dex: [
        {
          dice: inputsStatsData[2].valueDice,
          class: inputsStatsData[2].valueClass,
          level: inputsStatsData[2].valueLevel,
        },
      ],
      con: [
        {
          dice: inputsStatsData[3].valueDice,
          class: inputsStatsData[3].valueClass,
          level: inputsStatsData[3].valueLevel,
        },
      ],
      per: [
        {
          dice: inputsStatsData[4].valueDice,
          class: inputsStatsData[4].valueClass,
          level: inputsStatsData[4].valueLevel,
        },
      ],
      cha: [
        {
          dice: inputsStatsData[5].valueDice,
          class: inputsStatsData[5].valueClass,
          level: inputsStatsData[5].valueLevel,
        },
      ],
      mainWeapon: character.pus_arma_principal || '',
      secondaryWeapon: character.pus_arma_secundaria || '',
      alignment: character.pus_alineacion || '',
      mainSkill: selectedSkillValue || '',
      extraSkill: selectedExtraSkillValue || '',
      skills: skillsAcquired || [],
      coinsInv: coins || [0, 0, 0],
      inv: invObjects || [],
    };
  };

  /**
   * Abre el modal para guardar el personaje, validando primero
   * que todos los campos requeridos estén completos
   */
  const handleOpenModal = () => {
    console.log("Ejecutando handleOpenModal");
    
    // Validar campos requeridos
    const fieldsRequired = validateRequiredFields();
    setEmptyRequiredFields(fieldsRequired);
    
    if (fieldsRequired.length > 0) {
      alert("Por favor, complete todos los campos obligatorios: " + fieldsRequired.join(", "));
      return;
    }
    
    // Ensure character exists
    if (!character) {
      console.error("Character data is missing");
      return;
    }
    
    console.log("Campos requeridos completos, preparando datos para el modal...");

    try {
      const newCharacter = prepareCharacterData();
      console.log("Datos del personaje preparados para el modal:", newCharacter);
      setDataCharacter(newCharacter);
      console.log("Abriendo modal...");
      onOpen();
      console.log("Modal abierto, isOpen=", isOpen);
    } catch (error) {
      console.error("Error preparing character data:", error);
      alert("Error al preparar los datos del personaje");
    }
  };
  /**
   * Generates random dice values for character stats
   * Only allows randomization for level 1 characters
   */
  const randomRoll = useCallback(() => {
    // Prevent stat changes for characters above level 1
    if (character?.pus_nivel > 1) {
      alert("Solo puedes generar estadísticas aleatorias para personajes de nivel 1");
      return;
    }

    const updatedInputsStatsData = [...inputsStatsData];
    
    // Generate random dice values for all stats (1-4)
    for (let i = 0; i < 6; i++) {
      const randomNumber = Math.floor(Math.random() * 4) + 1;
      updatedInputsStatsData[i].valueDice = randomNumber;
    }

    setInputsStatsData(updatedInputsStatsData);
  }, [character?.pus_nivel, inputsStatsData]);

  const getClassName = (id: string | undefined): string | undefined => {
    return optionsCharacterClass.find((elem) => elem.value === id)?.name;
  };

  const getRaceName = (id: string | undefined): string | undefined => {
    return optionsCharacterRace.find((elem) => elem.value === id)?.name;
  };

  const getJobName = (id: string | undefined): string | undefined => {
    return optionsCharacterJob.find((elem) => elem.value === id)?.name;
  };
  const getKnowledgeName = (ids: string[] | undefined): string | undefined => {
    let names = "";
    if (ids === undefined || ids.length === 0) return names;
    
    // Filtrar valores vacíos
    const validIds = ids.filter(Boolean);
    if (validIds.length === 0) return names;
    
    console.log("Buscando nombres para conocimientos:", validIds);
    
    validIds.forEach((know) => {
      const found = checkboxesData.find((elem) => elem.value === know);
      if (found) {
        names += found.name + ", ";
      } else {
        console.log("Conocimiento no encontrado:", know);
      }
    });
    names = names.length > 2 ? names.substring(0, names.length - 2) : names;

    return names;
  };

  const getMainSkillName = (id: string | undefined): string | undefined => {
    return optionsSkillClass.find((elem) => elem.value === id)?.name;
  };

  const getExtraSkillName = (id: string | undefined): string | undefined => {
    return optionsSkillExtra.find((elem) => elem.value === id)?.name;
  };

  const getSkillName = (id: string, stat: string): string | undefined => {
    return skillsTypes
      .find((skill) => skill.id === stat)
      ?.skills.find((ele) => ele.value === id)?.name;
  };
  async function saveData() {
    try {
      // Before we start, validate character data
      if (!character) {
        throw new Error("No hay datos de personaje para guardar");
      }

      // Validate essential character fields
      const missingFields = validateCharacter(character);
      if (missingFields.length > 0) {
        throw new Error(`Datos incompletos del personaje: ${missingFields.join(', ')}`);
      }

      // Show saving indicator
      setLoading(true);
      
      console.log("Starting character save process", { 
        newRecord, 
        characterId: character.pus_id,
        username: character.pus_usuario
      });
      
      // Upload character information first
      let ID_CHARACTER: string;
      try {
        ID_CHARACTER = await uploadInfoCharacter(newRecord) || "";
        
        if (!ID_CHARACTER) {
          throw new Error("No se pudo guardar la información básica del personaje");
        }
        
        console.log("Character base info saved successfully with ID:", ID_CHARACTER);
      } catch (error) {
        console.error("Error during character base info upload:", error);
        throw error; // Re-throw to be caught by the outer catch
      }

      // Upload remaining data in parallel
      try {
        console.log("Uploading additional character data...");
        await Promise.all([
          uploadStats(newRecord, ID_CHARACTER)
            .catch(err => {
              console.error("Stats upload failed:", err);
              throw new Error(`Error al guardar estadísticas: ${err.message}`);
            }),
          uploadSkill(ID_CHARACTER)
            .catch(err => {
              console.error("Skills upload failed:", err);
              throw new Error(`Error al guardar habilidades: ${err.message}`);
            }),
          uploadInventory(ID_CHARACTER)
            .catch(err => {
              console.error("Inventory upload failed:", err);
              throw new Error(`Error al guardar inventario: ${err.message}`);
            }),
        ]);
        
        console.log("All character data saved successfully");
      } catch (error) {
        console.error("Error during additional character data upload:", error);
        throw error; // Re-throw to be caught by the outer catch
      }
      
      // Update state and navigate
      setNewRecord(false);
      document.documentElement.scrollTop = 0;
      onOpenChange();
      reloadPage(ID_CHARACTER);
    } catch (error) {
      console.error("Error during character save:", error);
      handleAsyncError(error, "saving character data");
    } finally {
      setLoading(false);
    }
  }

  const reloadPage = (characterId: string) => {
    navigate("/CharacterSheet/" + characterId);
  };

  async function uploadInfoCharacter(newRecord: boolean): Promise<string | undefined> {
    if (!character) {
      console.error("Character object is null or undefined");
      throw new Error("No character data available to save");
    }

    // Validate character data before saving
    const missingFields = validateCharacter(character);
    if (missingFields.length > 0) {
      console.error("Character validation failed, missing fields:", missingFields);
      throw new Error(`Datos incompletos del personaje: ${missingFields.join(', ')}`);
    }
    
    try {
      console.log("Saving character data:", character);
      if (!newRecord) {
          const data = await updateCharacter(character);
          if (!data) throw new Error("No se recibió respuesta al actualizar el personaje");
          console.log("Character updated successfully:", data);
          return data?.pus_id;
      } else {
          const data = await insertPus(character);
          if (!data) throw new Error("No se recibió respuesta al insertar el personaje");
          console.log("Character inserted successfully:", data);
          return data?.pus_id;
      }
    } catch (error) {
      console.error("Error saving character data:", error);
      throw error;
    }
  }

  async function uploadStats(isNewCharacter: boolean, characterId: string) {
    if (characterId === "") return;

    if (!isNewCharacter) {
      for (const element of inputsStatsData) {
        const record: DBEstadisticaPersonaje = {
          epe_id: uuidv4(),
          epe_personaje: characterId,
          epe_sigla: element?.id,
          epe_nombre: element?.label,
          epe_num_dado: element?.valueDice,
          epe_num_clase: element?.valueClass,
          epe_num_nivel: element?.valueLevel,
        };
        updateCharacterStats(record);
      }
    } else {
      const saveStats: DBEstadisticaPersonaje[] = [];
      for (const element of inputsStatsData) {
        saveStats.push({
          epe_id: uuidv4(),
          epe_personaje: characterId,
          epe_sigla: element?.id,
          epe_nombre: element?.label,
          epe_num_dado: element?.valueDice,
          epe_num_clase: element?.valueClass,
          epe_num_nivel: element?.valueLevel,
        });
      }
      insertDataEpe(saveStats);
    }
  }

  async function uploadSkill(characterId: string) {
    if (characterId === "") return;

    const saveSkill: DBHabilidadPersonaje[] = [];
    saveSkill.push({
      hpe_id: uuidv4(),
      hpe_personaje: characterId,
      hpe_habilidad: fieldSkill.filter(
        (skill) => skill.field === "skillClass"
      )[0].skill,
      hpe_campo: "skillClass",
      hpe_alineacion: null,
    });
    saveSkill.push({
      hpe_id: uuidv4(),
      hpe_personaje: characterId,
      hpe_habilidad: fieldSkill.filter(
        (skill) => skill.field === "skillExtra"
      )[0].skill,
      hpe_campo: "skillExtra",
      hpe_alineacion: null,
    });

    for (let index = 0; index < skillsAcquired.length; index++) {
      if (skillsAcquired[index].id === "") continue;
      saveSkill.push({
        hpe_id: uuidv4(),
        hpe_personaje: characterId,
        hpe_habilidad: skillsAcquired[index].id,
        hpe_campo: "skillRing" + skillsAcquired[index].value,
        hpe_alineacion: null,
      });
    }

    upsertDataHpe(saveSkill);
  }

  async function uploadInventory(characterId: string) {
    if (characterId === "") return;

    const saveItems: DBInventarioPersonaje[] = [];
    for (let index = 0; index < invObjects.length; index++) {
      saveItems.push({
        inp_id: invObjects[index].id,
        inp_personaje: characterId,
        inp_nombre: invObjects[index].name,
        inp_descripcion: invObjects[index].description,
        inp_cantidad: invObjects[index].count,
      });
    }

    upsertDataInp(saveItems);
    deleteItemInventory(deleteItems);
  }
  
  const onSubmitForm = (data: CharacterForm) => {
    console.log("Form submission data:", {
      formData: data,
      characterState: {
        name: character?.pus_nombre,
        clase: character?.pus_clase,
        raza: character?.pus_raza,
        trabajo: character?.pus_trabajo,
        userName: user?.usu_nombre
      },
      fieldValues: {
        nameValue: getValues("name"),
        userNameValue: getValues("userName"),
        classValue: character?.pus_clase,
        raceValue: character?.pus_raza,
        jobValue: character?.pus_trabajo
      }
    });      // Use our validateCharacterForm function to check for errors
    let fieldsRequired: string[] = validateCharacterForm();
    
    // Add additional form-specific validations
    if (!data.name?.trim()) fieldsRequired.push('name');
    
    // Validate numerical fields
    if (data.level < 1 || data.level > 10) fieldsRequired.push('level');
    if (data.luckyPoints < 0) fieldsRequired.push('luckyPoints');
    if (data.lifePoints < 0) fieldsRequired.push('lifePoints');
    
    // Validate weapon fields
    if (!data.mainWeapon?.trim()) fieldsRequired.push('mainWeapon');
    
    setEmptyRequiredFields(fieldsRequired);
    
    // Si hay campos vacíos, no enviar el formulario
    if (fieldsRequired.length > 0) {
      console.log("Required fields missing:", fieldsRequired);
      
      // Group error messages by category
      const basicInfoErrors = ['name', 'characterRace', 'characterClass', 'characterJob'];
      const statsErrors = ['stats', 'level', 'luckyPoints', 'lifePoints'];
      const weaponsErrors = ['mainWeapon', 'secondaryWeapon'];
      
      let errorMessage = "Por favor, complete todos los campos obligatorios:\n";
      
      const basicMissing = fieldsRequired.filter(field => basicInfoErrors.includes(field));
      const statsMissing = fieldsRequired.filter(field => statsErrors.includes(field));
      const weaponsMissing = fieldsRequired.filter(field => weaponsErrors.includes(field));
      
      if (basicMissing.length > 0) errorMessage += "\n- Información básica: " + basicMissing.join(", ");
      if (statsMissing.length > 0) errorMessage += "\n- Estadísticas: " + statsMissing.join(", ");
      if (weaponsMissing.length > 0) errorMessage += "\n- Armamento: " + weaponsMissing.join(", ");
      
      alert(errorMessage);
      return;
    }
    
    // Ensure character exists before proceeding
    if (!character) {
      console.error("Character data is missing");
      return;
    }
    
    const newCharacter: DataCharacter = {
      id: character.pus_id || '',
      player: character.pus_usuario || '',
      name: data.name,
      class: character.pus_clase || '',
      race: character.pus_raza || '',
      job: character.pus_trabajo || '',
      level: data.level,
      luckyPoints: character.pus_puntos_suerte || 0,
      description: data.characterDescription || '',
      knowledge: character.pus_conocimientos ? character.pus_conocimientos.split(',').filter(Boolean) : [],
      mainWeapon: data.mainWeapon || '',
      secondaryWeapon: data.secondaryWeapon || '',
      str: [
        {
          dice: inputsStatsData[0].valueDice,
          class: inputsStatsData[0].valueClass,
          level: inputsStatsData[0].valueLevel,
        },
      ],
      int: [
        {
          dice: inputsStatsData[1].valueDice,
          class: inputsStatsData[1].valueClass,
          level: inputsStatsData[1].valueLevel,
        },
      ],
      dex: [
        {
          dice: inputsStatsData[2].valueDice,
          class: inputsStatsData[2].valueClass,
          level: inputsStatsData[2].valueLevel,
        },
      ],
      con: [
        {
          dice: inputsStatsData[3].valueDice,
          class: inputsStatsData[3].valueClass,
          level: inputsStatsData[3].valueLevel,
        },
      ],
      per: [
        {
          dice: inputsStatsData[4].valueDice,
          class: inputsStatsData[4].valueClass,
          level: inputsStatsData[4].valueLevel,
        },
      ],
      cha: [
        {
          dice: inputsStatsData[5].valueDice,
          class: inputsStatsData[5].valueClass,
          level: inputsStatsData[5].valueLevel,
        },
      ],
      mainSkill: selectedSkillValue,
      extraSkill: selectedExtraSkillValue,
      alignment: character.pus_alineacion || '',
      skills: skillsAcquired,
      coinsInv: coins,
      inv: invObjects,
    };
    
    console.log("onSubmitForm: Preparando datos para el modal", newCharacter);
    setDataCharacter(newCharacter);
    console.log("onSubmitForm: Abriendo modal...");
    onOpen();
    console.log("onSubmitForm: Modal debería estar abierto ahora, isOpen=", isOpen);
  };

    /**
   * Validates the character form data and returns an array of field IDs with errors
   * @returns Array of field IDs that failed validation
   */const validateCharacterForm = (): string[] => {
    let fieldsRequired: string[] = [];
    
    // Use our character validation utility
    if (character) {
      const characterErrors = validateCharacter(character);
      // Map database field names to form field names
      characterErrors.forEach(field => {
        if (field === 'pus_nombre') fieldsRequired.push('name');
        else if (field === 'pus_raza') fieldsRequired.push('characterRace');
        else if (field === 'pus_clase') fieldsRequired.push('characterClass');
        else if (field === 'pus_trabajo') fieldsRequired.push('characterJob');
      });
    } else {
      fieldsRequired.push('character');
    }
    
    // Form values validation
    const formValues = getValues();
    if (!formValues.name?.trim()) {
      if (!fieldsRequired.includes('name')) fieldsRequired.push('name');
    }
    
    // Validate numeric values using our safe conversion helper
    if (safeNumberConversion(formValues.level, 0) <= 0) {
      fieldsRequired.push('level');
    }
    
    // Stats validation using our stats validation helper
    if (!validateCharacterStats(inputsStatsData)) {
      fieldsRequired.push('stats');
    }
    
    // Additional check for total stats
    const totalStats = inputsStatsData.reduce((sum, stat) => 
      sum + stat.valueDice + stat.valueClass + stat.valueLevel, 0);
    
    if (totalStats <= 0) {
      if (!fieldsRequired.includes('stats')) fieldsRequired.push('stats');
    }
    
    return fieldsRequired;
  };

  /**
   * Generic async function error handler with proper logging and user-friendly messaging
   */
  const handleAsyncError = useCallback((error: unknown, operation: string) => {
    console.error(`Error during ${operation}:`, error);
    
    // Extract detailed error information
    let errorMessage = 'Unknown error';
    let errorDetails = '';
    let userFriendlyMessage = '';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Extract additional details if available
      if ('details' in error) {
        errorDetails = (error as any).details;
      }
      
      // Extract Supabase specific error details
      if ('code' in error && 'hint' in error) {
        const code = (error as any).code;
        const hint = (error as any).hint;
        errorDetails = `Code: ${code}, Hint: ${hint}`;
        
        // Generate user-friendly messages for common Supabase errors
        switch(code) {
          case '23505': 
            userFriendlyMessage = 'Ya existe un registro con esa información.';
            break;
          case '42501':
            userFriendlyMessage = 'No tienes permisos para realizar esta acción.';
            break;
          case '23503':
            userFriendlyMessage = 'No se puede eliminar porque otros registros dependen de este.';
            break;
          // Add more specific error cases as needed
        }
      }
      
      // Network error handling
      if (errorMessage.includes('network') || errorMessage.includes('NetworkError')) {
        userFriendlyMessage = 'Hay un problema de conexión. Por favor, verifica tu conexión a internet.';
      }
    }
    
    // Log detailed error information
    if (errorDetails) {
      console.error(`Additional error details for ${operation}:`, errorDetails);
    }
    
    // Use specific message if available, otherwise construct a generic one
    if (!userFriendlyMessage) {
      userFriendlyMessage = `Error durante ${operation}: ${errorMessage}. Por favor, inténtalo de nuevo.`;
    }
    
    // Show user-friendly error message
    alert(userFriendlyMessage);
    
    return null;
  }, []);

  /**
   * Wraps an async function with error handling and loading state management
   */
  const withErrorHandling = useCallback(<T,>(
    asyncFn: () => Promise<T>,
    operation: string,
    setLoadingState?: (loading: boolean) => void
  ): Promise<T | null> => {
    if (setLoadingState) setLoadingState(true);
    
    return asyncFn()
      .catch(error => handleAsyncError(error, operation))
      .finally(() => {
        if (setLoadingState) setLoadingState(false);
      });
  }, [handleAsyncError]);

  return (
    <>
      {loading && <ScreenLoader />}
      <form
        id="form-sheet"
        className={`form-sheet min-h-screen grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-0 gap-y-4 md:gap-x-4 p-4 ${
          formAlignment === 'O' ? 'orden' : formAlignment === 'C' ? 'caos' : ''
        }`}
        onSubmit={handleSubmit(onSubmitForm)}
      >
        {/* Titulo */}
        <fieldset className="fieldset-form form-title col-span-2 md:col-span-2 lg:col-span-3 shadow-lg rounded">
          {!newRecord && character?.sju_sistema_juego ? (
            <h1 className="col-span-2 text-center font-bold">
              {getGameSystemProperty(character.sju_sistema_juego, 'sju_nombre', 'Sistema de Juego')}
            </h1>
          ) : (
            <FormSelectInfoPlayer
              id="systemGame"
              label="Sistema de juego"
              options={SystemGameList}
              selectedValue={systemGame.sju_id}
              onSelectChange={handleSystemGameChange}
            />
          )}
        </fieldset>
        {/* Informacion del jugador */}
        <fieldset className="fieldset-form info-player col-span-2 md:col-span-2 lg:col-span-3 bg-white shadow-lg rounded">
          <legend>
            <SvgCharacter width={20} height={20} className={"inline"} />
            Informacion del jugador
          </legend>

          <label
            htmlFor="userName"
            className="form-lbl col-start-1 bg-grey-lighter "
          >
            Jugador
          </label>
          <input
            {...register("userName", { required: true })}
            placeholder="Nombre del jugador"
            className="form-input col-start-2 col-end-3 col-span-1 mr-2 focus:border-black focus:shadow"
            readOnly
          />
          <label
            htmlFor="name"
            className="form-lbl col-start-1 bg-grey-lighter "
          >
            Personaje
          </label>
          <input
            {...register("name", { 
              required: true, 
              maxLength: 50,
              onChange: () => clearValidationError('name')
            })}
            placeholder="Nombre del personaje"
            className={`form-input col-start-2 mr-2 focus:border-black focus:shadow ${
              emptyRequiredFields.includes('name') ? 'required-input' : ''
            }`}
          />
          <FormSelectInfoPlayer
            id="characterClass"
            label="Clase"
            options={optionsCharacterClass}
            selectedValue={character?.pus_clase || ""}
            onSelectChange={handleCharacterClassChange}
            className={emptyRequiredFields.includes('characterClass') ? 'required-input' : ''}
          />
          <FormSelectInfoPlayer
            id="characterRace"
            label="Raza"
            options={optionsCharacterRace}
            selectedValue={character?.pus_raza || ""}
            onSelectChange={handleSelectRaceChange}
            className={emptyRequiredFields.includes('characterRace') ? 'required-input' : ''}
          ></FormSelectInfoPlayer>
          <FormSelectInfoPlayer
            id="characterJob"
            label="Trabajo"
            options={optionsCharacterJob}
            selectedValue={character?.pus_trabajo || ""}
            onSelectChange={handleCharacterJobSelectChange}
            className={emptyRequiredFields.includes('characterJob') ? 'required-input' : ''}
          ></FormSelectInfoPlayer>

          <label
            htmlFor="level"
            className="form-lbl-y col-start-1 md:col-start-3 col-span-1 row-start-2 md:row-start-1 bg-grey-lighter "
          >
            Nivel
          </label>
          <input
            {...register("level", { 
              required: true, 
              maxLength: 2, 
              min:1, 
              max:10, 
              onChange: (e) => {
                const levelValue = parseInt(e.target.value) || 0;
                setCharacter(prevState => ({
                  ...prevState!,
                  pus_nivel: levelValue
                }));
              }
            })}
            placeholder="Nivel"
            className="form-input-y numeric-input col-start-1 md:col-start-3 col-span-1 row-start-3 md:row-start-2 row-span-3 md:row-span-4 focus:border-black focus:shadow"
          />
          <label
            htmlFor="luckyPoints"
            className="form-lbl-y col-start-2 md:col-start-4 col-span-1 row-start-2 md:row-start-1 bg-grey-lighter "
            >
            Puntos de suerte
          </label>
          <input
            {...register("luckyPoints", { required: true, maxLength: 2, min:1, max:10 })}
            placeholder="Puntos de suerte"
            className="form-input-y numeric-input col-start-2 md:col-start-4 col-span-1 row-start-3 md:row-start-2 row-span-1 md:row-span-1 focus:border-black focus:shadow"
          />
          <label
            htmlFor="lifePoints"
            className="form-lbl-y col-start-2 md:col-start-4 col-span-1 row-start-4 md:row-start-3 bg-grey-lighter "
            >
            Vida
          </label>
          <input
            {...register("lifePoints", { required: true, maxLength: 2, min:1, max:10 })}
            placeholder="Puntos de vida"
            className="form-input-y numeric-input col-start-2 md:col-start-4 col-span-1 row-start-5 md:row-start-4 row-span-1 md:row-span-2 focus:border-black focus:shadow"
          />
          <label
            htmlFor="characterImage"
            className="form-lbl-y col-start-1 md:col-start-5 col-span-2 md:col-span-1 row-start-6 md:row-start-1 bg-grey-lighter "
          >
            Imagen
          </label>
          <FormImageFile
            externalStyles={
              "col-start-1 md:col-start-5 col-span-2 md:col-span-1 row-start-7 md:row-start-2 row-span-3 md:row-span-4 mr-2 ml-2"
            }
            locationImage={characterImage}
            onFormImageFileChange={handleCharacterImageFileChange}
          />

          <label
            htmlFor="characterDescription"
            className="form-lbl-y col-start-1 md:col-start-1 col-span-5 row-start-14 md:row-start-6 bg-grey-lighter "
          >
            Descripción
          </label>
          <textarea
            {...register("characterDescription", { 
              required: true, 
              maxLength: 500,
              onChange: () => clearValidationError('description')
            })}
            placeholder="Descripcion del personaje"
            className={`form-input-y col-start-1 md:col-start-1 col-span-5 row-start-15 md:row-start-7 row-span-1 focus:border-black focus:shadow ${
              emptyRequiredFields.includes('description') ? 'required-input' : ''
            }`}
          />

          <FormCardCheckbox
            id="characterKnowledge"
            label="Conocimientos"
            checkboxes={checkboxesData}
            selectedValues={(character?.pus_conocimientos || "").split(",")}
            onSelectedValuesChange={handleSelectedCheckValuesChange}
          />
        </fieldset>

        {/* Estadisticas del personaje */}
        <fieldset className="fieldset-form stats-player row-span-3 col-span-1 col-start-1 bg-white shadow-lg rounded" aria-labelledby="stats-heading">
          <legend id="stats-heading" className="text-lg font-semibold">Estadísticas del personaje</legend>
          <header className="stats-player-header col-span-3 col-start-3">
            <Tooltip
              className="bg-dark text-light px-2 py-1"
              placement="top"
              content={"Generar estadísticas aleatorias"}
            >
              <button
                type="button"
                className="btn-save-character"
                onClick={randomRoll}
                aria-label="Generar estadísticas aleatorias"
              >
                <SvgD4Roll className="btn-roll" width={30} height={30} aria-hidden="true" />
              </button>
            </Tooltip>
          </header>

          {/* STRENGTH */}
          <FormInputStats
            inputStats={inputsStatsData[0]}
            onSelectedValuesChange={handleStatsInputChange}
          />

          {/* INTELLIGENCE */}
          <FormInputStats
            inputStats={inputsStatsData[1]}
            onSelectedValuesChange={handleStatsInputChange}
          />

          {/* DEXTERITY */}
          <FormInputStats
            inputStats={inputsStatsData[2]}
            onSelectedValuesChange={handleStatsInputChange}
          />

          {/* CONSTITUTION */}
          <FormInputStats
            inputStats={inputsStatsData[3]}
            onSelectedValuesChange={handleStatsInputChange}
          />

          {/* PERCEPTION */}
          <FormInputStats
            inputStats={inputsStatsData[4]}
            onSelectedValuesChange={handleStatsInputChange}
          />

          {/* CHARISMA */}
          <FormInputStats
            inputStats={inputsStatsData[5]}
            onSelectedValuesChange={handleStatsInputChange}
          />
        </fieldset>

        {/* Armamento inicial */}
        <fieldset className="fieldset-form initial-armament col-span-1 row-span-1 col-start-1 md:col-start-2 bg-white shadow-lg rounded">
          <legend>Armamento inicial</legend>

          <label htmlFor="mainWeapon" className="form-lbl bg-grey-lighter ">
            Arma principal
          </label>
          <input
            {...register("mainWeapon", { required: true })}
            placeholder="Arma principal"
            className="form-input mr-2 focus:border-black focus:shadow"
            list="wearons"
          />
          <datalist id="wearons">
            {listWearpons?.map((elem, index) => (
              <option key={index} value={elem}>
                {elem}
              </option>
            ))}
          </datalist>
          <label
            htmlFor="secondaryWeapon"
            className="form-lbl bg-grey-lighter "
          >
            Arma secundaria
          </label>
          <input
            {...register("secondaryWeapon", { required: true })}
            placeholder="Arma secondaria"
            className="form-input mr-2 focus:border-black focus:shadow"
            list="wearons"
          />
          <FormSelectInfoPlayer
            id="skillClass"
            label="Habilidad innata"
            options={optionsSkillClass}
            selectedValue={selectedSkillValue}
            onSelectChange={handleSelectSkillChange}
          ></FormSelectInfoPlayer>

          {/* Debug information */}
          {optionsSkillClass.length === 0 && <div className="text-red-500 text-xs">No options available for skillClass</div>}

          <FormSelectInfoPlayer
            id="skillExtra"
            label="Habilidad extra"
            options={optionsSkillExtra}
            selectedValue={selectedExtraSkillValue}
            onSelectChange={handleSelectExtraSkillChange}
          ></FormSelectInfoPlayer>

          {/* Debug information */}
          {optionsSkillExtra.length === 0 && <div className="text-red-500 text-xs">No options available for skillExtra</div>}
        </fieldset>

        {/* Habilidades */}
        <fieldset className="fieldset-form skills-player col-span-1 row-span-2 col-start-1 md:col-start-2 bg-white shadow-lg rounded">
          <legend>Habilidades</legend>
          {character!.pus_nivel >= 3 ? (
            <>
              <label htmlFor="alignment" className="form-lbl mt-2 ">
                Alineación
              </label>
              <select
                id="alignment"
                className="form-input mr-2"
                onChange={(e) => handleAlignmentChange(e.target.value)}
              >
                <option value="" />
                <option value="O">Orden</option>
                <option value="C">Caos</option>
              </select>

              <label className="form-lbl-skills ml-2 mb-0 ">Nivel</label>
              <label className="form-lbl-skills mr-2 mb-0 ">
                Anillo de poder
              </label>

              <FormInputSkillsRing
                id={"0"}
                level={character!.pus_nivel}
                levelEvaluated={3}
                ringTypes={optionsRingTypes}
                skillList={skillsRingList[0]}
                values={skillsAcquired[0]}
                onSelectChange={handleSelectedRingSkillChange}
                onSelectTypeChange={handleSelectedTypeRingSkillChange}
              />

              <FormInputSkillsRing
                id={"1"}
                level={character!.pus_nivel}
                levelEvaluated={6}
                ringTypes={optionsRingTypes}
                skillList={skillsRingList[1]}
                values={skillsAcquired[1]}
                onSelectChange={handleSelectedRingSkillChange}
                onSelectTypeChange={handleSelectedTypeRingSkillChange}
              />

              <FormInputSkillsRing
                id={"2"}
                level={character!.pus_nivel}
                levelEvaluated={9}
                ringTypes={optionsRingTypes}
                skillList={skillsRingList[2]}
                values={skillsAcquired[2]}
                onSelectChange={handleSelectedRingSkillChange}
                onSelectTypeChange={handleSelectedTypeRingSkillChange}
              />
            </>
          ) : (
            <></>
          )}
        </fieldset>

        {/* Inventario */}
        <fieldset className="fieldset-form inventory-player row-span-3 col-span-1 col-start-1 lg:col-start-3 lg:row-start-3 bg-white shadow-lg rounded" aria-labelledby="inventory-heading">
          <legend id="inventory-heading" className="text-lg font-semibold">Inventario</legend>

          <label
            htmlFor="goldCoins"
            className="form-lbl col-span-3 mb-1 bg-grey-lighter font-medium"
          >
            Monedero
          </label>
          <label
            htmlFor="goldCoins"
            className="form-lbl-coins ml-2 col-span-1 bg-grey-lighter "
          >
            Oro
          </label>
          <label
            htmlFor="silverCoins"
            className="form-lbl-coins col-span-1 bg-grey-lighter "
          >
            Plata
          </label>
          <label
            htmlFor="bronzeCoins"
            className="form-lbl-coins mr-2 col-span-1 bg-grey-lighter "
          >
            Bronce
          </label>
          <input
            {...register("goldCoins", { required: true, maxLength: 3 })}
            placeholder="Oro"
            className="form-input ml-2 col-span-1 focus:border-black focus:shadow"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleCoinsChange(0, e.target.value)
            }
          />
          <input
            {...register("silverCoins", { required: true, maxLength: 3 })}
            placeholder="Plata"
            className="form-input col-span-1 focus:border-black focus:shadow"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleCoinsChange(1, e.target.value)
            }
          />
          <input
            {...register("bronzeCoins", { required: true, maxLength: 3 })}
            placeholder="Bronce"
            className="form-input mr-2 col-span-1 focus:border-black focus:shadow"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleCoinsChange(2, e.target.value)
            }
          />

          <label className="form-lbl mb-1 col-span-3 bg-grey-lighter ">
            Bolsa
          </label>
          {/* Listado de objetos */}
          {invObjects.map((elem) => (
            <Tooltip
              className="bg-dark text-light px-2 py-1"
              key={"object" + elem.id}
              placement="left"
              content={elem.description}
            >
              <label
                htmlFor={"object" + elem.id}
                className="form-lbl object-item col-span-3 bg-grey-lighter "
              >
                {" "}
                {elem.name}
                <input type="hidden" value={elem.id} />
                <input
                  type="text"
                  id={"object" + elem.id}
                  placeholder="Cantidad"
                  className="form-input-count focus:border-black focus:shadow"
                  value={elem.count}
                  maxLength={2}
                  onChange={(e) => handleEditCount(elem.id, e.target.value)}
                  readOnly={elem.readOnly}
                />
                <button
                  type="button"
                  className="btn-delete-object"
                  onClick={() => handleDeleteObject(elem.id)}
                >
                  <SvgDeleteItem width={25} fill="var(--required-color)" />
                </button>
              </label>
            </Tooltip>
          ))}

          <input
            type="text"
            id="objectName"
            placeholder="Objeto"
            className="form-input ml-2 col-span-2 row-span-1 focus:border-black focus:shadow"
            value={newObjectName}
            maxLength={50}
            onChange={(e) => setNewObjectName(e.target.value)}
          />
          <input
            type="text"
            id="objectCount"
            placeholder="Cantidad"
            className="form-input mr-2 col-span-1 focus:border-black focus:shadow"
            value={newObjectCount}
            maxLength={2}
            onChange={(e) => handleNewCount(e.target.value)}
          />
          <input
            type="text"
            id="objectDescription"
            placeholder="Descripción"
            className="form-input mx-2 col-span-3 row-span-2 focus:border-black focus:shadow"
            value={newObjectDescription}
            maxLength={100}
            onChange={(e) => setNewObjectDescription(e.target.value)}
          />
          <button
            type="button"
            className="btn-add-object col-span-3 mx-2"
            onClick={() => handleAddObject()}
          >
            Añadir
          </button>
        </fieldset>

        <aside className="panel-save">
          <button
            type="button"
            className="btn-save-character"
            onClick={handleOpenModal}
          >
            <SvgSaveCharacter className="icon" width={40} height={40} />
          </button>
        </aside>

        {/* Modal/Dialog */}
        <Modal
          id="modalSave"
          isOpen={isOpen}
          size={"5xl"}
          onOpenChange={onOpenChange}
          className="dialog modal-fix"
          classNames={{
            wrapper: "my-0",
            base: "z-50",
            backdrop: "z-40 bg-black/50",
            footer: "px-2 py-2",
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Resumen de hoja de personaje</ModalHeader>
                <ModalBody className="dialog-body grid grid-cols-3 gap-3">
                  <ul className="dialog-card col-span-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <li className="col-span-2">
                      <strong>Jugador: </strong>
                      {dataCharacter?.player}
                    </li>
                    <li className="col-span-2">
                      <strong>Personaje: </strong>
                      {dataCharacter?.name}
                    </li>
                    <li>
                      <strong>Nivel: </strong>
                      {dataCharacter?.level}
                    </li>
                    <li>
                      <strong>Clase: </strong>
                      {getClassName(dataCharacter?.class)}
                    </li>
                    <li>
                      <strong>Raza: </strong>
                      {getRaceName(dataCharacter?.race)}
                    </li>
                    <li>
                      <strong>Trabajo: </strong>
                      {getJobName(dataCharacter?.job)}
                    </li>
                    <li className="col-span-2">
                      <strong>Descripcion: </strong>
                      {dataCharacter?.description}
                    </li>
                    <li className="col-span-2">
                      <strong>Conocimientos: </strong>
                      {getKnowledgeName(dataCharacter?.knowledge)}
                    </li>
                  </ul>
                  <table className="dialog-table ">
                    <thead>
                      <tr>
                        <th colSpan={2}>Estadisticas</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Fuerza</td>
                        <td>
                          {(dataCharacter?.str[0].dice || 0) +
                            (dataCharacter?.str[0].class || 0) +
                            (dataCharacter?.str[0].level || 0)}
                        </td>
                      </tr>
                      <tr>
                        <td>Inteligencia</td>
                        <td>
                          {(dataCharacter?.int[0].dice || 0) +
                            (dataCharacter?.int[0].class || 0) +
                            (dataCharacter?.int[0].level || 0)}
                        </td>
                      </tr>
                      <tr>
                        <td>Destreza</td>
                        <td>
                          {(dataCharacter?.dex[0].dice || 0) +
                            (dataCharacter?.dex[0].class || 0) +
                            (dataCharacter?.dex[0].level || 0)}
                        </td>
                      </tr>
                      <tr>
                        <td>Constitucion</td>
                        <td>
                          {(dataCharacter?.con[0].dice || 0) +
                            (dataCharacter?.con[0].class || 0) +
                            (dataCharacter?.con[0].level || 0)}
                        </td>
                      </tr>
                      <tr>
                        <td>Percepcion</td>
                        <td>
                          {(dataCharacter?.per[0].dice || 0) +
                            (dataCharacter?.per[0].class || 0) +
                            (dataCharacter?.per[0].level || 0)}
                        </td>
                      </tr>
                      <tr>
                        <td>Carisma</td>
                        <td>
                          {(dataCharacter?.cha[0].dice || 0) +
                            (dataCharacter?.cha[0].class || 0) +
                            (dataCharacter?.cha[0].level || 0)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <ul className="dialog-card grid grid-cols-1 gap-3 col-start-1 row-start-2 items-center ">
                    <li className="">
                      <strong>Alineacion: </strong>
                      {dataCharacter?.alignment}
                    </li>
                  </ul>
                  <ul className="dialog-card grid grid-cols-1 gap-3 col-start-1">
                    <li>
                      <strong>Habilidad principal: </strong>
                      {getMainSkillName(dataCharacter?.mainSkill)}
                    </li>
                    <li>
                      <strong>Habilidad extra: </strong>
                      {getExtraSkillName(dataCharacter?.extraSkill)}
                    </li>
                    {dataCharacter?.skills.map((elem) => (
                      <li key={elem.value}>
                        <strong>Habilidad: </strong>
                        {getSkillName(elem.name, elem.stat || "")}
                      </li>
                    ))}
                  </ul>
                  <ul className="dialog-card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 col-start-2 row-start-2 items-center">
                    <li>
                      <strong>Arma principal: </strong>
                      {dataCharacter?.mainWeapon}
                    </li>
                  </ul>
                  <ul className="dialog-card grid grid-cols-1 gap-3 col-start-2">
                    <li>
                      <strong>Arma secundaria: </strong>
                      {dataCharacter?.secondaryWeapon}
                    </li>
                  </ul>
                  <ul className="dialog-card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 col-start-3 row-start-2">
                    <li className="md:col-span-2 lg:col-span-3">
                      <strong>Dinero: </strong>{" "}
                    </li>
                    <li>Oro: {dataCharacter?.coinsInv[0]}</li>
                    <li>Plata: {dataCharacter?.coinsInv[1]}</li>
                    <li>Cobre: {dataCharacter?.coinsInv[2]}</li>
                  </ul>
                  <ul className="dialog-card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 col-start-3">
                    <li className="md:col-span-2 lg:col-span-2">
                      Inventario:{" "}
                    </li>
                    {dataCharacter?.inv.map((elem) => (
                      <li key={elem.id}>
                        <strong>{elem.name}: </strong>
                        {elem.count}
                      </li>
                    ))}
                  </ul>
                </ModalBody>
                <ModalFooter>
                  <Button onPress={onClose} className="mr-1">
                    <span>Cancelar</span>
                  </Button>
                  <Button
                    className="btn-dialog-accept"
                    onClick={() => saveData()}
                    id="btnSaveData"
                  >
                    <span>Guardar información</span>
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </form>
    </>
  );
};

export default CharacterSheet;
