import React from 'react'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Login from '../screens/Login'
import Register from '../screens/Register'
import Home from '../screens/Home'
import Project from '../screens/Project'
import UserAuth from '../auth/UserAuth'
import MyGD from '../screens/MyGD'

import AuthLayout from '../Layout/AuthLayout'

const AppRoutes = () => {
    return (
        <BrowserRouter>

            <Routes>
                <Route element={<AuthLayout/>} >
                <Route path="/" element={ <Home /> } />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/MyGD" element={<UserAuth><MyGD /></UserAuth>} />
                <Route path="*" element={<div>Page not found</div>} />
                </Route>
                <Route path="/project" element={<UserAuth><Project /></UserAuth>} />
            </Routes>

        </BrowserRouter>
    )
}

export default AppRoutes