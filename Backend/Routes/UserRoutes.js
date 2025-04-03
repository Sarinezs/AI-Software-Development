const express = require('express')
const router = express.Router()
const UserController = require('../Controllers/UserControllers')



router.get("/", UserController.getUser)

/**
 * @swagger
 * /loggedin:
 *   get:
 *     summary: get user data.
 *     description: retrieve user logged in.
*/
router.get("/loggedin", UserController.getLoggedInUser)

module.exports = router;