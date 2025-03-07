const conn = require('../DB')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secret = 'mysecret'
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = 'whsec_cc88b8668d31645b3abc9fc30b05b88c880b9566e5ba51d3ea4652bf1e2590a0111';

exports.checkout = async (req, res) => {
    console.log(req)
    try {
        const { bill } = req.body
        const orderId = uuidv4();
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
            success_url: `http://localhost:5173/Dashboard`,
            cancel_url: `http://localhost:8888/cancel.html?id=${orderId}`,
        });

        console.log(session)
        res.json(req.body)
    } catch (error) {
        console.log(error)
        res.json(error)
    }
}

