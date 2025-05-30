const express = require("express")
const Controller = require("../controllers")
const authCheck = require("../middlewares/authCheck.js")
const authentication = require("../middlewares/authentication.js")
const authorization = require("../middlewares/authorization.js")
const router = express.Router()

router.use(authentication)

router.get("/", Controller.home)
router.get("/login", authCheck, Controller.login)
router.get("/signup", authCheck, Controller.signup)
router.get("/diary/create/:seriesid", authorization, Controller.diaryCreate)
router.get("/diary/detail/:diaryid", Controller.diaryDetail)
router.get("/diary/:seriesid", Controller.diary)
router.get("/series/:userid", Controller.series)

router.use("/api", require("./api/index.js"))

module.exports = router
