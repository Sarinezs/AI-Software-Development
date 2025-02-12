const express = require('express')
const router = express.Router()
const UserController = require('../Controllers/UserControllers')

router.get("/", UserController.getUser)

module.exports = router;