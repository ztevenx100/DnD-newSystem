import {createBrowserRouter, RouterProvider} from "react-router-dom";
import React, { createContext, useContext, useState } from 'react';

import homeBackground from './assets/img/jpg/bg-home-01.jpg';

import Navbar from './components/UI/Navbar/Navbar';
import Footer from './components/UI/Footer/Footer';
import BtnBackToTop from './components/UI/Buttons/BtnBackToTop';
import Home from './components/pages/Home';
import CharacterSheet from './components/pages/CharacterSheet/CharacterSheet';
import UserCharacters from './components/pages/UserCharacters/UserCharacters';
import SystemsGameList from './components/pages/SystemsGameList/SystemsGameList';
import SystemGameElement from './components/pages/SystemsGameList/SystemGameElement/SystemGameElement';

import "@unocss/reset/tailwind.css";
import "uno.css";
import './App.css'

// Cargar imagen de fondo

interface BackgroundContextType {
  backgroundImage: string;
  setBackgroundImage: React.Dispatch<React.SetStateAction<string>>;
}

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error('useBackground debe ser utilizado dentro de un BackgroundProvider');
  }
  return context;
};

export const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />,
    children:[
      { index: true, element: <Home /> },
      {
        path: "/CharacterSheet/:user/:id?",
        element: <CharacterSheet />,
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
      }
    ]
  },
]);

function App() {
  // const [count, setCount] = useState(0)
  const [backgroundImage, setBackgroundImage] = useState(homeBackground);

  return (
    <BackgroundContext.Provider value={{backgroundImage, setBackgroundImage }}>
      <aside className="bg-base" style={{ backgroundImage: `url(${backgroundImage})`}} >
        <main className='container mx-auto bg-main' >
            <RouterProvider router={router} />
        </main>
        <BtnBackToTop/>
        <Footer />
      </aside>
    </BackgroundContext.Provider>
  )
}

export default App
