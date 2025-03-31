const express = require('express')
const router = express.Router()
const FileController = require('../Controllers/FileController')

router.get('/', FileController.download)

module.exports = router;