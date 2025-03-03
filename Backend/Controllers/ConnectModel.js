const conn = require('../DB')
const jwt = require('jsonwebtoken')
const secret = 'mysecret'

exports.connectmodel = async (req, res) => {
    try {
        const { token, model_id } = req.body
        const authheader = req.headers['authorization']
        let authtoken = ''
        if (authheader) {
            authtoken = authheader.split(' ')[1]
        }

        jwt.verify(authtoken, secret)

        // Connect to model server using mt5_accountid and model_id
        const [result] = await conn.query('UPDATE mt5_account SET model_id = ? WHERE token = ?', [model_id, token])

        res.json({
            message: "Connected to model server",
            result
        })
    } catch (error) {
        // console.log(error)
        res.json({
            message: "Failed to connect to model server",
            error
        })
    }
}

exports.getmodelnamebyid = async (req, res) => {
    try {
        const { model_id } = req.params
        const [result] = await conn.query('SELECT model_name FROM model WHERE model_id =?', [model_id])
        res.json({
            message: "Get model name",
            result: result[0].model_name
        })
    } catch (error) {
        res.json({
            message: "Failed to get model name",
            error
        })
    }
}

exports.getmodelname = async (req, res) => {
    try {
        const authheader = req.headers['authorization']
        let authtoken = ''
        if (authheader) {
            authtoken = authheader.split(' ')[1]
        }

        jwt.verify(authtoken, secret)

        const [results] = await conn.query('SELECT * FROM model')
        res.json({
            message: "Get all model name",
            result: results
        })
    } catch (error) {
        res.json({
            message: "Failed to get all model name",
            error
        })
    }
}