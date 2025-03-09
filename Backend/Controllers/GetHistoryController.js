const conn = require('../DB')
const jwt = require('jsonwebtoken')
const secret = 'mysecret'

exports.get_history = async (req, res) => {
    try {
        const { token, deals } = req.body;
        console.log(deals)

        deals.forEach(deal => {
            // แปลง Unix Timestamp เป็น milliseconds
            const date = new Date(deal.time * 1000);

            // ปรับเวลาเป็น GMT+7
            const dateGMT7 = new Date(date.getTime() + (7 * 60 * 60 * 1000));

            // ดึงข้อมูลปี, เดือน, วัน, ชั่วโมง, นาที, วินาที
            const yyyy = dateGMT7.getUTCFullYear();
            const mm = String(dateGMT7.getUTCMonth() + 1).padStart(2, '0'); // เดือนเริ่มที่ 0 -> +1
            const dd = String(dateGMT7.getUTCDate()).padStart(2, '0');
            const HH = String(dateGMT7.getUTCHours()).padStart(2, '0');
            const MM = String(dateGMT7.getUTCMinutes()).padStart(2, '0');
            const SS = String(dateGMT7.getUTCSeconds()).padStart(2, '0');

            // Format yyyy-mm-dd HH:MM:SS
            const formattedDate = `${yyyy}-${mm}-${dd} ${HH}:${MM}:${SS}`;
            deal.time = formattedDate

            // console.log(`📅 Original: ${deal.time} → GMT+7: ${formattedDate}`);
        });

        // console.log(deals)
        const createBillResponse = await fetch("http://localhost:8000/createbill", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"  // ✅ ต้องระบุว่าเป็น JSON
            },
            body: JSON.stringify({ token,deals })
        });
        const responseData = await createBillResponse.json();
        // console.log("📩 Response from server:", responseData);

        res.json();
    } catch (error) {
        console.log("get-history error", error);
    }
}