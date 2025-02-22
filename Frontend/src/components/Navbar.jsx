import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {


  return (
    <div className='navbar'>
        <div className='nav-logo'>
            <img src="/Logo.png"/>
            <h2>TradeX</h2>
        </div>
        <div className='nav-menu'>
            <ul>
                <Link to="/Dashboard">Dashboard</Link>
                <Link to="/Robot">Robots</Link>
                <Link to="/MT5_Robot">MT5 Robots</Link>
                <Link>Commission</Link>
            </ul>
        </div>
        <div className='nav-user'>
            <Link to={"/User"}><img src="/user_icon.png"/></Link>
            
        </div>
    </div>
  )
}

export default Navbar