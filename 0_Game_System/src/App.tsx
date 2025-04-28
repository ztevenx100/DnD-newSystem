import "@unocss/reset/tailwind.css";
import "uno.css";
import "./App.css";

import { Suspense, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";

import {
  DBPersonajesUsuario,
  DBUsuario,
} from "@/components/interfaces/dbTypes";
import CharacterSheet from "@/components/pages/UserCharacters/CharacterSheet/CharacterSheet";
import homeBackground from "@img/webp/bg-home-01.webp";
import ErrorPage from "@pages/ErrorPage/ErrorPage";
import Home from "@pages/Home";
import SystemGameElement from "@pages/SystemsGameList/SystemGameElement/SystemGameElement";
import SystemsGameList from "@pages/SystemsGameList/SystemsGameList";
import UserCharacters from "@pages/UserCharacters/UserCharacters";
import WorldMap from "@pages/WorldMap/WorldMap";
import BackgroundChanger from "@UI/Background/BackgroundChanger";
import BtnBackToTop from "@UI/Buttons/BtnBackToTop";
import Footer from "@UI/Footer/Footer";
import Navbar from "@UI/Navbar/Navbar";
import { getCharacter, getUser } from "./services/UserCharactersServices";

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

  const characters: DBPersonajesUsuario[] = await getCharacter(params.id);
  return {
    user,
    character: Boolean(characters?.length) ? characters[0] : undefined,
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
