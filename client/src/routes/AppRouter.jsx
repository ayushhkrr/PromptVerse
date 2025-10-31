import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Landing from '../pages/Landing'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import LoginSuccess from '../pages/LoginSuccess'
import MyPrompts from '../pages/MyPrompts'
import MyPurchases from '../pages/MyPurchases'
import AdminDashboard from '../pages/AdminDashboard'

function AppRouter(){
    return(
        <BrowserRouter>
        <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login-success" element={<LoginSuccess />} />
        <Route path="/my-prompts" element={<MyPrompts />} />
        <Route path="/my-purchases" element={<MyPurchases />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
        </BrowserRouter>
    )
}

export default AppRouter