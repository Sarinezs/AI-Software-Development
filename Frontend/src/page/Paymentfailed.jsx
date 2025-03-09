import React from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom';

const Paymentfailed = () => {
  return (
    <div>
        <Navbar />
        <h1>Payment Failed</h1>
        <p>Your payment has failed. Please try again.
          <Link to="/Commission">Go back to Commission</Link>
        </p>
  
    </div>
  )
}

export default Paymentfailed