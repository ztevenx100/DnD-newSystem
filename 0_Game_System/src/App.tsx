import {createBrowserRouter, RouterProvider} from "react-router-dom";
import React, { Suspense, useState } from 'react';

import homeBackground from '@img/webp/bg-home-01.webp';

import Navbar from '@UI/Navbar/Navbar';
import Footer from '@UI/Footer/Footer';
import BackgroundChanger from '@UI/Background/BackgroundChanger';
import BtnBackToTop from '@UI/Buttons/BtnBackToTop';
import Home from '@pages/Home';
import CharacterSheet from '@/components/pages/UserCharacters/CharacterSheet/CharacterSheet';
import UserCharacters from '@pages/UserCharacters/UserCharacters';
import SystemsGameList from '@pages/SystemsGameList/SystemsGameList';
import SystemGameElement from '@pages/SystemsGameList/SystemGameElement/SystemGameElement';
import WorldMap from '@pages/WorldMap/WorldMap';
import ErrorPage from '@pages/ErrorPage/ErrorPage';

import "@unocss/reset/tailwind.css";
import "uno.css";
import './App.css';

const App: React.FC = () => {
  // const [count, setCount] = useState(0)
  const [background, setBackground] = useState(homeBackground);

  const changeBackground = (newBackground: string) => {
    setBackground(newBackground);
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navbar />,
      children:[
        { index: true, element: <Home changeBackground={changeBackground} /> },
        {
          id: "CharacterSheet",
          path: "/CharacterSheet/:user/:id?",
          element: <CharacterSheet changeBackground={changeBackground} />,
        },
        {
          id: "UserCharacters",
          path: "/UserCharacters",
          element: <UserCharacters />,
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
          element: <ErrorPage/>,
        }
      ]
    },
  ]);

  return (
    <>
      <BackgroundChanger initialBackground={background} >
        <main className='container mx-auto bg-main' >
          <Suspense>
            <RouterProvider router={router} />
          </Suspense>
        </main>
        <BtnBackToTop/>
        <Footer />
      </BackgroundChanger>
    </>
  )
}

export default App;
