const conn = require('../DB')
const jwt = require('jsonwebtoken')
const secret = 'mysecret'

exports.get_history = async (req, res) => {
    try {
        const { StartMonth, EndMonth, token, deals } = req.body;
        // console.log(deals)
       
        const createBillResponse = await fetch("http://localhost:8000/createbill", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"  // ✅ ต้องระบุว่าเป็น JSON
            },
            body: JSON.stringify({ StartMonth,EndMonth,token,deals })
        });
        const responseData = await createBillResponse.json();
        // console.log("📩 Response from server:", responseData);

        res.json();
    } catch (error) {
        console.log("get-history error", error);
    }
}