const express = require("express")
const { SeriesController } = require("../../../controllers/Series/Series.js")
const authorization = require("../../../middlewares/authorization.js")
const router = express.Router()

router.post("/", authorization, SeriesController.post)
router.put("/:seriesid", authorization, SeriesController.put)
router.delete("/:seriesid", authorization, SeriesController.delete)

module.exports = router
