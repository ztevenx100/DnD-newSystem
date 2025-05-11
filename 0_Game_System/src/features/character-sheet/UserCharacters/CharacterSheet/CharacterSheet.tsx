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

  const userName = user.usu_nombre;

  const defaultValues = useMemo(() => {
    return initialCharacter
      ? {
          userName: userName,
          name: initialCharacter.pus_nombre,
          class: initialCharacter.pus_clase,
          level: initialCharacter.pus_nivel,
          luckyPoints: initialCharacter.pus_puntos_suerte,
          lifePoints: initialCharacter.pus_vida,
          mainWeapon: initialCharacter.pus_arma_principal,
          secondaryWeapon: initialCharacter.pus_arma_secundaria,
          goldCoins: initialCharacter.pus_cantidad_oro,
          silverCoins: initialCharacter.pus_cantidad_plata,
          bronzeCoins: initialCharacter.pus_cantidad_bronce,
          characterDescription: initialCharacter.pus_descripcion,
          race: initialCharacter.pus_raza,
          job: initialCharacter.pus_trabajo,
          alignment: initialCharacter.pus_alineacion,
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
  }, [initialCharacter, userName]);  const {
    register,
    handleSubmit,
    setValue
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
    value: string
  ) => {
    setSkillsAcquired((prevItems) =>
      prevItems.map((item) =>
        item.value === id
          ? { ...item, name: value, stat: id }
          : item
      )
    );
  }, []);

  const handleSelectedTypeRingSkillChange = useCallback(async (
    id: string,
    type: string
  ) => {
    setSkillsRingList(prevList => {
      const newList = [...prevList];
      const skills = skillsTypes.find(option => option.id === type)?.skills || [];
      newList[Number(id)] = {
        ...newList[Number(id)],
        skills: skills
      };
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

      (data as DBHabilidad[]).forEach((elem: DBHabilidad) => {
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
    if (!user || !user.id) {
      console.error("User ID is undefined");
      return;
    }
    
    const userId = user.id;    if (params.id === null || params.id === undefined) {
      setCharacter({
        ...initialPersonajesUsuario,
        pus_id: uuidv4(),
        pus_usuario: userId
      });
      return;
    }

    const data = await getCharacter(params.id);

    if (data && data.length > 0) {
      const characterData = { ...data[0], pus_usuario: userId };
      setCharacter(characterData as DBPersonajesUsuario);

      if (characterData.sju_sistema_juego) {
        setSystemGame({
          sju_id: characterData.sju_sistema_juego.sju_id,
          sju_nombre: characterData.sju_sistema_juego.sju_nombre,
          sju_descripcion: ""
        });
      }
    }
  }, [params.id, user]);

  useEffect(() => {
    if (character?.pus_nombre) setValue("name", character.pus_nombre);
    if (character?.pus_descripcion) setValue("characterDescription", character.pus_descripcion);
    if (character?.pus_clase) setValue("class", character.pus_clase);
    if (character?.pus_raza) setValue("race", character.pus_raza);
    if (character?.pus_trabajo) setValue("job", character.pus_trabajo);
  }, [character, setValue]);

  useEffect(() => {
    getSkills();
  }, [getSkills]);
  useEffect(() => {
    changeBackground(mainBackground);

    const loadInfo = async () => {
      document.documentElement.scrollTop = 0;
      setNewRecord(params.id === null || params.id === undefined);
      setLoading(true); // Aseguramos que se muestre el loader
      
      try {
        await Promise.all([
          getListSkill(),
          getGameSystemList(),
          getInfoCharacter()
        ]);

        await getCharacterImage();

        await Promise.all([getStats(), getInventory()]);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };    loadInfo();
  }, [params.id, changeBackground]);

  async function getListSkill() {
    const data = await getListHad();

    if (data !== null) {
      const updatedOptionsSkillClass: Option[] = [];
      const updatedOptionsSkillExtra: Option[] = [];
      const otherSkills: SkillTypes[] = [];

      (data as DBHabilidad[]).forEach((elem) => {
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
        } else if (elem.tipo === "R") {
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
            otherSkills
              .find((option: SkillTypes) => option.id === elem.estadistica_base)
              ?.skills.push({
                id: elem.id,
                value: elem.sigla,
                name: elem.nombre,
              });
          }
        }
      });
      setOptionsSkillClass(updatedOptionsSkillClass);
      setOptionsSkillExtra(updatedOptionsSkillExtra);
      setSkillsTypes(otherSkills);
    }
  }

  async function getGameSystemList() {
    const data: DBSistemaJuego[] = await getGameSystem();
    if (data !== null) {
      const updatedSystemGameList = [];
      for (let i = 0; i < data.length; i++) {
        updatedSystemGameList.push({
          value: data[0].sju_id,
          name: data[0].sju_nombre,
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
    setCharacter((prevState) => ({ ...prevState!, ["pus_raza"]: value }));
  };
  const handleSystemGameChange = (currentSystem: string = "") => {
    if (!currentSystem) return;
    const option = SystemGameList.filter((elem) => elem.value === currentSystem);
    if (option.length === 0) return;
    
    setSystemGame({
      sju_id: option[0].value,
      sju_nombre: option[0].name,
      sju_descripcion: systemGame.sju_descripcion
    });
    
    setCharacter((prevState) => ({
      ...prevState!,
      ["pus_sistema_juego"]: currentSystem,
    }));
  };

  // Actualizar la habilidad principal del personaje
  const handleSelectSkillChange = (currentSkill: string) => {
    const option = optionsSkillClass.filter(
      (skill) => skill.value === currentSkill
    );
    setFieldSkill((prevItems) =>
      prevItems.map((item) =>
        item.field === "skillClass"
          ? { ...item, id: option[0].value, skill: option[0].id || "" }
          : item
      )
    );
    setSelectedSkillValue(currentSkill);
  };

  const handleSelectExtraSkillChange = (currentSkill: string) => {
    const option = optionsSkillExtra.filter(
      (skill) => skill.value === currentSkill
    );
    setFieldSkill((prevItems) =>
      prevItems.map((item) =>
        item.field === "skillExtra"
          ? { ...item, id: option[0].value, skill: option[0].id || "" }
          : item
      )
    );
    setSelectedExtraSkillValue(currentSkill);
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
    
    setCharacter((prevState) => ({ 
      ...prevState!, 
      pus_clase: value,
      pus_conocimientos: selectedOption?.work || ""
    }));

    updStatsPoints(value, character!.pus_trabajo);
    const skillValue = selectedOption?.mainStat ? "S" + selectedOption.mainStat : "";
    setSelectedSkillValue(skillValue);
    handleSelectSkillChange(skillValue);
  };
  const handleCharacterJobSelectChange = (value: string) => {
    clearValidationError('characterJob');
    setCharacter((prevState) => ({ ...prevState!, ["pus_trabajo"]: value }));
    updStatsPoints(character!.pus_clase, value);
  };

  const handleCharacterImageFileChange = async (value: string, file: File) => {
    if (!user || !params.id) return;

    if (!user.id) {
      console.error("User ID is undefined");
      return;
    }

    const { path, error } = await addStorageCharacter(
      user.id,
      params.id,
      file
    );

    if (error) alert(error);

    if (path) setCharacterImage(value);
  };

  const handleSelectedCheckValuesChange = (newValues: string[]) => {
    setCharacter((prevState) => ({
      ...prevState!,
      ["pus_conocimientos"]: newValues.join(","),
    }));
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
    setCharacter((prevState) => ({ ...prevState!, ["pus_alineacion"]: value }));
    setFormAlignment(value);
  };

  const handleCoinsChange = (index: number, value: string) => {
    const numericValue = validateNumeric(value);
    const updatedCoins = [...coins];
    updatedCoins[index] = numericValue;
    setCoins(updatedCoins);
  };

  const handleAddObject = () => {
    if (!newObjectName || newObjectName === "") {
      alert("Por favor digitar este campo");
      document.getElementById("objectName")?.focus();
      return;
    }

    const newObject: InventoryObject = {
      id: uuidv4(),
      name: newObjectName,
      description: newObjectDescription || "Descripción del nuevo objeto",
      count: newObjectCount,
      readOnly: false,
    };

    setInvObjects((prev) => [...prev, newObject]);
    setNewObjectName("");
    setNewObjectDescription("");
    setNewObjectCount(1);
  };

  async function handleDeleteObject(id: string) {
    setInvObjects((prevObjects) => prevObjects.filter((obj) => obj.id !== id));
    const updatedDeleteItems = [...deleteItems];
    updatedDeleteItems.push(id);
    setDeleteItems(updatedDeleteItems);
  }

  const handleEditCount = (id: string, newCount: string) => {
    const numericValue = validateNumeric(newCount, 1);
    setInvObjects((prevObjects) =>
      prevObjects.map((obj) =>
        obj.id === id ? { ...obj, count: numericValue } : obj
      )
    );
  };

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
  
  const handleOpenModal = handleSubmit(() => {
    const fieldsRequired: string[] = [];
    
    if (!character?.pus_raza?.trim()) fieldsRequired.push('race');
    if (!character?.pus_trabajo?.trim()) fieldsRequired.push('job');
    if (!character?.pus_clase?.trim()) fieldsRequired.push('class');
    
    setEmptyRequiredFields(fieldsRequired);
    
    if (fieldsRequired.length > 0) {
      alert("Por favor, complete todos los campos obligatorios: " + fieldsRequired.join(", "));
      return;
    }

    const newCharacter: DataCharacter = {
      id: character!.pus_id,
      player: character!.pus_usuario,
      name: character!.pus_nombre,
      class: character!.pus_clase,
      race: character!.pus_raza,
      job: character!.pus_trabajo,
      level: character!.pus_nivel,
      luckyPoints: character!.pus_puntos_suerte,
      description: character!.pus_descripcion,
      knowledge: character!.pus_conocimientos.split(","),
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
      mainWeapon: character!.pus_arma_principal,
      secondaryWeapon: character!.pus_arma_secundaria,
      alignment: character!.pus_alineacion,
      mainSkill: selectedSkillValue,
      extraSkill: selectedExtraSkillValue,
      skills: skillsAcquired,
      coinsInv: coins,
      inv: invObjects,
    };

    setDataCharacter(newCharacter);
    onOpen();
  });

  const randomRoll = () => {
    if (character!.pus_nivel > 1) return;

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
    if (ids === undefined) return names;
    ids.forEach((know) => {
      names += checkboxesData.find((elem) => elem.value === know)?.name + ", ";
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
    const ID_CHARACTER: string =
      (await Promise.resolve(uploadInfoCharacter(newRecord))) || "";

    Promise.all([
      uploadStats(newRecord, ID_CHARACTER),
      uploadSkill(ID_CHARACTER),
      uploadInventory(ID_CHARACTER),
    ]).finally(() => {
      setNewRecord(false);
    });

    document.documentElement.scrollTop = 0;
    onOpenChange();
    reloadPage(ID_CHARACTER);
  }

  const reloadPage = (characterId: string) => {
    navigate("/CharacterSheet/" + characterId);
  };

  async function uploadInfoCharacter(newRecord: boolean): Promise<string | undefined> {
    if (!character) return;

    if (!newRecord) {
        const data = await updateCharacter(character);
        return data?.pus_id;
    } else {
        const data = await insertPus(character);
        return data?.pus_id;
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
  // Función para enviar el formulario utilizando React Hook Form
  const onSubmitForm = (data: CharacterForm) => {
    const fieldsRequired: string[] = [];
    
    if (!character?.pus_raza?.trim()) fieldsRequired.push('race');
    if (!character?.pus_trabajo?.trim()) fieldsRequired.push('job');
    
    setEmptyRequiredFields(fieldsRequired);
    
    // Si hay campos vacíos, no enviar el formulario
    if (fieldsRequired.length > 0) {
      alert("Por favor, complete todos los campos obligatorios: " + fieldsRequired.join(", "));
      return;
    }
    const newCharacter: DataCharacter = {
      id: character!.pus_id,
      player: character!.pus_usuario,
      name: data.name,
      class: character!.pus_clase,
      race: character!.pus_raza,
      job: character!.pus_trabajo,
      level: data.level,
      luckyPoints: character!.pus_puntos_suerte,
      description: data.characterDescription,
      knowledge: character!.pus_conocimientos ? character!.pus_conocimientos.split(',').filter(Boolean) : [],
      mainWeapon: data.mainWeapon,
      secondaryWeapon: data.secondaryWeapon,
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
      alignment: character!.pus_alineacion,
      skills: skillsAcquired,
      coinsInv: coins,
      inv: invObjects,
    };
    
    setDataCharacter(newCharacter);
    onOpen();
  };

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
          {!newRecord ? (
            <h1 className="col-span-2 text-center font-bold">
              {systemGame.sju_nombre}
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
          </label>          <input
            {...register("name", { 
              required: true, 
              maxLength: 50,
              onChange: () => clearValidationError('name')
            })}
            placeholder="Nombre del personaje"
            className={`form-input col-start-2 mr-2 focus:border-black focus:shadow ${
              emptyRequiredFields.includes('name') ? 'required-input' : ''
            }`}
          /><FormSelectInfoPlayer
            id="characterClass"
            label="Clase"
            options={optionsCharacterClass}
            selectedValue={character?.pus_clase || ""}
            onSelectChange={handleCharacterClassChange}
            className={emptyRequiredFields.includes('characterClass') ? 'required-input' : ''}
          />          <FormSelectInfoPlayer
            id="characterRace"
            label="Raza"
            options={optionsCharacterRace}
            selectedValue={character?.pus_raza || ""}
            onSelectChange={handleSelectRaceChange}
            className={emptyRequiredFields.includes('characterRace') ? 'required-input' : ''}
          ></FormSelectInfoPlayer>          <FormSelectInfoPlayer
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
            {...register("level", { required: true, maxLength: 2, min:1, max:10 })}
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
          </label>          <textarea
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
        <fieldset className="fieldset-form stats-player row-span-3 col-span-1 col-start-1 bg-white shadow-lg rounded">
          <legend>Estadisticas del personaje</legend>
          <header className="stats-player-header col-span-3 col-start-3">
            <Tooltip
              className="bg-dark text-light px-2 py-1"
              placement="top"
              content={"Estadisticas al azar"}
            >
              <button
                type="button"
                className="btn-save-character"
                onClick={randomRoll}
              >
                <SvgD4Roll className="btn-roll" width={30} height={30} />
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

          <FormSelectInfoPlayer
            id="skillExtra"
            label="Habilidad extra"
            options={optionsSkillExtra}
            selectedValue={selectedExtraSkillValue}
            onSelectChange={handleSelectExtraSkillChange}
          ></FormSelectInfoPlayer>
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
        <fieldset className="fieldset-form inventory-player row-span-3 col-span-1 col-start-1 lg:col-start-3 lg:row-start-3 bg-white shadow-lg rounded">
          <legend>Inventario</legend>

          <label
            htmlFor="goldCoins"
            className="form-lbl col-span-3 mb-1 bg-grey-lighter "
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
            onClick={() => handleOpenModal()}
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
          className="dialog "
          classNames={{
            wrapper: "my-0",
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
