const conn = require('../DB')
const jwt = require('jsonwebtoken')
const secret = 'mysecret'
const moment = require('moment-timezone');

exports.create_bill = async (req, res) => {
    try {
        const { StartMonth, EndMonth, token, deals } = req.body

        const [account] = await conn.query('SELECT user_id, mt5_accountid FROM mt5_account WHERE token = ?', token)
        // console.log(account[0].user_id, account[0].mt5_accountid)

        const [existingBill] = await conn.query(
            `SELECT * FROM Bill 
            WHERE user_id = ? 
            AND mt5_accountid = ? 
            AND NOT (end_date <= ? OR start_date >= ?) 
            LIMIT 1`,
            [account[0].user_id, account[0].mt5_accountid, StartMonth, EndMonth]
        );
        let sum = 0.00
        deals.map(row => {
            // console.log(row.profit)
            sum += row.profit
        })
        console.log(" ")
        const totalProfit = sum
        console.log("First Deal : ",deals[0])
        console.log("Last Deal : ",deals[deals.length - 1])
        console.log("Income : ", totalProfit)


        if (existingBill.length > 0) {
            console.log("Bill found in range ", StartMonth, " - ", EndMonth);
        }
        else {
            console.log("No Bill found in range ", StartMonth, " - ", EndMonth);
            // const totalProfit = 10000

            if (totalProfit > 0) {
                const service_fee = totalProfit * 0.01
                console.log("create bill")
                const [result] = conn.query("INSERT INTO Bill set ?", {
                    user_id: account[0].user_id,
                    mt5_accountid: account[0].mt5_accountid,
                    amount: service_fee,
                    status: "unpaid",
                    start_date: StartMonth,
                    end_date: EndMonth
                })
            }
            else if (totalProfit < 0) {
                const service_fee = 0
                console.log("create bill")
                const [result] = conn.query("INSERT INTO Bill set ?", {
                    user_id: account[0].user_id,
                    mt5_accountid: account[0].mt5_accountid,
                    amount: service_fee,
                    status: "no profit",
                    start_date: StartMonth,
                    end_date: EndMonth
                })
            }
        }
        res.json({
            message: "Bill created successfully",
        }).status(200)
    } catch (error) {
        res.json({
            message: "Error creating bill",
            error
        })
    }
}

exports.get_bills = async (req, res) => {
    try {
        const authheader = req.headers['authorization']
        let authtoken = ''
        if (authheader) {
            authtoken = authheader.split(' ')[1]
        }
        const user = jwt.verify(authtoken, secret)
        // console.log(user)
        const [results] = await conn.query('SELECT * FROM Bill WHERE user_id =? AND status = ?', [user.user_id, 'unpaid'])
        // results.forEach(row => {
        //     row.start_date = moment.utc(row.start_date).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');
        //     row.end_date = moment.utc(row.end_date).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');
        // });
        // console.log(results)
        res.json({
            bills: results
        }).status(200)
    } catch (error) {
        console.log(error)
        res.json({
            message: "Error getting bills",
            error
        })
    }
}

exports.get_bills_history = async (req, res) => {
    try {
        const authheader = req.headers['authorization']
        let authtoken = ''
        if (authheader) {
            authtoken = authheader.split(' ')[1]
        }
        const user = jwt.verify(authtoken, secret)
        // console.log(user)
        const [results] = await conn.query('SELECT * FROM Bill WHERE user_id =? AND status = ?', [user.user_id, 'complete'])
        // results.forEach(row => {
        //     row.start_date = moment.utc(row.start_date).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');
        //     row.end_date = moment.utc(row.end_date).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');
        // });
        res.json({
            bills: results
        }).status(200)
    } catch (error) {
        res.json({
            message: "Error getting bills",
            error
        })
    }
}

exports.get_income = async (req, res) => {
    try {
        const authheader = req.headers['authorization']
        let authtoken = ''
        if (authheader) {
            authtoken = authheader.split(' ')[1]
        }
        const user = jwt.verify(authtoken, secret)
        // console.log(user)
        const [results] = await conn.query('SELECT SUM(amount) as total_income FROM Bill WHERE status =?', ["complete"])
        res.json({
            income: results[0].total_income
        }).status(200)
    }
    catch (error) {
        {
            res.json({
                message: "Error getting income",
                error
            }).status(500)
        }
    }
}