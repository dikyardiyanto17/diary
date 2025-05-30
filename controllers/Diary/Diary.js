const { generateRandomId } = require("../../helpers/index.js")
const Diaries = require("../../schema/Diaries.js")
const Series = require("../../schema/Series.js")
const Users = require("../../schema/Users.js")
class Diary {
	static async post(req, res, next) {
		try {
			const { seriesid } = req.params
			const { title, isPrivate, description, content } = req.body
			const { id } = req.user

			if (!seriesid) {
				throw { name: "unauthorized", message: "Unauthorized action" }
			}
			const seriesExist = await Series.findById(seriesid)
			if (!seriesExist) {
				throw { name: "notfounddata", message: "Series is not found" }
			}

			if (!title || !description || !content) {
				throw { name: "badrequest", message: "Diary field is missing" }
			}
			const duplicatedDiaries = await Diaries.findOne({ title, userId: id })

			if (duplicatedDiaries) {
				throw { name: "duplicateddata", message: "Title is already exist" }
			}

			let randomId
			let duplicatedRandomId
			do {
				randomId = await generateRandomId(15, "_", 3)
				duplicatedRandomId = await Diaries.findOne({ diaryId: randomId })
			} while (duplicatedRandomId)

			const newSDiaries = await Diaries.create({
				title,
				seriesId: seriesid,
				description,
				userId: id,
				private: seriesExist.private ? true : isPrivate,
				diaryId: randomId,
				content,
			})

			const response = newSDiaries.toObject()

			await res.status(201).json({
				error: "",
				message: "Diary created successfully",
				rawData: [response],
			})
		} catch (error) {
			next(error)
		}
	}

	static async put(req, res, next) {
		try {
			const { diaryid } = req.params
			const { id } = req.user

			if (!diaryid) {
				throw { name: "notfounddata", message: "ID is not valid or found" }
			}

			const diary = await Diaries.findById(diaryid)

			if (!diary) {
				throw { name: "notfounddata", message: "Diary is not found" }
			}

			if (diary.userId.toString() !== id.toString()) {
				throw { name: "unauthorized", message: "Unauthorized action" }
			}

			const series = await Series.findById(diary.seriesId)
			if (series.private && !req.body.private) {
				throw { name: "badrequest", message: "Cant change diary to public when series is in private, set the series to public first!" }
			}

			await Diaries.updateOne({ _id: diaryid }, req.body)

			await res.status(200).json({
				error: "",
				message: "Series updated successfully",
				rawData: [],
			})
		} catch (error) {
			next(error)
		}
	}

	static async delete(req, res, next) {
		try {
			const { diaryid } = req.params
			const { id } = req.user

			if (!diaryid) {
				throw { name: "notfounddata", message: "ID is not valid or found" }
			}

			const diary = await Diaries.findById(diaryid)

			if (!diary) {
				throw { name: "notfounddata", message: "Diary is not found" }
			}

			if (diary.userId.toString() !== id.toString()) {
				throw { name: "unauthorized", message: "Unauthorized action" }
			}

			const series = await Series.findById(diary.seriesId)
			if (series.private && !req.body.private) {
				throw { name: "badrequest", message: "Cant change diary to public when series is in private, set the series to public first!" }
			}

			await Diaries.deleteOne({ _id: diaryid })

			await res.status(200).json({ error: "", message: "Series deleted successfully", rawDate: [] })
		} catch (error) {
			next(error)
		}
	}

	static async likeDiary(req, res, next) {
		try {
			const { diaryid } = req.params
			const userId = req.user?.id

			if (!diaryid) {
				throw { name: "notfounddata", message: "Diary id is not valid or found" }
			}

			if (!userId) {
				throw { name: "notfounddata", message: "User is not valid or found, please login first!" }
			}

			const diary = await Diaries.findById(diaryid)
			if (!diary) {
				throw { name: "notfounddata", message: "Diary id is not valid" }
			}

			const user = await Users.findById(userId)
			if (!user) {
				throw { name: "notfounddata", message: "User is not valid or found, please login first!" }
			}

			const alreadyLiked = diary.likes.some((like) => like.userId === userId)
			if (alreadyLiked) {
				throw { name: "badrequest", message: "Diary already liked" }
			}

			diary.likes.push({ userId })
			await diary.save()

			await res.status(200).json({ error: "", message: "Like succedded", rawData: [] })
		} catch (error) {
			next(error)
		}
	}

	static async unlikeDiary(req, res, next) {
		try {
			const { diaryid } = req.params
			const userId = req.user?.id

			if (!diaryid) {
				throw { name: "notfounddata", message: "Diary id is not valid or found" }
			}

			if (!userId) {
				throw { name: "notfounddata", message: "User is not valid or found, please login first!" }
			}

			const diary = await Diaries.findById(diaryid)
			if (!diary) {
				throw { name: "notfounddata", message: "Diary id is not valid" }
			}

			const user = await Users.findById(userId)
			if (!user) {
				throw { name: "notfounddata", message: "User is not valid or found, please login first!" }
			}

			const alreadyLiked = diary.likes.some((like) => like.userId === userId)
			if (!alreadyLiked) {
				throw { name: "badrequest", message: "Diary not liked yet" }
			}

			diary.likes = diary.likes.filter((like) => like.userId !== userId)
			await diary.save()

			await res.status(200).json({ error: "", message: "Unlike succeeded", rawData: [] })
		} catch (error) {
			next(error)
		}
	}
}

module.exports = { Diary }
