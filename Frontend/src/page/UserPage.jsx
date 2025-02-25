import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './UserPage.css';

const UserPage = () => {
    const [userdata, setUserdata] = useState({});
    const [isEditing, setIsEditing] = useState(false); // ✅ เพิ่ม state เช็คโหมดแก้ไข

    useEffect(() => {
        checktoken();
    }, []);

    const checktoken = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/signin';
            }
            const response = await axios.post('http://localhost:8000/auth/checkjwttoken', {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUserdata(response.data.user || {});
            // console.log(userdata)
        } catch (error) {
            alert("Unauthorized! Please login again.");
            localStorage.removeItem("token");
            window.location.href = "/signin";
        }
    };

    // ✅ ฟังก์ชันอัปเดตข้อมูลผู้ใช้
    const handleSave = async () => {
        try {
            let token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:8000/auth/update`, userdata, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 200) {
                token = response.data.token
                localStorage.setItem('token', token);
                alert("User updated successfully!");
                // console.log(response.data.token);
                setIsEditing(false); // ปิดโหมดแก้ไข
                // checktoken()
            }
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user.");
        }
    };

    return (
        <div>
            <Navbar className="user-nav" />
            <div className='user-box'>
                <div className="user-window">
                    <div className="user-content">
                        <h2>User ID</h2>
                        <TextField
                            disabled
                            value={userdata.user_id || ''}
                            style={{ width: '350px' }}
                        />
                        <h2>Name</h2>
                        <TextField
                            type="text"
                            name='username'
                            className="name"
                            value={userdata.username || ''}
                            onChange={e => setUserdata({ ...userdata, username: e.target.value })}
                            disabled={!isEditing} // ✅ ปิด input ถ้าไม่ได้แก้ไข
                        />
                        <h2>Email</h2>
                        <TextField
                            type="text"
                            name='email'
                            className="name"
                            value={userdata.email || ''}
                            onChange={e => setUserdata({ ...userdata, email: e.target.value })}
                            disabled={!isEditing} // ✅ ปิด input ถ้าไม่ได้แก้ไข
                        />
                    </div>
                    <div className="edit-btn">
                        {!isEditing ? (
                            <Button variant="contained" onClick={() => setIsEditing(true)}>Edit</Button>
                        ) : (
                            <Button variant="contained" color="success" onClick={handleSave}>Save</Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserPage;
