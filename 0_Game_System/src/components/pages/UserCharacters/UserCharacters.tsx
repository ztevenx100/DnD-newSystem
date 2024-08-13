import "./UserCharacters.css";

import { Suspense } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";

import ListUserCharacterSkeleton from "@/components/UI/Skeleton/ListUserCharacterSkeleton";
// Images
import SvgAddCharacter from "@Icons/SvgAddCharacter";
import { Card, CardBody } from "@nextui-org/react";

import ListUserCharacter from "./ListUserCharacter/ListUserCharacter";
import { DBUsuario } from "@/components/interfaces/dbTypes";

const UserCharacters = () => {
  const navigate = useNavigate();
  const user: DBUsuario = useLoaderData() as DBUsuario;

  console.log({ user });

  const handleOpenCharacter = () => {
    navigate("/CharacterSheet/" + user);
  };

  return (
    <>
      <section className="min-h-screen grid grid-cols-1 grid-rows-6 gap-x-0 gap-y-4 py-4 mb-3">
        <header className="bg-white shadow-lg rounded py-2 grid items-center flex justify-center">
          <h1 className="text-xl font-bold uppercase">Listado de personajes</h1>
        </header>
        <Card className="w-full px-10 py-5 row-span-6 relative">
          <CardBody>
            <Suspense fallback={<ListUserCharacterSkeleton />}>
              <ListUserCharacter user={user} />
            </Suspense>
            <div className="rounded-xl aspect-square max-w-fit p-4 flex justify-center items-center bg-neutral-200 absolute bottom-4 right-0 shadow-sm shadow-neutral-500 m-4">
              <button
                className="btn-save-character"
                onClick={handleOpenCharacter}
              >
                <SvgAddCharacter className="icon" width={40} height={40} />
              </button>
            </div>
          </CardBody>
        </Card>
      </section>
    </>
  );
};

export default UserCharacters;
