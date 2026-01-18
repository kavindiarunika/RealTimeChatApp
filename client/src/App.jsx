import React from 'react'
import { Routes ,Route } from 'react-router-dom'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
function App() {
  return (
    <div className=' bg-[url("./src/assets/bgImage.svg")] bg-contain'>
      <Routes>
        <Route path ='/' element={<Home/>} />
        <Route path  ='/login' element ={<LoginPage/>} />
        <Route path  ='/profile' element ={<ProfilePage/>} />
        </Routes>
      
    </div>
  )
}

export default App
