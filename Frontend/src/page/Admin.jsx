import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { LineChart } from '@mui/x-charts/LineChart';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PaidIcon from '@mui/icons-material/Paid';
import axios from 'axios'
import './Admin.css'


const Admin = () => {

    const [users, setUsers] = useState(0);
    const [income, setIncome] = useState(0);

    useEffect(() => {
        getUsers()
        getIncome()
    })

    const getUsers = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.get('http://localhost:8000/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setUsers(response.data.users)
            // console.log(response.data.users)
        } catch (error) {
            console.error(error)
        }
    }

    const getIncome = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.get('http://localhost:8000/createbill/getincome', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setIncome(response.data.income)
            // console.log(response.data.income)
        } catch (error) {
            console.error(error)
        }
    }


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

    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // ✅ ฟังก์ชัน Sign Out
    const handleSignOut = () => {
        localStorage.removeItem('token');  // ลบ token
        navigate('/signin'); // กลับไปหน้า Login
    };

    return (
        <div className='admin-grid'>
            <div className="admin-sidebar">
                <div className='admin-user'>
                    <img src="/user_icon.png" alt="User" className="admin-icon" onClick={toggleDropdown} />
                    {isOpen && (
                        <div className="admin-dropdown-menu">
                            <button className="admin-dropdown-item signout-btn" onClick={handleSignOut}>Sign Out</button>
                        </div>
                    )}
                </div>
                <div className="admin-menu">

                    <ul>
                        <li>Dashboard</li>
                    </ul>
                </div>
            </div>
            <div className="admin-bg">
                <div className='admin-grid-header'>
                    <h1>Dashboard</h1>
                </div>
                <div className="admin-body">
                    <div className="box box1">
                        <div className="box-l">
                            <PeopleAltIcon fontSize="large" />
                        </div>
                        <div className="box-r">
                            <h2>{users}</h2>
                            <h4>Users</h4>
                        </div>

                    </div>
                    <div className="box box2">
                        <div className="box-l">
                            <PaidIcon fontSize="large" />
                        </div>
                        <div className="box-r">
                            <h2>{income}</h2>
                            <h4>Income</h4>
                        </div>

                    </div>
                    <div className='graph'>
                        <h2>Graph</h2>
                        <LineChart
                            xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }]}
                            series={[
                                {
                                    data: [2, 3, 5.5, 8.5, 1.5, 5, 1, 4, 3, 8],
                                    showMark: ({ index }) => index % 2 === 0,
                                },
                            ]}
                            width={1000}
                            height={350}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Admin