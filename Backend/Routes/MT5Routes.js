const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const CreateMt5 = require('../Controllers/MT5Controllers')



router.post("/create", CreateMt5.createmt5)
router.post("/connect", CreateMt5.connect)

module.exports = router;