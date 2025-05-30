import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Listbox, ListboxItem, Avatar, Chip, Button } from "@nextui-org/react";

import {
  deleteCharacter,
  getlistCharacters,
} from "@features/character-sheet/infrastructure/services/characters";
import { getUrlCharacter } from "@database/storage/dbStorage";

// Interfaces
import { DBPersonajesUsuario } from "@shared/utils/types";

// Images
import SvgDeleteItem from "@Icons/SvgDeleteItem";

import { normalizeUser } from "@shared/utils/helpers/userHelpers";

// Interface for component props
interface ListUserCharacterProps {
  user: {
    id: string;
    nombre?: string;
    usu_nombre?: string;
    usu_id?: string;
    email?: string;
  };
}

// Asegurar que getUrlImage utilice el id correcto
async function getUrlImage(character: DBPersonajesUsuario) {
  if (!character || !character.pus_usuario || !character.pus_id) {
    console.error("Datos de personaje incompletos para obtener imagen:", character);
    return "";
  }

  try {
    const url = await getUrlCharacter(character.pus_usuario, character.pus_id);
    return url ? url + "?" + Math.random().toString(36).substring(7) : "";
  } catch (error) {
    console.error("Error al obtener URL de imagen:", error);
    return "";
  }
}

async function getList(user: string) {
  if (!user || user === "" || user === undefined) {
    console.error("ID de usuario inválido:", user);
    return [];
  }

  try {
    console.log("Obteniendo lista de personajes para usuario:", user);
    const data: DBPersonajesUsuario[] = await getlistCharacters(user);

    if (data && data.length > 0) {
      await Promise.all(
        data.map(async (elem) => {
          try {
            elem.url_character_image = await getUrlImage(elem);
          } catch (error) {
            console.error("Error al obtener imagen para personaje:", elem.pus_id, error);
            elem.url_character_image = "";
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
    // Normalizar el usuario para asegurar que tenga todos los campos necesarios
    const normalizedUser = normalizeUser(user);
    
    setIsLoading(true);
    setError(null);
    
    console.log("Cargando personajes para usuario:", normalizedUser.usu_id);
    
    getList(normalizedUser.usu_id)
      .then((listData) => {
        setList(listData || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar personajes:", err);
        setError("Error al cargar la lista de personajes");
        setIsLoading(false);
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
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-3 text-gray-600">Cargando personajes...</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {!isLoading && !error && list.length === 0 && (
        <div className="text-center p-8 text-gray-500">
          No hay personajes disponibles para este usuario
        </div>
      )}
      
      {!isLoading && !error && list.length > 0 && (
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
            </div>          </ListboxItem>
        ))}
        </Listbox>
      )}
    </>
  );
};

export default ListUserCharacter;
