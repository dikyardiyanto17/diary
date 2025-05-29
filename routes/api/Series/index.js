const express = require("express")
const { SeriesController } = require("../../../controllers/Series/Series.js")
const authorization = require("../../../middlewares/authorization.js")
const router = express.Router()

router.post("/", authorization, SeriesController.post)

module.exports = router
