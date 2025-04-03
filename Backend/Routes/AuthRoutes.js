const express = require('express')
const router = express.Router()
const AuthController = require('../Controllers/AuthControllers')



/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: API สำหรับสมัครสมาชิก
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - confirm_password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *               confirm_password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Insert success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "insert success"
 *       400:
 *         description: Bad Request (password mismatch or email exists)
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/update', AuthController.updateuser)
router.post('/checkjwttoken', AuthController.checkjwttoken)

module.exports = router