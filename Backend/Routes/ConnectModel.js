const express = require('express')
const router = express.Router()
const model = require('../Controllers/ConnectModel')

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     ConnectModelRequest:
 *       type: object
 *       required:
 *         - token
 *         - model_id
 *       properties:
 *         token:
 *           type: string
 *           example: "6vufxhd6deio6w49228wkp8znqfrhzyr"
 *         model_id:
 *           type: integer
 *           example: 1
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Failed to connect to model server"
 *         error:
 *           type: object
 *           example: {}
 */


/**
 * @swagger
 * /model/connectModel:
 *   post:
 *     summary: Connect user to a model
 *     description: เชื่อมต่อบัญชี mt5 กับโมเดลที่ต้องการ โดยใช้ token และ model_id
 *     tags:
 *       - Model
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConnectModelRequest'
 *     responses:
 *       200:
 *         description: Connected to model server successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Connected to model server"
 *                 result:
 *                   type: object
 *       403:
 *         description: Unauthorized (Invalid Token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Bad request (Missing parameters)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/connectModel", model.connectmodel)


/**
 * @swagger
 * /model/getModelname/{model_id}:
 *   get:
 *     summary: Get model name by ID
 *     description: ดึงชื่อโมเดลจาก model_id
 *     tags:
 *       - Model
 *     parameters:
 *       - in: path
 *         name: model_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: The ID of the model
 *     responses:
 *       200:
 *         description: Successfully retrieved model name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get model name"
 *                 result:
 *                   type: string
 *                   example: "AI Trading Model"
 *       400:
 *         description: Invalid model ID
 *       500:
 *         description: Server error
 */
router.get("/getModelname/:model_id", model.getmodelnamebyid)


/**
 * @swagger
 * /model/getModelname:
 *   get:
 *     summary: Get all model names
 *     description: ดึงชื่อโมเดลทั้งหมดในระบบ
 *     tags:
 *       - Model
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all model names
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get all model name"
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       model_id:
 *                         type: integer
 *                         example: 1
 *                       model_name:
 *                         type: string
 *                         example: "AI Trading Model"
 *       403:
 *         description: Authentication error
 *       500:
 *         description: Server error
 *//model
router.get("/getModelname", model.getmodelname)


module.exports = router;