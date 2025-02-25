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
		{ id: 'name', label: 'Name', minWidth: 100 },
		{ id: 'code', label: 'ISO Code', minWidth: 100 },
		{
			id: 'population',
			label: 'Population',
			minWidth: 100,
			// align: 'right',
			format: (value) => value.toLocaleString('en-US'),
		},
		{
			id: 'size',
			label: 'Size\u00a0(km\u00b2)',
			minWidth: 100,
			// align: 'right',
			format: (value) => value.toLocaleString('en-US'),
		},
		{
			id: 'density',
			label: 'Density',
			minWidth: 100,
			// align: 'right',
			format: (value) => value.toFixed(2),
		},
		{
			id: 'density',
			label: 'Density',
			minWidth: 100,
			// align: 'right',
			format: (value) => value.toFixed(2),
		},
	];

	function createData(name, code, population, size) {
		const density = population / size;
		return { name, code, population, size, density };
	}

	const rows = [
		createData('India', 'IN', 1324171354, 3287263),
		createData('China', 'CN', 1403500365, 9596961),
		createData('Italy', 'IT', 60483973, 301340),
		createData('United States', 'US', 327167434, 9833520),
		createData('Canada', 'CA', 37602103, 9984670),
		createData('Australia', 'AU', 25475400, 7692024),
		createData('Germany', 'DE', 83019200, 357578),
		createData('Ireland', 'IE', 4857000, 70273),
		createData('Mexico', 'MX', 126577691, 1972550),
		createData('Japan', 'JP', 126317000, 377973),
		createData('France', 'FR', 67022000, 640679),
		createData('Russia', 'RU', 146793744, 17098246),
		createData('Nigeria', 'NG', 200962417, 923768),
		createData('Brazil', 'BR', 210147125, 8515767),
	];

	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	// const handleChangePage = (event, newPage) => {
	// 	setPage(newPage);
	// };

	// const handleChangeRowsPerPage = (event) => {
	// 	setRowsPerPage(+event.target.value);
	// 	setPage(0);
	// };

	const [userdata, setUserdata] = useState({});

	useEffect(() => {
		checktoken()
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
		console.log(e.target.name, e.target.value)
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
			console.log("create mt5 success", gentoken)
		} catch (error) {
			console.log("create mt5 error")
		}
	}

	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

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
																	id="standard-disabled"
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
						<h3>MT5 Account</h3>
						<Paper sx={{ width: '100%', overflow: 'hidden', marginTop: "10px"}}>
							<TableContainer sx={{ maxHeight: 634 }}>
								<Table stickyHeader aria-label="sticky table">
									<TableHead>
										<TableRow>
											{columns.map((column) => (
												<TableCell
													key={column.id}
													align={column.align}
													style={{ minWidth: column.minWidth }}
												>
													{column.label}
												</TableCell>
											))}
										</TableRow>
									</TableHead>
									<TableBody>
										{rows
											// .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
											.map((row) => {
												return (
													<TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
														{columns.map((column) => {
															const value = row[column.id];
															return (
																<TableCell key={column.id} align={column.align}>
																	{column.format && typeof value === 'number'
																		? column.format(value)
																		: value}
																</TableCell>
															);
														})}
													</TableRow>
												);
											})}
									</TableBody>
								</Table>
							</TableContainer>
							{/* <TablePagination
							rowsPerPageOptions={[10, 25, 100]}
							component="div"
							count={rows.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/> */}
						</Paper>
					</div>

				</div>
				<div className='item2'>
					<Gauge
						value={1}
						startAngle={0}
						endAngle={360}
						innerRadius="80%"
						outerRadius="100%"
						width={100}
						height={100}
					/>
				</div>
			</div>
			{/* <h1>Dashboard page</h1> */}

		</div>
	)
}

export default Dashboard