import "@unocss/reset/tailwind.css";
import "uno.css";
import "./App.css";

import { Suspense, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";

import { DBUsuario } from "@utils/types";
import { DBPersonajesUsuario } from "@features/character-sheet/domain/types";
import CharacterSheet from "@features/character-sheet/UserCharacters/CharacterSheet/CharacterSheet";
import homeBackground from "@assets/img/webp/bg-home-01.webp";
import { ErrorPage } from "@components/ErrorPage";
import Home from "@/app/Home";
import SystemGameElement from "@features/game-systems/SystemGameElement/SystemGameElement";
import SystemsGameList from "@features/game-systems/presentation/pages/SystemsGameList";
import UserCharacters from "@features/character-sheet/UserCharacters/UserCharacters";
import WorldMap from "@features/world-map/WorldMap/WorldMap";
import BackgroundChanger from "@UI/Background/BackgroundChanger";
import BtnBackToTop from "@UI/Buttons/BtnBackToTop";
import Footer from "@UI/Footer/Footer";
import Navbar from "@UI/Navbar/Navbar";
import { getCharacter, getUser } from "@features/character-sheet/infrastructure/services";

async function getUserSession(): Promise<DBUsuario> {
  const user: DBUsuario[] = await Promise.resolve(
    getUser("43c29fa1-d02c-4da5-90ea-51f451ed8952")
  );

  return user[0];
}

const userLoader = async () => {
  const user = await getUserSession();
  return user;
};

const userAndCharacterLoader = async ({ params }: any) => {
  const user = await getUserSession();

  const characters = await getCharacter(params.id);
  return {
    user,
    character: Boolean(characters?.length) ? characters[0] as DBPersonajesUsuario : undefined,
  };
};

const App = () => {
  const [background, setBackground] = useState(homeBackground);

  const changeBackground = (newBackground: string) => {
    setBackground(newBackground);
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navbar />,
      children: [
        {
          index: true,
          element: <Home changeBackground={changeBackground} />,
        },
        {
          id: "CreateCharacter",
          path: "/CharacterSheet",
          element: <CharacterSheet changeBackground={changeBackground} />,
          loader: userLoader,
        },
        {
          id: "EditCharacter",
          path: "/CharacterSheet/:id",
          element: <CharacterSheet changeBackground={changeBackground} />,
          loader: userAndCharacterLoader,
        },
        {
          id: "UserCharacters",
          path: "/UserCharacters",
          element: <UserCharacters />,
          loader: userLoader,
        },
        {
          id: "SystemsGameList",
          path: "/SystemsGameList",
          element: <SystemsGameList />,
        },
        {
          id: "SystemGameElement",
          path: "/SystemGameElement/:id",
          element: <SystemGameElement />,
        },
        {
          id: "WorldMap",
          path: "/WorldMap",
          element: <WorldMap changeBackground={changeBackground} />,
        },
        {
          path: "*",
          element: <ErrorPage />,
        },
      ],
    },
  ]);

  return (
    <NextUIProvider>
      <BackgroundChanger initialBackground={background}>
        <main className="container mx-auto bg-main light">
          <Suspense>
            <RouterProvider router={router} />
          </Suspense>
        </main>
        <BtnBackToTop />
        <Footer />
      </BackgroundChanger>
    </NextUIProvider>
  );
};

export default App;
