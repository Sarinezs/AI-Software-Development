const express = require('express')
const router = express.Router()
const UserController = require('../Controllers/UserControllers')


router.get("/", UserController.getUser)


/**
 * @swagger
 * /user/loggedin:
 *   get:
 *     summary: Get logged-in user info
 *     description: ดึงข้อมูลของผู้ใช้ที่ล็อกอิน (ต้องใช้ JWT Token)
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []  # 👈 ต้องใส่ Token ก่อนเรียก API
 *     responses:
 *       200:
 *         description: Successfully retrieved user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   example:
 *                     id: 1
 *                     username: johndoe
 *                     email: johndoe@example.com
 *       403:
 *         description: Unauthorized - Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "getLoggedInUser authentication fail"
 *                 error:
 *                   type: object
 *                   example: {}
 */
router.get("/loggedin", UserController.getLoggedInUser)

module.exports = router;