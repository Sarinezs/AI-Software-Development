import React, { useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'

const UserPage = () => {

    useEffect(() => {
        checktoken()
    }, [])

    const checktoken = async () => {

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/signin';
            }
            await axios.post('http://localhost:8000/auth/checkjwttoken', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

        } catch (error) {
            // console.log(error.response)
            alert("Unauthorized! Please login again.");
            localStorage.removeItem("token");
            window.location.href = "/signin";
        }
    }

    return (
        <div>
            <Navbar />
            <h1>UserPage</h1>
        </div>
    )
}

export default UserPage