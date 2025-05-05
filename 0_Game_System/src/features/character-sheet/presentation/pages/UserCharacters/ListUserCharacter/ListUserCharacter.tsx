import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Listbox, ListboxItem, Avatar, Chip, Button } from "@nextui-org/react";

import { DBUsuario } from "@utils/types";
import { DBPersonajesUsuario } from "@features/character-sheet/domain/types";
import { getUrlCharacter } from "@features/character-sheet/infrastructure/services/storage";
import { deleteCharacter, getlistCharacters } from "@features/character-sheet/infrastructure/services/characters";

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
    getList(user.id).then((listData) => {
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
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        classNames={{
          base: "max-w-full",
          list: "p-0 grid grid-cols-1 lg:grid-cols-2 gap-4"
        }}
        aria-label="Listado de personajes"
        onAction={(key) => navigate("/CharacterSheet/" + key)}
      >
        {list.map((elem) => (
          <ListboxItem
            key={elem.pus_id}
            className="character-item h-full"
            textValue={elem.pus_nombre}
          >
            <div className="flex flex-col w-full h-full">
              <div className="flex items-start space-x-4">
                <header className="flex-shrink-0">
                  <Avatar
                    alt={elem.pus_nombre}
                    className="w-20 h-20"
                    size="lg"
                    src={elem.url_character_image}
                  />
                </header>
                <div className="character-info flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-gray-800 truncate">{elem.pus_nombre}</h3>
                  <p className="text-base text-gray-600 mb-2">{elem.sju_sistema_juego.sju_nombre}</p>
                  {elem.pus_descripcion && (
                    <p className="text-sm text-gray-500 line-clamp-2">{elem.pus_descripcion}</p>
                  )}
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Chip 
                    size="lg"
                    radius="full" 
                    classNames={{ 
                      base: "lbl-level",
                      content: "font-semibold text-base"
                    }}
                  >
                    Nivel {elem.pus_nivel}
                  </Chip>
                  <Button
                    isIconOnly
                    className="btn-delete-object"
                    aria-label="Eliminar personaje"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteCharacter(elem.pus_id);
                    }}
                  >
                    <SvgDeleteItem width={24} fill="var(--required-color)" />
                  </Button>
                </div>
              </div>
            </div>
          </ListboxItem>
        ))}
      </Listbox>
    </>
  );
};

export default ListUserCharacter; 