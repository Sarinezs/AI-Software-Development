import { useEffect, useState } from 'react';

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51QauyQGRBGrifrDf6lo1JsGti7Y59VJu4ilSh3HwEUkUo2I93wHohNwBQAZNYODmjmAjBHfC44mvyOmX22QsHC9k00Pdqxkzx3");

import axios from 'axios'
import Navbar from '../components/Navbar'
import './Commission.css'
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider } from "@mui/material";

const Commission = () => {

    const [bills, setBills] = useState([]);

    useEffect(() => {
        checktoken()
        getbills()
        setModalOpen(false)
    }, [])


    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);

    const handleOpenModal = (bill) => {
        setSelectedBill(bill);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

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

    const getbills = async (req, res) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get('http://localhost:8000/createbill/getbills', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const formattedBills = response.data.bills.map(bill => ({
                ...bill,
                start_date: bill.start_date.split('T')[0],  // ตัดเวลาออก
                end_date: bill.end_date.split('T')[0]      // ตัดเวลาออก
            }));

            // console.log(formattedBills.length);
            setBills(formattedBills);
        } catch (error) {
            console.log("get bill error: " + error)
        }
    }

    const pay = async (id, amount) => {
        const stripe = await stripePromise;
        const response = await axios.post('http://localhost:8000/payment/checkout', {
            bill: {
                bill_id: id,
                amount: amount
            }
        })
        const sessionId = response.data.sessionId
        const { error } = await stripe.redirectToCheckout({ sessionId });
        console.log(sessionId)
    }


    return (
        <div>
            <div className='cms-body'>
                <Navbar />
                <div className="bill-box">
                    <div className="bill-table">
                        <h1>Bills</h1>
                        <Divider />
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Bill id</TableCell>
                                            <TableCell>MT5 Accountid</TableCell>
                                            <TableCell>Amount</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Start Date</TableCell>
                                            <TableCell>End Date</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {bills.map((bill) => (
                                            <TableRow key={bill.bill_id} hover role="checkbox">
                                                <TableCell>{bill.bill_id}</TableCell>
                                                <TableCell>{bill.mt5_accountid}</TableCell>
                                                <TableCell>{bill.amount}</TableCell>
                                                <TableCell>{bill.status}</TableCell>
                                                <TableCell>{bill.start_date}</TableCell>
                                                <TableCell>{bill.end_date}</TableCell>
                                                <TableCell>
                                                    <Button onClick={() => handleOpenModal(bill)} color="primary" variant="contained">
                                                        Pay
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                        <Dialog open={modalOpen} onClose={handleCloseModal}>
                            <DialogTitle>ยืนยันการชำระเงิน</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    คุณต้องการชำระเงินจำนวน <strong>{selectedBill?.amount}</strong> ใช่หรือไม่? <br />
                                    <strong>Bill ID:</strong> {selectedBill?.bill_id}
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseModal} color="primary">
                                    ยกเลิก
                                </Button>
                                <Button
                                    onClick={() => {
                                        pay(selectedBill.bill_id, parseInt(selectedBill.amount));
                                        handleCloseModal();
                                    }}
                                    color="success"
                                    autoFocus
                                >
                                    ยืนยันจ่าย
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Commission