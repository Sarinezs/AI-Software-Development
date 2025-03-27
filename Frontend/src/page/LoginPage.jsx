import React, { useState, useEffect } from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login'
import { Link, useNavigate } from 'react-router-dom'
import { gapi } from 'gapi-script'
import axios from 'axios'
import './LoginPage.css'

const LoginPage = () => {

    const clientId = "11247620455-hdn7a4bois1qleisef5aaobjaq9ijd2v.apps.googleusercontent.com"
    const [profile, setProfile] = useState(null)
    const [userdata, setUserdata] = useState({
        email: '',
        password: '',
    })

    const navigate = useNavigate()

    const signinhandlechange = (event) => {
        setUserdata(prevstate => ({
            ...prevstate,
            [event.target.name]: event.target.value
        }))
        // console.log(userdata)
    }

    useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                clientId: clientId,
                scope: ''
            })
        }
        gapi.load("client:auth2", initClient)
    }, [])

    const gg_Login = async (res) => {
        setProfile(res.profileObj)
        setUserdata(prevstate => ({
            ...prevstate,
            username: res.profileObj.name,
            email: res.profileObj.email,
        }))
        const payload = {
            username: res.profileObj.name,
            email: res.profileObj.email,
            password: userdata.password,
            confirm_password: userdata.password // ใช้ password จาก state
        };
        try {
            await axios.post("http://localhost:8000/auth/register", payload).then(async () => {
                const list = await axios.post("http://localhost:8000/auth/login", {
                    email: payload.email,
                    password: payload.password,
                })
                const role = list.data.role
                if (role === "user") {
                    localStorage.setItem('token', list.data.token)
                    navigate('/Dashboard')
                }

            })
        } catch (error) {
            console.error('Error during registration:', error.message);
        }
    }

    const logIn = async () => {
        try {
            if (!userdata.password) { // กรณีไม่ใส่รหัสผ่าน
                console.log("can't login")
                alert("email and password are required")
                return
            }
            else {

                const list = await axios.post("http://localhost:8000/auth/login", {
                    email: userdata.email,
                    password: userdata.password,
                })
                const role = list.data.role
                if (role === "admin") {
                    localStorage.setItem('token', list.data.token)
                    navigate('/Admin')
                    return
                }
                localStorage.setItem('token', list.data.token)
                navigate('/Dashboard')
            }


        } catch (error) {
            alert("wrong email or password")
        }
    }


    return (
        <div className='signin-main'>
            <div className='signin-box'>
                <h1 className='signin-title'>Sign In</h1>
                <input className='signin-input' onChange={signinhandlechange} name='email' type="text" placeholder='Email' />
                <input className='signin-input' onChange={signinhandlechange} name='password' type="password" placeholder='Password' />
                <button className='signin-btn' onClick={logIn}>Sign In</button>
                <p className='signin-separate1'>Don't have an account? <Link to="/">Sign Up</Link></p>
                <div className='signin-separate2'>
                    <hr />
                    <p>or</p>
                </div>
                <div className='signin-google'>
                    <GoogleLogin
                        clientId={clientId}
                        onSuccess={gg_Login}
                        cookiePolicy={'single_host_origin'}
                        render={renderProps => (
                            <>

                                <button
                                    onClick={renderProps.onClick}
                                    disabled={renderProps.disabled}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '350px',
                                        height: '50px',
                                        fontSize: '16px',
                                        backgroundColor: '#FFFFFF',
                                        color: '#222831',
                                        border: '#222831 solid 1px',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}>
                                    <img className='g-logo-img' src="google_logo.png" alt="" />
                                    Sign In With Google
                                </button>
                            </>
                        )}
                    />
                </div>
            </div>
        </div>
    )
}

export default LoginPage