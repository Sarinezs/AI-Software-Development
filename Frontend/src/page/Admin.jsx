import { useEffect } from 'react'
import axios from 'axios'
import { extendTheme, styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid2';
import Sidebar from '../components/Sidebar';
import './Admin.css'
import Navbar from '../components/Navbar';

const Admin = () => {


    const test = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.get('http://localhost:8000/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const users = response.data.users
            console.log(users)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className='admin-grid'>
            <div className="admin-sidebar">
                {/* <Sidebar /> */}
                <Navbar />
            </div>
            <div className="admin-body">
                <h1>test</h1>
            </div>
        </div>
    )
}

export default Admin