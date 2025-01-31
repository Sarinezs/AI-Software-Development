const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bcrypt = require('bcrypt')

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

let conn = null
var text = ''

const connectMySQL = async () => {
    try {
        conn = await mysql.createConnection({
            host: 'localhost', // docker : db
            user: 'root',
            password: 'root',
            database: 'test',
        });
        text = 'Connected to MySQL!'
        console.log('Connected to MySQL!');
    } catch (err) {
        text = 'Error connecting to MySQL:' + err
        console.error('Error connecting to MySQL:', err);
    }
}

app.get('/', (req, res) => {
    res.send(text)
})
app.get('/user', async (req, res) => {
    try {
        const authheader = req.headers['authorization']
        let authtoken = ''
        if(authheader) {
            authtoken = authheader.split(' ')[1]
        }
        console.log(authtoken)
        const user = jwt.verify(authtoken, secret)
        console.log(user)
        const [results] = await conn.query('SELECT * FROM user')
        res.json({
            users: results
        })
    } catch (error) {
        console.log('error', error)
        res.status(403).json({
            message: 'autehntication fail',
            error
        })
    }
})

app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const userdata = {
            username,
            email,
            password: hashedPassword
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
        const {email, password} = req.body
        const [result] = await conn.query('SELECT * FROM user WHERE email = ?', email)
        const userdata = result[0]
        const match = await bcrypt.compare(password, userdata.password)
        if(!match) {
            res.status(400).json({
                message: "login failed"
            })
            return false
        }

        // สร้าง jwt token 
        const token = jwt.sign({email, role: 'admin'}, secret, { expiresIn: "1h"})


        res.json({
            message: "login success",
            token
        })
    }catch(error) {
        console.log('error555')
        res.status(401).json({
            message: 'login falied',
            error
        })
    }
})
app.listen(port, async () => {
    await connectMySQL()
    console.log('Server running at http://localhost:' + port)
})