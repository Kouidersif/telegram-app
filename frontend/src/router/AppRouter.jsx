import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { IsAuthenticated } from './Permissions'

const Home = React.lazy(() => import('../pages/home/Home'))
const Login = React.lazy(() => import('../pages/login/Login'))
const Register = React.lazy(() => import('../pages/register/Register'))
const ConnectTelegram = React.lazy(() => import('../pages/telegram/ConnectTelegram'))

const AppRouter = () => {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
                <Route element={<IsAuthenticated />} >
                <Route element={<AppLayout />} >
                    <Route path="/" element={<Home />} />
                    <Route path="/tg-connect" element={<ConnectTelegram />} />
                </Route>
                </Route>
            </Routes>
        </React.Suspense>
    )
}

export default AppRouter