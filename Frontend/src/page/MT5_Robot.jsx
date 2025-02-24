import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import MT5_popup from '../components/MT5_popup'
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import './MT5_Robot.css'


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
            const user = await axios.post('http://localhost:8000/auth/checkjwttoken', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            // console.log(user.data.user.username)

        } catch (error) {
            // console.log(error.response)
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
            <h1>MT5_Robot</h1>
            {/* <button onClick={() => { Setopenpopup(true) }}>add MT5 Account</button> */}

            <div>
                <Button onClick={handleOpen}>Add MT5 Account</Button>
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
                                                        <button onClick={createtoken}>generate token</button>
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

                                                        <button onClick={copytext}>Copy text</button>
                                                        <button onClick={handleSubmit}>create</button>
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

        </div>
    )
}

export default MT5_Robot