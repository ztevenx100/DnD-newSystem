import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, useLoaderData } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';

// Custom hooks
import { characterSchema } from "@features/character-sheet/hooks/useCharacterFormValidation";
import useRingSkills from "@features/character-sheet/hooks/useRingSkills";
import { useCharacterStats } from "@features/character-sheet/hooks/useCharacterStats";
import { CharacterForm } from "@features/character-sheet/types/characterForm";

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
  safeNumberConversion,
  validateCharacterAttributes
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
          knowledge: getCharacterProperty(initialCharacter, 'pus_conocimientos', ''),
          // Valores predeterminados para estadísticas
          strDice: 1, strClass: 0, strLevel: 0,
          intDice: 1, intClass: 0, intLevel: 0,
          dexDice: 1, dexClass: 0, dexLevel: 0,
          conDice: 1, conClass: 0, conLevel: 0,
          perDice: 1, perClass: 0, perLevel: 0,
          chaDice: 1, chaClass: 0, chaLevel: 0,
          // Valores predeterminados para inventario
          newObjectName: "",
          newObjectDescription: "",
          newObjectCount: 1,
          // Valores predeterminados para habilidades
          skillClass: "",
          skillExtra: ""
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
          knowledge: "",
          // Valores predeterminados para estadísticas
          strDice: 1, strClass: 0, strLevel: 0,
          intDice: 1, intClass: 0, intLevel: 0,
          dexDice: 1, dexClass: 0, dexLevel: 0,
          conDice: 1, conClass: 0, conLevel: 0,
          perDice: 1, perClass: 0, perLevel: 0,
          chaDice: 1, chaClass: 0, chaLevel: 0,
          // Valores predeterminados para inventario
          newObjectName: "",
          newObjectDescription: "",
          newObjectCount: 1,
          // Valores predeterminados para habilidades
          skillClass: "",
          skillExtra: ""
        };
  }, [initialCharacter, userName]);
  
  // Añadimos valores iniciales para los arrays de la nueva estructura
  const extendedDefaultValues = useMemo(() => {
    return {
      ...defaultValues,
      // Inicializar arrays para React Hook Form
      stats: [
        { id: 'STR', label: 'Fuerza', description: 'Fuerza física y potencia muscular', valueDice: 1, valueClass: 0, valueLevel: 0 },
        { id: 'INT', label: 'Inteligencia', description: 'Capacidad mental y conocimiento', valueDice: 1, valueClass: 0, valueLevel: 0 },
        { id: 'DEX', label: 'Destreza', description: 'Agilidad y precisión', valueDice: 1, valueClass: 0, valueLevel: 0 },
        { id: 'CON', label: 'Constitución', description: 'Resistencia y salud', valueDice: 1, valueClass: 0, valueLevel: 0 },
        { id: 'PER', label: 'Percepción', description: 'Atención y observación', valueDice: 1, valueClass: 0, valueLevel: 0 },
        { id: 'CHA', label: 'Carisma', description: 'Personalidad y liderazgo', valueDice: 1, valueClass: 0, valueLevel: 0 }
      ],
      inventory: [],
      skills: [
        { id: "", value: "0", name: "", description: "", ring: "" },
        { id: "", value: "1", name: "", description: "", ring: "" },
        { id: "", value: "2", name: "", description: "", ring: "" },
      ]
    }
  }, [defaultValues]);
  
  const methods = useForm<CharacterForm>({
    defaultValues: extendedDefaultValues,
    mode: "onSubmit",
    resolver: yupResolver(characterSchema)
  });
  
  const ringSkills = useRingSkills(methods);
  
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors }  } = methods;

  // State to track empty required fields for validation
  const [emptyRequiredFields, setEmptyRequiredFields] = useState<string[]>([]);
  
  // Function to clear validation errors for a field
  const clearValidationError = (fieldId: string) => {
    if (emptyRequiredFields.includes(fieldId)) {
      setEmptyRequiredFields((prev) =>
        prev.filter((field) => field !== fieldId)
      );
    }
  };
  // Default stats data for fallback scenarios only
  const defaultStatsData: InputStats[] = [
    { id: 'STR', label: 'Fuerza', description: 'Fuerza física y potencia muscular', valueDice: 1, valueClass: 0, valueLevel: 0 },
    { id: 'INT', label: 'Inteligencia', description: 'Capacidad mental y conocimiento', valueDice: 1, valueClass: 0, valueLevel: 0 },
    { id: 'DEX', label: 'Destreza', description: 'Agilidad y precisión', valueDice: 1, valueClass: 0, valueLevel: 0 },
    { id: 'CON', label: 'Constitución', description: 'Resistencia y salud', valueDice: 1, valueClass: 0, valueLevel: 0 },
    { id: 'PER', label: 'Percepción', description: 'Atención y observación', valueDice: 1, valueClass: 0, valueLevel: 0 },
    { id: 'CHA', label: 'Carisma', description: 'Personalidad y liderazgo', valueDice: 1, valueClass: 0, valueLevel: 0 }
  ];

  /**
   * Validates a specific character stat and provides detailed feedback
   * Can be used for individual stat validation during character creation/editing
   * 
   * @param statId - The ID of the stat to validate (e.g., 'STR', 'INT')
   * @param showAlert - Whether to display alerts for validation issues
   * @returns Object with validation status and messages
   */
  // validateSingleStat function is now provided by the useCharacterStats hook as characterStats.validateSingleStat
  // Usar useFieldArray para gestionar los arrays en el formulario
  const { 
    fields: _statsFields, // Usando prefijo _ para indicar que es intencionalmente no utilizada
    update: updateStats
  } = useFieldArray({
    control,
    name: "stats"
  });
  
  const { 
    fields: inventoryFields,
    append: appendInventory,
    remove: removeInventory,
    update: updateInventory
  } = useFieldArray({
    control,
    name: "inventory",
    rules: {
      // Add validation rules for the array as a whole
      validate: {
        notEmpty: (value) => 
          (value && value.length > 0) || 
          "El inventario no puede estar vacío. Debe tener al menos un objeto.",
        validItems: (value) => {
          if (!value || value.length === 0) return true;
          
          // Check each item for valid name and count
          const invalidItems = value.filter(item => {
            // Name must not be empty
            if (!item.name?.trim()) return true;
            
            // Count must be a positive number
            if (!item.count || typeof item.count !== 'number' || item.count < 1 || item.count > 99) 
              return true;
            
            // Description shouldn't be too long if present
            if (item.description && item.description.length > 200)
              return true;
              
            return false;
          });
          
          return invalidItems.length === 0 || 
            `${invalidItems.length} objeto(s) del inventario tienen datos inválidos. Verifica nombres y cantidades.`;
        }
      }
    }
  });
  
  const {
    fields: _skillsFields // Usando prefijo _ para indicar que es intencionalmente no utilizada
  } = useFieldArray({
    control,
    name: "skills"
  });
    const [characterImage, setCharacterImage] = useState<string | undefined>(
    undefined
  );
  
  // Default skills data for fallback scenarios only
  const defaultSkillsData: SkillsAcquired[] = [
    { id: "", value: "0", name: "", description: "", ring: "" },
    { id: "", value: "1", name: "", description: "", ring: "" },
    { id: "", value: "2", name: "", description: "", ring: "" },
  ];

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
  ]);  // Eliminamos los estados manuales para el inventario y usamos React Hook Form
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
  const [newRecord, setNewRecord] = useState<boolean>(true);  const [character, setCharacter] = useState<DBPersonajesUsuario>(
    initialPersonajesUsuario
  );
  const navigate = useNavigate();
  const params = useParams();
  // Initialize character stats hook - now after all dependencies are declared
  const characterStats = useCharacterStats({
    getValues,
    setValue,
    updateStats,
    character: character || initialPersonajesUsuario,
    optionsCharacterJob: optionsCharacterJob.filter(option => option.extraPoint !== undefined).map(option => ({
      value: option.value,
      extraPoint: option.extraPoint!
    })),
    clearValidationError
  });

  // Calculate total stats with useMemo to optimize performance
  const totalStats = useMemo(() => {
    const totalFormStats = getValues("stats") || [];
    if (totalFormStats.length < 6) return { str: 0, int: 0, dex: 0, con: 0, per: 0, cha: 0, total: 0 };    
    const getStatById = (id: string) => totalFormStats.find(s => s.id === id);
    
    const strStat = getStatById('STR');
    const intStat = getStatById('INT');
    const dexStat = getStatById('DEX');
    const conStat = getStatById('CON');
    const perStat = getStatById('PER');
    const chaStat = getStatById('CHA');
    
    return {
      str: strStat ? strStat.valueDice + strStat.valueClass + strStat.valueLevel : 0,
      int: intStat ? intStat.valueDice + intStat.valueClass + intStat.valueLevel : 0,
      dex: dexStat ? dexStat.valueDice + dexStat.valueClass + dexStat.valueLevel : 0,
      con: conStat ? conStat.valueDice + conStat.valueClass + conStat.valueLevel : 0,
      per: perStat ? perStat.valueDice + perStat.valueClass + perStat.valueLevel : 0,
      cha: chaStat ? chaStat.valueDice + chaStat.valueClass + chaStat.valueLevel : 0,
      total: totalFormStats.reduce((sum: number, stat: any) => sum + stat.valueDice + stat.valueClass + stat.valueLevel, 0)
    };
  }, [getValues]);
  
  /**
   * Helper function to calculate the total value of a stat from React Hook Form data
   * Uses the cached totalStats when possible to avoid recalculations
   */
  const getStatTotal = useCallback((statId: string): number => {
    // Use a mapping object to avoid switch/case and improve readability
    const statsMap: Record<string, number | undefined> = {
      'STR': totalStats.str,
      'INT': totalStats.int,
      'DEX': totalStats.dex,
      'CON': totalStats.con,
      'PER': totalStats.per,
      'CHA': totalStats.cha,
      'total': totalStats.total
    };

    // Look up in the map first for optimal performance
    const mappedValue = statsMap[statId];
    if (mappedValue !== undefined) {
      return mappedValue;
    }
    // Fallback calculation only if necessary
    const fallbackFormStats = getValues("stats") || [];
    const stat = fallbackFormStats.find(s => s.id === statId);
    if (!stat) return 0;
    
    // Calculate and return the result
    const calculatedValue = stat.valueDice + stat.valueClass + stat.valueLevel;
    return calculatedValue;
  }, [totalStats, getValues]);

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

  /**
   * Carga los objetos del inventario desde la base de datos y los configura en React Hook Form.
   * 
   * Esta función utiliza exclusivamente React Hook Form para gestionar el inventario,
   * siguiendo el patrón de tener una única fuente de verdad para los datos.
   * 
   * @returns {Promise<void>}
   */
  const getInventory = useCallback(async () => {
    // Check if we already have inventory data
    const currentInventory = getValues("inventory") || [];
    if (currentInventory.length !== 0) return;

    try {
      // For new characters, add a default item
      if (params.id === null || params.id === undefined) {
        const defaultItem = {
          id: uuidv4(),
          name: "Gema",
          description: "Articulo del elegido",
          count: 1,
          readOnly: true,
        };
        
        // Add to React Hook Form
        appendInventory(defaultItem);
        
        console.log("Objeto inicial añadido a nuevo personaje");
        return;
      }

      // For existing characters, load data from the database
      const data = await getCharacterInventory(params.id);

      if (data !== null && Array.isArray(data)) {
        const formattedInventory = data.map((elem: DBInventarioPersonaje) => ({
          id: elem.inp_id,
          name: elem.inp_nombre,
          description: elem.inp_descripcion,
          count: elem.inp_cantidad,
          readOnly: false,
        }));
        
        // Clear any existing inventory data in the form
        setValue("inventory", []);
        
        // Add each item to the form using batch approach for performance
        if (formattedInventory.length > 0) {
          // Añadir elementos en batch si hay muchos
          if (formattedInventory.length > 10) {
            // Procesar en lotes para evitar problemas de rendimiento
            const batchSize = 10;
            for (let i = 0; i < formattedInventory.length; i += batchSize) {
              const batch = formattedInventory.slice(i, i + batchSize);
              batch.forEach(item => {
                appendInventory(item);
              });
              // Opcional: Podríamos añadir un pequeño retraso entre lotes para UI responsiva
              // await new Promise(resolve => setTimeout(resolve, 10));
            }
          } else {
            // Si son pocos elementos, añadirlos directamente
            formattedInventory.forEach(item => {
              appendInventory(item);
            });
          }
          
          console.log(`Inventario cargado: ${formattedInventory.length} objetos`);
        } else {
          console.log("No se encontraron objetos en el inventario");
        }
      } else {
        console.log("No se encontraron objetos en el inventario");
      }
    } catch (error) {
      console.error("Error al cargar el inventario:", error);
    }
  }, [params.id, appendInventory, getValues, setValue]);
  /**
   * Maneja el cambio en la selección de una habilidad para un anillo específico
   * Actualiza la habilidad seleccionada usando el hook useRingSkills   * 
   * @param id - ID/índice del anillo que está siendo modificado
   * @param ring - Tipo de anillo seleccionado
   * @param skill - ID de la habilidad seleccionada
   * @param stat - Estadística base asociada a la habilidad
   */
  const handleSelectedRingSkillChange = useCallback((
    id: string,
    ring: string,
    skill: string,
    stat: string
  ) => {
    console.log('handleSelectedRingSkillChange', {id, ring, skill, stat});
    
    // Validar entradas
    if (!id || !ring || !skill) {
      console.warn('ID, ring o skill inválidos en handleSelectedRingSkillChange', {id, ring, skill});
      return;
    }
    try {
      // 1. Actualizar usando el hook useRingSkills (fuente principal de verdad)
      ringSkills.setRingSkillName(id, skill, ring, stat);
      console.log(`Habilidad de anillo ${id} actualizada en React Hook Form usando ringSkills hook`);
      
      // Limpiar cualquier error de validación relacionado con este anillo
      clearValidationError(`ringSkill${id}`);
    } catch (error) {
      console.error("Error al actualizar la habilidad del anillo:", error);
    }
  }, [ringSkills, clearValidationError]);
  /**
   * Maneja el cambio en el tipo de habilidad del anillo seleccionado
   * Actualiza el tipo de anillo usando el hook useRingSkills
   *
   * @param id - ID/índice del anillo que está siendo modificado
   * @param type - Tipo de habilidad seleccionado para el anillo
   */
  const handleSelectedTypeRingSkillChange = useCallback(async (
    id: string,
    type: string
  ) => {
    console.log('handleSelectedTypeRingSkillChange', {id, type});
    
    // Validar entradas
    if (!id || !type) {
      console.warn('ID o tipo de habilidad inválido', {id, type});
      return;
    }
    
    try {
      // 1. Actualizar usando el hook useRingSkills (fuente principal de verdad)
      ringSkills.updateRingType(id, type);
      console.log(`Tipo de habilidad de anillo ${id} actualizado a ${type} usando ringSkills hook`);
      
      // 2. Actualizar la lista de habilidades disponibles para este anillo (estado local)
      // Este paso es necesario para mantener la UI actualizada con las opciones disponibles
      setSkillsRingList(prevList => {
        const newList = [...prevList];
        const skills = skillsTypes.find(option => option.id === type)?.skills || [];
        console.log('New skills for ring', id, ':', skills.map(s => s.name).join(', '));
        
        // Log para depuración 
        if (skills.length === 0) {
          console.warn(`No se encontraron habilidades para el tipo ${type}. skillsTypes contiene:`, 
            skillsTypes.map(s => ({ id: s.id, numSkills: s.skills.length })));
        }
        
        // Actualizar las habilidades disponibles para este anillo
        const ringIndex = Number(id);
        if (isNaN(ringIndex) || ringIndex < 0 || ringIndex >= newList.length) {
          console.error(`Índice de anillo inválido: ${id}`);
          return prevList;
        }
        
        newList[ringIndex] = {
          ...newList[ringIndex],
          skills: skills
        };
        return newList;
      });
      
      // Limpiar cualquier error de validación relacionado con este anillo
      clearValidationError(`ringSkill${id}`);
    } catch (error) {
      console.error("Error al cambiar el tipo de habilidad del anillo:", error);
    }
  }, [skillsTypes, ringSkills, clearValidationError]);
  const getSkills = useCallback(async () => {
    const data = await getListHad();
    
    if (data !== null) {
      const updatedFieldSkill = fieldSkill.map(item => ({...item}));

      let characterSkills: DBHabilidadPersonaje[] = [];
      if (params.id) {
        characterSkills = await getCharacterSkills(params.id);
      }
      (data as DBHabilidad[]).forEach((rawElem: DBHabilidad) => {
        const elem = mapSkillFields(rawElem);

        if (elem.tipo === "C") {
          const existingSkill = characterSkills.find(skill => 
            skill.hpe_campo === "skillClass" && skill.hpe_habilidad === elem.id);
          
          if (existingSkill) {
            setValue("skillClass", elem.sigla);
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
            setValue("skillExtra", elem.sigla);
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
            
            ringSkills.setRingSkillName(ringNumber, elem.sigla, elem.estadistica_base, elem.estadistica_base);
          }
        }
      });
      
      setFieldSkill(updatedFieldSkill);
    }
  }, [params.id, handleSelectedTypeRingSkillChange, setValue]);

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

  /**
   * Carga las estadísticas del personaje desde la base de datos y las configura
   * dando prioridad a React Hook Form como fuente principal de verdad.
   */
  const getStats = useCallback(async () => {
    if (params.id === null || params.id === undefined) return;

    try {
      const data = await getCharacterStats(params.id);
      
      if (data !== null && Array.isArray(data)) {
        // 1. Actualizar React Hook Form - Array de estadísticas (enfoque principal)
        const getStatsFormStats = getValues("stats") || [];
        
        if (getStatsFormStats.length === 6 && data.length >= 6) {
          data.forEach((stat, index) => {
            if (index < 6) {
              const updatedStat = {
                ...getStatsFormStats[index],
                valueDice: stat.epe_num_dado,
                valueClass: stat.epe_num_clase,
                valueLevel: stat.epe_num_nivel
              };
              
              updateStats(index, updatedStat);
            }
          });
          
          console.log("Estadísticas actualizadas en React Hook Form");
        } else {
          console.warn("No se pudo actualizar el array de estadísticas: longitud incorrecta");
          return; // Salir si no se puede actualizar React Hook Form
        }
        
        // 2. Actualizar React Hook Form - Campos individuales (para compatibilidad)
        if (data.length >= 6) {
          setValue("strDice", data[0].epe_num_dado);
          setValue("strClass", data[0].epe_num_clase);
          setValue("strLevel", data[0].epe_num_nivel);
          setValue("intDice", data[1].epe_num_dado);
          setValue("intClass", data[1].epe_num_clase);
          setValue("intLevel", data[1].epe_num_nivel);
          setValue("dexDice", data[2].epe_num_dado);
          setValue("dexClass", data[2].epe_num_clase);
          setValue("dexLevel", data[2].epe_num_nivel);
          setValue("conDice", data[3].epe_num_dado);
          setValue("conClass", data[3].epe_num_clase);
          setValue("conLevel", data[3].epe_num_nivel);
          setValue("perDice", data[4].epe_num_dado);
          setValue("perClass", data[4].epe_num_clase);
          setValue("perLevel", data[4].epe_num_nivel);
          setValue("chaDice", data[5].epe_num_dado);
          setValue("chaClass", data[5].epe_num_clase);
          setValue("chaLevel", data[5].epe_num_nivel);
        }
        
        console.log("React Hook Form estadísticas actualizadas desde la base de datos");
      } else {
        console.warn("No se encontraron datos de estadísticas para cargar");
      }
    } catch (error) {
      console.error("Error al cargar las estadísticas:", error);
    }
  }, [params.id, setValue, getValues, updateStats]);
  const getInfoCharacter = useCallback(async () => {
    try {
      if (!user || !user.id) {
        console.error("User ID is undefined");
        return;
      }
      
      const userId = user.id;
      
      if (params.id === null || params.id === undefined) {
        setCharacter({
          ...initialPersonajesUsuario,
          pus_id: uuidv4(),
          pus_usuario: userId
        });
        return;
      }

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
        await withErrorHandling(
          () => getListSkill(),
          "loading skill data"
        );
        if (!isNewRecord) {
          await withErrorHandling(
            () => getInfoCharacter(),
            "loading character information"
          );
        }
        
        await withErrorHandling(
          () => getGameSystemList(),
          "loading game systems"
        );
        
        if (!isNewRecord) {
          await withErrorHandling(
            () => getCharacterImage(),
            "loading character image"
          );
        }
        
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
          const elem = {
            id: rawElem.hab_id || rawElem.id || '',
            nombre: rawElem.hab_nombre || rawElem.nombre || '',
            sigla: rawElem.hab_siglas || rawElem.sigla || '',
            tipo: rawElem.hab_tipo || rawElem.tipo || '',
            estadistica_base: rawElem.had_estadistica_base || rawElem.estadistica_base || '',
            descripcion: rawElem.hab_descripcion || rawElem.descripcion || ''
          };
          
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

  /**
   * Maneja el cambio en la selección de raza del personaje
   * usando React Hook Form como fuente principal de verdad
   * 
   * @param value - ID de la raza seleccionada
   */
   const handleSelectRaceChange = (value: string) => {
    console.log("Selecting race:", value);
    
    // 1. Actualizar en React Hook Form (fuente principal de verdad)
    setValue("race", value);
    console.log(`Raza actualizada en React Hook Form: ${value}`);
    
    // 2. Actualizar en el estado del personaje (compatibilidad temporal)
    setCharacter((prevState) => {
      if (!prevState) return prevState;
      const updated = setCharacterProperty(prevState, 'pus_raza', value);
      console.log("Updated character state with race:", updated);
      return updated;
    });
    
    // Limpiar cualquier error de validación relacionado con la raza
    clearValidationError('characterRace');
  };
  /**
   * Maneja el cambio en la selección del sistema de juego
   * 
   * @param currentSystem - ID del sistema de juego seleccionado
   */
  const handleSystemGameChange = (currentSystem: string = "") => {
    if (!currentSystem) {
      return;
    }
    
    const option = SystemGameList.filter((elem) => elem.value === currentSystem);
    if (option.length === 0) {
      return;
    }
    
    console.log("Cambiando sistema de juego:", currentSystem, option[0].name);
    
    setSystemGame({
      sju_id: option[0].value,
      sju_nombre: option[0].name,
      sju_descripcion: systemGame.sju_descripcion
    });
    
    setCharacter((prevState) => {
      if (!prevState) return prevState;
      return setCharacterProperty(prevState, 'pus_sistema_juego', currentSystem);
    });
  };

  /**
   * Maneja el cambio en la selección de habilidad principal del personaje
   * 
   * Esta función actualiza la habilidad principal del personaje usando React Hook Form como 
   * fuente principal de verdad, manteniendo también actualizado el estado local por compatibilidad.
   *
   * @param currentSkill - ID de la habilidad seleccionada
   */
  const handleSelectSkillChange = (currentSkill: string) => {
    console.log('handleSelectSkillChange', currentSkill);
    
    // Si no hay habilidad seleccionada, limpiar el valor
    if (!currentSkill) {
      setValue("skillClass", "");
      // Actualizar también el estado local por compatibilidad
      setFieldSkill((prevItems) =>
        prevItems.map((item) =>
          item.field === "skillClass"
            ? { ...item, id: "", skill: "" }
            : item
        )
      );
      return;
    }
    
    // Buscar la opción correspondiente en las opciones disponibles
    const option = optionsSkillClass.filter(
      (skill) => skill.value === currentSkill
    );
    
    if (option.length > 0) {
      // 1. Actualizar React Hook Form (fuente principal de verdad)
      setValue("skillClass", currentSkill);
      console.log(`Habilidad principal actualizada en React Hook Form: ${currentSkill}`);
      
      // 2. Actualizar el estado local (compatibilidad temporal)
      setFieldSkill((prevItems) =>
        prevItems.map((item) =>
          item.field === "skillClass"
            ? { ...item, id: option[0].value, skill: option[0].id || "" }
            : item
        )
      );
      
      clearValidationError('skillClass');
    } else {
      console.warn("No matching option found for skillClass:", currentSkill);
    }
  };

  /**
   * Maneja el cambio en la selección de habilidades extra
   * 
   * Esta función actualiza la habilidad extra del personaje usando React Hook Form como 
   * fuente principal de verdad, manteniendo también actualizado el estado local por compatibilidad.
   * 
   * @param currentSkill - ID de la habilidad extra seleccionada
   */
  const handleSelectExtraSkillChange = (currentSkill: string) => {
    console.log('handleSelectExtraSkillChange', currentSkill);
    
    // Si no hay habilidad seleccionada, limpiar el valor
    if (!currentSkill) {
      setValue("skillExtra", "");
      // Actualizar también el estado local por compatibilidad
      setFieldSkill((prevItems) =>
        prevItems.map((item) =>
          item.field === "skillExtra"
            ? { ...item, id: "", skill: "" }
            : item
        )
      );
      return;
    }
    
    // Buscar la opción correspondiente en las opciones disponibles
    const option = optionsSkillExtra.filter(
      (skill) => skill.value === currentSkill
    );
    
    if (option.length > 0) {
      // 1. Actualizar React Hook Form (fuente principal de verdad)
      setValue("skillExtra", currentSkill);
      console.log(`Habilidad extra actualizada en React Hook Form: ${currentSkill}`);
      
      // 2. Actualizar el estado local (compatibilidad temporal)
      setFieldSkill((prevItems) =>
        prevItems.map((item) =>
          item.field === "skillExtra"
            ? { ...item, id: option[0].value, skill: option[0].id || "" }
            : item
        )
      );
      console.log(`Estado local de habilidad extra actualizado para compatibilidad`);
      
      // Limpiar cualquier error de validación que pudiera haber
      clearValidationError('skillExtra');
    } else {
      console.warn("No matching option found for skillExtra:", currentSkill);
    }
  };
  /**
   * Maneja el cambio en la selección de clase del personaje
   * 
   * Esta función actualiza la clase del personaje, asigna el conocimiento correspondiente,
   * actualiza los puntos de estadísticas y selecciona la habilidad principal según la clase,
   * usando React Hook Form como fuente principal de verdad
   *
   * @param value - ID de la clase seleccionada
   */
  const handleCharacterClassChange = (value: string) => {
    // Limpiar cualquier error de validación previo
    clearValidationError('characterClass');
    
    // Buscar la opción de clase seleccionada
    const selectedOption = optionsCharacterClass.find(
      (option) => option.value === value
    );
    
    console.log("Option found:", selectedOption);
    
    // 1. Actualizar en React Hook Form (fuente principal de verdad)
    setValue("class", value);
    console.log(`Clase actualizada en React Hook Form: ${value}`);
    
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
    
    // 2. Actualizar los datos del personaje (compatibilidad temporal)
    setCharacter((prevState) => {
      if (!prevState) return prevState;
      
      // Usar nuestra función de utilidad para actualizar propiedades de manera segura
      let updated = setCharacterProperty(prevState, 'pus_clase', value);
      updated = setCharacterProperty(updated, 'pus_conocimientos', knowledgeValue);
      console.log("Updated character state with class:", updated);
      return updated;
    });
    // 3. Actualizar puntos de estadísticas basados en la clase y trabajo
    characterStats.updStatsPoints(value, character?.pus_trabajo || '');
    
    // 4. Seleccionar y actualizar la habilidad principal según la clase
    const skillValue = selectedOption?.mainStat ? "S" + selectedOption.mainStat : "";
    setValue("skillClass", skillValue);
    handleSelectSkillChange(skillValue);
  };
  /**
   * Maneja el cambio en la selección de trabajo/profesión del personaje
   * 
   * Esta función actualiza el trabajo del personaje y ajusta los puntos de estadísticas
   * basados en la combinación de clase y trabajo seleccionados,
   * usando React Hook Form como fuente principal de verdad
   *
   * @param value - ID del trabajo seleccionado
   */
  const handleCharacterJobSelectChange = (value: string) => {
    // Limpiar cualquier error de validación previo
    clearValidationError('characterJob');
    
    // 1. Actualizar en React Hook Form (fuente principal de verdad)
    setValue("job", value);
    console.log(`Trabajo actualizado en React Hook Form: ${value}`);
    
    // 2. Actualizar el trabajo en el estado del personaje (compatibilidad temporal)
    setCharacter((prevState) => {
      if (!prevState) return prevState;
      
      // Usar la función helper con tipado seguro para actualizar la propiedad
      const updated = setCharacterProperty(prevState, 'pus_trabajo', value);
      console.log("Updated character state with job:", updated);
      return updated;
    });
    // 3. Actualizar puntos de estadísticas basados en la clase y trabajo
    characterStats.updStatsPoints(character?.pus_clase || '', value);
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
  /**
   * Maneja el cambio en los conocimientos seleccionados del personaje
   * usando React Hook Form como fuente principal de verdad
   * 
   * @param newValues - Array de IDs de los conocimientos seleccionados
   */
  const handleSelectedCheckValuesChange = (newValues: string[]) => {
    console.log("Conocimientos seleccionados:", newValues);
    
    // Construir una cadena separada por comas con los conocimientos seleccionados
    const knowledgeString = newValues.join(',');
    
    // 1. Actualizar en React Hook Form (fuente principal de verdad)
    setValue("knowledge", knowledgeString);
    
    // 2. Actualizar el estado local del personaje (compatibilidad temporal)
    setCharacter((prevState) => {
      if (!prevState) return prevState;
      // Use the type-safe helper to update knowledge property
      const updated = setCharacterProperty(prevState, 'pus_conocimientos', knowledgeString);
      console.log("Estado actualizado con conocimientos:", updated);
      return updated;
    });
    
    // Limpiar cualquier error de validación relacionado con los conocimientos
    clearValidationError('knowledge');
  };
  // Note: handleStatsInputChange is now provided by the useCharacterStats hook

  /**
   * Actualiza la alineación del personaje y aplica efectos visuales
   * basados en la alineación seleccionada, usando React Hook Form como fuente principal
   * 
   * @param value - Alineación seleccionada ('O' para Orden, 'C' para Caos)
   */
  const handleAlignmentChange = (value: string) => {
    console.log('handleAlignmentChange', value);
    
    // 1. Actualizar en React Hook Form (fuente principal de verdad)
    setValue("alignment", value);
    console.log(`Alineación actualizada en React Hook Form: ${value}`);
    
    // 2. Actualizar la alineación en el estado del personaje (compatibilidad temporal)
    setCharacter((prevState) => {
      if (!prevState) return prevState;
      
      // Usar el helper con tipado seguro para modificar la propiedad
      const updated = setCharacterProperty(prevState, 'pus_alineacion', value);
      console.log(`Estado local de alineación actualizado para compatibilidad: ${value}`);
      return updated;
    });
    
    // Limpiar cualquier error de validación relacionado con la alineación
    clearValidationError('alignment');
  };
  
  
  /**
   * Validates an inventory object and ensures it has all required fields
   * @param object The inventory object to validate
   * @returns A valid inventory object with defaults for missing fields
   */
  const validateInventoryObject = (object: Partial<InventoryObject>): InventoryObject => {
    // Ensure all required fields exist with default values if missing
    return {
      id: object.id || uuidv4(),
      name: object.name?.trim() || "Item sin nombre",
      description: object.description?.trim() || "Sin descripción",
      count: typeof object.count === 'number' ? object.count : 1,
      readOnly: object.readOnly || false,
    };
  };

  /**
   * Validates a new inventory item before adding it to the inventory
   * @param name The item name to validate
   * @param count The item count to validate
   * @returns Error message or null if validation passes
   */
  const validateInventoryItem = useCallback((name: string, count: number | string): string | null => {
    // Trim name to check if it's empty
    const nameValue = typeof name === 'string' ? name.trim() : '';
    
    // Validate name
    if (!nameValue) {
      return "El nombre del objeto no puede estar vacío";
    }
    
    // Validate length
    if (nameValue.length > 50) {
      return "El nombre del objeto no puede tener más de 50 caracteres";
    }
    
    // Validate count is a positive number
    const countValue = typeof count === 'number' ? count : parseInt(String(count), 10);
    if (isNaN(countValue) || countValue < 1) {
      return "La cantidad debe ser un número positivo";
    }
    if (countValue > 99) {
      return "La cantidad no puede ser mayor a 99";
    }
    
    // All validations passed
    return null;
  }, []);
  /**
   * Añade un nuevo objeto al inventario
   * 
   * IMPLEMENTACIÓN HÍBRIDA: Esta función muestra el patrón de sincronización
   * entre el estado local y React Hook Form, manteniendo ambos sistemas actualizados.
   * 
   * NOTA SOBRE LA MIGRACIÓN:
   * - En la implementación actual: Mantiene sincronizados ambos enfoques (estado local y RHF)
   * - En la implementación ideal: Usaríamos solo React Hook Form con useFieldArray
   */
  /**
   * Añade un nuevo objeto al inventario usando React Hook Form's field array
   * Esta es la versión migrada que usa exclusivamente React Hook Form
   * - No más dependencia del estado local (setInvObjects)
   * - Toda la gestión de datos a través de React Hook Form
   */  const handleAddObject = useCallback(() => {
    console.log("Añadiendo nuevo objeto al inventario usando React Hook Form");
    
    try {
      // 1. Obtener valores desde React Hook Form
      const newObjectName = getValues("newObjectName");
      const newObjectDescription = getValues("newObjectDescription");
      const newObjectCount = getValues("newObjectCount");
      
      // 2. Validar los datos del objeto
      const errorMessage = validateInventoryItem(newObjectName, newObjectCount);
      if (errorMessage) {
        console.warn("Validación fallida:", errorMessage);
        alert(errorMessage);
        document.getElementById("objectName")?.focus();
        return;
      }    
      
      // 3. Crear un objeto válido y bien formateado
      const newObject = validateInventoryObject({
        id: uuidv4(),
        name: newObjectName.trim(),
        description: newObjectDescription.trim() || "Sin descripción",
        count: typeof newObjectCount === 'number' ? newObjectCount : 1,
        readOnly: false,
      });
      
      console.log("Nuevo objeto creado:", newObject);

      // 4. Actualizar el formulario usando useFieldArray
      appendInventory(newObject);
      
      // 5. Limpiar los campos del formulario usando React Hook Form
      setValue("newObjectName", "");
      setValue("newObjectDescription", "");
      setValue("newObjectCount", 1);
      
      console.log("Objeto añadido correctamente");
    } catch (error) {
      console.error("Error al añadir objeto al inventario:", error);
      alert("No se pudo añadir el objeto. Por favor, inténtalo de nuevo.");
    }
  }, [getValues, setValue, appendInventory, validateInventoryItem]);
/**
   * Elimina un objeto del inventario usando React Hook Form
   * 
   * @param id - ID del objeto a eliminar
   */  const handleDeleteObject = useCallback(async (id: string) => {
    try {
      // 1. Encontrar el índice del objeto en el array de inventario
      const formInventory = getValues("inventory");
      const objectIndex = formInventory.findIndex(obj => obj.id === id);
      
      // 2. Si se encuentra el objeto, eliminarlo usando removeInventory
      if (objectIndex !== -1) {
        removeInventory(objectIndex);
        console.log(`Objeto con ID ${id} eliminado del formulario`);
      } else {
        console.warn(`No se encontró el objeto con ID ${id} en el formulario`);
      }
      
      // 3. Registrar el ID para eliminación en la base de datos
      setDeleteItems((prevItems) => [...prevItems, id]);
    } catch (error) {
      console.error("Error al eliminar objeto del inventario:", error);
      alert("No se pudo eliminar el objeto. Por favor, inténtalo de nuevo.");
    }
  }, [getValues, removeInventory]);
/**
   * Actualiza la cantidad de un objeto en el inventario usando React Hook Form
   * 
   * @param id - ID del objeto a editar
   * @param newCount - Nueva cantidad como string
   */  const handleEditCount = useCallback((id: string, newCount: string) => {
    try {
      // 1. Convertir el valor de entrada a un número válido con valor predeterminado de 1
      const numericValue = validateNumeric(newCount, 1);
      
      // 2. Encontrar el índice del objeto en el array de inventario de React Hook Form
      const formInventory = getValues("inventory");
      const objectIndex = formInventory.findIndex(obj => obj.id === id);
      
      // 3. Si se encuentra el objeto, actualizar su cantidad usando el método update
      if (objectIndex !== -1) {
        const updatedObject = { ...formInventory[objectIndex], count: numericValue };
        updateInventory(objectIndex, updatedObject);
        console.log(`Cantidad del objeto ${id} actualizada a ${numericValue} en el formulario`);
      } else {
        console.warn(`No se encontró el objeto con ID ${id} en el formulario para actualizar su cantidad`);
      }
    } catch (error) {
      console.error("Error al actualizar la cantidad del objeto:", error);
    }
  }, [getValues, updateInventory]);
  const handleNewCount = (value: string) => {
    const numericValue = validateNumeric(value, 1);
    setValue("newObjectCount", numericValue);
  };

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
   * Usando nuestros helpers para acceder a la versión más actualizada de los datos
   * @returns Un objeto DataCharacter con todos los datos del personaje
   */
  const prepareCharacterData = (): DataCharacter => {
    if (!character) {
      console.error("Character data is missing");
      throw new Error("No character data available");
    }
    
    // Obtener datos de formulario con fallback al estado local
    const formValues = getValues();
    const characterStats = getInputStatsFromForm();
    
    // Procesar conocimientos desde el formulario o del personaje
    const knowledgeStr = formValues.knowledge || character.pus_conocimientos || '';
    const knowledgeArray = typeof knowledgeStr === 'string' 
      ? knowledgeStr.split(',').filter(Boolean)
      : Array.isArray(knowledgeStr) ? knowledgeStr : [];
    
    return {
      id: character.pus_id || '',
      player: character.pus_usuario || '',
      name: formValues.name || character.pus_nombre || '',
      class: formValues.class || character.pus_clase || '',
      race: formValues.race || character.pus_raza || '',
      job: formValues.job || character.pus_trabajo || '',
      level: formValues.level || character.pus_nivel || 1,
      luckyPoints: formValues.luckyPoints || character.pus_puntos_suerte || 0,
      description: formValues.characterDescription || character.pus_descripcion || '',
      knowledge: knowledgeArray,
      str: [
        {
          dice: characterStats[0].valueDice,
          class: characterStats[0].valueClass,
          level: characterStats[0].valueLevel,
        },
      ],
      int: [
        {
          dice: characterStats[1].valueDice,
          class: characterStats[1].valueClass,
          level: characterStats[1].valueLevel,
        },
      ],
      dex: [
        {
          dice: characterStats[2].valueDice,
          class: characterStats[2].valueClass,
          level: characterStats[2].valueLevel,
        },
      ],
      con: [
        {
          dice: characterStats[3].valueDice,
          class: characterStats[3].valueClass,
          level: characterStats[3].valueLevel,
        },
      ],
      per: [
        {
          dice: characterStats[4].valueDice,
          class: characterStats[4].valueClass,
          level: characterStats[4].valueLevel,
        },
      ],
      cha: [
        {
          dice: characterStats[5].valueDice,
          class: characterStats[5].valueClass,
          level: characterStats[5].valueLevel,
        },
      ],
      mainWeapon: formValues.mainWeapon || character.pus_arma_principal || '',
      secondaryWeapon: formValues.secondaryWeapon || character.pus_arma_secundaria || '',
      alignment: formValues.alignment || character.pus_alineacion || '',
      mainSkill: formValues.skillClass || '',
      extraSkill: formValues.skillExtra || '',
      skills: getSkillsAcquiredFromForm(),
      coinsInv: [
        Number(formValues.goldCoins) || 0,
        Number(formValues.silverCoins) || 0,
        Number(formValues.bronzeCoins) || 0
      ],
      inv: formValues.inventory || [],
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
  /**
   * Saves character data to the database
   */
  async function saveData() {
    try {
      // Before we start, validate character data
      if (!character) {
        throw new Error("No hay datos de personaje para guardar");
      }

      // Get all form values from React Hook Form (primary source of truth)
      const formValues = getValues();
      
      // Update character with form values to ensure it has the latest data
      // This ensures we're saving what's in the form rather than possibly stale local state
      if (character) {
        character.pus_nombre = formValues.name;
        character.pus_nivel = formValues.level;
        character.pus_suerte = formValues.luckyPoints;
        character.pus_vida = formValues.lifePoints;
        character.pus_arma_principal = formValues.mainWeapon;
        character.pus_arma_secundaria = formValues.secondaryWeapon;
        character.pus_cantidad_oro = formValues.goldCoins;
        character.pus_cantidad_plata = formValues.silverCoins;
        character.pus_cantidad_bronce = formValues.bronzeCoins;
        character.pus_descripcion = formValues.characterDescription;
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
        username: character.pus_usuario,
        formValues
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

  /**
   * Uploads basic character information to the database
   * 
   * @param newRecord - Whether this is a new character or an update
   * @returns - The ID of the saved character
   */
  async function uploadInfoCharacter(newRecord: boolean): Promise<string | undefined> {
    if (!character) {
      console.error("Character object is null or undefined");
      throw new Error("No character data available to save");
    }

    // Get current form values from React Hook Form (primary source of truth)
    const formValues = getValues();
    
    // Update character object with the latest form values before saving
    // This ensures we're saving what the user has actually entered in the form
    if (character) {
      character.pus_nombre = formValues.name;
      character.pus_nivel = Number(formValues.level);
      character.pus_suerte = Number(formValues.luckyPoints);
      character.pus_vida = Number(formValues.lifePoints);
      character.pus_descripcion = formValues.characterDescription || '';
      character.pus_alineacion = formValues.alignment || '';
      
      // These properties may not be directly editable in the form
      // but are maintained in the character state
      if (character.pus_arma_1 !== formValues.mainWeapon) {
        console.log(`Updating mainWeapon from ${character.pus_arma_1} to ${formValues.mainWeapon}`);
        character.pus_arma_1 = formValues.mainWeapon;
      }
      
      if (character.pus_arma_2 !== formValues.secondaryWeapon) {
        console.log(`Updating secondaryWeapon from ${character.pus_arma_2} to ${formValues.secondaryWeapon}`);
        character.pus_arma_2 = formValues.secondaryWeapon;
      }
    }

    // Validate character data before saving
    const missingFields = validateCharacter(character);
    if (missingFields.length > 0) {
      console.error("Character validation failed, missing fields:", missingFields);
      throw new Error(`Datos incompletos del personaje: ${missingFields.join(', ')}`);
    }
    
    try {
      console.log("Saving character data with form values:", { character, formValues });
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
  /**
   * Uploads character statistics to the database
   * 
   * @param isNewCharacter - Whether this is a new character or an update
   * @param characterId - The ID of the character to update
   */
  async function uploadStats(isNewCharacter: boolean, characterId: string) {
    if (characterId === "") return;
    
    // Get stats using our helper function (uses React Hook Form as primary source)
    const characterStats = getInputStatsFromForm();
    
    // Map of stat IDs to their labels for building database records
    const statLabels = {
      'STR': 'Fuerza',
      'INT': 'Inteligencia',
      'DEX': 'Destreza',
      'CON': 'Constitución',
      'PER': 'Percepción',
      'CHA': 'Carisma'
    };
    
    // Build stat records using our helper to get the most up-to-date stats
    const buildStats = () => {
      const stats: DBEstadisticaPersonaje[] = [];
      
      // Use the helper function to get current stat values
      characterStats.forEach(stat => {
        stats.push({
          epe_id: uuidv4(),
          epe_personaje: characterId,
          epe_sigla: stat.id,
          epe_nombre: statLabels[stat.id as keyof typeof statLabels] || stat.label,
          epe_num_dado: stat.valueDice,
          epe_num_clase: stat.valueClass,
          epe_num_nivel: stat.valueLevel,
        });
      });
      
      return stats;
    };
    
    // Process based on whether it's a new character or an update
    if (!isNewCharacter) {
      const stats = buildStats();
      // Update each stat record individually
      for (const stat of stats) {
        await updateCharacterStats(stat);
      }
    } else {
      // Insert all stats at once for new character
      const stats = buildStats();
      await insertDataEpe(stats);
      console.log(`Inserted ${stats.length} stats for new character ${characterId}`);
    }
  }
  /**
   * Uploads character skills data to the database
   * 
   * @param characterId - The ID of the character to update
   */
  async function uploadSkill(characterId: string) {
    if (characterId === "") return;

    // Get form values from React Hook Form (primary source of truth)
    const formValues = getValues();
    const saveSkill: DBHabilidadPersonaje[] = [];
    
    // Add main skill (try React Hook Form first, fall back to local state)
    const mainSkillId = formValues.skillClass || 
      fieldSkill.find(skill => skill.field === "skillClass")?.skill || '';
      
    if (mainSkillId) {
      saveSkill.push({
        hpe_id: uuidv4(),
        hpe_personaje: characterId,
        hpe_habilidad: mainSkillId,
        hpe_campo: "skillClass",
        hpe_alineacion: null,
      });
    } else {
      console.warn("No main skill found for character");
    }
    
    // Add extra skill (try React Hook Form first, fall back to local state)
    const extraSkillId = formValues.skillExtra || 
      fieldSkill.find(skill => skill.field === "skillExtra")?.skill || '';
      
    if (extraSkillId) {
      saveSkill.push({
        hpe_id: uuidv4(),
        hpe_personaje: characterId,
        hpe_habilidad: extraSkillId,
        hpe_campo: "skillExtra",
        hpe_alineacion: null,
      });
    } else {
      console.warn("No extra skill found for character");
    }

    // Add ring skills - use our helper to get the most up-to-date data
    const characterSkills = getSkillsAcquiredFromForm();
    
    // Process and save ring skills
    for (let index = 0; index < characterSkills.length; index++) {
      if (!characterSkills[index].id) continue;
      saveSkill.push({
        hpe_id: uuidv4(),
        hpe_personaje: characterId,
        hpe_habilidad: characterSkills[index].id,
        hpe_campo: "skillRing" + characterSkills[index].value,
        hpe_alineacion: formValues.alignment || null,
      });
    }

    console.log(`Saving ${saveSkill.length} skills for character ${characterId}`, saveSkill);
    await upsertDataHpe(saveSkill);
  }

  async function uploadInventory(characterId: string) {
    if (characterId === "") return;

    // Use inventory data from React Hook Form instead of local state
    const inventoryItems = getValues("inventory") || [];
    
    const saveItems: DBInventarioPersonaje[] = [];
    for (let index = 0; index < inventoryItems.length; index++) {
      saveItems.push({
        inp_id: inventoryItems[index].id,
        inp_personaje: characterId,
        inp_nombre: inventoryItems[index].name,
        inp_descripcion: inventoryItems[index].description,
        inp_cantidad: inventoryItems[index].count,
      });
    }

    upsertDataInp(saveItems);
    deleteItemInventory(deleteItems);
  }  /**
   * Handles the form submission, performing validations and preparing data for saving
   * 
   * @param data The form data submitted
   */
  const onSubmitForm = (data: CharacterForm) => {
    console.log("Form submission data:", {
      formData: data,
      characterState: {
        name: character?.pus_nombre,
        clase: character?.pus_clase,
        raza: character?.pus_raza,
        trabajo: character?.pus_trabajo,
        userName: user?.usu_nombre
      }
    });
    
    // Error categories for better UI feedback
    const basicInfoErrors = ['name', 'characterRace', 'characterClass', 'characterJob'];
    const statsErrors = ['stats', 'level', 'luckyPoints', 'lifePoints'];
    const weaponsErrors = ['mainWeapon', 'secondaryWeapon'];
    const skillsErrors = ['mainSkill', 'extraSkill', 'ringSkills', 'ringSkill0', 'ringSkill1', 'ringSkill2'];
    
    // Check for React Hook Form validation errors first
    if (Object.keys(errors).length > 0) {
      console.log("React Hook Form validation errors:", errors);
      
      // Map React Hook Form errors to our validation structure
      const validationResult = {
        isValid: false,
        errors: Object.entries(errors).reduce((acc, [key, error]) => {
          if (error && error.message) {
            acc[key] = error.message as string;
          }
          return acc;
        }, {} as Record<string, string>),
        warnings: {}
      };
      
      // Use our existing feedback mechanism for consistency
      showValidationFeedback(validationResult);
      return; // Stop form submission if there are React Hook Form errors
    }
    
    // As backup, use our existing validation for additional checks
    let fieldsRequired: string[] = validateCharacterForm();
    let errorMessage = "Por favor, complete todos los campos obligatorios:\n";
    
    // Update character object with form values
    const updatedCharacter = character ? {...character} : undefined;
    if (updatedCharacter) {
      updatedCharacter.pus_nombre = data.name;
      updatedCharacter.pus_nivel = data.level;
      updatedCharacter.pus_suerte = data.luckyPoints;
      updatedCharacter.pus_vida = data.lifePoints;
      updatedCharacter.pus_arma_principal = data.mainWeapon;
      updatedCharacter.pus_arma_secundaria = data.secondaryWeapon;
      updatedCharacter.pus_cantidad_oro = data.goldCoins;
      updatedCharacter.pus_cantidad_plata = data.silverCoins;
      updatedCharacter.pus_cantidad_bronce = data.bronzeCoins;
      updatedCharacter.pus_descripcion = data.characterDescription;
    }
    // Use our enhanced validation function for comprehensive assessment with helper functions
    const validationResults = validateCharacterAttributes(
      updatedCharacter, 
      getInputStatsFromForm(),
      getSkillsAcquiredFromForm(),
      getValues("inventory") || []
    );
    
    // Process validation results with our new feedback function
    const feedbackResult = showValidationFeedback(validationResults);
    
    // If validation failed, stop form processing
    if (!feedbackResult.success) {
      return;
    }
      
    const basicMissing = fieldsRequired.filter(field => basicInfoErrors.includes(field));
    const statsMissing = fieldsRequired.filter(field => statsErrors.includes(field));
    const weaponsMissing = fieldsRequired.filter(field => weaponsErrors.includes(field));
    const skillsMissing = fieldsRequired.filter(field => skillsErrors.includes(field));
    const otherMissing = fieldsRequired.filter(field => 
      !basicInfoErrors.includes(field) && 
      !statsErrors.includes(field) && 
      !weaponsErrors.includes(field) &&
      !skillsErrors.includes(field)
    );
    if (fieldsRequired.length > 0) {
      if (basicMissing.length > 0) errorMessage += "\n- Información básica: " + basicMissing.join(", ");
      if (statsMissing.length > 0) errorMessage += "\n- Estadísticas: " + statsMissing.join(", ");
      if (weaponsMissing.length > 0) errorMessage += "\n- Armamento: " + weaponsMissing.join(", ");
      if (skillsMissing.length > 0) errorMessage += "\n- Habilidades: " + skillsMissing.join(", ");
      if (otherMissing.length > 0) errorMessage += "\n- Otros campos: " + otherMissing.join(", ");
      
      alert(errorMessage);
      return;
    }
    
    // Ensure character exists before proceeding
    if (!character) {
      console.error("Character data is missing");
      alert("Error: No se encontraron datos del personaje. Por favor, intenta nuevamente.");
      return;
    }
    
    // Prepare character data for the modal
    const newCharacter: DataCharacter = {
      id: character.pus_id || '',
      player: character.pus_usuario || '',
      name: data.name,
      class: character.pus_clase || '',
      race: character.pus_raza || '',
      job: character.pus_trabajo || '',
      level: data.level,
      luckyPoints: data.luckyPoints,
      description: data.characterDescription || '',
      knowledge: character.pus_conocimientos ? character.pus_conocimientos.split(',').filter(Boolean) : [],
      mainWeapon: data.mainWeapon || '',
      secondaryWeapon: data.secondaryWeapon || '',
      str: [
        {
          dice: getInputStatsFromForm()[0]?.valueDice || defaultStatsData[0].valueDice,
          class: getInputStatsFromForm()[0]?.valueClass || defaultStatsData[0].valueClass,
          level: getInputStatsFromForm()[0]?.valueLevel || defaultStatsData[0].valueLevel,
        },
      ],
      int: [
        {
          dice: getInputStatsFromForm()[1]?.valueDice || defaultStatsData[1].valueDice,
          class: getInputStatsFromForm()[1]?.valueClass || defaultStatsData[1].valueClass,
          level: getInputStatsFromForm()[1]?.valueLevel || defaultStatsData[1].valueLevel,
        },
      ],
      dex: [
        {
          dice: getInputStatsFromForm()[2]?.valueDice || defaultStatsData[2].valueDice,
          class: getInputStatsFromForm()[2]?.valueClass || defaultStatsData[2].valueClass,
          level: getInputStatsFromForm()[2]?.valueLevel || defaultStatsData[2].valueLevel,
        },
      ],
      con: [
        {
          dice: getInputStatsFromForm()[3]?.valueDice || defaultStatsData[3].valueDice,
          class: getInputStatsFromForm()[3]?.valueClass || defaultStatsData[3].valueClass,
          level: getInputStatsFromForm()[3]?.valueLevel || defaultStatsData[3].valueLevel,
        },
      ],
      per: [
        {
          dice: getInputStatsFromForm()[4]?.valueDice || defaultStatsData[4].valueDice,
          class: getInputStatsFromForm()[4]?.valueClass || defaultStatsData[4].valueClass,
          level: getInputStatsFromForm()[4]?.valueLevel || defaultStatsData[4].valueLevel,
        },
      ],
      cha: [
        {
          dice: getInputStatsFromForm()[5]?.valueDice || defaultStatsData[5].valueDice,
          class: getInputStatsFromForm()[5]?.valueClass || defaultStatsData[5].valueClass,
          level: getInputStatsFromForm()[5]?.valueLevel || defaultStatsData[5].valueLevel,
        },
      ],
      mainSkill: data.skillClass || '',
      extraSkill: data.skillExtra || '',
      alignment: character.pus_alineacion || '',
      skills: ringSkills.getSkillsFromForm(),
      coinsInv: [
        data.goldCoins || 0,
        data.silverCoins || 0, 
        data.bronzeCoins || 0
      ],
      inv: getValues("inventory") || [],
    };
    
    // Only update character if updatedCharacter is not undefined
    if (updatedCharacter) {
      setCharacter(updatedCharacter);
    }
    
    console.log("onSubmitForm: Preparando datos para el modal", newCharacter);
    setDataCharacter(newCharacter);
    console.log("onSubmitForm: Abriendo modal...");
    onOpen();
    console.log("onSubmitForm: Modal debería estar abierto ahora, isOpen=", isOpen);
  };
  /**
   * Validates the character form data, checking all required fields and constraints
   * 
   * @returns Array of field names with validation errors
   */
  const validateCharacterForm = (): string[] => {
    let fieldsRequired: string[] = [];
    
    // Get form values from React Hook Form (primary source of truth)
    const formValues = getValues();
    
    // Create a character object using form values with fallback to local state
    const tempCharacter = character ? { ...character } : {} as DBPersonajesUsuario;
    
    // Update character fields with form values
    tempCharacter.pus_nombre = formValues.name;
    tempCharacter.pus_clase = formValues.class;
    tempCharacter.pus_raza = formValues.race;
    tempCharacter.pus_trabajo = formValues.job;
    tempCharacter.pus_nivel = Number(formValues.level);
    tempCharacter.pus_suerte = Number(formValues.luckyPoints);
    tempCharacter.pus_vida = Number(formValues.lifePoints);
    tempCharacter.pus_arma_principal = formValues.mainWeapon;
    tempCharacter.pus_arma_secundaria = formValues.secondaryWeapon;
    tempCharacter.pus_descripcion = formValues.characterDescription;
    tempCharacter.pus_alineacion = formValues.alignment;
    
    // Use our character validation utility for base character properties
    if (character) {
      const characterErrors = validateCharacter(tempCharacter);
      
      // Map database field names to UI field names for validation
      characterErrors.forEach(field => {
        if (field === 'pus_nombre') fieldsRequired.push('name');
        else if (field === 'pus_clase') fieldsRequired.push('characterClass');
        else if (field === 'pus_raza') fieldsRequired.push('characterRace');
        else if (field === 'pus_trabajo') fieldsRequired.push('characterJob');
      });
    } else {
      fieldsRequired.push('character');
      // Only exit early if we don't have a character object, to allow partial validation
      return fieldsRequired;
    }
    
    // Check basic required text fields
    if (!formValues.name?.trim()) {
      if (!fieldsRequired.includes('name')) fieldsRequired.push('name');
    }
    
    // Validate character level with proper type safety
    const level = safeNumberConversion(formValues.level);
    if (level < 1 || level > 10) {
      fieldsRequired.push('level');
    }
    
    // Validate other numeric values
    const luckyPoints = safeNumberConversion(formValues.luckyPoints);
    if (luckyPoints < 0) {
      fieldsRequired.push('luckyPoints');
    }
    
    const lifePoints = safeNumberConversion(formValues.lifePoints);
    if (lifePoints < 0) {
      fieldsRequired.push('lifePoints');
    }
    
    // Validate required weapons
    if (!formValues.mainWeapon?.trim()) {
      fieldsRequired.push('mainWeapon');
    }
    // Validate stats using our helper function to get most current stats data
    const statsToValidate = getInputStatsFromForm();
    
    // First check overall stats
    if (!validateCharacterStats(statsToValidate)) {
      fieldsRequired.push('stats');
    } else {
      // Additional check for total stats to ensure character has some abilities
      const totalStats = statsToValidate.reduce((sum, stat) => 
        sum + stat.valueDice + stat.valueClass + stat.valueLevel, 0);
      
      if (totalStats <= 0) {
        if (!fieldsRequired.includes('stats')) fieldsRequired.push('stats');
      }
      
      // Then validate each stat individually for more detailed feedback
      const statIds = ['STR', 'INT', 'DEX', 'CON', 'PER', 'CHA'];
      statIds.forEach(statId => {
        const result = characterStats.validateSingleStat(statId);
        if (!result.isValid && !fieldsRequired.includes('stats')) {
          fieldsRequired.push('stats');
          console.warn(`Stat validation failed for ${statId}: ${result.message}`);
        }
      });
    }
    
    // Validate selected skills using helper function to get consistent data
    const skills = getSkillsAcquiredFromForm();
    if (!formValues.skillClass) {
      fieldsRequired.push('mainSkill');
    }
    
    // Check if ring skills are properly assigned (if they should be)
    const ringSkillsWithoutName = skills.filter(skill => skill.ring && !skill.name);
    if (ringSkillsWithoutName.length > 0) {
      fieldsRequired.push('ringSkills');
      console.warn('Missing ring skill names:', ringSkillsWithoutName.map(s => s.value).join(', '));
    }
    
    // Validate character description if it's a required field
    if (formValues.characterDescription?.trim() === '') {
      fieldsRequired.push('description');
    }
    
    // Remove any duplicate entries
    return [...new Set(fieldsRequired)];
  };
    /**
   * Helper function to get InputStats array from React Hook Form data
   * This ensures that all code that previously used inputsStatsData can work
   * with React Hook Form's data as the source of truth
   */
  const getInputStatsFromForm = useCallback((): InputStats[] => {
    const inputStatsFormStats = getValues("stats") || [];
    if (inputStatsFormStats.length < 6) return defaultStatsData; // Fallback to default data
    
    return inputStatsFormStats.map(stat => ({
      id: stat.id,
      label: stat.label,
      description: stat.description,
      valueDice: stat.valueDice,
      valueClass: stat.valueClass,
      valueLevel: stat.valueLevel
    }));
  }, [getValues, defaultStatsData]);
  /**
   * Get the skills from React Hook Form and ensure they are properly formatted
   * This is now a simple wrapper around our custom hook
   * 
   * @returns Array of skills from the form
   */
  const getSkillsAcquiredFromForm = useCallback((): SkillsAcquired[] => {
    return ringSkills.getSkillsFromForm();
  }, [ringSkills]);

  /**
   * Displays user-friendly validation feedback based on validation results
   * Groups errors by category and creates a well-structured message
   * 
   * MIGRATION STATUS: Enhanced to better support React Hook Form validation
   * - Shows more detailed errors by category
   * - Provides better error highlighting using field names from React Hook Form
   * - Adds support for both errors and warnings
   * 
   * @param validationResults The detailed validation results
   * @param showAlerts Whether to display alert boxes (default true)
   * @returns Object with validation summary
   */
  const showValidationFeedback = useCallback((
    validationResults: {
      isValid: boolean,
      errors: Record<string, string>,
      warnings: Record<string, string>
    },
    showAlerts = true
  ) => {
    // Early return if validation passed
    if (validationResults.isValid && Object.keys(validationResults.warnings).length === 0) {
      return { success: true };
    }
    
    // Track fields that have errors for form highlighting
    const fieldsWithErrors: string[] = [];
    
    // Group errors by category for better user experience
    const errorGroups: Record<string, string[]> = {
      'Basic Information': [],
      'Character Stats': [],
      'Equipment': [],
      'Skills': [],
      'Other': []
    };

    // Process all errors
    Object.entries(validationResults.errors).forEach(([field, message]) => {
      if (field.startsWith('pus_')) {
        // Map database field names to UI field names and React Hook Form fields
        switch(field) {
          case 'pus_nombre':
            fieldsWithErrors.push('name');
            errorGroups['Basic Information'].push(message);
            break;
          case 'pus_clase':
            fieldsWithErrors.push('characterClass');
            errorGroups['Basic Information'].push(message);
            break;
          case 'pus_raza':
            fieldsWithErrors.push('characterRace');
            errorGroups['Basic Information'].push(message);
            break;
          case 'pus_trabajo':
            fieldsWithErrors.push('characterJob');
            errorGroups['Basic Information'].push(message);
            break;
          case 'pus_nivel':
            fieldsWithErrors.push('level');
            errorGroups['Character Stats'].push(message);
            break;
          case 'pus_puntos_suerte':
            fieldsWithErrors.push('luckyPoints');
            errorGroups['Character Stats'].push(message);
            break;
          case 'pus_vida':
            fieldsWithErrors.push('lifePoints');
            errorGroups['Character Stats'].push(message);
            break;
          case 'pus_arma_principal':
            fieldsWithErrors.push('mainWeapon');
            errorGroups['Equipment'].push(message);
            break;
          case 'pus_conocimientos':
            fieldsWithErrors.push('knowledge');
            errorGroups['Basic Information'].push(message);
            break;
          default:
            errorGroups['Other'].push(`${field}: ${message}`);
        }
      } else if (field === 'stats' || field.startsWith('stat_')) {
        fieldsWithErrors.push('stats');
        errorGroups['Character Stats'].push(message);
      } else if (field.startsWith('skill') || field === 'ringSkills' || field.startsWith('skills.')) {
        // Handle both legacy skill errors and React Hook Form skill array errors
        if (field.startsWith('skills.')) {
          // Extract index from array path (e.g., skills.0.name -> 0)
          const match = field.match(/skills\.(\d+)/);
          if (match && match[1]) {
            fieldsWithErrors.push(`ringSkill${match[1]}`);
          } else {
            fieldsWithErrors.push('ringSkills');
          }
        } else {
          fieldsWithErrors.push(field);
        }
        errorGroups['Skills'].push(message);
      } else if (field.startsWith('inv_') || field.startsWith('inventory.')) {
        fieldsWithErrors.push('inventory');
        errorGroups['Equipment'].push(message);
      } else {
        // Default case for other errors
        errorGroups['Other'].push(`${field}: ${message}`);
      }
    });

    // Process warnings (less severe than errors)
    const warningMessages: string[] = [];
    Object.entries(validationResults.warnings).forEach(([field, message]) => {
      // Categorize warnings similar to errors but don't mark fields as errors
      if (field.startsWith('pus_')) {
        switch(field) {
          // Similar mapping pattern as errors
          case 'pus_nombre':
          case 'pus_clase':
          case 'pus_raza':
          case 'pus_trabajo':
            warningMessages.push(`Basic Information: ${message}`);
            break;
          case 'pus_nivel':
          case 'pus_puntos_suerte':
          case 'pus_vida':
            warningMessages.push(`Character Stats: ${message}`);
            break;
          default:
            warningMessages.push(`${field}: ${message}`);
        }
      } else {
        warningMessages.push(`${field}: ${message}`);
      }
    });

    // Build comprehensive error message
    let errorMessage = "Por favor, corrija los siguientes problemas antes de guardar:\n\n";
    
    Object.entries(errorGroups).forEach(([group, messages]) => {
      if (messages.length > 0) {
        errorMessage += `${group}:\n`;
        messages.forEach(msg => {
          errorMessage += `• ${msg}\n`;
        });
        errorMessage += '\n';
      }
    });

    // Add warnings if any exist
    if (warningMessages.length > 0) {
      errorMessage += "\nAdvertencias (todavía puedes guardar con advertencias):\n";
      warningMessages.forEach(msg => {
        errorMessage += `• ${msg}\n`;
      });
    }

    // Show alert if requested
    if (showAlerts && Object.keys(validationResults.errors).length > 0) {
      alert(errorMessage);
    }

    // Set empty required fields for UI highlighting in the form
    setEmptyRequiredFields(fieldsWithErrors);

    return {
      success: false,
      errorMessage,
      fieldsWithErrors
    };
  }, []);

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
          getValues("alignment") === 'O' ? 'orden' : getValues("alignment") === 'C' ? 'caos' : ''
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
                characterStats.handleLevelChange(levelValue);
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
          <header className="stats-player-header col-span-3 col-start-3 flex items-center gap-2">
            <div className="relative group">
              <Tooltip
                className="bg-dark text-light px-2 py-1"
                placement="top"
                content={"Generar estadísticas aleatorias"}
              >
                <button
                  type="button"
                  className="btn-save-character"
                  onClick={() => {
                    const generationType = document.getElementById('statGenerationType') as HTMLSelectElement;
                    characterStats.randomRoll(generationType?.value as 'balanced' | 'heroic' | 'standard' || 'balanced');
                  }}
                  aria-label="Generar estadísticas aleatorias"
                >
                  <SvgD4Roll className="btn-roll" width={30} height={30} aria-hidden="true" />
                </button>
              </Tooltip>
              
              {/* Generation type dropdown */}
              <select 
                id="statGenerationType"
                className="absolute top-full right-0 mt-1 py-1 px-2 text-xs bg-white border border-gray-300 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                aria-label="Tipo de generación"
                defaultValue="balanced"
              >
                <option value="balanced">Equilibrado</option>
                <option value="heroic">Heroico</option>
                <option value="standard">Estándar</option>
              </select>
            </div>
          </header>

          {/* STRENGTH */}
          <FormInputStats
            inputStats={getValues("stats")[0] || characterStats.defaultStatsData[0]}
            onSelectedValuesChange={characterStats.handleStatsInputChange}
          />

          {/* INTELLIGENCE */}
          <FormInputStats
            inputStats={getValues("stats")[1] || characterStats.defaultStatsData[1]}
            onSelectedValuesChange={characterStats.handleStatsInputChange}
          />

          {/* DEXTERITY */}
          <FormInputStats
            inputStats={getValues("stats")[2] || characterStats.defaultStatsData[2]}
            onSelectedValuesChange={characterStats.handleStatsInputChange}
          />

          {/* CONSTITUTION */}
          <FormInputStats
            inputStats={getValues("stats")[3] || characterStats.defaultStatsData[3]}
            onSelectedValuesChange={characterStats.handleStatsInputChange}
          />

          {/* PERCEPTION */}
          <FormInputStats
            inputStats={getValues("stats")[4] || characterStats.defaultStatsData[4]}
            onSelectedValuesChange={characterStats.handleStatsInputChange}
          />

          {/* CHARISMA */}
          <FormInputStats
            inputStats={getValues("stats")[5] || characterStats.defaultStatsData[5]}
            onSelectedValuesChange={characterStats.handleStatsInputChange}
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
            {listWearpons?.map((elem) => (
              <option key={elem} value={elem}>
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
            selectedValue={getValues("skillClass")}
            onSelectChange={handleSelectSkillChange}
          ></FormSelectInfoPlayer>

          {/* Debug information */}
          {optionsSkillClass.length === 0 && <div className="text-red-500 text-xs">No options available for skillClass</div>}

          <FormSelectInfoPlayer
            id="skillExtra"
            label="Habilidad extra"
            options={optionsSkillExtra}
            selectedValue={getValues("skillExtra")}
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
                {...register("alignment")}
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
                values={getValues("skills")[0] || defaultSkillsData[0]}
                onSelectChange={handleSelectedRingSkillChange}
                onSelectTypeChange={handleSelectedTypeRingSkillChange}
              />

              <FormInputSkillsRing
                id={"1"}
                level={character!.pus_nivel}
                levelEvaluated={6}
                ringTypes={optionsRingTypes}
                skillList={skillsRingList[1]}
                values={getValues("skills")[1] || defaultSkillsData[1]}
                onSelectChange={handleSelectedRingSkillChange}
                onSelectTypeChange={handleSelectedTypeRingSkillChange}
              />

              <FormInputSkillsRing
                id={"2"}
                level={character!.pus_nivel}
                levelEvaluated={9}
                ringTypes={optionsRingTypes}
                skillList={skillsRingList[2]}
                values={getValues("skills")[2] || defaultSkillsData[2]}
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
            {...register("goldCoins", { 
              required: true, 
              maxLength: 3,
              onChange: (e) => {
                const numericValue = validateNumeric(e.target.value);
                setValue("goldCoins", numericValue);
                clearValidationError('goldCoins');
              }
            })}
            placeholder="Oro"
            className={`form-input ml-2 col-span-1 focus:border-black focus:shadow ${
              emptyRequiredFields.includes('goldCoins') ? 'required-input' : ''
            }`}
          />
          <input
            {...register("silverCoins", { 
              required: true, 
              maxLength: 3,
              onChange: (e) => {
                const numericValue = validateNumeric(e.target.value);
                setValue("silverCoins", numericValue);
                clearValidationError('silverCoins');
              }
            })}
            placeholder="Plata"
            className={`form-input col-span-1 focus:border-black focus:shadow ${
              emptyRequiredFields.includes('silverCoins') ? 'required-input' : ''
            }`}
          />
          <input
            {...register("bronzeCoins", { 
              required: true, 
              maxLength: 3,
              onChange: (e) => {
                const numericValue = validateNumeric(e.target.value);
                setValue("bronzeCoins", numericValue);
                clearValidationError('bronzeCoins');
              }
            })}
            placeholder="Bronce"
            className={`form-input mr-2 col-span-1 focus:border-black focus:shadow ${
              emptyRequiredFields.includes('bronzeCoins') ? 'required-input' : ''
            }`}
          />

          <label className="form-lbl mb-1 col-span-3 bg-grey-lighter ">
            Bolsa
          </label>
          {/* Listado de objetos */}
          {inventoryFields.map((elem) => (
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
            placeholder="Nuevo objeto"
            className={`form-input col-span-2 focus:border-black focus:shadow ${errors.newObjectName ? 'border-red-500' : ''}`}
            {...register("newObjectName", {
              maxLength: {
                value: 50,
                message: "El nombre no puede exceder 50 caracteres"
              }
            })}
            maxLength={50}
          />
          <input
            type="text"
            id="objectCount"
            placeholder="Cantidad"
            className={`form-input mr-2 col-span-1 focus:border-black focus:shadow ${errors.newObjectCount ? 'border-red-500' : ''}`}
            {...register("newObjectCount", {
              validate: value => {
                const numValue = Number(value);
                return (!isNaN(numValue) && numValue > 0 && numValue <= 99) || 
                  "La cantidad debe ser un número entre 1 y 99";
              }
            })}
            maxLength={2}
            onChange={(e) => handleNewCount(e.target.value)}
          />
          <input
            type="text"
            id="objectDescription"
            placeholder="Descripción"
            className={`form-input mx-2 col-span-3 row-span-2 focus:border-black focus:shadow ${errors.newObjectDescription ? 'border-red-500' : ''}`}
            {...register("newObjectDescription", {
              maxLength: {
                value: 200,
                message: "La descripción no puede exceder 200 caracteres"
              }
            })}
            maxLength={200}
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
                        <td>Constitución</td>
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
