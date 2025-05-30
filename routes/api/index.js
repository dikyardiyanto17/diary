const express = require("express")
const router = express.Router()


router.use("/user", require("./User/index.js"))
router.use("/auth", require("./Auth/index.js"))
router.use("/series", require("./Series/index.js"))
router.use("/diary", require("./Diary/index.js"))
router.use("/comment", require("./Comment/index.js"))

module.exports = router
