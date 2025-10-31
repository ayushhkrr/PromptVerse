import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Landing from '../pages/Landing'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import LoginSuccess from '../pages/LoginSuccess'

function AppRouter(){
    return(
        <BrowserRouter>
        <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login-success" element={<LoginSuccess />} />
      </Routes>
        </BrowserRouter>
    )
}

export default AppRouter