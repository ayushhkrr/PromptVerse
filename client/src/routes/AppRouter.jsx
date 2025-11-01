import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Landing from '../pages/Landing'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import LoginSuccess from '../pages/LoginSuccess'
import LoginFailed from '../pages/LoginFailed'
import MyPrompts from '../pages/MyPrompts'
import MyPurchases from '../pages/MyPurchases'
import AdminDashboard from '../pages/AdminDashboard'
import CreatePrompt from '../pages/CreatePrompt'
import BecomeSeller from '../pages/BecomeSeller'
import PromptDetail from '../pages/PromptDetail'
import PaymentSuccess from '../pages/PaymentSuccess'
import PaymentCancel from '../pages/PaymentCancel'

function AppRouter(){
    return(
        <BrowserRouter>
        <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login-success" element={<LoginSuccess />} />
        <Route path="/login-failed" element={<LoginFailed />} />
        <Route path="/my-prompts" element={<MyPrompts />} />
        <Route path="/my-purchases" element={<MyPurchases />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/create-prompt" element={<CreatePrompt />} />
        <Route path="/become-seller" element={<BecomeSeller />} />
        <Route path="/prompt/:id" element={<PromptDetail />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
      </Routes>
        </BrowserRouter>
    )
}

export default AppRouter