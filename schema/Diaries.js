const mongoose = require("mongoose")
const Schema = mongoose.Schema

const diarySchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		diaryId: {
			type: String,
			required: true,
		},
		seriesId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "Series",
		},
		title: {
			type: String,
			required: [true, "Title is required"],
			maxlength: [20, "Title cannot exceed 20 characters"],
		},
		description: {
			type: String,
			required: [true, "Description is required"],
			maxlength: [100, "Description cannot exceed 100 characters"],
		},
		content: {
			type: String,
			required: [true, "Description is required"],
		},
		likes: [
			{
				userId: String,
			},
		],
		private: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model("Diary", diarySchema)
