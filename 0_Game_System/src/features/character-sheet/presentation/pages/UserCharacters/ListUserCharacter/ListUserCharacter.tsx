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
  if (user === "" || user === null || user === undefined) {
    console.error("ID de usuario inválido:", user);
    return [];
  }

  try {
    console.log("Obteniendo lista de personajes para usuario:", user);
    const data: DBPersonajesUsuario[] = await getlistCharacters(user);
    console.log("Datos recibidos:", data);

    if (data !== null && data.length > 0) {
      await Promise.all(
        data.map(async (elem) => {
          try {
            elem.url_character_image = await getUrlImage(elem);
          } catch (error) {
            console.error("Error al obtener imagen para personaje:", elem.pus_id, error);
            elem.url_character_image = ""; // Usar una imagen por defecto
          }
        })
      );

      return data;
    } else {
      console.log("No se encontraron personajes para el usuario:", user);
      return [];
    }
  } catch (error) {
    console.error("Error al obtener la lista de personajes:", error);
    return [];
  }
}

const ListUserCharacter: React.FC<ListUserCharacterProps> = ({ user }) => {
  const navigate = useNavigate();
  const [list, setList] = useState<DBPersonajesUsuario[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !user.id) {
      setError("No se ha proporcionado un ID de usuario válido");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    console.log("Cargando personajes para usuario:", user.id);
    getList(user.id)
      .then((listData) => {
        setList(listData ?? []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error en useEffect al cargar personajes:", err);
        setError("Error al cargar la lista de personajes");
        setIsLoading(false);
      });
  }, [user]);

  async function handleDeleteCharacter(id: string) {
    if (!confirm("¿Seguro de que desea eliminar el personaje?")) return;

    if (id === null || id === "") return;

    try {
      // Eliminar objeto db
      await deleteCharacter(id);
      console.log("Personaje eliminado correctamente:", id);
      setList((prevObjects) => prevObjects.filter((obj) => obj.pus_id !== id));
    } catch (error) {
      console.error("Error al eliminar personaje:", error);
      alert("Error al eliminar el personaje");
    }
  }

  if (isLoading) {
    return <div className="text-center p-8">Cargando personajes...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  if (list.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        No tienes personajes creados. ¡Crea uno nuevo!
      </div>
    );
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
                  <p className="text-base text-gray-600 mb-2">{elem.sju_sistema_juego?.sju_nombre}</p>
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