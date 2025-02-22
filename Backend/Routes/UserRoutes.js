const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const UserController = require('../Controllers/UserControllers')



router.get("/", UserController.getUser)
router.get("/test", UserController.test)
router.get("/loggedin", UserController.getLoggedInUser)

module.exports = router;