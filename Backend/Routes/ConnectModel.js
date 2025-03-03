const express = require('express')
const router = express.Router()
const model = require('../Controllers/ConnectModel')



router.post("/connectModel", model.connectmodel)
router.get("/getModelname/:model_id", model.getmodelnamebyid)
router.get("/getModelname", model.getmodelname)


module.exports = router;