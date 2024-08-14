import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Listbox, ListboxItem, Avatar, Chip, Button } from "@nextui-org/react";

import {
  deleteCharacter,
  getlistCharacters,
} from "@services/UserCharactersServices";
import { getUrlCharacter } from "@services/database/dbStorage";

// Interfaces
import { DBPersonajesUsuario, DBUsuario } from "@interfaces/dbTypes";

// Images
import SvgDeleteItem from "@Icons/SvgDeleteItem";

interface ListUserCharacterProps {
  user: DBUsuario;
}

async function getUrlImage(character: DBPersonajesUsuario) {
  const url = await getUrlCharacter(character.pus_usuario, character.pus_id);

  return url + "?" + Math.random().toString(36).substring(7);
}

async function getList(user: string) {
  if (user === "" || user === null) return;

  const data: DBPersonajesUsuario[] = await getlistCharacters(user);

  if (data !== null && data.length > 0) {
    await Promise.all(
      data.map(async (elem) => {
        elem.url_character_image = await getUrlImage(elem);
      })
    );

    return data;
  }
}

const ListUserCharacter: React.FC<ListUserCharacterProps> = ({ user }) => {
  const navigate = useNavigate();
  const [list, setList] = useState<DBPersonajesUsuario[]>([]);

  useEffect(() => {
    getList(user.usu_id).then((listData) => {
      setList(listData ?? []);
    });
  }, [user]);

  async function handleDeleteCharacter(id: string) {
    if (!confirm("¿Seguro de que desea eliminar el personaje?")) return;

    if (id === null || id === "") return;

    // Eliminar objeto db
    await deleteCharacter(id);

    setList((prevObjects) => prevObjects.filter((obj) => obj.pus_id !== id));
  }

  return (
    <>
      <Listbox
        variant="flat"
        className=""
        classNames={{ list: "gap-y-2" }}
        aria-label="Listado de personajes"
        onAction={(key) => navigate("/CharacterSheet/" + key)}
      >
        {list.map((elem) => (
          <ListboxItem
            key={elem.pus_id}
            description={elem.sju_sistema_juego.sju_nombre}
            className="character-item "
            textValue={"0"}
            classNames={{
              description: "",
              title: "w-full whitespace-normal",
            }}
          >
            <header className="flex gap-2 items-center justify-between mb-2">
              <div className="flex gap-2">
                <Avatar
                  alt={elem.pus_nombre}
                  className="flex-shrink-0"
                  size="sm"
                  src={elem.url_character_image}
                />
                <h1
                  color="dark-3"
                  className="block antialiased tracking-normal text-2xl leading-snug text-blue-gray-900 font-black mb-1"
                >
                  {elem.pus_nombre}
                </h1>
              </div>
              <div className="flex items-center">
                <Chip radius="sm" classNames={{ base: "lbl-level" }}>
                  {elem.pus_nivel}
                </Chip>
                <Button
                  isIconOnly
                  className="btn-delete-object"
                  aria-label="Like"
                  onClick={() => handleDeleteCharacter(elem.pus_id)}
                >
                  <SvgDeleteItem width={30} fill="var(--required-color)" />
                </Button>
              </div>
            </header>
            <footer className=" ">
              <p>{elem.pus_descripcion}</p>
            </footer>
          </ListboxItem>
        ))}
      </Listbox>
    </>
  );
};

export default ListUserCharacter;
