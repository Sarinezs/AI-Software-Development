const express = require('express')
const router = express.Router()
const BillControllers = require('../Controllers/BillControllers')

router.post('/', BillControllers.create_bill)

module.exports = router;