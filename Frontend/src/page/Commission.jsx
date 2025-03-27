import React, { useEffect, useState } from 'react';

import axios from 'axios'
import Navbar from '../components/Navbar'
import './Commission.css'
import Bills from '../components/Bills';

const Commission = () => {

    const [ishistory, setIshistory] = useState(false)


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
            // setUserdata(response.data.user || {});
        } catch (error) {
            // console.log(error.response)
            alert("Unauthorized! Please login again.");
            localStorage.removeItem("token");
            window.location.href = "/signin";
        }
    }

    const test = (hist) => {
        setIshistory(hist)
        console.log(ishistory)
    }


    return (
        <div>
            <div className='cms-body'>
                <Navbar />
                <div className='cms-grid'>
                    <div className='cms-sidebar'>
                        <div className="cms-menu">
                            <ul>
                                <li onClick={() => {test(false)}}>Bills</li>
                                <li onClick={() => {test(true)}}>History</li>
                            </ul>
                        </div>
                    </div>
                    <Bills ishistory={ishistory}/>
                    {/* <div className="bill-box">
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
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Commission