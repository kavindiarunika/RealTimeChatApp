import React from 'react'
import { Routes ,Route } from 'react-router-dom'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import {Toaster} from 'react-hot-toast';

function App() {
  return (
    <div className=' bg-[url("./src/assets/bgImage.svg")] bg-contain'>
      
      <Toaster/>
      <Routes>
        <Route path ='/' element={<Home/>} />
        <Route path  ='/login' element ={<LoginPage/>} />
        <Route path  ='/profile' element ={<ProfilePage/>} />
        </Routes>
      
    </div>
  )
}

export default App
