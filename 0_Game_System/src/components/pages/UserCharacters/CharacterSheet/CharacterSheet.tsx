import React, { useEffect, useMemo, ChangeEvent, useState } from "react";
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
import { DBPersonajesUsuario, DBUsuario } from "@core/types";
import { CharacterClassOption, CharacterRaceOption, CharacterJobOption } from './types';
import { InputStats, DataCharacter, InventoryObject, SystemGame } from './models';

// Hooks
import { useCharacter } from '@features/characters/hooks';

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

const CharacterSheet: React.FC<CharacterSheetProps> = ({ changeBackground }) => {
  const { user, character: initialCharacter } = useLoaderData() as {
    user: DBUsuario;
    character?: DBPersonajesUsuario;
  };
  const params = useParams();
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Initialize character hook
  const {
    character,
    statsData,
    skillsAcquired,
    skillsRingList,
    inventory,
    coins,
    deleteItems,
    systemGame,
    loading,
    newRecord,
    characterImage,
    setCharacter,
    setStatsData,
    setSkillsAcquired,
    setSkillsRingList,
    setInventory,
    setCoins,
    setDeleteItems,
    setSystemGame,
    initialize,
    saveCharacter,
    uploadCharacterImage
  } = useCharacter(params.id, user?.usu_id);

  const defaultValues = useMemo(() => {
    return initialCharacter
      ? {
          userName: user.usu_nombre,
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
        }
      : undefined;
  }, [initialCharacter, user]);

  const { register } = useForm<CharacterForm>({ defaultValues });

  // Effects
  useEffect(() => {
    changeBackground(mainBackground);
    initialize();
  }, [changeBackground, initialize]);

  // Event Handlers
  const handleCharacterClassChange = (value: string) => {
    setCharacter(prev => ({ ...prev, pus_clase: value }));
    const selectedOption = CHARACTER_CLASSES.find(option => option.value === value);
    if (selectedOption) {
      setCharacter(prev => ({ ...prev, pus_conocimientos: selectedOption.work }));
    }

    // Reset and update stats points based on new class
    const updatedStats = statsData.map(stat => ({ ...stat, valueClass: 0 }));
    setStatsData(updatedStats);
    updateStatsPoints(value, character.pus_trabajo);
  };

  const handleCharacterJobSelectChange = (value: string) => {
    setCharacter(prev => ({ ...prev, pus_trabajo: value }));
    updateStatsPoints(character.pus_clase, value);
  };

  const handleCharacterImageFileChange = async (value: string, file: File) => {
    const result = await uploadCharacterImage(file);
    if (!result?.error) {
      setCharacterImage(value);
    }
  };

  const handleSelectedCheckValuesChange = (newValues: string[]) => {
    setCharacter(prev => ({ ...prev, pus_conocimientos: newValues.join(",") }));
  };

  const handleStatsInputChange = (newInputStats: InputStats) => {
    setStatsData(prevItems =>
      prevItems.map(item =>
        item.id === newInputStats.id ? { ...item, ...newInputStats } : item
      )
    );
  };

  const handleAlignmentChange = (value: string) => {
    setCharacter(prev => ({ ...prev, pus_alineacion: value }));
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

  const handleCoinsChange = (index: number, value: string) => {
    const numericValue = validateNumeric(value);
    const updatedCoins = [...coins];
    updatedCoins[index] = numericValue;
    setCoins(updatedCoins);
  };

  const handleAddObject = (name: string, description: string, count: number) => {
    if (!name) {
      alert("Por favor digitar este campo");
      document.getElementById("objectName")?.focus();
      return;
    }

    const newObject = {
      id: uuidv4(),
      name,
      description: description || "Descripción del nuevo objeto",
      count,
      readOnly: false,
    };

    setInventory(prev => [...prev, newObject]);
  };

  const handleDeleteObject = (id: string) => {
    setInventory(prev => prev.filter(obj => obj.id !== id));
    setDeleteItems(prev => [...prev, id]);
  };

  const handleEditCount = (id: string, newCount: string) => {
    const numericValue = validateNumeric(newCount, 1);
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

  // Helper Methods
  const validateNumeric = (value: string, min: number = 0): number => {
    const num = parseInt(value);
    return isNaN(num) ? min : Math.max(min, num);
  };

  const updateStatsPoints = (selectedClass: string, selectedJob: string): void => {
    const extraPoints = CHARACTER_JOBS.find(option => option.value === selectedJob)?.extraPoint || "";
    const updatedStats = statsData.map(stat => {
      const isMainStat = 
        (stat.id === "STR" && selectedClass === "WAR") ||
        (stat.id === "INT" && selectedClass === "MAG") ||
        (stat.id === "DEX" && selectedClass === "SCO") ||
        (stat.id === "CON" && selectedClass === "MED") ||
        (stat.id === "PER" && selectedClass === "RES") ||
        (stat.id === "CHA" && selectedClass === "ACT");
      
      return {
        ...stat,
        valueClass: (isMainStat ? 2 : 0) + (extraPoints.includes(stat.id) ? 1 : 0)
      };
    });
    
    setStatsData(updatedStats);
  };

  return (
    <>
      {loading && <ScreenLoader />}
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

export default CharacterSheet;
