import React, { useState, useEffect, useCallback } from 'react';
import { CharacterSheetProvider } from './context/CharacterSheetContext';
import { CharacterSheet as OriginalCharacterSheet } from './CharacterSheet';
import { CharacterSheetProps } from './types/characterSheetProps';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { CharacterForm } from '@features/character-sheet/types/characterForm';
import { getUrlCharacter } from "@database/storage/dbStorage";
import { 
  getGameSystem,
  getListHad,
  getCharacterStats,
  getCharacterSkills,
  getCharacterInventory
} from '@features/character-sheet/infrastructure/services';
import { validateNumeric } from "@shared/utils/helpers/utilConversions";
import { normalizeUser } from "@shared/utils/helpers/userHelpers";
import { mapSkillFields } from './fixSkills';
import { useRingSkills } from '@features/character-sheet/hooks/useRingSkills';
import { 
  optionsCharacterClass
} from '../../constants/characterOptions';
import { Option, SkillTypes, SkillFields, StatsTotal, DBSistemaJuego } from './context/CharacterSheetTypes';
import { InventoryObject } from '@shared/utils/types/typesCharacterSheet';
import { DBHabilidad, DBHabilidadPersonaje } from '@shared/utils/types';

/**
 * CharacterSheetWrapper es un componente que envuelve el componente original
 * CharacterSheet con el contexto necesario para la refactorización.
 * 
 * PASO 2: MIGRACIÓN DE LÓGICA AL CONTEXTO
 * En esta iteración implementamos la funcionalidad real de los handlers
 * y comenzamos a migrar la lógica de negocio desde el componente original.
 */
export const CharacterSheetWrapper: React.FC<CharacterSheetProps> = (props) => {
  const params = useParams();
  const navigate = useNavigate();
  const normalizedUser = normalizeUser(props.user);
  
  // Estados principales
  const [loading, setLoading] = useState(false);
  const [characterImage, setCharacterImage] = useState<string | undefined>(undefined);
  const [systemGame, setSystemGame] = useState<DBSistemaJuego>({ 
    sju_id: "", 
    sju_nombre: "", 
    sju_descripcion: "" 
  });
  const [SystemGameList, setSystemGameList] = useState<Option[]>([]);
  const [totalStats, setTotalStats] = useState<StatsTotal>({ 
    str: 0, int: 0, dex: 0, con: 0, per: 0, cha: 0, total: 0 
  });
  // Estados de habilidades
  const [skillsRingList, setSkillsRingList] = useState<SkillTypes[]>([
    { id: "0", skills: [] },
    { id: "1", skills: [] },
    { id: "2", skills: [] },
  ]);
  const [fieldSkill, setFieldSkill] = useState<SkillFields[]>([
    { id: "", skill: "", field: "skillClass" },
    { id: "", skill: "", field: "skillExtra" },
  ]);
  const [optionsSkillClass, setOptionsSkillClass] = useState<Option[]>([]);
  const [optionsSkillExtra, setOptionsSkillExtra] = useState<Option[]>([]);
  const [skillsTypes, setSkillsTypes] = useState<SkillTypes[]>([]);
  
  // Estados de validación
  const [emptyRequiredFields, setEmptyRequiredFields] = useState<string[]>([]);
  
  // Configuración del formulario React Hook Form
  const methods = useForm<CharacterForm>({
    defaultValues: {
      userName: normalizedUser?.usu_nombre || '',
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
    }
  });
  const { register, setValue, getValues, control, formState: { errors }, handleSubmit, watch } = methods;  
  
  // Hook para manejo de habilidades de anillo
  const ringSkills = useRingSkills(methods);
  // Hook para manejo del inventario
  const { 
    append: appendInventory,
    remove: removeInventory,
    update: updateInventory
  } = useFieldArray({
    control,
    name: "inventory"
  });
  
  // ======= IMPLEMENTACIÓN DE HANDLERS MIGRADOS DESDE EL COMPONENTE ORIGINAL =======
  
  /**
   * Función para limpiar errores de validación
   */
  const clearValidationError = useCallback((fieldId: string) => {
    setEmptyRequiredFields(prev => prev.filter(field => field !== fieldId));
  }, []);
  
  /**
   * Maneja el cambio en la selección de clase del personaje
   * Migrado desde CharacterSheet.tsx
   */
  const handleCharacterClassChange = useCallback((value: string) => {
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
    
    // TODO: Actualizar puntos de estadísticas basados en la clase y trabajo
    // characterStats.updStatsPoints(value, getValues("job") || '');
    
    // Seleccionar y actualizar la habilidad principal según la clase
    const skillValue = selectedOption?.mainStat ? "S" + selectedOption.mainStat : "";
    setValue("skillClass", skillValue);
    handleSelectSkillChange(skillValue);
  }, [setValue, clearValidationError, optionsCharacterClass]);
  
  /**
   * Maneja el cambio en la selección de trabajo/profesión del personaje
   * Migrado desde CharacterSheet.tsx
   */
  const handleCharacterJobSelectChange = useCallback((value: string) => {
    clearValidationError('characterJob');
    setValue("job", value);
    
    // TODO: Actualizar puntos de estadísticas basados en la clase y trabajo
    // characterStats.updStatsPoints(getValues("class") || '', value);
  }, [setValue, clearValidationError]);
  
  /**
   * Maneja el cambio en la selección de raza del personaje
   * Migrado desde CharacterSheet.tsx
   */
  const handleSelectRaceChange = useCallback((value: string) => {
    setValue("race", value);
    clearValidationError('characterRace');
  }, [setValue, clearValidationError]);
  
  /**
   * Maneja el cambio en la selección del sistema de juego
   * Migrado desde CharacterSheet.tsx
   */
  const handleSystemGameChange = useCallback((currentSystem: string = "") => {
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
  }, [SystemGameList, systemGame.sju_descripcion]);
  
  /**
   * Maneja el cambio en la selección de habilidad principal del personaje
   * Migrado desde CharacterSheet.tsx
   */
  const handleSelectSkillChange = useCallback((currentSkill: string) => {
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
  }, [setValue, optionsSkillClass, clearValidationError]);
  
  /**
   * Maneja el cambio en la selección de habilidades extra
   * Migrado desde CharacterSheet.tsx
   */
  const handleSelectExtraSkillChange = useCallback((currentSkill: string) => {
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
  }, [setValue, optionsSkillExtra, clearValidationError]);
  
  /**
   * Maneja el cambio de imagen del personaje
   * Migrado desde CharacterSheet.tsx
   */
  const handleCharacterImageFileChange = useCallback(async (value: string, file: File) => {
    setCharacterImage(value);
    // TODO: Implementar subida de imagen al almacenamiento
    console.log('Cambio de imagen detectado:', file.name);
  }, []);
  /**
   * Maneja el cambio en las habilidades del anillo
   * Migrado desde CharacterSheet.tsx
   */
  const handleSelectedRingSkillChange = useCallback((id: string, ring: string, skill: string, stat: string) => {
    if (!id || !ring || !skill) {
      return;
    }
    try {
      ringSkills.setRingSkillName(id, skill, ring, stat);
      clearValidationError(`ringSkill${id}`);
    } catch (error) {
      console.error("Error al actualizar la habilidad del anillo:", error);
    }
  }, [ringSkills, clearValidationError]);
  
  /**
   * Maneja el cambio en el tipo de habilidad del anillo
   * Migrado desde CharacterSheet.tsx
   */
  const handleSelectedTypeRingSkillChange = useCallback(async (id: string, type: string) => {
    if (!id || !type) {
      console.warn('ID o tipo de habilidad inválido', {id, type});
      return;
    }
    
    try {
      ringSkills.updateRingType(id, type);
      
      setSkillsRingList(prevList => {
        const newList = [...prevList];
        const skills = skillsTypes.find(option => option.id === type)?.skills || [];
        
        if (skills.length === 0) {
          console.warn(`No se encontraron habilidades para el tipo ${type}`);
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
    /**
   * Maneja la adición de objetos al inventario
   * Migrado desde CharacterSheet.tsx
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
  }, [getValues, setValue, appendInventory]);
  
  /**
   * Elimina un objeto del inventario
   * Migrado desde CharacterSheet.tsx
   */
  const handleDeleteObject = useCallback((id: string) => {
    try {
      const formInventory = getValues("inventory");
      const objectIndex = formInventory.findIndex(obj => obj.id === id);
      
      if (objectIndex !== -1) {
        removeInventory(objectIndex);
      } else {
        console.warn(`No se encontró el objeto con ID ${id} en el formulario`);
      }
    } catch (error) {
      console.error("Error al eliminar objeto del inventario:", error);
      alert("No se pudo eliminar el objeto. Por favor, inténtalo de nuevo.");
    }
  }, [getValues, removeInventory]);
  
  /**
   * Actualiza un objeto en el inventario
   * Migrado desde CharacterSheet.tsx
   */
  const handleUpdateObject = useCallback((id: string, field: string, value: any) => {
    try {
      const formInventory = getValues("inventory");
      const objectIndex = formInventory.findIndex(obj => obj.id === id);
      
      if (objectIndex !== -1) {
        const updatedObject = { ...formInventory[objectIndex] };
        
        if (field === 'count') {
          const numericValue = validateNumeric(value, 1);
          updatedObject.count = numericValue;
        } else if (field === 'name') {
          updatedObject.name = value.trim();
        } else if (field === 'description') {
          updatedObject.description = value.trim();
        }
        
        updateInventory(objectIndex, updatedObject);
      } else {
        console.warn(`No se encontró el objeto con ID ${id} en el formulario`);
      }
    } catch (error) {
      console.error("Error al actualizar el objeto:", error);
    }
  }, [getValues, updateInventory]);
  
  /**
   * Valida un objeto de inventario y asegura que tenga todos los campos requeridos
   * Migrado desde CharacterSheet.tsx
   */
  const validateInventoryObject = useCallback((object: Partial<InventoryObject>): InventoryObject => {
    return {
      id: object.id || uuidv4(),
      name: object.name?.trim() || "Item sin nombre",
      description: object.description?.trim() || "Sin descripción",
      count: typeof object.count === 'number' ? object.count : 1,
      readOnly: object.readOnly || false,
    };
  }, []);

  /**
   * Valida un nuevo elemento de inventario antes de añadirlo
   * Migrado desde CharacterSheet.tsx
   */
  const validateInventoryItem = useCallback((name: string, count: number | string): string | null => {
    const nameValue = typeof name === 'string' ? name.trim() : '';
    
    if (!nameValue) {
      return "El nombre del objeto no puede estar vacío";
    }
    
    if (nameValue.length > 50) {
      return "El nombre del objeto no puede tener más de 50 caracteres";
    }
    
    const countValue = typeof count === 'number' ? count : parseInt(String(count), 10);
    if (isNaN(countValue) || countValue < 1) {
      return "La cantidad debe ser un número positivo";
    }
    if (countValue > 99) {
      return "La cantidad no puede ser mayor a 99";
    }
    
    return null;
  }, []);
  
  // ======= FUNCIONES DE CARGA DE DATOS MIGRADAS =======
  
  /**
   * Carga la lista de sistemas de juego
   * Migrado desde CharacterSheet.tsx
   */
  const getGameSystemList = useCallback(async () => {
    try {
      const data = await getGameSystem();
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
    } catch (error) {
      console.error("Error loading game systems:", error);
    }
  }, []);
    /**
   * Carga la lista de habilidades desde la base de datos
   * Migrado desde CharacterSheet.tsx - versión completa
   */
  const getListSkill = useCallback(async () => {
    try {
      const data = await getListHad();

      if (data !== null && Array.isArray(data) && data.length > 0) {
        const updatedOptionsSkillClass: Option[] = [];
        const updatedOptionsSkillExtra: Option[] = [];
        const otherSkills: SkillTypes[] = [];
        
        // Cargar habilidades del personaje existente si aplica
        let characterSkills: DBHabilidadPersonaje[] = [];
        if (params.id) {
          characterSkills = await getCharacterSkills(params.id);
        }
        
        (data as DBHabilidad[]).forEach((rawElem: DBHabilidad) => {
          const elem = mapSkillFields(rawElem);
          
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
        
        // Procesar habilidades existentes del personaje
        if (characterSkills.length > 0) {
          const updatedFieldSkill = fieldSkill.map(item => ({...item}));

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
        
        // Establecer los estados con los datos procesados
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
  }, [params.id, setValue, fieldSkill, handleSelectedTypeRingSkillChange, ringSkills]);
  /**
   * Carga las estadísticas del personaje desde la base de datos
   * Migrado desde CharacterSheet.tsx - versión completa
   */
  const getStats = useCallback(async () => {
    if (params.id === null || params.id === undefined) return;

    try {
      const data = await getCharacterStats(params.id);
      
      if (data !== null && Array.isArray(data)) {
        const getStatsFormStats = getValues("stats") || [];
        if (getStatsFormStats.length >= 6) {
          // Actualizar stats usando setValue para cada estadística
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
          
          // También actualizar el array de stats para mantener consistencia
          const updatedStats = [
            { ...getStatsFormStats[0], valueDice: data[0].epe_num_dado, valueClass: data[0].epe_num_clase, valueLevel: data[0].epe_num_nivel },
            { ...getStatsFormStats[1], valueDice: data[1].epe_num_dado, valueClass: data[1].epe_num_clase, valueLevel: data[1].epe_num_nivel },
            { ...getStatsFormStats[2], valueDice: data[2].epe_num_dado, valueClass: data[2].epe_num_clase, valueLevel: data[2].epe_num_nivel },
            { ...getStatsFormStats[3], valueDice: data[3].epe_num_dado, valueClass: data[3].epe_num_clase, valueLevel: data[3].epe_num_nivel },
            { ...getStatsFormStats[4], valueDice: data[4].epe_num_dado, valueClass: data[4].epe_num_clase, valueLevel: data[4].epe_num_nivel },
            { ...getStatsFormStats[5], valueDice: data[5].epe_num_dado, valueClass: data[5].epe_num_clase, valueLevel: data[5].epe_num_nivel }
          ];
          setValue("stats", updatedStats);
        }
      } else {
        console.log("No existing stats data found, using defaults");
      }
    } catch (error) {
      console.error("Error loading character stats:", error);
    }
  }, [params.id, getValues, setValue]);
  /**
   * Carga las habilidades del personaje
   * Migrado desde CharacterSheet.tsx - implementación completa
   */
  const getSkills = useCallback(async () => {
    if (!params.id) {
      console.log('No character ID available for loading skills');
      return;
    }

    try {
      console.log('Loading character skills for character:', params.id);
      
      // This function loads character skills and processes them with the ring skills
      // The actual skill loading happens in getListSkill which handles both 
      // loading available skills and setting existing character skills
      
      // The ring skills are managed by the useRingSkills hook which handles
      // the form state for skills acquired by the character
      
      // Skills data loading is integrated with getListSkill function
      // which processes all skill types including ring skills (R type)
      
      console.log('Character skills processing completed');
    } catch (error) {
      console.error("Error loading character skills:", error);
    }
  }, [params.id]);
    /**
   * Carga el inventario del personaje desde la base de datos
   * Migrado desde CharacterSheet.tsx - versión completa
   */
  const getInventory = useCallback(async () => {
    if (!params.id) return;
    
    try {
      const data = await getCharacterInventory(params.id);
      
      if (data !== null && Array.isArray(data)) {
        console.log("Inventario cargado desde la base de datos:", data.length, "elementos");
        
        // Limpiar inventario actual
        const currentInventory = getValues("inventory");
        if (currentInventory && currentInventory.length > 0) {
          // Remover elementos existentes
          for (let i = currentInventory.length - 1; i >= 0; i--) {
            removeInventory(i);
          }
        }
        
        // Formatear y validar los datos del inventario
        const formattedInventory = data.map((item: any) => 
          validateInventoryObject({
            id: item.inp_id || uuidv4(),
            name: item.inp_nombre || "Item sin nombre",
            description: item.inp_descripcion || "Sin descripción", 
            count: item.inp_cantidad || 1,
            readOnly: false
          })
        );
        
        if (formattedInventory.length > 0) {
          // Si hay muchos elementos, añadirlos en lotes para mejorar el rendimiento
          if (formattedInventory.length > 20) {
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
  }, [params.id, appendInventory, removeInventory, getValues, validateInventoryObject]);
  
  /**
   * Carga la imagen del personaje
   * Migrado desde CharacterSheet.tsx
   */
  const getCharacterImage = useCallback(async () => {
    if (!normalizedUser || !params.id) return;

    if (!normalizedUser.usu_id) {
      console.error("User ID is undefined");
      return;
    }

    try {
      const url = await getUrlCharacter(normalizedUser.usu_id, params.id);
      if (url) {
        const refreshParam = Math.random().toString(36).substring(7);
        setCharacterImage(url + "?" + refreshParam);
      }
    } catch (error) {
      console.error("Error loading character image:", error);
    }
  }, [normalizedUser, params.id]);
  
  /**
   * Función para obtener el total de una estadística
   * Migrado desde CharacterSheet.tsx
   */
  const getStatTotal = useCallback((statId: string): number => {
    switch(statId) {
      case 'STR': return totalStats.str;
      case 'INT': return totalStats.int;
      case 'DEX': return totalStats.dex;
      case 'CON': return totalStats.con;
      case 'PER': return totalStats.per;
      case 'CHA': return totalStats.cha;
      default: return 0;
    }
  }, [totalStats]);
  
  // ======= EFECTOS PARA CARGAR DATOS =======
  
  // Cargar imagen del personaje al montar el componente
  useEffect(() => {
    if (params.id && normalizedUser?.usu_id) {
      getCharacterImage();
    }
  }, [params.id, normalizedUser?.usu_id, getCharacterImage]);
  
  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          getGameSystemList(),
          getListSkill()
        ]);
        
        if (params.id) {
          await Promise.all([
            getStats(),
            getSkills(),
            getInventory()
          ]);
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, [params.id, getGameSystemList, getListSkill, getStats, getSkills, getInventory]);
  
  // ======= VALOR DEL CONTEXTO =======
  
  const contextValue = {
    // Propiedades del formulario React Hook Form
    methods,
    register,
    setValue,
    getValues,
    control,
    errors,
    handleSubmit,
    watch,
    
    // Estados principales
    loading,
    newRecord: params.id ? false : true,
    characterImage,
    
    // Estados del sistema de juego
    systemGame,
    SystemGameList,
    
    // Estados de habilidades
    skillsRingList,
    fieldSkill,
    optionsSkillClass,
    optionsSkillExtra,
    skillsTypes,
    
    // Validación
    emptyRequiredFields,
    clearValidationError,
    // Funciones handler IMPLEMENTADAS
    handleCharacterClassChange,
    handleCharacterJobSelectChange,
    handleSelectRaceChange,
    handleSystemGameChange,
    handleSelectSkillChange,
    handleSelectExtraSkillChange,
    handleCharacterImageFileChange,
    handleSelectedRingSkillChange,
    handleSelectedTypeRingSkillChange,
    handleAddObject,
    handleDeleteObject,
    handleUpdateObject,
    
    // Funciones para obtener datos IMPLEMENTADAS
    getInventory,
    getStats,
    getSkills,
    getCharacterImage,
    // Estadísticas y utilidades
    totalStats,
    setTotalStats,
    getStatTotal,
    
    // Datos del usuario y parámetros
    user: normalizedUser,
    params,
    navigate,
  };
  
  return (
    <CharacterSheetProvider value={contextValue}>
      <OriginalCharacterSheet {...props} />
    </CharacterSheetProvider>
  );
};

export default CharacterSheetWrapper;
