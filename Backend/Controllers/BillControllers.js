const conn = require('../DB')
const jwt = require('jsonwebtoken')
const secret = 'mysecret'

exports.create_bill = async (req, res) => {
    try {
        const { token, deals } = req.body

        const [account] = await conn.query('SELECT user_id, mt5_accountid FROM mt5_account WHERE token = ?', token)
        console.log(account[0].user_id, account[0].mt5_accountid)


        // ค้นหาเวลาเก่าสุด และ ใหม่สุด
        let minTime = new Date(deals[0].time);
        let maxTime = new Date(deals[0].time);

        deals.forEach(deal => {
            let dealTime = new Date(deal.time);
            if (dealTime < minTime) minTime = dealTime;
            if (dealTime > maxTime) maxTime = dealTime;
        });

        const formatDate = (date) => {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มที่ 0 -> +1
            const dd = String(date.getDate()).padStart(2, '0');
            const HH = String(date.getHours()).padStart(2, '0');
            const MM = String(date.getMinutes()).padStart(2, '0');
            const SS = String(date.getSeconds()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd} ${HH}:${MM}:${SS}`;
        };

        // console.log("⏳ Oldest Time:", formatDate(minTime));
        // console.log("⏰ Newest Time:", formatDate(maxTime));

        // const totalProfit = deals.reduce((sum, deal) => sum + deal.profit, 0)

        const start_date = formatDate(minTime);
        const end_date = formatDate(maxTime);

        const [existingBill] = await conn.query(
            `SELECT * FROM Bill 
            WHERE user_id = ? 
            AND mt5_accountid = ? 
            AND NOT (end_date <= ? OR start_date >= ?) 
            LIMIT 1`,
            [account[0].user_id, account[0].mt5_accountid, start_date, end_date]
        );


        if (existingBill.length > 0) {
            console.log("Bill found in range ", start_date, " - ", end_date);
        }
        else {
            console.log("No Bill found in range ", start_date, " - ", end_date);
            const totalProfit = 10000

            if (totalProfit > 0) {
                const service_fee = totalProfit * 0.01
                console.log("create bill")
                const [result] = conn.query("INSERT INTO Bill set ?", {
                    user_id: account[0].user_id,
                    mt5_accountid: account[0].mt5_accountid,
                    amount: service_fee,
                    status: "unpaid",
                    start_date: formatDate(minTime),
                    end_date: formatDate(maxTime)
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
                    start_date: formatDate(minTime),
                    end_date: formatDate(maxTime)
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