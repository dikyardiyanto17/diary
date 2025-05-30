const express = require("express")
const { Comment } = require("../../../controllers/Comment/Comment")
const router = express.Router()

router.post("/:relatedid", Comment.post)
router.delete("/:commentid", Comment.delete)

module.exports = router
