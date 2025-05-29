const express = require("express")
const Auth = require("../../../controllers/auth.js")
const router = express.Router()

router.post("/", Auth.login)
router.post("/logout", Auth.logout)

module.exports = router
