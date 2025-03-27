const conn = require('../DB')
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = 'whsec_cc88b8668d31645b3abc9fc30b05b88c880b9566e5ba51d3ea4652bf1e2590a0111';

exports.checkout = async (req, res) => {
    try {
        const { bill } = req.body
        const orderId = uuidv4();

        const [billData] = await conn.query("SELECT * FROM Bill WHERE bill_id = ? AND status = ?", [bill.bill_id, "complete"])
        // console.log(billData.length)
        if(billData.length > 0) {
            return res.status(400).json({message: 'Bill already complete'})
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "thb",
                        product_data: {
                            name: "Robot trade's services fee",
                        },
                        unit_amount: bill.amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `http://localhost:5173/Paymentsuccess`,
            cancel_url: `http://localhost:5173/Paymentfailed`,
        });

        await conn.query("UPDATE Bill SET session_id = ? WHERE bill_id = ?", [session.id, bill.bill_id])

        // console.log("data=============",session.url)
        res.json({
            sessionId: session.id
        })
    } catch (error) {
        console.log(error)
        res.json(error)
    }
}

