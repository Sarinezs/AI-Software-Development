const conn = require('../DB')

const jwt = require('jsonwebtoken')

const secret = 'mysecret'

exports.getUser = async (req, res) => {
    try {
        const authheader = req.headers['authorization']
        let authtoken = ''
        if (authheader) {
            authtoken = authheader.split(' ')[1]
        }
        const user = jwt.verify(authtoken, secret)
        console.log(user)
        const [results] = await conn.query('SELECT * FROM user WHERE role = ?', ['user'])
        res.json({
            users: results.length
        })
    } catch (error) {
        console.log('error', error)
        if (error.name === 'JsonWebTokenError') {
            res.status(403).json({
                message: 'Token is not valid',
                error
            })
        }
        else {
            res.status(500).json({
                message: 'server error',
                error
            })
        }
    }
}

exports.getLoggedInUser = async (req, res) => {
    try {
        const authheader = req.headers['authorization']
        let authtoken = ''
        if (authheader) {
            authtoken = authheader.split(' ')[1]
        }
        const user = jwt.verify(authtoken, secret)
        // console.log(user)
        res.json({
            user
        })
    } catch (error) {
        // console.log('error', error)
        res.status(403).json({
            message: 'getLoggedInUser authentication fail',
            error
        })
    }
}

exports.test = async (req, res) => {
    try {
        console.log("test")
        res.status(200).json({
            message: 'test success',
        })
    } catch (error) {
        res.status(404).json({
            message: 'test fail',
            error
        })
    }
}