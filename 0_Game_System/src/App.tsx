import reactLogo from './assets/react.svg'
import {createBrowserRouter, RouterProvider} from "react-router-dom";

import Navbar from './components/UI/Navbar/Navbar';
import Footer from './components/UI/Footer/Footer';
import Home from './components/pages/Home'
import CharacterSheet from './components/pages/CharacterSheet/CharacterSheet'
// import { useState } from 'react'

import "@unocss/reset/tailwind.css";
import "uno.css";
import './App.css'

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

  return (
    <main className='container mx-auto' >
        <RouterProvider router={router} />
        <Footer />
    </main>
  )
}

export default App
