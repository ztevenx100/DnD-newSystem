import React, { useState, useEffect, useCallback } from 'react';
import { CharacterSheetProvider } from './context/CharacterSheetContext';
import { CharacterSheet as OriginalCharacterSheet } from './CharacterSheet';
import { CharacterSheetProps } from './types/characterSheetProps';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { useDisclosure } from '@nextui-org/react';
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
import { useRingSkills } from '@features/character-sheet/hooks/useRingSkills';
import { useCharacterStats } from '@features/character-sheet/hooks/useCharacterStats';
import { CharacterService } from '@features/character-sheet/infrastructure/services/CharacterService';
import { addStorageCharacter } from '@database/storage/dbStorage';
import { 
  optionsCharacterClass,
  optionsCharacterJob,
  optionsCharacterRace,
  checkboxesData
} from '../../constants/characterOptions';
import { Option, SkillTypes, SkillFields, StatsTotal, DBSistemaJuego, InventoryObject } from './context/CharacterSheetTypes';
import { DBPersonajesUsuario, InputStats, SkillsAcquired } from '@shared/utils/types';

// Importar los estilos CSS del componente original
import './CharacterSheet.css';

// Importar el background principal
import mainBackground from "@img/webp/bg-home-02.webp";

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
  
  // Estado para manejo de elementos eliminados del inventario
  const [deleteItems, setDeleteItems] = useState<string[]>([]);
  
  // Estados adicionales para saveData
  const [newRecord, setNewRecord] = useState<boolean>(true);
  
  // Estados para modal
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [dataCharacter, setDataCharacter] = useState<any>(null);
  
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
  
  /**
   * Función para limpiar errores de validación
   */
  const clearValidationError = useCallback((fieldId: string) => {
    setEmptyRequiredFields(prev => prev.filter(field => field !== fieldId));
  }, []);

  // Hook para manejo de habilidades de anillo
  const ringSkills = useRingSkills(methods);
  
  // Hook para manejo de estadísticas de personaje
  const { 
    update: updateStats
  } = useFieldArray({
    control,
    name: "stats"
  });

  const characterStats = useCharacterStats({
    getValues,
    setValue,
    updateStats,
    optionsCharacterJob: optionsCharacterJob.map(option => ({
      value: option.value,
      extraPoint: option.extraPoint || ''
    })),
    clearValidationError
  });  // Hook para manejo del inventario
  const { 
    append: appendInventory,
    remove: removeInventory,
    update: updateInventory
  } = useFieldArray({
    control,
    name: "inventory"
  });
  
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
      readOnly: object.readOnly ?? false,
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
    
    // Actualizar puntos de estadísticas basados en la clase y trabajo
    characterStats.updStatsPoints(value, getValues("job") || '');
    
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
    
    // Actualizar puntos de estadísticas basados en la clase y trabajo
    characterStats.updStatsPoints(getValues("class") || '', value);
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
   * 
   * Esta función se encarga de subir la imagen seleccionada al almacenamiento
   * y actualizar la URL de la imagen en el estado del componente
   * 
   * @param value - URL de la imagen seleccionada
   * @param file - Archivo de imagen seleccionado
   * @returns {Promise<void>}
   */
  const handleCharacterImageFileChange = useCallback(async (value: string, file: File) => {
    if (!normalizedUser || !params.id) {
      return;
    }

    if (!normalizedUser.usu_id) {
      console.error("User ID is undefined");
      return;
    }

    try {
      // Subir la imagen al almacenamiento
      const { path, error } = await addStorageCharacter(
        normalizedUser.usu_id,
        params.id,
        file
      );

      if (error) {
        // Mostrar error al usuario
        alert(`Error al subir la imagen: ${error}`);
        return;
      }

      // Actualizar la URL de la imagen en el estado
      if (path) {
        setCharacterImage(value);
        console.log('Imagen del personaje actualizada correctamente:', path);
      }
    } catch (error) {
      console.error('Error al procesar la imagen del personaje:', error);
      alert('Error al procesar la imagen del personaje');
    }
  }, [normalizedUser, params.id]);
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
      
      // Agregar el ID a la lista de elementos eliminados
      setDeleteItems((prevItems) => [...prevItems, id]);
    } catch (error) {
      console.error("Error al eliminar objeto del inventario:", error);
      alert("No se pudo eliminar el objeto. Por favor, inténtalo de nuevo.");
    }
  }, [getValues, removeInventory, setDeleteItems]);
  
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
   * Actualiza la cantidad de un objeto en el inventario
   * Migrado desde CharacterSheet.tsx
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
  
  /**
   * Valida y establece un nuevo valor de cantidad para el formulario de nuevo objeto
   * Migrado desde CharacterSheet.tsx
   */
  const handleNewCount = useCallback((value: string) => {
    const numericValue = validateNumeric(value, 1);
    setValue("newObjectCount", numericValue);
  }, [setValue]);
  
  /**
   * Helper function para obtener InputStats desde React Hook Form data
   * Migrado desde CharacterSheet.tsx
   */
  const getInputStatsFromForm = useCallback((): InputStats[] => {
    const inputStatsFormStats = getValues("stats") || [];
    if (inputStatsFormStats.length < 6) {
      // Fallback a datos por defecto si no hay estadísticas en el formulario
      return [
        { id: "STR", label: "Fuerza", description: "La fuerza física del personaje", valueDice: 1, valueClass: 0, valueLevel: 0 },
        { id: "INT", label: "Inteligencia", description: "La capacidad mental del personaje", valueDice: 1, valueClass: 0, valueLevel: 0 },
        { id: "DEX", label: "Destreza", description: "La agilidad y coordinación del personaje", valueDice: 1, valueClass: 0, valueLevel: 0 },
        { id: "CON", label: "Constitución", description: "La resistencia y salud del personaje", valueDice: 1, valueClass: 0, valueLevel: 0 },
        { id: "PER", label: "Percepción", description: "Los sentidos y percepción del personaje", valueDice: 1, valueClass: 0, valueLevel: 0 },
        { id: "CHA", label: "Carisma", description: "El carisma y personalidad del personaje", valueDice: 1, valueClass: 0, valueLevel: 0 }
      ];
    }
    
    return inputStatsFormStats.map(stat => ({
      id: stat.id,
      label: stat.label,
      description: stat.description,
      valueDice: stat.valueDice,
      valueClass: stat.valueClass,
      valueLevel: stat.valueLevel
    }));
  }, [getValues]);
  
  /**
   * Obtiene las habilidades desde React Hook Form
   * Migrado desde CharacterSheet.tsx
   */
  const getSkillsAcquiredFromForm = useCallback((): SkillsAcquired[] => {
    return ringSkills.getSkillsFromForm();
  }, [ringSkills]);
  
  /**
   * Función para recargar la página hacia un personaje específico
   * Migrado desde CharacterSheet.tsx
   */
  const reloadPage = useCallback((characterId: string) => {
    navigate("/CharacterSheet/" + characterId);
  }, [navigate]);
  
  /**
   * Función principal para guardar los datos del personaje
   * Migrado desde CharacterSheet.tsx - Implementación completa
   */
  const saveData = useCallback(async () => {
    try {
      const formValues = getValues();
      
      // Construir el objeto del personaje desde los datos del formulario
      const characterData: DBPersonajesUsuario = {
        pus_id: formValues.characterId || uuidv4(),
        pus_usuario: formValues.userName || normalizedUser?.usu_id || '',
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

      // Mostrar indicador de guardado
      setLoading(true);
      
      // Obtener datos requeridos para el servicio
      const characterStats = getInputStatsFromForm();
      const characterSkills = getSkillsAcquiredFromForm();
      const inventoryItems = getValues("inventory") || [];
      
      // Usar CharacterService para guardar todos los datos
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
      
      // Actualizar estado y navegar
      setNewRecord(false);
      document.documentElement.scrollTop = 0;
      reloadPage(savedCharacterId);
    } catch (error) {
      console.error("Error durante el guardado del personaje:", error);
      alert("Error al guardar el personaje. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [getValues, normalizedUser, systemGame, newRecord, deleteItems, fieldSkill, getInputStatsFromForm, getSkillsAcquiredFromForm, setLoading, setNewRecord, reloadPage]);
  
  // ======= FUNCIONES PARA CARGAR DATOS IMPLEMENTADAS =======
  
  /**
   * Obtiene la lista de sistemas de juego disponibles
   * Migrado desde CharacterSheet.tsx
   */
  const getGameSystemList = useCallback(async () => {
    try {
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
    } catch (error) {
      console.error("Error loading game systems:", error);
    }
  }, []);

  /**
   * Obtiene la lista de habilidades disponibles
   * Migrado desde CharacterSheet.tsx
   */
  const getListSkill = useCallback(async () => {
    try {
      const data = await getListHad();

      if (data !== null && Array.isArray(data) && data.length > 0) {
        const updatedOptionsSkillClass: Option[] = [];
        const updatedOptionsSkillExtra: Option[] = [];
        const otherSkills: SkillTypes[] = [];
        
        (data as any[]).forEach((rawElem) => {
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
  }, []);

  /**
   * Obtiene la imagen del personaje desde el almacenamiento
   * Migrado desde CharacterSheet.tsx
   */
  const getCharacterImage = useCallback(async () => {
    if (!normalizedUser?.usu_id || !params.id) {
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
  }, [normalizedUser?.usu_id, params.id]);

  /**
   * Carga las estadísticas del personaje desde la base de datos
   * Migrado desde CharacterSheet.tsx
   */
  const getStats = useCallback(async () => {
    if (!params.id) return;

    try {
      const data = await getCharacterStats(params.id);
      
      if (data && Array.isArray(data)) {
        const currentStats = getValues("stats") || [];
        const statsMap = new Map(currentStats.map((stat: InputStats) => [stat.id, stat]));
        data.forEach((stat: any) => {
          const statId = stat.est_sigla || stat.sigla;
          if (statId && statsMap.has(statId)) {
            const currentStat = statsMap.get(statId);
            if (currentStat) {
              currentStat.valueDice = stat.pes_valor_dado || stat.valor_dado || currentStat.valueDice;
              currentStat.valueClass = stat.pes_valor_clase || stat.valor_clase || currentStat.valueClass;
              currentStat.valueLevel = stat.pes_valor_nivel || stat.valor_nivel || currentStat.valueLevel;
            }
          }
        });
        
        // Ensure all stats have required properties before setting
        const updatedStats = Array.from(statsMap.values()).map(stat => ({
          id: stat.id,
          label: stat.label,
          description: stat.description || "", // Ensure description is always a string
          valueDice: stat.valueDice,
          valueClass: stat.valueClass,
          valueLevel: stat.valueLevel
        }));
        
        setValue("stats", updatedStats);
      }
    } catch (error) {
      console.error("Error loading character stats:", error);
    }
  }, [params.id, getValues, setValue]);
  
  /**
   * Carga las habilidades del personaje desde la base de datos
   * Migrado desde CharacterSheet.tsx
   */
  const getSkills = useCallback(async () => {
    if (!params.id) return;

    try {
      const data = await getCharacterSkills(params.id);
      
      if (data && Array.isArray(data)) {
        data.forEach((skill: any) => {
          const field = skill.hpe_campo || skill.campo;
          const skillValue = skill.hab_sigla || skill.sigla || skill.hpe_habilidad;
          
          if (field && skillValue) {
            if (field === "skillClass") {
              setValue("skillClass", skillValue);
              handleSelectSkillChange(skillValue);
            } else if (field === "skillExtra") {
              setValue("skillExtra", skillValue);
              handleSelectExtraSkillChange(skillValue);
            } else if (field.startsWith("skill")) {
              // Habilidades de anillo - usar RingSkills hook
              const ringId = field.replace("skill", "");
              if (ringId && /^\d+$/.test(ringId)) {
                const ringIndex = parseInt(ringId, 10);
                const skillName = skill.hab_nombre || skill.nombre || skillValue;
                const ringType = skill.hpe_anillo || skill.anillo || "";
                const statType = skill.hab_estadistica || skill.estadistica || "";
                
                ringSkills.setRingSkillName(ringIndex, skillName, ringType, statType);
              }
            }
          }
        });
      }
    } catch (error) {
      console.error("Error loading character skills:", error);
    }
  }, [params.id, setValue, handleSelectSkillChange, handleSelectExtraSkillChange, ringSkills]);
  
  /**
   * Carga el inventario del personaje desde la base de datos
   * Migrado desde CharacterSheet.tsx
   */
  const getInventory = useCallback(async () => {
    if (!params.id) return;

    try {
      const data = await getCharacterInventory(params.id);
      
      if (data && Array.isArray(data)) {
        const inventoryItems = data.map((item: any) => ({
          id: item.inp_id || item.id || uuidv4(),
          name: item.inp_nombre || item.nombre || "Item sin nombre",
          description: item.inp_descripcion || item.descripcion || "Sin descripción",
          count: item.inp_cantidad || item.cantidad || 1,
          readOnly: true // Los elementos cargados de la BD son de solo lectura inicialmente
        }));
        
        setValue("inventory", inventoryItems);
      }
    } catch (error) {
      console.error("Error loading character inventory:", error);
    }
  }, [params.id, setValue]);
  
  /**
   * Función para obtener el total de una estadística específica
   * Migrado desde CharacterSheet.tsx
   */
  const getStatTotal = useCallback((statId: string): number => {
    const statsMap: Record<string, number | undefined> = {
      'STR': totalStats.str,
      'INT': totalStats.int,
      'DEX': totalStats.dex,
      'CON': totalStats.con,
      'PER': totalStats.per,
      'CHA': totalStats.cha,
      'total': totalStats.total
    };

    const mappedValue = statsMap[statId];
    if (mappedValue !== undefined) {
      return mappedValue;
    }

    // Fallback: calcular desde los datos del formulario
    const formStats = getValues("stats") || [];
    const stat = formStats.find((s: InputStats) => s.id === statId);
    if (!stat) return 0;
    
    return stat.valueDice + stat.valueClass + stat.valueLevel;
  }, [totalStats, getValues]);
  
  // ======= FUNCIONES FALTANTES MIGRADAS DESDE CharacterSheet.tsx =======
  
  /**
   * Valida que todos los campos requeridos estén completos
   * Migrado desde CharacterSheet.tsx
   */
  const validateRequiredFields = useCallback((): string[] => {
    const fieldsRequired: string[] = [];
    const formValues = getValues();
    
    // Validate character selection fields
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
  }, [getValues, getStatTotal]);

  /**
   * Prepara los datos del personaje para el modal
   * Migrado desde CharacterSheet.tsx
   */
  const prepareCharacterData = useCallback((): any => {
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
      ],
      mainWeapon: formValues.mainWeapon || '',
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
  }, [getValues, getInputStatsFromForm, getSkillsAcquiredFromForm]);

  /**
   * Abre el modal para guardar el personaje, validando primero
   * que todos los campos requeridos estén completos
   * Migrado desde CharacterSheet.tsx
   */
  const handleOpenModal = useCallback(() => {
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
  }, [validateRequiredFields, setEmptyRequiredFields, prepareCharacterData, setDataCharacter, onOpen]);

  // ======= FUNCIONES PARA OBTENER NOMBRES =======

  /**
   * Obtiene el nombre de una clase por su ID
   * Migrado desde CharacterSheet.tsx
   */
  const getClassName = useCallback((id: string | undefined): string | undefined => {
    return optionsCharacterClass.find((elem) => elem.value === id)?.name;
  }, [optionsCharacterClass]);

  /**
   * Obtiene el nombre de una raza por su ID
   * Migrado desde CharacterSheet.tsx
   */
  const getRaceName = useCallback((id: string | undefined): string | undefined => {
    return optionsCharacterRace.find((elem) => elem.value === id)?.name;
  }, [optionsCharacterRace]);

  /**
   * Obtiene el nombre de un trabajo por su ID
   * Migrado desde CharacterSheet.tsx
   */
  const getJobName = useCallback((id: string | undefined): string | undefined => {
    return optionsCharacterJob.find((elem) => elem.value === id)?.name;
  }, [optionsCharacterJob]);

  /**
   * Obtiene los nombres de conocimientos por sus IDs
   * Migrado desde CharacterSheet.tsx
   */
  const getKnowledgeName = useCallback((ids: string[] | undefined): string | undefined => {
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
  }, [checkboxesData]);

  /**
   * Obtiene el nombre de una habilidad principal por su ID
   * Migrado desde CharacterSheet.tsx
   */
  const getMainSkillName = useCallback((id: string | undefined): string | undefined => {
    return optionsSkillClass.find((elem) => elem.value === id)?.name;
  }, [optionsSkillClass]);

  /**
   * Obtiene el nombre de una habilidad extra por su ID
   * Migrado desde CharacterSheet.tsx
   */
  const getExtraSkillName = useCallback((id: string | undefined): string | undefined => {
    return optionsSkillExtra.find((elem) => elem.value === id)?.name;
  }, [optionsSkillExtra]);

  /**
   * Obtiene el nombre de una habilidad de anillo por su ID y estadística
   * Migrado desde CharacterSheet.tsx
   */
  const getSkillName = useCallback((id: string, stat: string): string | undefined => {
    return skillsTypes
      .find((skill) => skill.id === stat)
      ?.skills.find((ele) => ele.value === id)?.name;
  }, [skillsTypes]);

  // ======= FUNCIONES DE MANEJO DE ERRORES =======

  /**
   * Generic async function error handler with proper logging and user-friendly messaging
   * Migrado desde CharacterSheet.tsx
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
   * Migrado desde CharacterSheet.tsx
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
  
  // ======= EFECTOS PARA CARGAR DATOS =======
  
  // Cargar imagen del personaje al montar el componente
  useEffect(() => {
    if (params.id && normalizedUser?.usu_id) {
      getCharacterImage();
    }
  }, [params.id, normalizedUser?.usu_id, getCharacterImage]);  // Cargar datos iniciales
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
  }, [params.id, getGameSystemList, getListSkill, getStats, getSkills, getInventory]); // Incluir todas las funciones como dependencias
  
  // Configurar el background de la aplicación
  useEffect(() => {
    if (props.changeBackground) {
      props.changeBackground(mainBackground);
    }
  }, [props.changeBackground]);
  
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
    
    // Estados del modal
    isOpen,
    onOpen,
    onOpenChange,
    dataCharacter,
    
    // Estados de habilidades
    skillsRingList,
    fieldSkill,
    optionsSkillClass,
    optionsSkillExtra,
    skillsTypes,
    
    // Validación
    emptyRequiredFields,
    clearValidationError,
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
    handleEditCount,
    handleNewCount,
    saveData,
    
    // Validación de inventario
    validateInventoryObject,
    validateInventoryItem,
    
    // Estado de elementos eliminados
    deleteItems,
    setDeleteItems,
    // Funciones para obtener datos IMPLEMENTADAS
    getInventory,
    getStats,
    getSkills,
    getCharacterImage,
    getGameSystemList,
    getListSkill,
    
    // Funciones migradas para modal y nombres
    handleOpenModal,
    getClassName,
    getRaceName,
    getJobName,
    getKnowledgeName,
    getMainSkillName,
    getExtraSkillName,
    getSkillName,
    handleAsyncError,
    withErrorHandling,
    validateRequiredFields,
    prepareCharacterData,
    
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
