const { generateRandomId } = require("../../helpers/index.js")
const mongoose = require("mongoose")
const Diaries = require("../../schema/Diaries.js")
const Series = require("../../schema/Series.js")
class SeriesController {
	static async post(req, res, next) {
		try {
			const { title, isPrivate, description } = req.body
			const { id } = req.user
			if (!title || !description) {
				throw { name: "badrequest", message: "User field is missing" }
			}
			const duplicatedSeries = await Series.findOne({ title, userId: id })

			if (duplicatedSeries) {
				throw { name: "duplicateddata", message: "Title is already exist" }
			}

			let randomId
			let duplicatedRandomId
			do {
				randomId = await generateRandomId(12, "_", 3)
				duplicatedRandomId = await Series.findOne({ seriesId: randomId })
			} while (duplicatedRandomId)

			const newSeries = await Series.create({ title, description, userId: id, private: isPrivate, seriesId: randomId })

			const response = newSeries.toObject()

			await res.status(201).json({
				error: "",
				message: "Series created successfully",
				rawData: [response],
			})
		} catch (error) {
			next(error)
		}
	}

	static async put(req, res, next) {
		try {
			const { seriesid } = req.params
			const { id } = req.user

			if (!seriesid) {
				throw { name: "notfounddata", message: "ID is not valid or found" }
			}

			const session = await mongoose.startSession()
			await session.startTransaction()

			const series = await Series.findById(seriesid).session(session)

			if (!series) {
				throw { name: "notfounddata", message: "Series is not found" }
			}

			if (series.userId.toString() !== id.toString()) {
				throw { name: "unauthorized", message: "Unauthorized action" }
			}

			await Diaries.updateMany({ seriesId: seriesid }, { private: req.body.private }).session(session)

			await Series.updateOne({ _id: seriesid }, req.body).session(session)

			await session.commitTransaction()
			await session.endSession()
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
			const { seriesid } = req.params
			const { id } = req.user
			if (!seriesid) {
				throw { name: "notfounddata", message: "ID is not valid or found" }
			}

			const session = await mongoose.startSession()
			await session.startTransaction()

			const series = await Series.findById(seriesid).session(session)

			if (!series) {
				throw { name: "notfounddata", message: "Series is not found" }
			}

			if (series.userId.toString() != id.toString()) {
				throw { name: "unauthorized", message: "Unauthorized action" }
			}

			await Diaries.deleteMany({ seriesId: seriesid }).session(session)
			await Series.deleteOne({ _id: seriesid }).session(session)

			await session.commitTransaction()
			await session.endSession()

			await res.status(200).json({ error: "", message: "Series deleted successfully", rawDate: [] })
		} catch (error) {
			next(error)
		}
	}
}

module.exports = { SeriesController }
