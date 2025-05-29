const { getInitials } = require("../helpers")
const { decodeToken } = require("../helpers/jwt")

const authentication = async (req, res, next) => {
	try {
		if (req.session.token) {
			const { username, id, petname } = await decodeToken(req.session.token)
			req.user = { username, id, petname, initial: await getInitials(petname) }
			res.locals.user = req.user
		} else {
			req.user = null
			res.locals.user = null
		}
		next()
	} catch (error) {
		next(error)
	}
}

module.exports = authentication
