const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const CreateMt5 = require('../Controllers/MT5Controllers')

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 *   schemas:
 *     CreateMT5Request:
 *       type: object
 *       required:
 *         - token
 *         - mt5id
 *         - mt5name
 *       properties:
 *         token:
 *           type: string
 *           example: "user-token-123"
 *         mt5id:
 *           type: integer
 *           example: 12345678
 *         mt5name:
 *           type: string
 *           example: "Trading Account"
 * 
 *     ConnectMT5Request:
 *       type: object
 *       required:
 *         - token
 *         - mt5id
 *         - action
 *         - balance
 *       properties:
 *         token:
 *           type: string
 *           example: "user-token-123"
 *         mt5id:
 *           type: integer
 *           example: 12345678
 *         action:
 *           type: string
 *           enum: [connect, disconnect]
 *           example: "connect"
 *         balance:
 *           type: number
 *           example: 10000.00
 * 
 *     DeleteMT5Request:
 *       type: object
 *       required:
 *         - mt5id
 *         - token
 *       properties:
 *         mt5id:
 *           type: integer
 *           example: 12345678
 *         token:
 *           type: string
 *           example: "user-token-123"
 * 
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Operation successful"
 */


/**
 * @swagger
 * /MT5/create:
 *   post:
 *     summary: Create a new MT5 account
 *     description: สร้างบัญชี MT5 ใหม่สำหรับผู้ใช้
 *     tags:
 *       - MT5 Account
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMT5Request'
 *     responses:
 *       200:
 *         description: Successfully created MT5 account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error creating MT5 account
 *       403:
 *         description: Authentication error
 *       500:
 *         description: Server error
 */
router.post("/create", CreateMt5.createmt5)

/**
 * @swagger
 * /MT5/connect:
 *   post:
 *     summary: Connect or disconnect an MT5 account
 *     description: ใช้เพื่อเชื่อมต่อ หรือยกเลิกการเชื่อมต่อบัญชี MT5
 *     tags:
 *       - MT5 Account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConnectMT5Request'
 *     responses:
 *       200:
 *         description: Successfully changed connection status
 *       400:
 *         description: Error in request
 *       500:
 *         description: Server error
 */
router.post("/connect", CreateMt5.connect)

/**
 * @swagger
 * /MT5/getaccount:
 *   get:
 *     summary: Get user MT5 accounts
 *     description: ดึงข้อมูลบัญชี MT5 ทั้งหมดของผู้ใช้
 *     tags:
 *       - MT5 Account
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved accounts
 *       403:
 *         description: Authentication error
 *       500:
 *         description: Server error
 */
router.get("/getaccount", CreateMt5.getaccount)

/**
 * @swagger
 * /MT5/deleteaccount:
 *   delete:
 *     summary: Delete an MT5 account
 *     description: ลบบัญชี MT5 ออกจากระบบ
 *     tags:
 *       - MT5 Account
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteMT5Request'
 *     responses:
 *       200:
 *         description: Successfully deleted account
 *       403:
 *         description: Authentication error
 *       500:
 *         description: Server error
 */
router.delete("/deleteaccount", CreateMt5.deletemt5)

/**
 * @swagger
 * /MT5/getnullmodelaccount:
 *   get:
 *     summary: Get MT5 accounts without a model
 *     description: ดึงบัญชี MT5 ที่ยังไม่มีการเชื่อมต่อกับโมเดล
 *     tags:
 *       - MT5 Account
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved accounts without a model
 *       403:
 *         description: Authentication error
 *       500:
 *         description: Server error
 */
router.get("/getnullmodelaccount", CreateMt5.getnullmodelmt5)


module.exports = router;