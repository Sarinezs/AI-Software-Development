const conn = require('../DB')
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

const secret = 'mysecret'

exports.register = async (req, res) => {
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
}

exports.login = async (req, res) => {
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
        let token = ""
        if (userdata.role === "admin") {
            token = jwt.sign({
                user_id: userdata.user_id,
                username: userdata.username,
                email,
                role: 'admin'
            },
                secret,
                { expiresIn: "24h" })
            // console.log('user data', userdata)
        }
        else { // user
            token = jwt.sign({
                user_id: userdata.user_id,
                username: userdata.username,
                email,
                role: 'user'
            },
                secret,
                { expiresIn: "24h" })
        }


        res.status(200).json({
            message: "login success",
            token,
            role: userdata.role

        })

    } catch (error) {
        // console.log('login error', error)
        res.status(401).json({
            message: 'login falied',
            error
        })
    }
}

exports.checkjwttoken = async (req, res) => {
    try {
        const authheader = req.headers['authorization']
        let authtoken = ''
        if (authheader) {
            authtoken = authheader.split(' ')[1]
        }
        const user = jwt.verify(authtoken, secret)
        if (!user) {
            res.status(403).json({
                message: 'token authentication fail',
            })
            return false
        }
        console.log(user)
        res.status(200).json({
            message: 'token authentication success',
            user
        })
    } catch (error) {
        // console.log(error.message)
        res.status(403).json({
            message: 'token authentication fail1111',
            error
        })
    }
}

exports.updateuser = async (req, res) => {
    try {
        const { user_id, username, email } = req.body
        const userdata = {
            username,
            email,
        }
        const [result] = await conn.query('UPDATE user SET? WHERE user_id =?', [userdata, user_id])
        const token = jwt.sign({
            user_id,
            username: userdata.username,
            email,
            role: 'user'
        },
            secret,
            { expiresIn: "24h" })
        console.log(user_id, result)
        res.json({
            message: 'update success',
            result,
            token
        })
    } catch (error) {
        console.log('error', error)
        res.json({
            message: "update error",
            error
        })
    }
}

exports.get