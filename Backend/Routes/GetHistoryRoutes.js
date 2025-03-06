const express = require('express')
const router = express.Router()
const gethist = require('../Controllers/GetHistoryController')

router.post('/', gethist.get_history)

module.exports = router;