import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { Gauge } from '@mui/x-charts/Gauge';
import { LineChart } from '@mui/x-charts/LineChart';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import './Dashboard.css'

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};


import axios from 'axios'

const Dashboard = () => {
	const columns = [
		{ id: 'mt5_accountid', label: 'mt5_accountid', minWidth: 100 },
		{ id: 'name', label: 'name', minWidth: 100 },
		{ id: 'token', label: 'token', minWidth: 100 },
		{ id: 'symbol', label: 'symbol', minWidth: 100 },
		{ id: 'status', label: 'status', minWidth: 100 },
		{
			id: 'balance',
			label: 'balance',
			minWidth: 100,
			// align: 'right',
			format: (value) => value.toFixed(2),
		},
		{ id: 'actions', label: 'actions', minWidth: 100 },

	];

	function createData(mt5_accountid, name, token, symbol, status, balance) {
		return { mt5_accountid, name, token, symbol, status, balance };
	}

	const [rows, setRows] = useState([]);

	const fetchModelName = async (modelId) => {
		if (!modelId) return 'No model'; // ถ้า model_id เป็น null หรือ undefined
		try {
			const response = await axios.get(`http://localhost:8000/model/getModelname/${modelId}`);
			// console.log(response.data.result)
			return response.data.result || 'no model'; // ถ้าไม่มีข้อมูลให้ใช้ "Unknown model"
		} catch (error) {
			console.error("Error fetching model name:", error);
			return 'no model';
		}
	};

	const getmt5account = async (req, res) => {
		try {
			const token = localStorage.getItem('token');
			const response = await axios.get('http://localhost:8000/MT5/getaccount', {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});

			// ✅ แปลงข้อมูล API เป็น rows
			const accountData = await Promise.all(
				response.data.results.map(async (acc) => {
					let balance = acc.balance !== 0 ? acc.balance : 0;
					let modelName = await fetchModelName(acc.model_id); // Query หา model_name

					return createData(acc.mt5_accountid, acc.name, acc.token, modelName, acc.status, balance);
				})
			);

			setRows(accountData);
			// console.log(rows.length);

		} catch (error) {
			console.log("Error fetching MT5 accounts:", error);
		}
	}




	const [userdata, setUserdata] = useState({});

	useEffect(() => {
		checktoken()
		getmt5account()
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
			console.log(error)
			alert("Unauthorized! Please login again.");
			localStorage.removeItem("token");
			window.location.href = "/signin";
		}
	}

	const [Openpopup, Setopenpopup] = useState(false)


	const [gentoken, setGentoken] = useState(null)
	const [form, setForm] = useState({
		mt5id: '',
		mt5name: '',
		token: ''
	})

	var rand = function () {
		return Math.random().toString(36).substr(2);
	};

	const copytext = function () {
		var Text = document.getElementById("apitoken");
		navigator.clipboard.writeText(Text.value);
	}

	const createtoken = async () => {
		setGentoken(rand() + rand() + rand())
	};

	const handleClosePopup = () => {
		setOpen(false)
		setGentoken(null)
		setForm({
			mt5id: '',
			mt5name: '',
			token: ''
		})
		setOpen(false)
	}

	const handleChange = (e) => {
		// console.log(e.target.name, e.target.value)
		setForm({
			...form,
			[e.target.name]: e.target.value
		})
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			if (form.mt5id === '' || form.mt5name === "") {
				alert("Please enter MT5 id and name")
				return;
			}
			const acc = await axios.post('http://localhost:8000/MT5/create', {
				mt5id: form.mt5id,
				mt5name: form.mt5name,
				token: gentoken
			}, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`
				}
			})
			handleClosePopup()
			getmt5account()
			// console.log("create mt5 success", gentoken)
		} catch (error) {
			console.log("create mt5 error")
		}
	}

	const handleDelete = async (mt5_accountid, mt5token) => {
		try {
			const token = localStorage.getItem('token');
			const accountdata = {
				mt5id: mt5_accountid,
				token: mt5token,
			}
			const response = await axios.delete('http://localhost:8000/MT5/deleteaccount', {
				headers: {
					'Authorization': `Bearer ${token}`
				},
				data: accountdata
			});
			getmt5account()

		} catch (error) {
			console.log("delete MT5 accounts:", error);
		}
	};

	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	// model ยืนยันการลบ
	const [modalopen, setmodalOpen] = useState(false);
	const [selectedAccount, setSelectedAccount] = useState(null);

	const handleOpenModal = (accountId, token) => {
		setSelectedAccount({ accountId, token });
		setmodalOpen(true);
	};

	const handleCloseModal = () => {
		setmodalOpen(false);
		setSelectedAccount(null);
	};

	const confirmDelete = () => {
		if (selectedAccount) {
			handleDelete(selectedAccount.accountId, selectedAccount.token);
		}
		handleCloseModal();
	};

	return (

		<div>
			<Navbar />
			<div className='grid-container'>
				<div className='item1'>
					<div className='mt5-btn'>
						{/* <Button onClick={handleOpen}>Add MT5 Account</Button> */}
						<Button variant="contained" style={{ backgroundColor: "#fff", color: "#000" }} onClick={handleOpen}>Add MT5 Account</Button>
						<Modal
							aria-labelledby="transition-modal-title"
							aria-describedby="transition-modal-description"
							open={open}
							onClose={handleClose}
							closeAfterTransition
							slots={{ backdrop: Backdrop }}
							slotProps={{
								backdrop: {
									timeout: 500,
								},
							}}
						>
							<Fade in={open}>
								<Box sx={style}>
									<Typography id="transition-modal-title" variant="h6" component="h2">
										Text in a modal
									</Typography>
									<Typography id="transition-modal-description" sx={{ mt: 2 }}>
										<div className="page">
											<div className="page-window">
												<div className='page-content'>
													<div className='page-content-header'>
														<h2>Add MT5 Account</h2>
														<CloseIcon className='close-btn' onClick={handleClosePopup} />
													</div>
													<div className="page-content-body">
														{/* <input type="text" onChange={e => handleChange(e)} placeholder='mt5_id' name='mt5id' className="mt5id" /> */}
														<TextField
															label="mt5_id"
															type="text"
															onChange={e => handleChange(e)}
															name='mt5id'
															className="mt5id"
														/>
														<br /><br />

														{/* <input type="text" onChange={e => handleChange(e)} placeholder='name' name='mt5name' className="name" /> */}
														<TextField
															label="mt5name"
															type="text"
															onChange={e => handleChange(e)}
															name='mt5name'
															className="name"
														/>
														<br /><br />
														{gentoken === null ? (
															<div>
																<br /><br />
																<Button variant="contained" onClick={createtoken}>generate token</Button>
															</div>) :
															<div>
																<h3>Token</h3>
																<br /><br />
																{/* <input type="text" value={gentoken} className="token" name='token' id='apitoken' disabled /> */}
																<TextField
																	disabled
																	id="apitoken"
																	defaultValue={gentoken}
																	style={{ width: '350px' }}
																/>
																<br /><br />

																<Button variant='contained' onClick={copytext}>Copy text</Button>
																<Button variant='contained' onClick={handleSubmit}>create</Button>
															</div>}
													</div>

												</div>

											</div>

										</div>
									</Typography>
								</Box>
							</Fade>
						</Modal>
					</div>
					{/* // ตาราง mt5 account */}
					<div className='mt5-table'>
						<h1>MT5 Account</h1>
						<Paper sx={{ width: "100%", overflow: "hidden", marginTop: "10px" }}>
							<TableContainer sx={{ maxHeight: 634, minheight: 300 }}>
								<Table stickyHeader aria-label="sticky table">
									<TableHead>
										<TableRow>
											{columns.map((column) => (
												<TableCell key={column.id} style={{ minWidth: column.minWidth }}>
													{column.label}
												</TableCell>
											))}
										</TableRow>
									</TableHead>
									<TableBody>
										{rows.map((row) => (
											<TableRow hover key={row.mt5accountid}>
												{columns.map((column) => {
													const value = row[column.id];

													// ✅ เพิ่มปุ่มลบในคอลัมน์ Actions
													return (
														<TableCell key={column.id}>
															{column.id === "actions" ? (
																<Button
																	variant="contained"
																	color="error"
																	onClick={() => handleOpenModal(row.mt5_accountid, row.token)}
																>
																	Delete
																</Button>
															) : column.format && typeof value === "number" ? (
																column.format(value)
															) : (
																value
															)}

														</TableCell>
													);
												})}
											</TableRow>
										))}
										<Dialog open={modalopen} onClose={handleCloseModal}>
											<DialogTitle>ยืนยันการลบ</DialogTitle>
											<DialogContent>
												<DialogContentText>
													คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีนี้? <br />
													<strong>mt5 Account ID:</strong> {selectedAccount?.accountId}
												</DialogContentText>
											</DialogContent>
											<DialogActions>
												<Button onClick={handleCloseModal} color="primary">
													ยกเลิก
												</Button>
												<Button onClick={confirmDelete} color="error" autoFocus>
													ยืนยันลบ
												</Button>
											</DialogActions>
										</Dialog>
									</TableBody>

								</Table>
							</TableContainer>
						</Paper>
					</div>

				</div>
				<div className='item2'>
					<Gauge
						value={rows.length}
						valueMax={10}
						startAngle={0}
						endAngle={360}
						innerRadius="80%"
						outerRadius="100%"
						width={250}
						height={250}
						text={
							({ value, }) => `Number of asset : ${value}`
						}
					/>
				</div>
			</div>
			{/* <h1>Dashboard page</h1> */}

		</div>
	)
}

export default Dashboard