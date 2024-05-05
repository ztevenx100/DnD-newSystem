import {createBrowserRouter, RouterProvider} from "react-router-dom";
import React, { useState } from 'react';

import homeBackground from './assets/img/webp/bg-home-01.webp';

import Navbar from './components/UI/Navbar/Navbar';
import Footer from './components/UI/Footer/Footer';
import BackgroundChanger from './components/UI/Background/BackgroundChanger';
import BtnBackToTop from './components/UI/Buttons/BtnBackToTop';
import Home from './components/pages/Home';
import CharacterSheet from './components/pages/CharacterSheet/CharacterSheet';
import UserCharacters from './components/pages/UserCharacters/UserCharacters';
import SystemsGameList from './components/pages/SystemsGameList/SystemsGameList';
import SystemGameElement from './components/pages/SystemsGameList/SystemGameElement/SystemGameElement';
import WorldMap from './components/pages/WorldMap/WorldMap';

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
          path: "/CharacterSheet/:user/:id?",
          element: <CharacterSheet changeBackground={changeBackground} />,
        },
        {
          path: "/UserCharacters",
          element: <UserCharacters />,
        },
        {
          path: "/SystemsGameList",
          element: <SystemsGameList />,
        },
        {
          path: "/SystemGameElement/:id",
          element: <SystemGameElement />,
        },
        {
          path: "/WorldMap",
          element: <WorldMap changeBackground={changeBackground} />,
        }
      ]
    },
  ]);

  return (
    <>
      <BackgroundChanger initialBackground={background} >
        <main className='container mx-auto bg-main' >
            <RouterProvider router={router} />
        </main>
        <BtnBackToTop/>
        <Footer />
      </BackgroundChanger>
    </>
  )
}

export default App;
