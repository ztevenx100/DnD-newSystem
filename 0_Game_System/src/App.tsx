import reactLogo from './assets/react.svg'

import { Home } from './components/pages/Home'
// import { useState } from 'react'

import "@unocss/reset/tailwind.css";
import "uno.css";
import './App.css'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
        <main className='container mx-auto' >
          <Home/>
        </main>
    </>
  )
}

export default App
