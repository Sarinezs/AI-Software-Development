const express = require('express')
const router = express.Router()
const BillControllers = require('../Controllers/BillControllers')

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     CreateBillRequest:
 *       type: object
 *       required:
 *         - StartMonth
 *         - EndMonth
 *         - token
 *         - deals
 *       properties:
 *         StartMonth:
 *           type: string
 *           format: date
 *           example: "2025-01-01"
 *         EndMonth:
 *           type: string
 *           format: date
 *           example: "2025-01-31"
 *         token:
 *           type: string
 *           example: "q4leyayqs6m2dcdd7cbcnucsobkmu21kp"
 *         deals:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               profit:
 *                 type: number
 *                 example: 500.75
 *     Bill:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 123
 *         mt5_accountid:
 *           type: integer
 *           example: 456789
 *         amount:
 *           type: number
 *           example: 50.00
 *         status:
 *           type: string
 *           enum: [unpaid, complete, no profit]
 *           example: "unpaid"
 *         start_date:
 *           type: string
 *           format: date
 *           example: "2025-01-01"
 *         end_date:
 *           type: string
 *           format: date
 *           example: "2025-01-31"
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
 * /createbill:
 *   post:
 *     summary: Create a new bill
 *     description: สร้างใบเรียกเก็บเงินสำหรับผู้ใช้ตามระยะเวลาที่กำหนด
 *     tags:
 *       - Bill
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBillRequest'
 *     responses:
 *       200:
 *         description: Bill created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bill created successfully"
 *       400:
 *         description: Error creating bill
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', BillControllers.create_bill)

/**
 * @swagger
 * /createbill/getbills:
 *   get:
 *     summary: Get unpaid bills
 *     description: ดึงใบเรียกเก็บเงินที่ยังไม่ได้ชำระของผู้ใช้ที่ล็อกอิน
 *     tags:
 *       - Bill
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of unpaid bills
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bills:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Bill'
 *       403:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/getbills', BillControllers.get_bills)

/**
 * @swagger
 * /createbill/getbills_history:
 *   get:
 *     summary: Get bill payment history
 *     description: ดึงประวัติใบเรียกเก็บเงินที่ชำระแล้วของผู้ใช้ที่ล็อกอิน
 *     tags:
 *       - Bill
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of completed bills
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bills:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Bill'
 *       403:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/getbills_history', BillControllers.get_bills_history)


router.get('/getincome', BillControllers.get_income)

module.exports = router;