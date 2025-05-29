const express = require("express")
const Controller = require("../controllers")
const authCheck = require("../middlewares/authCheck.js")
const authentication = require("../middlewares/authentication.js")
const router = express.Router()

router.use(authentication)

router.get("/", Controller.home)
router.get("/login", authCheck, Controller.login)
router.get("/signup", authCheck, Controller.signup)
router.get("/series/:userid", Controller.series)

router.use("/api/user", require("./api/User/index.js"))
router.use("/api/auth", require("./api/Auth/index.js"))
router.use("/api/series", require("./api/Series/index.js"))

module.exports = router
