const express = require('express')
const router = express.Router()
const BillControllers = require('../Controllers/BillControllers')

router.post('/', BillControllers.create_bill)
router.get('/getbills', BillControllers.get_bills)

module.exports = router;