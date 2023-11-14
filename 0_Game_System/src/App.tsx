import reactLogo from './assets/react.svg'

import { CharacterSheet } from './components/pages/CharacterSheet/CharacterSheet'
// import { useState } from 'react'

import "@unocss/reset/tailwind.css";
import "uno.css";
import './App.css'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
        <main className='container mx-auto' >
          <CharacterSheet/>
        </main>
    </>
  )
}

export default App
