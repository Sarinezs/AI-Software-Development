const express = require('express')
const router = express.Router()
const AuthController = require('../Controllers/AuthControllers')

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/update', AuthController.updateuser)
router.post('/checkjwttoken', AuthController.checkjwttoken)

module.exports = router