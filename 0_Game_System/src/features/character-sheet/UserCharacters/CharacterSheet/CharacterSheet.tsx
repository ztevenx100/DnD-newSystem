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
  useDisclosure,
} from "@nextui-org/react";
import "./CharacterSheet.css";

// Database Services
import {
  addStorageCharacter,
  getUrlCharacter,
} from "@database/storage/dbStorage";
import {
  getCharacter,
  getGameSystem,
  getCharacterStats,
  getListHad,
  getCharacterInventory,
  getCharacterSkills,
  CharacterService,
} from "@features/character-sheet/infrastructure/services";

// Local Components
import FormSelectInfoPlayerWrapper from "./FormSelectInfoPlayer/FormSelectInfoPlayerWrapper";
import FormInputSkillsRingWrapper from "./FormInputSkillsRing/FormInputSkillsRingWrapper";
import KnowledgeWrapper from "./components/KnowledgeWrapper";
import CharacterSaveModal from "./CharacterSaveModal/CharacterSaveModal";
import CharacterImageWrapper from "./components/CharacterImageWrapper";
import CharacterStatsWrapper from "./components/CharacterStatsWrapper";
import CharacterBasicInfoWrapper from "./components/CharacterBasicInfoWrapper";
import CharacterInventoryWrapper from "./components/CharacterInventoryWrapper";

// Context
import { useCharacterSheet } from "./context/CharacterSheetContext";

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
  DBHabilidad,
  DBHabilidadPersonaje,
  DBInventarioPersonaje,
  DBPersonajesUsuario,
  DBSistemaJuego,
  DBUsuario,
} from '@shared/utils/types';

// Utility Functions
import { validateNumeric } from "@shared/utils/helpers/utilConversions";
import { normalizeUser } from "@shared/utils/helpers/userHelpers";
import { mapSkillFields } from "./fixSkills";
import {
  getCharacterProperty, 
  getGameSystemProperty,
  validateCharacterAttributes
} from "@shared/utils/helpers/characterHelpers";

// Assets and Icons
import mainBackground from "@img/webp/bg-home-02.webp";
import ScreenLoader from "@UI/ScreenLoader/ScreenLoader";
import SvgCharacter from "@Icons/SvgCharacter";
import SvgSaveCharacter from "@Icons/SvgSaveCharacter";
import SvgD4Roll from "@Icons/SvgD4Roll";

// Constants
import { 
  optionsCharacterClass, 
  optionsCharacterRace, 
  optionsCharacterJob, 
  optionsRingTypes, 
  listWearpons, 
  checkboxesData 
} from '../../constants/characterOptions';

// Importar las props desde el archivo de tipos
import { CharacterSheetProps } from './types/characterSheetProps';

export const CharacterSheet: React.FC<CharacterSheetProps> = ({
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
    watch,
    formState: { errors }  } = methods;

  // Get additional data from context (this provides skillsRingList, among other things)
  const { skillsRingList } = useCharacterSheet();

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
  const [newRecord, setNewRecord] = useState<boolean>(true);
  const navigate = useNavigate();
  const params = useParams();
  // Initialize character stats hook - now after all dependencies are declared
  const characterStats = useCharacterStats({
    getValues,
    setValue,
    updateStats,
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
          
        }
      }
    } catch (error) {
      console.error("Error al cargar el inventario:", error);
    }
  }, [params.id, appendInventory, getValues, setValue]);
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
            // Ring skills are now handled by the context and ringSkills hook
            ringSkills.setRingSkillName(ringNumber, elem.sigla, elem.estadistica_base, elem.estadistica_base);
          }
        }
      });
      setFieldSkill(updatedFieldSkill);
    }
  }, [params.id, setValue, ringSkills]);

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
   * Carga las estadísticas del personaje desde la base de datos
   */
  const getStats = useCallback(async () => {
    if (params.id === null || params.id === undefined) return;

    try {
      const data = await getCharacterStats(params.id);
      
      if (data !== null && Array.isArray(data)) {
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
        } else {
          console.warn("No se pudo actualizar el array de estadísticas: longitud incorrecta");
          return;
        }
        
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
        // For new characters, just set default values in the form
        setValue("characterId", uuidv4());
        setValue("userName", userId);
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

        // Load character data into the form
        setValue("characterId", getCharacterProperty(characterData, 'pus_id', ''));
        setValue("userName", getCharacterProperty(characterData, 'pus_usuario', userId));
        setValue("name", getCharacterProperty(characterData, 'pus_nombre', ''));
        setValue("class", getCharacterProperty(characterData, 'pus_clase', ''));
        setValue("level", getCharacterProperty(characterData, 'pus_nivel', 1));
        setValue("race", getCharacterProperty(characterData, 'pus_raza', ''));
        setValue("job", getCharacterProperty(characterData, 'pus_trabajo', ''));
        setValue("alignment", getCharacterProperty(characterData, 'pus_alineacion', ''));
        setValue("luckyPoints", Number(getCharacterProperty(characterData, 'pus_puntos_suerte', 0)));
        setValue("lifePoints", Number(getCharacterProperty(characterData, 'pus_puntos_vida', 0)));
        setValue("knowledge", getCharacterProperty(characterData, 'pus_conocimientos', ''));
        setValue("characterDescription", getCharacterProperty(characterData, 'pus_descripcion', ''));
        setValue("mainWeapon", getCharacterProperty(characterData, 'pus_arma_principal', ''));
        setValue("secondaryWeapon", getCharacterProperty(characterData, 'pus_arma_secundaria', ''));
        setValue("goldCoins", Number(getCharacterProperty(characterData, 'pus_monedas_oro', 0)));
        setValue("silverCoins", Number(getCharacterProperty(characterData, 'pus_monedas_plata', 0)));
        setValue("bronzeCoins", Number(getCharacterProperty(characterData, 'pus_monedas_bronce', 0)));

      } catch (parseError) {
        console.error("Error processing character data:", parseError);
        alert("Error al procesar los datos del personaje. Algunos campos pueden no estar disponibles.");
      }
    } catch (error) {
      handleAsyncError(error, "fetching character info");
    }
  }, [params.id, user]);
    useEffect(() => {
    if (user?.usu_nombre) setValue("userName", user.usu_nombre);
  }, [setValue, user]);

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
      const data = await getListHad();

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
   * 
   * @param value - ID de la raza seleccionada
   */
   const handleSelectRaceChange = (value: string) => {
    setValue("race", value);
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
    
    setSystemGame({
      sju_id: option[0].value,
      sju_nombre: option[0].name,
      sju_descripcion: systemGame.sju_descripcion
    });
  };
  /**
   * Maneja el cambio en la selección de habilidad principal del personaje
   * 
   * @param currentSkill - ID de la habilidad seleccionada
   */
  const handleSelectSkillChange = (currentSkill: string) => {
    if (!currentSkill) {
      setValue("skillClass", "");
      setFieldSkill((prevItems) =>
        prevItems.map((item) =>
          item.field === "skillClass"
            ? { ...item, id: "", skill: "" }
            : item
        )
      );
      return;
    }
    
    const option = optionsSkillClass.filter(
      (skill) => skill.value === currentSkill
    );
    
    if (option.length > 0) {
      setValue("skillClass", currentSkill);
      
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
   * @param currentSkill - ID de la habilidad extra seleccionada
   */
  const handleSelectExtraSkillChange = (currentSkill: string) => {
    if (!currentSkill) {
      setValue("skillExtra", "");
      setFieldSkill((prevItems) =>
        prevItems.map((item) =>
          item.field === "skillExtra"
            ? { ...item, id: "", skill: "" }
            : item
        )
      );
      return;
    }
    
    const option = optionsSkillExtra.filter(
      (skill) => skill.value === currentSkill
    );
    
    if (option.length > 0) {
      setValue("skillExtra", currentSkill);
      
      setFieldSkill((prevItems) =>
        prevItems.map((item) =>
          item.field === "skillExtra"
            ? { ...item, id: option[0].value, skill: option[0].id || "" }
            : item
        )
      );
      
      clearValidationError('skillExtra');
    } else {
      console.warn("No matching option found for skillExtra:", currentSkill);
    }
  };
  /**
   * Maneja el cambio en la selección de clase del personaje
   * 
   * Actualiza la clase del personaje, asigna el conocimiento correspondiente,
   * actualiza los puntos de estadísticas y selecciona la habilidad principal según la clase.
   *
   * @param value - ID de la clase seleccionada
   */
  const handleCharacterClassChange = (value: string) => {
    clearValidationError('characterClass');
    
    const selectedOption = optionsCharacterClass.find(
      (option) => option.value === value
    );
    
    setValue("class", value);
    
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
    
    setValue("knowledge", knowledgeValue);
    
    // Actualizar puntos de estadísticas basados en la clase y trabajo
    characterStats.updStatsPoints(value, getValues("job") || '');
    
    // Seleccionar y actualizar la habilidad principal según la clase
    const skillValue = selectedOption?.mainStat ? "S" + selectedOption.mainStat : "";
    setValue("skillClass", skillValue);
    handleSelectSkillChange(skillValue);
  };
  /**
   * Maneja el cambio en la selección de trabajo/profesión del personaje
   * 
   * Actualiza el trabajo del personaje y ajusta los puntos de estadísticas
   * basados en la combinación de clase y trabajo seleccionados.
   *
   * @param value - ID del trabajo seleccionado
   */
  const handleCharacterJobSelectChange = (value: string) => {
    clearValidationError('characterJob');
    setValue("job", value);
    
    // Actualizar puntos de estadísticas basados en la clase y trabajo
    characterStats.updStatsPoints(getValues("class") || '', value);
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
   * 
   * @param newValues - Array de IDs de los conocimientos seleccionados
   */
  const handleSelectedCheckValuesChange = (newValues: string[]) => {
    const knowledgeString = newValues.join(',');
    setValue("knowledge", knowledgeString);
    clearValidationError('knowledge');
  };
  // Note: handleStatsInputChange is now provided by the useCharacterStats hook
  /**
   * Actualiza la alineación del personaje
   * 
   * @param value - Alineación seleccionada ('O' para Orden, 'C' para Caos)
   */
  const handleAlignmentChange = (value: string) => {
    setValue("alignment", value);
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
   */
  const handleAddObject = useCallback(() => {
    try {
      const newObjectName = getValues("newObjectName");
      const newObjectDescription = getValues("newObjectDescription");
      const newObjectCount = getValues("newObjectCount");
      
      const errorMessage = validateInventoryItem(newObjectName, newObjectCount);
      if (errorMessage) {
        alert(errorMessage);
        document.getElementById("objectName")?.focus();
        return;
      }
      const newObject = validateInventoryObject({
        id: uuidv4(),
        name: newObjectName.trim(),
        description: newObjectDescription.trim() || "Sin descripción",
        count: typeof newObjectCount === 'number' ? newObjectCount : 1,
        readOnly: false,
      });

      appendInventory(newObject);
      setValue("newObjectName", "");
      setValue("newObjectDescription", "");
      setValue("newObjectCount", 1);
    } catch (error) {
      console.error("Error al añadir objeto al inventario:", error);
      alert("No se pudo añadir el objeto. Por favor, inténtalo de nuevo.");
    }
  }, [getValues, setValue, appendInventory, validateInventoryItem]);
  /**
   * Elimina un objeto del inventario
   * 
   * @param id - ID del objeto a eliminar
   */
  const handleDeleteObject = useCallback(async (id: string) => {
    try {
      const formInventory = getValues("inventory");
      const objectIndex = formInventory.findIndex(obj => obj.id === id);
      
      if (objectIndex !== -1) {
        removeInventory(objectIndex);
      } else {
        console.warn(`No se encontró el objeto con ID ${id} en el formulario`);
      }
      
      setDeleteItems((prevItems) => [...prevItems, id]);
    } catch (error) {
      console.error("Error al eliminar objeto del inventario:", error);
      alert("No se pudo eliminar el objeto. Por favor, inténtalo de nuevo.");
    }
  }, [getValues, removeInventory]);
  /**
   * Actualiza la cantidad de un objeto en el inventario
   * 
   * @param id - ID del objeto a editar
   * @param newCount - Nueva cantidad como string
   */
  const handleEditCount = useCallback((id: string, newCount: string) => {
    try {
      const numericValue = validateNumeric(newCount, 1);
      const formInventory = getValues("inventory");
      const objectIndex = formInventory.findIndex(obj => obj.id === id);
      
      if (objectIndex !== -1) {
        const updatedObject = { ...formInventory[objectIndex], count: numericValue };
        updateInventory(objectIndex, updatedObject);
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
    
    // Get form values for validation
    const formValues = getValues();
    
    // Validate required character properties
    if (!formValues.race?.trim()) {
      fieldsRequired.push('characterRace');
    }
    if (!formValues.job?.trim()) {
      fieldsRequired.push('characterJob');
    }
    if (!formValues.class?.trim()) {
      fieldsRequired.push('characterClass');
    }
    
    // Validate form fields
    if (!formValues.name?.trim()) {
      fieldsRequired.push('name');
    }
    
    // Validate stats - use our getStatTotal helper
    const totalStatsSum = getStatTotal('total');
    if (totalStatsSum <= 0) {
      fieldsRequired.push('stats');
    }
    
    return fieldsRequired;
  };
  /**
   * Prepara los datos del personaje para el modal
   * 
   * @returns Un objeto DataCharacter con todos los datos del personaje
   */
  const prepareCharacterData = (): DataCharacter => {
    const formValues = getValues();
    const characterStats = getInputStatsFromForm();
    
    // Procesar conocimientos desde el formulario
    const knowledgeStr = formValues.knowledge || '';
    const knowledgeArray = typeof knowledgeStr === 'string' 
      ? knowledgeStr.split(',').filter(Boolean)
      : Array.isArray(knowledgeStr) ? knowledgeStr : [];
    
    return {
      id: formValues.characterId || '',
      player: formValues.userName || '',
      name: formValues.name || '',
      class: formValues.class || '',
      race: formValues.race || '',
      job: formValues.job || '',
      level: formValues.level || 1,
      luckyPoints: formValues.luckyPoints || 0,
      description: formValues.characterDescription || '',
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
      ],      mainWeapon: formValues.mainWeapon || '',
      secondaryWeapon: formValues.secondaryWeapon || '',
      alignment: formValues.alignment || '',
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
    // Validar campos requeridos
    const fieldsRequired = validateRequiredFields();
    setEmptyRequiredFields(fieldsRequired);
    
    if (fieldsRequired.length > 0) {
      alert("Por favor, complete todos los campos obligatorios: " + fieldsRequired.join(", "));
      return;
    }

    try {
      const newCharacter = prepareCharacterData();
      setDataCharacter(newCharacter);
      onOpen();
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
    
    validIds.forEach((know) => {
      const found = checkboxesData.find((elem) => elem.value === know);
      if (found) {
        names += found.name + ", ";
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
   * Saves character data to the database using the CharacterService
   */
  async function saveData() {
    try {
      const formValues = getValues();
      
      // Build character object from form data
      const characterData: DBPersonajesUsuario = {
        pus_id: formValues.characterId || uuidv4(),
        pus_usuario: formValues.userName || user?.id || '',
        pus_nombre: formValues.name || '',
        pus_clase: formValues.class || '',
        pus_raza: formValues.race || '',
        pus_trabajo: formValues.job || '',
        pus_nivel: formValues.level || 1,
        pus_puntos_suerte: formValues.luckyPoints || 0,
        pus_vida: formValues.lifePoints || 0,
        pus_descripcion: formValues.characterDescription || '',
        pus_conocimientos: formValues.knowledge || '',
        pus_arma_principal: formValues.mainWeapon || '',
        pus_arma_secundaria: formValues.secondaryWeapon || '',
        pus_alineacion: formValues.alignment || '',
        pus_sistema_juego: systemGame.sju_id || '',
        pus_cantidad_oro: formValues.goldCoins || 0,
        pus_cantidad_plata: formValues.silverCoins || 0,
        pus_cantidad_bronce: formValues.bronzeCoins || 0
      };

      // Show saving indicator
      setLoading(true);
      
      // Get required data for the service
      const characterStats = getInputStatsFromForm();
      const characterSkills = getSkillsAcquiredFromForm();
      const inventoryItems = getValues("inventory") || [];
      
      // Use CharacterService to save all data
      const savedCharacterId = await CharacterService.saveCompleteCharacter(
        characterData,
        formValues,
        characterStats,
        characterSkills,
        inventoryItems,
        newRecord,
        deleteItems,
        fieldSkill
      );
      
      // Update state and navigate
      setNewRecord(false);
      document.documentElement.scrollTop = 0;
      onOpenChange();
      reloadPage(savedCharacterId);
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
   * Handles the form submission, performing validations and preparing data for saving
   * 
   * @param data The form data submitted
   */
  const onSubmitForm = (data: CharacterForm) => {
    // Check for React Hook Form validation errors first
    if (Object.keys(errors).length > 0) {
      
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
    // Use comprehensive validation with helper functions
    const characterForValidation: DBPersonajesUsuario = {
      pus_id: data.characterId || '',
      pus_usuario: data.userName || '',
      pus_nombre: data.name || '',
      pus_clase: data.class || '',
      pus_raza: data.race || '',
      pus_trabajo: data.job || '',
      pus_nivel: data.level || 1,
      pus_puntos_suerte: data.luckyPoints || 0,
      pus_vida: data.lifePoints || 0,
      pus_arma_principal: data.mainWeapon || '',
      pus_arma_secundaria: data.secondaryWeapon || '',
      pus_descripcion: data.characterDescription || '',
      pus_alineacion: data.alignment || '',
      pus_conocimientos: data.knowledge || '',
      pus_cantidad_oro: data.goldCoins || 0,
      pus_cantidad_plata: data.silverCoins || 0,
      pus_cantidad_bronce: data.bronzeCoins || 0,
      pus_sistema_juego: systemGame.sju_id || ''
    };
    
    const validationResults = validateCharacterAttributes(
      characterForValidation,
      getInputStatsFromForm(),
      getSkillsAcquiredFromForm(),
      getValues("inventory") || []
    );
    
    const feedbackResult = showValidationFeedback(validationResults);
    
    if (!feedbackResult.success) {
      return;
    }
    
    // Prepare character data for the modal using form data
    const newCharacter: DataCharacter = {
      id: data.characterId || uuidv4(),
      player: data.userName || '',
      name: data.name,
      class: data.class || '',
      race: data.race || '',
      job: data.job || '',
      level: data.level,
      luckyPoints: data.luckyPoints,
      description: data.characterDescription || '',
      knowledge: data.knowledge ? data.knowledge.split(',').filter(Boolean) : [],
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
      alignment: data.alignment || '',
      skills: ringSkills.getSkillsFromForm(),
      coinsInv: [
        data.goldCoins || 0,
        data.silverCoins || 0, 
        data.bronzeCoins || 0
      ],
      inv: getValues("inventory") || [],
    };
    setDataCharacter(newCharacter);
    onOpen();
  };
  /**
   * Helper function to get InputStats array from React Hook Form data
   * This ensures that all code that previously used inputsStatsData can work
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
          {!newRecord && systemGame?.sju_nombre ? (
            <h1 className="col-span-2 text-center font-bold">
              {systemGame.sju_nombre}
            </h1>
          ) : (
            <FormSelectInfoPlayerWrapper
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
          {/* LEFT COLUMN - Player info and character details */}
          {/* Player name field - positioned at the top left */}
          <label
            htmlFor="userName"
            className="form-lbl col-start-1 col-end-2 row-start-1 bg-grey-lighter"
          >
            Jugador
          </label>
          <input
            {...register("userName", { required: true })}
            placeholder="Nombre del jugador"
            className="form-input col-start-2 col-end-6 row-start-1 focus:border-black focus:shadow"
            readOnly
          />
          
          {/* Character basic info positioned below player name in left column */}
          <CharacterBasicInfoWrapper 
            externalStyles="col-start-1 col-end-6 row-start-2 row-span-4"
            name={getValues("name") || ""}
            characterClass={getValues("class") || ""}
            race={getValues("race") || ""}
            job={getValues("job") || ""}
            level={getValues("level") || 1}
            alignment={getValues("alignment") || ""}
            classOptions={optionsCharacterClass}
            raceOptions={optionsCharacterRace}
            jobOptions={optionsCharacterJob}
            onNameChange={(value) => {
              setValue("name", value);
              clearValidationError('name');
            }}
            onClassChange={handleCharacterClassChange}
            onRaceChange={handleSelectRaceChange}
            onJobChange={handleCharacterJobSelectChange}
            onLevelChange={(value) => {
              setValue("level", value);
              characterStats.handleLevelChange(value);
            }}
            onAlignmentChange={(value) => {
              setValue("alignment", value);
            }}
          />

          {/* Lucky and Life points in left column */}
          <label
            htmlFor="luckyPoints"
            className="form-lbl-y col-start-1 col-end-2 row-start-6 bg-grey-lighter"
            >
            Puntos de suerte
          </label>
          <input
            {...register("luckyPoints", { required: true, maxLength: 2, min:1, max:10 })}
            placeholder="Puntos de suerte"
            className="form-input-y numeric-input col-start-2 col-end-3 row-start-6 focus:border-black focus:shadow"
          />
          
          <label
            htmlFor="lifePoints"
            className="form-lbl-y col-start-3 col-end-4 row-start-6 bg-grey-lighter"
            >
            Vida
          </label>
          <input
            {...register("lifePoints", { required: true, maxLength: 2, min:1, max:10 })}
            placeholder="Puntos de vida"
            className="form-input-y numeric-input col-start-4 col-end-6 row-start-6 focus:border-black focus:shadow"
          />
          
          {/* Description in left column */}
          <label
            htmlFor="characterDescription"
            className="form-lbl-y col-start-1 col-end-6 row-start-7 bg-grey-lighter"
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
            className={`form-input-y col-start-1 col-end-6 row-start-8 row-span-2 focus:border-black focus:shadow ${
              emptyRequiredFields.includes('description') ? 'required-input' : ''
            }`}
          />

          {/* RIGHT COLUMN - Image and Knowledge */}
          {/* Character image in right column */}
          <label
            htmlFor="characterImage"
            className="form-lbl-y col-start-6 col-end-9 row-start-1 bg-grey-lighter"
          >
            Imagen
          </label>
          <CharacterImageWrapper
            externalStyles={
              "form-field-wide" // Cambiado para usar el nuevo sistema de grid
            }
            locationImage={characterImage}
            onFormImageFileChange={handleCharacterImageFileChange}
          />

          {/* Knowledge checkboxes utilizando el nuevo componente */}
          <KnowledgeWrapper
            id="characterKnowledge"
            label="Conocimientos"
            checkboxes={checkboxesData}
            name="knowledge"
            onSelectedValuesChange={handleSelectedCheckValuesChange}
          />
        </fieldset>
        {/* Estadisticas del personaje - Primary positioning for logical character building flow */}
        <fieldset className="fieldset-form stats-player row-span-2 col-span-1 col-start-1 bg-white shadow-lg rounded" aria-labelledby="stats-heading">
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
          <CharacterStatsWrapper
            inputStats={getValues("stats")[0] || characterStats.defaultStatsData[0]}
            onSelectedValuesChange={characterStats.handleStatsInputChange}
          />

          {/* INTELLIGENCE */}
          <CharacterStatsWrapper
            inputStats={getValues("stats")[1] || characterStats.defaultStatsData[1]}
            onSelectedValuesChange={characterStats.handleStatsInputChange}
          />

          {/* DEXTERITY */}
          <CharacterStatsWrapper
            inputStats={getValues("stats")[2] || characterStats.defaultStatsData[2]}
            onSelectedValuesChange={characterStats.handleStatsInputChange}
          />

          {/* CONSTITUTION */}
          <CharacterStatsWrapper
            inputStats={getValues("stats")[3] || characterStats.defaultStatsData[3]}
            onSelectedValuesChange={characterStats.handleStatsInputChange}
          />

          {/* PERCEPTION */}
          <CharacterStatsWrapper
            inputStats={getValues("stats")[4] || characterStats.defaultStatsData[4]}
            onSelectedValuesChange={characterStats.handleStatsInputChange}
          />

          {/* CHARISMA */}
          <CharacterStatsWrapper
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
          <FormSelectInfoPlayerWrapper
            id="skillClass"
            label="Habilidad innata"
            options={optionsSkillClass}
            name="skillClass"
            required={true}
            onSelectChange={handleSelectSkillChange}
          />

          {/* Debug information */}
          {optionsSkillClass.length === 0 && <div className="text-red-500 text-xs">No options available for skillClass</div>}
          <FormSelectInfoPlayerWrapper
            id="skillExtra"
            label="Habilidad extra"
            options={optionsSkillExtra}
            name="skillExtra"
            required={true}
            onSelectChange={handleSelectExtraSkillChange}
          />

          {/* Debug information */}
          {optionsSkillExtra.length === 0 && <div className="text-red-500 text-xs">No options available for skillExtra</div>}
        </fieldset>
        {/* Habilidades - Positioned for natural progression after armament */}
        <fieldset className="fieldset-form skills-player col-span-1 row-span-1 col-start-1 md:col-start-2 lg:row-start-4 bg-white shadow-lg rounded">
          <legend>Habilidades</legend>
          {watch("level") >= 3 ? (
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
              <FormInputSkillsRingWrapper
                id={"0"}
                level={watch("level")}
                levelEvaluated={3}
                ringTypes={optionsRingTypes}
                skillList={skillsRingList[0]}
                values={getValues("skills")[0] || defaultSkillsData[0]}
              />
              <FormInputSkillsRingWrapper
                id={"1"}
                level={watch("level")}
                levelEvaluated={6}
                ringTypes={optionsRingTypes}
                skillList={skillsRingList[1]}
                values={getValues("skills")[1] || defaultSkillsData[1]}
              />
              <FormInputSkillsRingWrapper
                id={"2"}
                level={watch("level")}
                levelEvaluated={9}
                ringTypes={optionsRingTypes}
                skillList={skillsRingList[2]}
                values={getValues("skills")[2] || defaultSkillsData[2]}
              />
            </>
          ) : (
            <></>
          )}
        </fieldset>
        {/* Componente de inventario refactorizado */}
        <fieldset className="fieldset-form inventory-player row-span-3 col-span-full col-start-1 lg:col-start-3 lg:row-start-4 bg-white shadow-lg rounded w-full" aria-labelledby="inventory-heading">
          <legend id="inventory-heading" className="text-lg font-semibold">Inventario</legend>
          
          <CharacterInventoryWrapper 
            externalStyles="inventory-wrapper"
            inventory={inventoryFields}
            onAddItem={handleAddObject}
            onUpdateItem={(id, field, value) => {
              if (field === 'count') {
                handleEditCount(id, value);
              }
            }}
            onRemoveItem={handleDeleteObject}
            newObjectName={getValues("newObjectName") || ""}
            newObjectDescription={getValues("newObjectDescription") || ""}
            newObjectCount={getValues("newObjectCount") || 1}
            onNewObjectNameChange={(value) => setValue("newObjectName", value)}
            onNewObjectDescriptionChange={(value) => setValue("newObjectDescription", value)}
            onNewObjectCountChange={(value) => {
              setValue("newObjectCount", value);
              handleNewCount(value.toString());
            }}
          />
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
        <CharacterSaveModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          dataCharacter={dataCharacter}
          onSave={saveData}
          getClassName={getClassName}
          getRaceName={getRaceName}
          getJobName={getJobName}
          getKnowledgeName={getKnowledgeName}
          getMainSkillName={getMainSkillName}
          getExtraSkillName={getExtraSkillName}
          getSkillName={getSkillName}
        />
      </form>
    </>
  );
};
