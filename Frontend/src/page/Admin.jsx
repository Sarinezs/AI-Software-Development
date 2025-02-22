import { useEffect } from 'react'
import axios from 'axios'

const Admin = () => {

    const test = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.get('http://localhost:8000/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const users = response.data.users
            console.log(users)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <h1>Admin</h1>
            <button onClick={test}>test</button>
        </div>
    )
}

export default Admin