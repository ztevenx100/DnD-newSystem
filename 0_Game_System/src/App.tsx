import {createBrowserRouter, RouterProvider} from "react-router-dom";
import React, { createContext, useContext, useState } from 'react';

import homeBackground from './assets/img/jpg/bg-home-01.jpg';

import Navbar from './components/UI/Navbar/Navbar';
import Footer from './components/UI/Footer/Footer';
import Home from './components/pages/Home'
import CharacterSheet from './components/pages/CharacterSheet/CharacterSheet'

import "@unocss/reset/tailwind.css";
import "uno.css";
import './App.css'

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
        path: "/CharacterSheet",
        element: <CharacterSheet />,
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
            <Footer />
        </main>
      </aside>
    </BackgroundContext.Provider>
  )
}

export default App
