import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import MT5_popup from '../components/MT5_popup'
import CloseIcon from '@mui/icons-material/Close';


const MT5_Robot = () => {

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

    const [Openpopup, Setopenpopup] = useState(false)


    return (
        <div>
            <Navbar />
            <h1>MT5_Robot</h1>
            <button onClick={() => { Setopenpopup(true) }}>click me</button>

            {
                Openpopup &&
                <div className="page">
                    <div className="page-content">
                        <CloseIcon className='close-btn' onClick={() => { Setopenpopup(false) }} />
                        <MT5_popup />
                    </div>

                </div>
            }

        </div>
    )
}

export default MT5_Robot