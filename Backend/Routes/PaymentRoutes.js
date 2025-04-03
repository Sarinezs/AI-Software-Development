const express = require('express')
const router = express.Router()
const PaymentController = require('../Controllers/PaymentControllers')


/**
 * @swagger
 * /payment/checkout:
 *   post:
 *     summary: Checkout payment for a bill
 *     description: สร้าง session การชำระเงินผ่าน Stripe สำหรับค่าใช้บริการ
 *     tags:
 *       - Payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bill:
 *                 type: object
 *                 properties:
 *                   bill_id:
 *                     type: integer
 *                     example: 123
 *                   amount:
 *                     type: number
 *                     example: 1000
 *     responses:
 *       200:
 *         description: Successfully created checkout session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionId:
 *                   type: string
 *                   example: "cs_test_a1b2c3d4e5f6g7h8"
 *       400:
 *         description: Bill already complete
 *       500:
 *         description: Server error
 */
router.post('/checkout',PaymentController.checkout)


module.exports = router;