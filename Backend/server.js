const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bcrypt = require('bcrypt')

const app = express()
app.use(express.json())
app.use(cors({
    credentials: true,
    origin: ['http://localhost:8000']
}))
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
        text = 'Error connecting to MySQL:'+err
        console.error('Error connecting to MySQL:', err);
    }
}

app.get('/', (req, res) => {
    res.send(text)
})
app.get('/user', async (req, res) => {
    const [results] = await conn.query('SELECT * FROM user')
    res.json(results)
})

app.get('/test', (req, res) => {
    res.json({ message: 'test' })
})

app.listen(port, async () => {
    await connectMySQL()
    console.log('Server running at http://localhost:'+port)
})