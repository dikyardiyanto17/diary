const mongoose = require("mongoose")
const Schema = mongoose.Schema

const commentSchema = new Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		petname: {
			type: String,
			required: true,
		},
		comment: {
			type: String,
			required: true,
			maxlength: [100, "Comment cannot exceed 100 characters"],
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
		commentId: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model("Comment", commentSchema)
