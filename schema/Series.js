const mongoose = require("mongoose")
const Schema = mongoose.Schema

const seriesSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		seriesId: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: [true, "Title is required"],
			maxlength: [20, "Title cannot exceed 20 characters"],
		},
		description: {
			type: String,
			required: [true, "Description is required"],
			maxlength: [50, "Description cannot exceed 50 characters"],
		},
		diaries: [
			{
				type: Schema.Types.ObjectId,
				ref: "Diary",
			},
		],
		likes: [
			{
				userId: String,
			},
		],
		views: {
			type: Number,
			default: 0,
		},
		private: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model("Series", seriesSchema)
