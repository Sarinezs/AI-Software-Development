import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { Gauge } from '@mui/x-charts/Gauge';
import { LineChart } from '@mui/x-charts/LineChart';


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
      <Gauge
        value={1}
        startAngle={0}
        endAngle={360}
        innerRadius="80%"
        outerRadius="100%"
        width={100}
        height={100}
      />
    </div>
  )
}

export default Dashboard