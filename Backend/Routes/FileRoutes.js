const express = require('express')
const router = express.Router()
const FileController = require('../Controllers/FileController')


/**
 * @swagger
 * /download:
 *   get:
 *     summary: Download the TradeX.mq5 file
 *     description: ให้ผู้ใช้ที่มี JWT Token ถูกต้องสามารถดาวน์โหลดไฟล์ TradeX.mq5
 *     tags:
 *       - File
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.get('/', FileController.download)

module.exports = router;