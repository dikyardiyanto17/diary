const { generateRandomId } = require("../../helpers/index.js")
const Users = require("../../schema/Users.js")
const Diaries = require("../../schema/Diaries.js")
const Series = require("../../schema/Series.js")
const Comments = require("../../schema/Comment.js")

class Comment {
	static async post(req, res, next) {
		try {
			const { relatedid } = req.params
			const { relatedtype, comment } = req.body
			const userId = req.user?.id
			const petname = req.user?.petname

			if (!relatedid) {
				throw { name: "notfounddata", message: "ID is not valid or found" }
			}

			if (!userId) {
				throw { name: "notfounddata", message: "User is not valid or found, please login first!" }
			}

			if (!["Diary", "Series"].includes(relatedtype)) {
				throw { name: "badrequest", message: "Invalid related type" }
			}

			const Model = relatedtype === "Diary" ? Diaries : Series
			const relatedDoc = await Model.findById(relatedid)

			if (!relatedDoc) {
				throw { name: "notfounddata", message: `${relatedtype} not found` }
			}

			const user = await Users.findById(userId)
			if (!user) {
				throw { name: "notfounddata", message: "User is not valid or found, please login first!" }
			}

			const newComment = await Comments.create({
				userId,
				petname,
				comment,
				relatedType: relatedtype,
				relatedId: relatedid,
				commentId: await generateRandomId(12, "_", 2),
			})

			await res.status(201).json({ error: "", message: "Comment posted", rawData: [{ ...newComment.toObject() }] })
		} catch (error) {
			next(error)
		}
	}

	static async delete(req, res, next) {
		try {
			const { commentid } = req.params
			const userId = req.user?.id

			if (!commentid) {
				throw { name: "notfounddata", message: "ID is not valid or found" }
			}

			if (!userId) {
				throw { name: "notfounddata", message: "User is not valid or found, please login first!" }
			}

			const comment = await Comments.findById(commentid)
			if (!comment) {
				throw { name: "notfounddata", message: "Comment is not found" }
			}

			if (comment.userId.toString() !== userId.toString()) {
				throw { name: "unauthorized", message: "Unauthorized action" }
			}

			await Comments.deleteOne({ _id: commentid })

			await res.status(200).json({ error: "", message: "Comment deleted successfully", rawDate: [] })
		} catch (error) {
			next(error)
		}
	}
}

module.exports = { Comment }
