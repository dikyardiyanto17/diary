const mongoose = require("mongoose")
const Schema = mongoose.Schema

const commentSchema = new Schema({
	userId: {
		type: String,
		required: true,
	},
	petname: String,
	comment: {
		type: String,
		required: true,
	},
	relatedType: {
		type: String,
		enum: ["Diary", "Series"],
		required: true,
	},
	relatedId: {
		type: Schema.Types.ObjectId,
		required: true,
		refPath: "relatedType",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

module.exports = mongoose.model("Comment", commentSchema)
