const express = require('express')
const router = express.Router()
const AuthController = require('../Controllers/AuthControllers')

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - confirm_password
 *       properties:
 *         username:
 *           type: string
 *           example: johndoe
 *         email:
 *           type: string
 *           format: email
 *           example: johndoe@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: password123
 *         confirm_password:
 *           type: string
 *           format: password
 *           example: password123
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "insert success"
 *         result:
 *           type: object
 *           properties:
 *             insertId:
 *               type: integer
 *               example: 1
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: johndoe@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: password123
 *     LoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "login success"
 *         token:
 *           type: string
 *           example: "your_jwt_token"
 *         role:
 *           type: string
 *           example: "user"
 *     UpdateUserRequest:
 *       type: object
 *       required:
 *         - user_id
 *         - username
 *         - email
 *       properties:
 *         user_id:
 *           type: integer
 *           example: 1
 *         username:
 *           type: string
 *           example: johndoe
 *         email:
 *           type: string
 *           format: email
 *           example: johndoe@example.com
 *     UpdateUserResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "update success"
 *         result:
 *           type: object
 *           example: {}
 *         token:
 *           type: string
 *           example: "new_jwt_token"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "error message"
 *         error:
 *           type: object
 *           example: {}
 */


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: สมัครสมาชิกด้วย username, email และ password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Registration failed (e.g., password not match, email already exists)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', AuthController.register)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: เข้าสู่ระบบโดยใช้ email และ password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Login failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', AuthController.login)

/**
 * @swagger
 * /auth/update:
 *   put:
 *     summary: Update user profile
 *     description: อัปเดตข้อมูลผู้ใช้ (username, email)
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserResponse'
 *       400:
 *         description: Update failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/update', AuthController.updateuser)


/**
 * @swagger
 * /auth/checkjwttoken:
 *   post:
 *     summary: Validate JWT token
 *     description: ตรวจสอบว่า JWT Token ใช้งานได้หรือไม่
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "token authentication success"
 *                 user:
 *                   type: object
 *                   example:
 *                     id: 1
 *                     username: johndoe
 *                     email: johndoe@example.com
 *       403:
 *         description: Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/checkjwttoken', AuthController.checkjwttoken)

module.exports = router