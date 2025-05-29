const mongoose = require("mongoose")
const Schema = mongoose.Schema

const diarySchema = new Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		seriesId: {
			type: Schema.Types.ObjectId,
			ref: "Series",
			required: true,
		},
		diaryId: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		diaries: {
			type: String,
			required: true,
		},
		likes: [
			{
				userId: String,
			},
		],
		views: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model("Diary", diarySchema)
