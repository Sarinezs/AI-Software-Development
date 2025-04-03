const express = require('express')
const router = express.Router()
const gethist = require('../Controllers/GetHistoryController')


/**
 * @swagger
 * components:
 *   schemas:
 *     GetHistoryRequest:
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
 *           example: "2024-01-01"
 *         EndMonth:
 *           type: string
 *           format: date
 *           example: "2024-01-31"
 *         token:
 *           type: string
 *           example: "user-token-123"
 *         deals:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               trade_id:
 *                 type: integer
 *                 example: 101
 *               profit:
 *                 type: number
 *                 example: 500.75
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Error fetching history"
 *         error:
 *           type: object
 *           example: {}
 */


/**
 * @swagger
 * /get-history:
 *   post:
 *     summary: Fetch user history and create bill
 *     description: ดึงประวัติการเทรดของผู้ใช้ และส่งข้อมูลไปสร้างใบเรียกเก็บเงิน
 *     tags:
 *       - History
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetHistoryRequest'
 *     responses:
 *       200:
 *         description: Successfully fetched history and sent data to create bill
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "History fetched and bill created successfully"
 *       400:
 *         description: Bad request (Missing parameters)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', gethist.get_history)

module.exports = router;