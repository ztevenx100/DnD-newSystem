import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

// Types
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
  str: Array<{ dice: number; class: number; level: number }>;
  int: Array<{ dice: number; class: number; level: number }>;
  dex: Array<{ dice: number; class: number; level: number }>;
  con: Array<{ dice: number; class: number; level: number }>;
  per: Array<{ dice: number; class: number; level: number }>;
  cha: Array<{ dice: number; class: number; level: number }>;
  mainWeapon: string;
  secondaryWeapon: string;
  alignment: string;
  mainSkill: string;
  extraSkill: string;
  skills: Array<{ id: string; value: string; name: string; description?: string; ring: string; stat?: string }>;
  coinsInv: number[];
  inv: Array<{ id: string; name: string; count: number }>;
}

interface CharacterSaveModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  dataCharacter: DataCharacter | null | undefined;
  onSave: () => void;
  getClassName: (id?: string) => string | undefined;
  getRaceName: (id?: string) => string | undefined;
  getJobName: (id?: string) => string | undefined;
  getKnowledgeName: (ids?: string[]) => string | undefined;
  getMainSkillName: (id?: string) => string | undefined;
  getExtraSkillName: (id?: string) => string | undefined;
  getSkillName: (id: string, stat: string) => string | undefined;
}

/**
 * Modal component for displaying character summary and saving character data
 * 
 * This component shows a comprehensive overview of the character including:
 * - Basic information (player, name, class, race, job, etc.)
 * - Character statistics with calculated totals
 * - Equipment and skills
 * - Inventory and coins
 * 
 * @param props - Modal configuration and character data
 */
const CharacterSaveModal: React.FC<CharacterSaveModalProps> = ({
  isOpen,
  onOpenChange,
  dataCharacter,
  onSave,
  getClassName,
  getRaceName,
  getJobName,
  getKnowledgeName,
  getMainSkillName,
  getExtraSkillName,
  getSkillName,
}) => {
  return (
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
                onClick={() => onSave()}
                id="btnSaveData"
              >
                <span>Guardar información</span>
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CharacterSaveModal;
