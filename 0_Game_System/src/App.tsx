import "@unocss/reset/tailwind.css";
import "uno.css";
import "./App.css";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { DBUsuario } from "@/components/interfaces/dbTypes";
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

function getUser(): Promise<DBUsuario> {
  // const user = '43c29fa1-d02c-4da5-90ea-51f451ed8951';

  // return '43c29fa1-d02c-4da5-90ea-51f451ed8952';

  return Promise.resolve({
    usu_id: "43c29fa1-d02c-4da5-90ea-51f451ed8952",
    usu_nombre: "Pablo",
  });
}

const userLoader = async () => {
  const user = await getUser();

  return user;
};

const App = () => {
  // const [count, setCount] = useState(0)
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
          id: "CharacterSheet",
          path: "/CharacterSheet/:id?",
          element: <CharacterSheet changeBackground={changeBackground} />,
          loader: userLoader,
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
    <>
      <BackgroundChanger initialBackground={background}>
        <main className="container mx-auto bg-main">
          <Suspense>
            <RouterProvider router={router} />
          </Suspense>
        </main>
        <BtnBackToTop />
        <Footer />
      </BackgroundChanger>
    </>
  );
};

export default App;
