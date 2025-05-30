const { appName, baseUrl } = require("../config")

const configuration = async (req, res, next) => {
	try {
		res.locals.appName = appName
		res.locals.baseUrl = baseUrl
		next()
	} catch (error) {
		next(error)
	}
}

module.exports = configuration
