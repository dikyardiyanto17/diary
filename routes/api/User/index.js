const express = require("express")
const { Users } = require("../../../controllers/User/User.js")
const router = express.Router()

router.post("/", Users.post)

module.exports = router
