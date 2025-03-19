import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import './Admin.css'


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
            <div className="admin-body">
                <div class="box box1">
                    <h2>Users</h2>
                </div>
                <div class="box box2">
                    <h2>Income</h2>
                </div>
            </div>
        </div>
    )
}

export default Admin