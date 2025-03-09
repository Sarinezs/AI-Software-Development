const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require("uuid");

require('dotenv').config();




const UserRoutes = require('./Routes/UserRoutes')
const AuthRoutes = require('./Routes/AuthRoutes')
const MT5Routes = require('./Routes/MT5Routes')
const ConnectModel = require('./Routes/ConnectModel')
const GetHist = require('./Routes/GetHistoryRoutes')
const CreateBill = require('./Routes/BillRoutes')
const Payment = require('./Routes/PaymentRoutes')

const conn = require('./DB')

const app = express()
// app.use(express.json())

app.use(cors(
    {
        credentials: true,
        origin: ['http://localhost:5173']
    }
))
app.use(cookieParser())

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}))

const port = 8000
const secret = 'mysecret'

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = 'whsec_cc88b8668d31645b3abc9fc30b05b88c880b9566e5ba51d3ea4652bf1e2590a0';

// let conn = null
// var text = ''

// const connectMySQL = async () => {
//     try {
//         conn = await mysql.createConnection({
//             host: 'localhost', // docker : db
//             user: 'root',
//             password: 'root',
//             database: 'test',
//         });
//         text = 'Connected to MySQL!'
//         console.log('Connected to MySQL!');
//     } catch (err) {
//         text = 'Error connecting to MySQL:' + err
//         console.error('Error connecting to MySQL:', err);
//     }
// }


// app.get('/user', async (req, res) => {
//     try {
//         const authheader = req.headers['authorization']
//         let authtoken = ''
//         if (authheader) {
//             authtoken = authheader.split(' ')[1]
//         }
//         // console.log(authtoken)
//         const user = jwt.verify(authtoken, secret)
//         // console.log(user)
//         const [results] = await conn.query('SELECT * FROM user')
//         res.json({
//             users: results
//         })
//     } catch (error) {
//         console.log('error', error)
//         res.status(403).json({
//             message: 'authentication fail',
//             error
//         })
//     }
// })

app.use('/user', express.json(), UserRoutes)
app.use('/auth', express.json(), AuthRoutes)
app.use('/MT5', express.json(), MT5Routes)
app.use('/model', express.json(), ConnectModel)
app.use('/get-history', express.json(), GetHist)
app.use('/createbill', express.json(), CreateBill)
app.use('/payment', express.json(), Payment)


// app.post('/register', async (req, res) => {
//     try {
//         const { username, email, password, confirm_password } = req.body
//         if (password !== confirm_password) {
//             res.json({
//                 message: "password not match"
//             })
//             return false;
//         }
//         let hashedPassword = await bcrypt.hash(password, 10)
//         const userdata = {
//             username,
//             email,
//             password: hashedPassword,
//             role: 'user',
//         }
//         const [ismember] = await conn.query('SELECT * FROM user WHERE email = ?', email)
//         if (ismember.length !== 0) {
//             res.json({
//                 message: "email already exists"
//             })
//             return false;
//         }
//         const [result] = await conn.query('INSERT INTO user set ? ', userdata)
//         res.json({
//             message: 'insert success',
//             result
//         })
//     } catch (error) {
//         console.log('error', error)
//         res.json({
//             message: "insert error",
//             error
//         })
//     }
// })

// app.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body
//         const [result] = await conn.query('SELECT * FROM user WHERE email = ?', email)
//         const userdata = result[0]
//         const match = await bcrypt.compare(password, userdata.password)
//         if (!match) { // รหัสตรงกันไหม
//             res.status(400).json({
//                 message: "login failed1"
//             })
//             return false
//         }

//         // สร้าง jwt token 
//         let token = ""
//         if (userdata.role === "admin") {
//             token = jwt.sign({  user_id: userdata.user_id,
//                                 username: userdata.username,
//                                 email,
//                                 role: 'admin' 
//                              },
//                             secret, 
//                             { expiresIn: "1h" })
//             // console.log('user data', userdata)
//         }
//         else { // user
//             token = jwt.sign({  user_id: userdata.user_id,
//                 username: userdata.username,
//                 email,
//                 role: 'user' 
//              },
//             secret, 
//             { expiresIn: "1h" })
//         }


//         res.status(200).json({
//             message: "login success",
//             token,
//             role: userdata.role

//         })

//     } catch (error) {
//         console.log('login error', error)
//         res.status(401).json({
//             message: 'login falied',
//             error
//         })
//     }
// })

app.post('/logout', async (req, res) => {
    try {
        req.session.destroy(function (err) {
            if (err) {
                console.log(err);
                res.status(500).json({
                    message: "Failed to destroy session"
                });
            } else {
                res.clearCookie('connect.sid');
                res.status(200).json({
                    message: "logout success"
                });
            }
        });
    } catch (error) {
        console.log('logout error', error)
        res.status(500).json({
            message: 'logout failed',
            error
        })
    }
})

app.post('/api/verify-token', async (req, res) => {
    try {
        console.log(req.body)
        res.status(200).json(req.body)
    } catch (error) {
        console.log("verify token error", error)
    }
})

app.get("/api/get-selected-model", async (req, res) => {
    try {
        const { mt5_id, api_token } = req.query; // ดึงค่าจาก Query Parameters

        // console.log("🔹 Received Request:", { mt5_id, api_token })

        // ✅ ส่งข้อมูล Model กลับให้ MQL5
        const selectedModel = {
            model_name: "EURUSD"
        };

        res.status(200).json(selectedModel);
    } catch (error) {
        console.log("selected model error: ", error)
    }
});

// app.post('/api/get-history', async (req, res) => {
//     try {
//         const { deals } = req.body;

//         deals.forEach(deal => {
//             // แปลง Unix Timestamp เป็นวันที่และเวลาใน GMT+7
//             const date = new Date(deal.time * 1000); // คูณ 1000 เพราะ JS ใช้ milliseconds
//             const options = { timeZone: 'Asia/Bangkok', hour12: false };

//             // ใช้ Intl.DateTimeFormat เพื่อแสดงผลใน GMT+7
//             const formattedDate = new Intl.DateTimeFormat('en-GB', {
//                 year: 'numeric', month: '2-digit', day: '2-digit',
//                 hour: '2-digit', minute: '2-digit', second: '2-digit',
//                 timeZone: 'Asia/Bangkok'
//             }).format(date);

//             console.log(`${deal.dealTicket} GMT+7: ${formattedDate}`);
//         });

//         res.json(req.body);
//     } catch (error) {
//         console.log("get-history error", error);
//     }
// });


// ระบบจ่ายเงิน
app.post('/api/checkout', async (req, res) => {
    const { bill } = req.body
    try {
        const orderId = uuidv4();
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "thb",
                        product_data: {
                            name: "Robot trade's services fee",
                        },
                        unit_amount: bill.amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `http://localhost:5173/Dashboard`,
            cancel_url: `http://localhost:8888/cancel.html?id=${orderId}`,
        });
// cs_test_a1IAvUlYsASkWyLB8KY7RtRrahaPtTYzYIwnAAJlJy1piGrNS8QvFZDtny
// cs_test_a1IAvUlYsASkWyLB8KY7RtRrahaPtTYzYIwnAAJlJy1piGrNS8QvFZDtny
        console.log(session)
        res.json(req.body)
    } catch (error) {
        console.log("error")
    }
})

app.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const paymentSuccessData = event.data.object;
            const session_id = paymentSuccessData.id;

            const data = {
                status: paymentSuccessData.status,
            };

            const [result] = await conn.query("UPDATE Bill SET ? WHERE session_id = ?", [
                data,
                session_id,
            ]);

            // console.log("=== update result", result);

            // event.data.object.id = session.id
            // event.data.object.customer_details คือข้อมูลลูกค้า
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
});
app.listen(port, async () => {
    // await connectMySQL()
    // console.log(conn)
    console.log('Server running at http://localhost:' + port)
})