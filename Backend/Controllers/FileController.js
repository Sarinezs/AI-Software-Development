const conn = require('../DB')
const jwt = require('jsonwebtoken')
const secret = 'mysecret'

exports.download = async (req, res) => {
    try {
        const authheader = req.headers['authorization']
        let authtoken = ''
        if (authheader) {
            authtoken = authheader.split(' ')[1]
        }
        jwt.verify(authtoken, secret)
        res.download("./EA_file/TradeX.mq5")
    } catch (error) {
        res.status(500).json({
            message: 'download error',
            error
        })
    }

}