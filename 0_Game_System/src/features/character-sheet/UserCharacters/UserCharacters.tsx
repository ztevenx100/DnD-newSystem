import "./UserCharacters.css";

import { Suspense } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";

import ListUserCharacterSkeleton from "@components/UI/Skeleton/ListUserCharacterSkeleton";
// Images
import SvgAddCharacter from "@Icons/SvgAddCharacter";
import { Card, CardBody } from "@nextui-org/react";

import ListUserCharacter from "./ListUserCharacter/ListUserCharacter";
import { DBUsuario } from "@shared/utils/types";

// Tipo que coincide con lo que espera ListUserCharacter
type ListUserCharacterUser = {
  id: string;
  nombre?: string;
  usu_nombre?: string;
  usu_id?: string;
  email?: string;
};

const UserCharacters = () => {
  const navigate = useNavigate();  
  const user = useLoaderData() as DBUsuario;
  
  // Si el usuario es undefined, usamos un usuario fijo para que el componente pueda seguir funcionando  
  const safeUser: DBUsuario = {
    // Campos obligatorios según la interfaz DBUsuario
    usu_id: user?.usu_id || user?.id || "43c29fa1-d02c-4da5-90ea-51f451ed8952",
    usu_nombre: user?.usu_nombre || user?.nombre || "Usuario Temporal",
    usu_email: user?.usu_email || user?.email || "temp@example.com",
    
    // Campos alias para compatibilidad
    id: user?.id || user?.usu_id || "43c29fa1-d02c-4da5-90ea-51f451ed8952",
    nombre: user?.nombre || user?.usu_nombre || "Usuario Temporal",
    email: user?.email || user?.usu_email || "temp@example.com"
  };
  
  // Función para convertir de DBUsuario al tipo que espera ListUserCharacter
  const toListUserCharacterUser = (user: DBUsuario): ListUserCharacterUser => {
    return {
      id: user.id || user.usu_id || "", // Garantizamos que id nunca sea undefined
      nombre: user.nombre,
      usu_nombre: user.usu_nombre,
      usu_id: user.usu_id,
      email: user.email || user.usu_email
    };
  };

  const handleOpenCharacter = () => {
    // Navegamos usando el ID del usuario
    navigate("/CharacterSheet/" + safeUser.id);
  };

  return (
    <>
      <section className="min-h-screen w-full px-4 py-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-[1400px] mx-auto">
          <header className="bg-white shadow-lg rounded-lg py-6 mb-8">
            <h1 className="text-3xl font-bold uppercase text-center text-gray-800">
              Listado de personajes
            </h1>
            <p className="text-center text-gray-600 mt-2">
              Usuario: {safeUser.nombre}
            </p>
          </header>
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardBody className="p-6 md:p-8">
              <div className="flex justify-end mb-6">
                <button
                  className="btn-add-character"
                  onClick={handleOpenCharacter}
                  title="Añadir nuevo personaje"
                >
                  <SvgAddCharacter className="icon" width={32} height={32} />
                  <span>Nuevo Personaje</span>
                </button>
              </div>              <Suspense fallback={<ListUserCharacterSkeleton />}>
                <ListUserCharacter user={toListUserCharacterUser(safeUser)} />
              </Suspense>
            </CardBody>
          </Card>
        </div>
      </section>
    </>
  );
};

export default UserCharacters;
