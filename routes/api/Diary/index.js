const express = require("express")
const { Diary } = require("../../../controllers/Diary/Diary.js")
const authorization = require("../../../middlewares/authorization.js")
const router = express.Router()

router.post("/:seriesid", authorization, Diary.post)
router.post("/like/:diaryid", Diary.likeDiary)
router.post("/unlike/:diaryid", Diary.unlikeDiary)
router.put("/:diaryid", Diary.put)
router.delete("/:diaryid", Diary.delete)

module.exports = router
