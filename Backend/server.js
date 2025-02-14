const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bcrypt = require('bcrypt')

const UserRoutes = require('./Routes/UserRoutes')
const conn = require('./DB')

const app = express()
app.use(express.json())
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


app.get('/', (req, res) => {
    res.send(text)
})
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

app.use('/user', UserRoutes)

app.post('/register', async (req, res) => {
    try {
        const { username, email, password, confirm_password } = req.body
        if (password !== confirm_password) {
            res.json({
                message: "password not match"
            })
            return false;
        }
        let hashedPassword = await bcrypt.hash(password, 10)
        const userdata = {
            username,
            email,
            password: hashedPassword,
            role: 'user',
        }
        const [ismember] = await conn.query('SELECT * FROM user WHERE email = ?', email)
        if (ismember.length !== 0) {
            res.json({
                message: "email already exists"
            })
            return false;
        }
        const [result] = await conn.query('INSERT INTO user set ? ', userdata)
        res.json({
            message: 'insert success',
            result
        })
    } catch (error) {
        console.log('error', error)
        res.json({
            message: "insert error",
            error
        })
    }
})

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const [result] = await conn.query('SELECT * FROM user WHERE email = ?', email)
        const userdata = result[0]
        const match = await bcrypt.compare(password, userdata.password)
        if (!match) { // รหัสตรงกันไหม
            res.status(400).json({
                message: "login failed1"
            })
            return false
        }

        // สร้าง jwt token 
        const token = jwt.sign({ email, role: 'user' }, secret, { expiresIn: "1h" })


        res.status(200).json({
            message: "login success",
            token,
            role: userdata.role

        })

    } catch (error) {
        console.log('login error')
        res.status(401).json({
            message: 'login falied',
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

        console.log("🔹 Received Request:", { mt5_id, api_token })

        // ✅ ส่งข้อมูล Model กลับให้ MQL5
        const selectedModel = {
            success: true,
            message: "Model data retrieved successfully",
            mt5_id: mt5_id,
            selected_model: "AI-Trading-Model-01"
        };

        res.status(200).json(selectedModel);
    } catch (error) {
        console.log("selected model error: ", error)
    }
});

app.post('/api/get-history', async (req, res) => {
    try {
        console.log(req.body)
        res.json(req.body)
    } catch (error) {
        console.log("get-history error", error)
    }
})
app.listen(port, async () => {
    // await connectMySQL()
    console.log('Server running at http://localhost:' + port)
})