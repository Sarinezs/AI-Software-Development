import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ username }) => {
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
        <div className='navbar'>
            <div className='nav-logo'>
                <img src="/Logo.png" alt="TradeX Logo" />
                <h2>TradeX</h2>
            </div>
            <div className='nav-menu'>
                <ul>
                    <Link to="/Dashboard">Dashboard</Link>
                    <Link to="/Robot">Robots</Link>
                    {/* <Link to="/MT5_Robot">MT5 Robots</Link> */}
                    <Link>Commission</Link>
                </ul>
            </div>
            <div className='nav-user'>

                <span className="username">{username}</span>
                <img src="/user_icon.png" alt="User" className="user-icon" onClick={toggleDropdown} />

                {isOpen && (
                    <div className="dropdown-menu">
                        <Link to="/User" className="dropdown-item">Profile</Link>
                        <button className="dropdown-item signout-btn" onClick={handleSignOut}>Sign Out</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
