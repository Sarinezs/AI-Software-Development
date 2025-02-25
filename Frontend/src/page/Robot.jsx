import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
const Robot = () => {

  const [userdata, setUserdata] = useState({});

  useEffect(() => {
    checktoken()
  }, [])

  const checktoken = async () => {

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/signin';
      }
      const response = await axios.post('http://localhost:8000/auth/checkjwttoken', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setUserdata(response.data.user || {});
    } catch (error) {
      // console.log(error.response)
      alert("Unauthorized! Please login again.");
      localStorage.removeItem("token");
      window.location.href = "/signin";
    }
  }

  return (
    <div>
      <Navbar/>
      <h1>Robot Page</h1>
    </div>
  )
}

export default Robot