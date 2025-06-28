import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './components/Home'
import Trending from './components/Trending'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Watch    from './components/Watch';
import Search from './components/Search'
import History from './components/History'

function App() {
  const [count, setCount] = useState(0)

  return (
<BrowserRouter>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/trending"  element={<Trending />} />
         <Route path="/watch/:id" element={<Watch />} />   {/* ← THIS LINE FIXES THE ERROR */}
         <Route path='/search'    element={<Search/>}/>
         <Route path='/history'  element={<History/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
