import { useState, useEffect } from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login'
import { Link, useNavigate } from 'react-router-dom'
import { gapi } from 'gapi-script'
import axios from 'axios'
import './SignupPage.css'

const SignupPage = () => {

    const clientId = "11247620455-hdn7a4bois1qleisef5aaobjaq9ijd2v.apps.googleusercontent.com"
    const [profile, setProfile] = useState(null)
    const [userdata, setUserdata] = useState({
        username: '',
        email: '',
        password: '',
        confirm_password: '',
    })

    const navigate = useNavigate()

    useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                clientId: clientId,
                scope: ''
            })
        }
        gapi.load("client:auth2", initClient)
    }, [])

    const signuphandlechange = (event) => {
        setUserdata(prevstate => ({
            ...prevstate,
            [event.target.name]: event.target.value
        }))
        // console.log(userdata)
    }

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

    const Signup = async (res) => {
        try {
            function is_email(email) {
                const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return pattern.test(email);
            }
            if (is_email(userdata.email)) {
                if (userdata.password === userdata.confirm_password) {
                    await axios.post("http://localhost:8000/auth/register", userdata).then((res) => {
                        if (res.data.message !== 'email already exists') {
                            alert("Registration Successful")
                            navigate('/signin')
                        }
                        else {
                            alert(res.data.message)
                        }
                    })
                }
                else {
                    alert("Passwords do not match")
                }
            }
            else {
                alert("Invalid email address")
            }
        } catch (error) {
            console.error('Error during registration:', error.message);
        }
    }

    return (
        <div className='signup-main'>
            <div className='signup-box'>
                <h1 className='signup-title'>Sign Up</h1>
                <input className='signup-input' onChange={signuphandlechange} name='username' type="text" placeholder='Username' />
                <input className='signup-input' onChange={signuphandlechange} name='email' type="text" placeholder='Email' />
                <input className='signup-input' onChange={signuphandlechange} name='password' type="password" placeholder='Password' />
                <input className='signup-input' onChange={signuphandlechange} name='confirm_password' type="password" placeholder='Confirm Password' />
                <button className='signup-btn' onClick={Signup}>Sign Up</button>
                <p className='signup-separate1'>Already have an account? <Link to="/signin">Sign In</Link></p>
                <div className='signup-separate2'>
                    <hr />
                    <p>or</p>
                </div>
                <div className='signup-google'>
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

export default SignupPage