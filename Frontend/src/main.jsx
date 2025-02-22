import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider, Route, Link } from 'react-router-dom'
import LoginPage from './page/LoginPage.jsx'
import SignupPage from './page/SignupPage.jsx'
import Dashboard from './page/Dashboard.jsx'
import Robot from './page/Robot.jsx'
import MT5_Robot from './page/MT5_Robot.jsx'
import Admin from './page/Admin.jsx'
import UserPage from './page/UserPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <SignupPage />
  },
  {
    path: '/signin',
    element: <LoginPage />
  },
  {
    path: '/Dashboard',
    element: <Dashboard />
  },
  {
    path: '/Robot',
    element: <Robot />
  },
  {
    path: '/MT5_Robot',
    element: <MT5_Robot />
  },
  {
    path: '/Admin',
    element: <Admin />
  },
  {
    path: '/User',
    element: <UserPage />
  },
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
