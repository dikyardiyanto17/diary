const Comment = require("../schema/Comment")
const Diaries = require("../schema/Diaries")
const Series = require("../schema/Series")
const Users = require("../schema/Users")

class Controller {
	static async home(req, res, next) {
		try {
			const series = await Series.find({ private: false })

			const newSeriesData = await Promise.all(
				series.map(async (x) => {
					const user = await Users.findById(x.userId)
					const diaries = await Diaries.find({ seriesId: x._id.toString() })

					const diaryIds = diaries.map((d) => d._id.toString())

					const totalLikes = diaries.reduce((acc, diary) => acc + (diary.likes?.length || 0), 0)

					const totalCommentsFromDiaries = await Comment.countDocuments({
						relatedType: "Diary",
						relatedId: { $in: diaryIds },
					})

					const totalCommentsFromSeries = await Comment.countDocuments({
						relatedType: "Series",
						relatedId: x._id.toString(),
					})

					const totalComments = totalCommentsFromSeries + totalCommentsFromDiaries

					return {
						...x.toObject(),
						petname: user?.petname || "Unknown",
						totalLikes,
						totalComments,
					}
				})
			)

			await res.render("pages/home/index", { rawData: newSeriesData })
		} catch (error) {
			next(error)
		}
	}

	static async login(req, res, next) {
		try {
			await res.render("pages/login/index")
		} catch (error) {
			next.log(error)
		}
	}

	static async signup(req, res, next) {
		try {
			await res.render("pages/signup/index")
		} catch (error) {
			next.log(error)
		}
	}

	static async diary(req, res, next) {
		try {
			const { seriesid } = req.params
			const loggedInUserId = req.user?.id

			if (!seriesid) {
				throw { name: "notfoundpage", message: "Invalid series ID" }
			}

			const seriesExist = await Series.findById(seriesid)
			if (!seriesExist) {
				throw { name: "notfoundpage", message: "Series not found" }
			}

			const canPost = seriesExist.userId == loggedInUserId
			const query = {
				seriesId: seriesid,
				...(canPost ? {} : { private: false }),
			}

			const user = await Users.findById(seriesExist.userId)
			if (!user || (seriesExist.private && seriesExist.userId != loggedInUserId)) {
				throw { name: "notfoundpage", message: "User not found" }
			}

			const diaries = await Diaries.find(query).sort({ updatedAt: -1 })
			const baseUrl = res.locals.baseUrl

			const enhancedDiaries = await Promise.all(
				diaries.map(async (diary) => {
					const obj = diary.toObject()
					const content = obj.content || ""

					const commentCount = await Comment.countDocuments({
						relatedType: "Diary",
						relatedId: diary._id.toString(),
					})

					let image = `${baseUrl}/assets/images/default_picture.png`
					if (content.includes("<img")) {
						const match = content.match(/<img[^>]+src="([^">]+)"/)
						if (match && match[1]) {
							image = match[1]
						}
					}

					obj.image = image
					obj.totalComments = commentCount
					return obj
				})
			)

			const seriesComments = await Comment.find({ relatedType: "Series", relatedId: seriesExist._id.toString() }).sort({ updatedAt: -1 })

			await res.render("pages/diary/index", {
				canPost,
				seriesid: seriesid,
				private: seriesExist.private,
				petname: user.petname,
				rawData: enhancedDiaries,
				comments: seriesComments,
			})
		} catch (error) {
			next(error)
		}
	}

	static async diaryDetail(req, res, next) {
		try {
			const { diaryid } = req.params
			const loggedInUserId = req.user?.id

			if (!diaryid) {
				throw { name: "notfoundpage", message: "Diary not found" }
			}

			const diary = await Diaries.findById(diaryid)
			if (!diary) {
				throw { name: "notfoundpage", message: "Diary not found" }
			}

			const diaryData = diary.toObject()
			const canUpdate = diaryData.userId == req.user?.id

			if (diaryData.private && diaryData.userId.toString() !== loggedInUserId) {
				throw { name: "notfoundpage", message: "Diary not found" }
			}

			const diaryUser = await Users.findById(diaryData.userId.toString())
			const diaryComments = await Comment.find({ relatedType: "Diary", relatedId: diary._id.toString() }).sort({ updatedAt: -1 })

			await res.render("pages/diary/detail", {
				rawData: [diaryData],
				comments: diaryComments,
				petname: (await diaryUser.toObject()?.petname) || "Unknown",
				userId: diaryUser._id.toString(),
				canUpdate,
				diaryid: diary._id.toString(),
				private: diary.private,
			})
		} catch (error) {
			next(error)
		}
	}

	static async diaryCreate(req, res, next) {
		try {
			const { seriesid } = req.params
			const loggedInUserId = req.user?.id
			if (!seriesid) {
				throw { name: "notfoundpage", message: "Invalid series id" }
			}

			const seriesExist = await Series.findById(seriesid)
			if (!seriesExist) {
				throw { name: "notfoundpage", message: "Series is not found" }
			}

			if (seriesExist.userId.toString() != loggedInUserId) {
				throw { name: "notfoundpage", message: "Unathorized access" }
			}
			await res.render("pages/diary/post", { seriesId: seriesid })
		} catch (error) {
			next(error)
		}
	}

	static async series(req, res, next) {
		try {
			const urlUserId = req.params.userid
			const loggedInUserId = req.user?.id

			const canPost = urlUserId === loggedInUserId

			const query = {
				userId: urlUserId,
				...(canPost ? {} : { private: false }),
			}

			const series = await Series.find(query)
			let userpetName

			const newSeriesData = await Promise.all(
				series.map(async (x) => {
					const user = await Users.findById(x.userId)
					userpetName = user?.petname || "Unknown"

					const diaries = await Diaries.find({ seriesId: x._id.toString() })
					const diaryIds = diaries.map((d) => d._id.toString())

					const totalLikes = diaries.reduce((acc, diary) => acc + (diary.likes?.length || 0), 0)

					const totalCommentsFromDiaries = await Comment.countDocuments({
						relatedType: "Diary",
						relatedId: { $in: diaryIds },
					})

					const totalCommentsFromSeries = await Comment.countDocuments({
						relatedType: "Series",
						relatedId: x._id.toString(),
					})

					const totalComments = totalCommentsFromSeries + totalCommentsFromDiaries

					return {
						...x.toObject(),
						petname: user?.petname || "Unknown",
						totalLikes,
						totalComments,
					}
				})
			)

			if (newSeriesData.length === 0) {
				const user = await Users.findById(urlUserId)
				userpetName = user?.petname || "Unknown"
			}

			res.render("pages/series/index", {
				userId: urlUserId,
				canPost,
				petname: userpetName,
				rawData: [...newSeriesData],
			})
		} catch (error) {
			console.error(error)
			next(error)
		}
	}
}
module.exports = Controller
