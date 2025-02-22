import React, {useEffect} from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'

const Dashboard = () => {

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
      console.log(error)
      alert("Unauthorized! Please login again.");
      localStorage.removeItem("token");
      window.location.href = "/signin";
    }
  }

  return (

    <div>
      <Navbar />
      <h1>Dashboard page</h1>
    </div>
  )
}

export default Dashboard