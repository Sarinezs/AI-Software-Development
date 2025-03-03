import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
const Robot = () => {

	const [userdata, setUserdata] = useState({});

	useEffect(() => {
		checktoken()
		getmodelname()
		getnullmt5account()
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

	const [model_name, setModel_name] = useState([]);
	const [mt5account, setMt5account] = useState([]);
	const [selectedValues, setSelectedValues] = useState({});

	const connectmodel = async () => {
		try {
			const token = localStorage.getItem('token');
			const response = await axios.post('http://localhost:8000/model/connectModel', selectedValues, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
			console.log(response.data.result)
			getnullmt5account()
		} catch (error) {
			console.log(error.response)
		}
	}

	const getmodelname = async () => {
		try {
			const token = localStorage.getItem('token');
			const response = await axios.get('http://localhost:8000/model/getModelname', {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
			console.log(response.data.result)
			setModel_name(response.data.result)
		} catch (error) {
			console.log(error.response)
		}
	}

	const getnullmt5account = async (req, res) => {
		const token = localStorage.getItem('token');
		const response = await axios.get('http://localhost:8000/MT5/getnullmodelaccount', {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		})
		// console.log(response.data.results)
		setMt5account(response.data.results)
	}


	const handleChange = (id, event) => {
		setSelectedValues(prev => ({
			...prev,
			"token": event.target.value,
			"model_id": 1
		}));
	};



	return (
		<div>
			<Navbar />
			<div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
				<div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
					<h1>EURUSD</h1>
					<Box sx={{ maxWidth: 120 }}>
						<FormControl fullWidth>
							<InputLabel>เลือกค่า</InputLabel>
							<Select
								label="เลือกค่า"
								defaultValue={"qqq"}
								onChange={(event) => handleChange("token", event)}
							>
								{mt5account.map((option) => ( // ✅ วนลูปสร้าง MenuItem
									<MenuItem value={option.token}>
										{option.mt5_accountid}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>
				</div>

			</div>
			<button onClick={connectmodel}>connect</button>
		</div>
	)
}

export default Robot