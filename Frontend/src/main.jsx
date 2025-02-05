import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider, Route, Link } from 'react-router-dom'
import LoginPage from './page/LoginPage.jsx'
import SignupPage from './page/SignupPage.jsx'
import Dashboard from './page/Dashboard.jsx'

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
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
