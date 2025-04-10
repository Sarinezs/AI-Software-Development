import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
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
			// setUserdata(response.data.user || {});
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
			setModel_name(response.data.result)
			console.log(model_name)
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
		console.log(id, event.target.value);
		setSelectedValues(prev => ({
			...prev,
			[id]: event.target.value,
		}));
	};

	return (
		<div>
			<Navbar />
			<div style={{ display: "flex", flexWrap: "wrap", gap: "20px", margin: "5% 0 0 8%" }}>
				<div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
					<h1>Select Model</h1>
					<br />
					<Box sx={{ maxWidth: 120 }}>
						<FormControl fullWidth>
							<InputLabel>Symbol</InputLabel>
							<Select
								label="เลือกค่า"
								defaultValue={"qqq"}
								onChange={(event) => handleChange("model_id", event)}
							>
								{model_name?.length > 0 &&
									model_name.map((option) => (
										<MenuItem key={option.model_id} value={option.model_id}>
											{option.model_name}
										</MenuItem>
									))}
							</Select>
						</FormControl>
					</Box>
					<br />
					<Box sx={{ maxWidth: 120 }}>
						<FormControl fullWidth>
							<InputLabel>Account</InputLabel>
							<Select
								label="เลือกค่า"
								defaultValue={"qqq"}
								onChange={(event) => handleChange("token", event)}
							>
								{mt5account?.length > 0 &&
									mt5account.map((option) => ( // ✅ วนลูปสร้าง MenuItem
										<MenuItem value={option.token}>
											{option.mt5_accountid}
										</MenuItem>
									))}
							</Select>
						</FormControl>
					</Box>
				</div>

			</div>
			<Button style={{ margin: "1% 0 0 8%" }} variant="contained" onClick={connectmodel}>connect</Button>
		</div>
	)
}

export default Robot