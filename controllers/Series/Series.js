const { generateRandomId } = require("../../helpers/index.js")
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
				duplicatedRandomId = await Series.findOne({ series: randomId })
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
}

module.exports = { SeriesController }
