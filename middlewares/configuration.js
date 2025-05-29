const { appName, baseUrl } = require("../config")

const configuration = async (req, res, next) => {
	try {
		res.locals.appName = appName
		res.locals.baseUrl = baseUrl
		res.locals.selectedMode = "dark-mode"
		next()
	} catch (error) {
		next(error)
	}
}

module.exports = configuration
