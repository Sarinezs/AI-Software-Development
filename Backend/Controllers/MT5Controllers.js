const conn = require('../DB')
const jwt = require('jsonwebtoken')
const secret = 'mysecret'

exports.createmt5 = async (req, res) => {
    try {
        const { token, mt5id, mt5name } = req.body
        const authheader = req.headers['authorization']
        let authtoken = ''
        if (authheader) {
            authtoken = authheader.split(' ')[1]
        }
        const user = jwt.verify(authtoken, secret)

        const newAccount = await conn.query("INSERT INTO mt5_account set ? ", {
            token: token,
            mt5_accountid: mt5id,
            name: mt5name,
            user_id: user.user_id,
            status: "disconnected",
            balance: 0
        })
        res.json({
            message: "create mt5 success",
            newAccount
        })
    } catch (error) {
        res.status(400).send("createmt5 error: " + error)
        console.log(error)
    }
}

exports.connect = async (req, res) => {
    try {
        const { token, mt5id, action, balance } = req.body
        console.log(token, mt5id, action, balance)

        if (!token) {
            return res.json({
                message: "token required"
            }).status(400)
        }

        const [account] = await conn.query("SELECT * FROM mt5_account WHERE mt5_accountid = ? AND token = ?", [mt5id, token])
        if (account.length === 0) {
            return res.json({
                message: "mt5 account not found"
            }).status(400)
        } else {
            const newStatus = action === "connect" ? "connected" : "disconnected";
            const newBalance = action === "connect" ? balance : account[0].balance;
            await conn.query("UPDATE mt5_account SET status =?, balance =? WHERE mt5_accountid = ? AND token = ?", [newStatus, newBalance, mt5id, token])
            console.log('status change to connect ')
        }
        res.json({
            account
        }).status(200)
    } catch (error) {
        res.json({
            message: "connect error: " + error
        }).status(400)
    }
}

exports.getaccount = async (req, res) => {
    try {
        const authheader = req.headers['authorization']
        let authtoken = ''
        if (authheader) {
            authtoken = authheader.split(' ')[1]
        }
        const userID = jwt.verify(authtoken, secret).user_id

        const [results] = await conn.query('SELECT * FROM mt5_account WHERE user_id =? ', [userID])

        // console.log(user)
        res.json({
            results
        })
    } catch (error) {
        res.status(403).json({
            message: 'getaccount fail',
            error
        })
    }
}