import { useState, useEffect } from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login'
import { gapi } from 'gapi-script'
import axios from 'axios'

const LoginPage = () => {

    const clientId = "11247620455-hdn7a4bois1qleisef5aaobjaq9ijd2v.apps.googleusercontent.com"
	const [profile, setProfile] = useState(null)
	const [userdata, setUserdata] = useState({
		username: '',
		email: '',
		password: '',
	})

	useEffect(() => {
		const initClient = () => {
			gapi.client.init({
				clientId: clientId,
				scope: ''
			})
		}
		gapi.load("client:auth2", initClient)
	}, [])

	const onsuccess = async (res) => {
		setProfile(res.profileObj)
		setUserdata(prevstate => ({
			...prevstate,
			username: res.profileObj.name,
			email: res.profileObj.email,
		}))
		const payload = {
			username: res.profileObj.name,
			email: res.profileObj.email,
			password: userdata.password, // ใช้ password จาก state
		};
		try {
			const list = await axios.post("http://localhost:8000/register", payload);
			console.log('success', list);
		} catch (error) {
			console.error('Error during registration:', error);
		}
	}

	const onfailure = (res) => {
		console.log('failed', res)
	}

	const fetchUsers = async () => {
		try {
			const authtoken = localStorage.getItem('token')
			const response = await axios.get('http://localhost:8000/user', {
				headers: {
					'authorization': `Bearer ${authtoken}`
				}
			});
			console.log(response.data.users[4].email); // อัปเดต state users ด้วยข้อมูลที่ได้จาก API
		} catch (err) {
			console.error('Error fetching users:', err);
		}
	};

	const logIn = async () => {
		try {
			
			const list = await axios.post("http://localhost:8000/login", {
				email: "arm50@mail.com",
                password: "12345",
			});
			localStorage.setItem('token', list.data.token)
			console.log('success', list);
		} catch (error) {
			console.error('Error during registration:', error);
		}
	}

	const logOut = () => {
		setProfile(null)
	}


  return (
    <div>
        
    </div>
  )
}

export default LoginPage