const express = require('express')
const router = express.Router()
const BillControllers = require('../Controllers/BillControllers')

router.post('/', BillControllers.create_bill)
router.get('/getbills', BillControllers.get_bills)
router.get('/getbills_history', BillControllers.get_bills_history)
router.get('/getincome', BillControllers.get_income)

module.exports = router;