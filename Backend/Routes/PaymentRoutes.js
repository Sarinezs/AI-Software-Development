const express = require('express')
const router = express.Router()
const PaymentController = require('../Controllers/PaymentControllers')

router.post('/checkout',PaymentController.checkout)


module.exports = router;