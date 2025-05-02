import { useEffect, useMemo, ChangeEvent, useState, useCallback } from "react";
import { useParams, useNavigate, useLoaderData } from "react-router-dom";
import { useForm } from "react-hook-form";
import "@unocss/reset/tailwind.css";
import "uno.css";
import "./CharacterSheet.css";

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

// Core types
import { DBUsuario } from "@core/types";
import { DBPersonajesUsuario } from "@core/types/characters/characterDbTypes";
import { CharacterClassOption, CharacterRaceOption, CharacterJobOption, RingTypeOption } from './types';
import { DataCharacter, InventoryObject, SystemGame } from './models';
import { InputStats } from '@core/types/characters/characterDbTypes';

// Hooks
import { useCharacter } from '@features/characters/hooks';
import { SkillsAcquired as FeatureSkillsAcquired } from '@features/characters/types';
import { SkillsAcquired as ComponentSkillsAcquired } from '@interfaces/typesCharacterSheet';

// Components
import FormSelectInfoPlayer from "./FormSelectInfoPlayer/FormSelectInfoPlayer";
import FormCardCheckbox from "./FormCardCheckbox/FormCardCheckbox";
import FormInputStats from "./FormInputStats/FormInputStats";
import FormInputSkillsRing from "./FormInputSkillsRing/FormInputSkillsRing";
import FormImageFile from "./FormImageFile/FormImageFile";
import ScreenLoader from "@UI/ScreenLoader/ScreenLoader";

// Utils
import { getClassName, getRaceName, getJobName, getKnowledgeName, getMainSkillName, getExtraSkillName, getSkillName } from './utils';

// Constants
import { CHARACTER_CLASSES, CHARACTER_RACES, CHARACTER_JOBS, CHARACTER_KNOWLEDGE, RING_TYPES } from './constants';
import { SystemGameList } from './constants/systemGame';

// Icons
import SvgCharacter from "@Icons/SvgCharacter";
import SvgSaveCharacter from "@Icons/SvgSaveCharacter";
import SvgD4Roll from "@Icons/SvgD4Roll";
import SvgDeleteItem from "@Icons/SvgDeleteItem";
import { v4 as uuidv4 } from 'uuid';

// Images
import mainBackground from "@img/webp/bg-home-02.webp";

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
}

// Definir las opciones fuera del componente para evitar recreaciones innecesarias
const optionsCharacterClass: CharacterClassOption[] = CHARACTER_CLASSES.map(cls => ({ value: cls.value, name: cls.name, work: cls.work }));
const optionsCharacterRace: CharacterRaceOption[] = CHARACTER_RACES.map(race => ({ value: race.value, name: race.name }));
const optionsCharacterJob: CharacterJobOption[] = CHARACTER_JOBS.map(job => ({ value: job.value, name: job.name, extraPoint: job.extraPoint }));
const checkboxesData = CHARACTER_KNOWLEDGE.map(knowledge => ({ id: knowledge.value, value: knowledge.value, name: knowledge.name }));
const optionsRingTypes: RingTypeOption[] = RING_TYPES.map(ring => ({ id: ring.id, name: ring.name, stat: ring.stat })); // Ensure all needed fields are mapped

const weaponsList = [
  "Espada",
  "Hacha",
  "Arco",
  "Daga",
  "Maza",
  "Lanza",
  "Escudo",
  "Ballesta"
];

const CharacterSheet = ({ changeBackground }: CharacterSheetProps) => {
  const { user, character: initialCharacter } = useLoaderData() as {
    user: DBUsuario;
    character?: DBPersonajesUsuario;
  };
  const params = useParams();
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [characterImage, setCharacterImage] = useState<string>("");
  const [dataCharacter] = useState<DataCharacter | null>(null);

  // Initialize character hook
  const {
    character,
    statsData,
    skillsAcquired,
    skillsRingList,
    coins,
    systemGame,
    loading,
    newRecord,
    setCharacter,
    setStatsData,
    setInventory,
    setCoins,
    setDeleteItems,
    setSystemGame,
    initialize,
    saveCharacter,
    uploadCharacterImage
  } = useCharacter(params.id, user?.usu_id);

  // Adapter function to convert from feature SkillsAcquired to component SkillsAcquired
  const adaptSkillsAcquired = useCallback((skill: FeatureSkillsAcquired): ComponentSkillsAcquired => {
    return {
      id: skill.id ?? '',
      name: skill.name ?? '',
      value: String(skill.value ?? ''),
      ring: skill.type ?? "", // Map type to ring
      stat: "", // Default empty stat
      description: ""
    };
  }, []);

  // Convert the skills from feature format to component format
  const [adaptedSkillsAcquired, setAdaptedSkillsAcquired] = useState<ComponentSkillsAcquired[]>([]);

  // Update adaptedSkillsAcquired whenever skillsAcquired changes
  useEffect(() => {
    if (skillsAcquired && Array.isArray(skillsAcquired) && skillsAcquired.length > 0) {
      // Asegurarse de que skillsAcquired es un array
      const skillsArray = Array.isArray(skillsAcquired[0]) ? skillsAcquired[0] : skillsAcquired;
      const adapted = skillsArray.map(skill => adaptSkillsAcquired(skill));
      setAdaptedSkillsAcquired(adapted);
    } else {
      setAdaptedSkillsAcquired([]);
    }
  }, [skillsAcquired, adaptSkillsAcquired]);

  const defaultValues = useMemo(() => {
    return initialCharacter
      ? {
          userName: user?.usu_nombre || '',
          name: initialCharacter?.pus_nombre || '',
          class: initialCharacter?.pus_clase || '',
          level: initialCharacter?.pus_nivel ?? 1,
          luckyPoints: initialCharacter?.pus_puntos_suerte ?? 0,
          lifePoints: initialCharacter?.pus_vida ?? 0,
          mainWeapon: initialCharacter?.pus_arma_principal || '',
          secondaryWeapon: initialCharacter?.pus_arma_secundaria || '',
          goldCoins: initialCharacter?.pus_cantidad_oro ?? 0,
          silverCoins: initialCharacter?.pus_cantidad_plata ?? 0,
          bronzeCoins: initialCharacter?.pus_cantidad_bronce ?? 0,
          characterDescription: initialCharacter?.pus_descripcion || '',
        }
      : {
          userName: user?.usu_nombre || '',
          name: '',
          class: '',
          level: 1,
          luckyPoints: 0,
          lifePoints: 0,
          mainWeapon: '',
          secondaryWeapon: '',
          goldCoins: 0,
          silverCoins: 0,
          bronzeCoins: 0,
          characterDescription: '',
        };
  }, [initialCharacter, user]);

  const { register } = useForm<CharacterForm>({ defaultValues });

  // Effects
  useEffect(() => {
    changeBackground(mainBackground);
    initialize();
  }, [changeBackground, initialize]);

  // Helper function to calculate stats based on class and job
  const calculateUpdatedStats = (currentStats: InputStats[], selectedClass: string, selectedJob: string): InputStats[] => {
    const extraPoints = CHARACTER_JOBS.find(option => option.value === selectedJob)?.extraPoint ?? "";
    return currentStats.map(stat => {
      const isMainStat =
        (stat.id === "STR" && selectedClass === "WAR") ||
        (stat.id === "INT" && selectedClass === "MAG") ||
        (stat.id === "DEX" && selectedClass === "SCO") ||
        (stat.id === "CON" && selectedClass === "MED") ||
        (stat.id === "PER" && selectedClass === "RES") ||
        (stat.id === "CHA" && selectedClass === "ACT");

      return {
        ...stat,
        valueClass: (isMainStat ? 2 : 0) + (extraPoints.includes(stat.id ?? '') ? 1 : 0)
      };
    });
  };

  // Event Handlers
  const handleCharacterClassChange = (value: string) => {
    if (!character) return;

    const newClass = value;
    const currentJob = character.pus_trabajo ?? ''; // Get current job with default

    setCharacter((prev: DBPersonajesUsuario | null) => {
      if (!prev) return null;
      return {
        ...prev,
        pus_clase: newClass,
        pus_conocimientos: CHARACTER_CLASSES.find(option => option.value === newClass)?.work ?? prev.pus_conocimientos ?? ''
      };
    });

    // Calculate new stats based on the *new* class and *current* job
    const updatedStats = calculateUpdatedStats(statsData, newClass, currentJob);
    setStatsData(updatedStats);
  };

  const handleCharacterJobSelectChange = (value: string) => {
    if (!character) return;

    const newJob = value;
    const currentClass = character.pus_clase; // Get current class

    setCharacter((prev: DBPersonajesUsuario | null) => {
      if (!prev) return null;
      return {
        ...prev,
        pus_trabajo: newJob
      };
    });

    // Calculate new stats based on the *current* class and *new* job
    const updatedStats = calculateUpdatedStats(statsData, currentClass, newJob);
    setStatsData(updatedStats);
  };

  const handleSelectedCheckValuesChange = (newValues: string[]) => {
    if (!character) return;

    setCharacter((prev: DBPersonajesUsuario | null) => {
      if (!prev) return null;
      return {
        ...prev,
        pus_conocimientos: newValues.join(",")
      };
    });
  };

  // Add any missing functions that are used in your component
  const handleSelectRaceChange = (value: string) => {
    if (!character) return;
    
    setCharacter((prev: DBPersonajesUsuario | null) => {
      if (!prev) return null;
      return {
        ...prev,
        pus_raza: value
      };
    });
  };

  const handleOpenModal = () => {
    if (onOpen) {
      onOpen();
    }
  };

  const handleSystemGameChange = (value: string) => {
    const selectedOption = SystemGameList.find(system => system.value === value);
    if (selectedOption) {
      // Construct the SystemGame object from the selected Option
      const newSystemGame: SystemGame = {
        sju_id: selectedOption.value,
        sju_nombre: selectedOption.name
      };
      setSystemGame(newSystemGame);
    }
  };

  const handleCharacterImageFileChange = (_value: string, file: File) => {
    if (file && character) {
      uploadCharacterImage(file)
        .then(result => {
          if (!result.error && result.url) {
            setCharacterImage(result.url);
          } else {
            console.error('Error uploading character image: No URL returned');
          }
        })
        .catch(error => {
          console.error('Error uploading character image:', error);
        });
    }
  };

  // Add missing functions
  const handleAlignmentChange = (value: string) => {
    if (!character) return;

    setCharacter((prev: DBPersonajesUsuario | null) => {
      if (!prev) return null;
      return {
        ...prev,
        pus_alineacion: value
      };
    });
    const formElement = document.getElementById("form-sheet");
    if (value === "O") {
      formElement?.classList.add("orden");
      formElement?.classList.remove("caos");
    } else if (value === "C") {
      formElement?.classList.add("caos");
      formElement?.classList.remove("orden");
    } else {
      formElement?.classList.remove("caos");
      formElement?.classList.remove("orden");
    }
  };

  const validateNumeric = (value: string, min: number = 0): number => {
    const num = parseInt(value);
    return isNaN(num) ? min : Math.max(min, num);
  };

  const handleCoinsChange = (index: number, value: string) => {
    const numericValue = validateNumeric(value);
    const updatedCoins = [...coins];
    updatedCoins[index] = numericValue;
    setCoins(updatedCoins);
  };

  const [newObjectName, setNewObjectName] = useState("");
  const [newObjectCount, setNewObjectCount] = useState("1");
  const [newObjectDescription, setNewObjectDescription] = useState("");
  const [invObjects, setInvObjects] = useState<InventoryObject[]>([]);
  const [optionsSkillClass] = useState<any[]>([]);
  const [optionsSkillExtra] = useState<any[]>([]);
  const [selectedSkillValue, setSelectedSkillValue] = useState("");
  const [selectedExtraSkillValue, setSelectedExtraSkillValue] = useState("");
  const [inputsStatsData] = useState<any[]>([]);

  const handleNewCount = (value: string) => {
    setNewObjectCount(value);
  };

  const handleAddObject = () => {
    if (!newObjectName) {
      alert("Por favor digitar este campo");
      document.getElementById("objectName")?.focus();
      return;
    }

    const newObject = {
      id: uuidv4(),
      name: newObjectName,
      description: newObjectDescription || "Descripción del nuevo objeto",
      count: parseInt(newObjectCount) || 1,
      readOnly: false,
    };

    setInvObjects(prev => [...prev, newObject]);
    setInventory(prev => [...prev, newObject]);
    setNewObjectName("");
    setNewObjectCount("1");
    setNewObjectDescription("");
  };

  const handleDeleteObject = (id: string) => {
    setInvObjects(prev => prev.filter(obj => obj.id !== id));
    setInventory(prev => prev.filter(obj => obj.id !== id));
    setDeleteItems(prev => [...prev, id]);
  };

  const handleEditCount = (id: string, newCount: string) => {
    const numericValue = validateNumeric(newCount, 1);
    setInvObjects(prevObjects =>
      prevObjects.map(obj =>
        obj.id === id ? { ...obj, count: numericValue } : obj
      )
    );
    setInventory(prevObjects =>
      prevObjects.map(obj =>
        obj.id === id ? { ...obj, count: numericValue } : obj
      )
    );
  };

  const handleSaveCharacter = async () => {
    const characterId = await saveCharacter();
    if (characterId) {
      document.documentElement.scrollTop = 0;
      navigate("/CharacterSheet/" + characterId);
    }
  };

  const handleSelectSkillChange = (value: string) => {
    setSelectedSkillValue(value);
  };

  const handleSelectExtraSkillChange = (value: string) => {
    setSelectedExtraSkillValue(value);
  };

  const handleStatsInputChange = (value: any) => {
    // Implementation depends on your specific requirements
    console.log("Stats input changed:", value);
  };

  const handleSelectedRingSkillChange = (id: string, value: string) => {
    // Implementation depends on your specific requirements
    console.log("Ring skill changed:", id, value);
  };

  const handleSelectedTypeRingSkillChange = (id: string, value: string) => {
    // Implementation depends on your specific requirements
    console.log("Ring type changed:", id, value);
  };

  const randomRoll = () => {
    // Implementation depends on your specific requirements
    console.log("Random roll clicked");
  };

  // Mostrar solo el componente de carga si los datos están cargando o si no hay personaje
  if (loading || !character) {
    return <ScreenLoader />;
  }

  return (
    <>
      <form
        id="form-sheet"
        className="form-sheet min-h-screen grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-0 gap-y-4 md:gap-x-4 p-4"
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
          </label>
          <input
            {...register("name", { required: true, maxLength: 50 })}
            placeholder="Nombre del personaje"
            className="form-input col-start-2 mr-2 focus:border-black focus:shadow"
          />

          <FormSelectInfoPlayer
            id="characterClass"
            label="Clase"
            options={optionsCharacterClass}
            selectedValue={character?.pus_clase || ""}
            onSelectChange={handleCharacterClassChange}
          />

          <FormSelectInfoPlayer
            id="characterRace"
            label="Raza"
            options={optionsCharacterRace}
            selectedValue={character?.pus_raza || ""}
            onSelectChange={handleSelectRaceChange}
          ></FormSelectInfoPlayer>

          <FormSelectInfoPlayer
            id="characterJob"
            label="Trabajo"
            options={optionsCharacterJob}
            selectedValue={character?.pus_trabajo || ""}
            onSelectChange={handleCharacterJobSelectChange}
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
          </label>
          <textarea
            {...register("characterDescription", { required: true, maxLength: 500 })}
            placeholder="Descripcion del personaje"
            className="form-input-y col-start-1 md:col-start-1 col-span-5 row-start-15 md:row-start-7 row-span-1 focus:border-black focus:shadow"
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
            {weaponsList.map((weapon, index) => (
              <option key={index} value={weapon}>
                {weapon}
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
                values={adaptedSkillsAcquired[0] || {id: "", name: "", value: "", ring: "", stat: "", description: ""}}
                onSelectChange={handleSelectedRingSkillChange}
                onSelectTypeChange={handleSelectedTypeRingSkillChange}
              />

              <FormInputSkillsRing
                id={"1"}
                level={character!.pus_nivel}
                levelEvaluated={6}
                ringTypes={optionsRingTypes}
                skillList={skillsRingList[1]}
                values={adaptedSkillsAcquired[1] || {id: "", name: "", value: "", ring: "", stat: "", description: ""}}
                onSelectChange={handleSelectedRingSkillChange}
                onSelectTypeChange={handleSelectedTypeRingSkillChange}
              />

              <FormInputSkillsRing
                id={"2"}
                level={character!.pus_nivel}
                levelEvaluated={9}
                ringTypes={optionsRingTypes}
                skillList={skillsRingList[2]}
                values={adaptedSkillsAcquired[2] || {id: "", name: "", value: "", ring: "", stat: "", description: ""}}
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
                      {getClassName(character?.pus_clase)}
                    </li>
                    <li>
                      <strong>Raza: </strong>
                      {getRaceName(character?.pus_raza)}
                    </li>
                    <li>
                      <strong>Trabajo: </strong>
                      {getJobName(character?.pus_trabajo)}
                    </li>
                    <li className="col-span-2">
                      <strong>Descripcion: </strong>
                      {character?.pus_descripcion}
                    </li>
                    <li className="col-span-2">
                      <strong>Conocimientos: </strong>
                      {getKnowledgeName(character?.pus_conocimientos?.split(','))}
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
                          {statsData.find(stat => stat.id === "STR") ? 
                            (statsData.find(stat => stat.id === "STR")?.valueDice || 0) +
                            (statsData.find(stat => stat.id === "STR")?.valueClass || 0) +
                            (statsData.find(stat => stat.id === "STR")?.valueLevel || 0)
                            : 0
                          }
                        </td>
                      </tr>
                      <tr>
                        <td>Inteligencia</td>
                        <td>
                          {statsData.find(stat => stat.id === "INT") ? 
                            (statsData.find(stat => stat.id === "INT")?.valueDice || 0) +
                            (statsData.find(stat => stat.id === "INT")?.valueClass || 0) +
                            (statsData.find(stat => stat.id === "INT")?.valueLevel || 0)
                            : 0
                          }
                        </td>
                      </tr>
                      <tr>
                        <td>Destreza</td>
                        <td>
                          {statsData.find(stat => stat.id === "DEX") ? 
                            (statsData.find(stat => stat.id === "DEX")?.valueDice || 0) +
                            (statsData.find(stat => stat.id === "DEX")?.valueClass || 0) +
                            (statsData.find(stat => stat.id === "DEX")?.valueLevel || 0)
                            : 0
                          }
                        </td>
                      </tr>
                      <tr>
                        <td>Constitucion</td>
                        <td>
                          {statsData.find(stat => stat.id === "CON") ? 
                            (statsData.find(stat => stat.id === "CON")?.valueDice || 0) +
                            (statsData.find(stat => stat.id === "CON")?.valueClass || 0) +
                            (statsData.find(stat => stat.id === "CON")?.valueLevel || 0)
                            : 0
                          }
                        </td>
                      </tr>
                      <tr>
                        <td>Percepcion</td>
                        <td>
                          {statsData.find(stat => stat.id === "PER") ? 
                            (statsData.find(stat => stat.id === "PER")?.valueDice || 0) +
                            (statsData.find(stat => stat.id === "PER")?.valueClass || 0) +
                            (statsData.find(stat => stat.id === "PER")?.valueLevel || 0)
                            : 0
                          }
                        </td>
                      </tr>
                      <tr>
                        <td>Carisma</td>
                        <td>
                          {statsData.find(stat => stat.id === "CHA") ? 
                            (statsData.find(stat => stat.id === "CHA")?.valueDice || 0) +
                            (statsData.find(stat => stat.id === "CHA")?.valueClass || 0) +
                            (statsData.find(stat => stat.id === "CHA")?.valueLevel || 0)
                            : 0
                          }
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
                  <ul className="dialog-card grid grid-cols-1 gap-3 col-start-2 row-start-2 items-center">
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
                    onClick={() => handleSaveCharacter()}
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

// Añadimos un componente envoltorio para manejar la carga y los errores
const CharacterSheetWrapper = (props: CharacterSheetProps) => {
  try {
    return <CharacterSheet {...props} />;
  } catch (error) {
    console.error('Error en CharacterSheet:', error);
    return <ScreenLoader />;
  }
};

export default CharacterSheetWrapper;
