const { getInitials } = require("../helpers")
const { decodeToken } = require("../helpers/jwt")

const authorization = async (req, res, next) => {
	try {
		if (!req.session.token) {
			throw { name: "unauthorized", message: "Unathorized access" }
		}
		const decodedToken = await decodeToken(req.session.token)
		if (!decodedToken) {
			throw { name: "unauthorized", message: "Unathorized access" }
		}
		req.authorizedUser = {
			username: decodedToken.username,
			id: decodedToken.id,
			petname: decodedToken.petname,
			initial: await getInitials(decodedToken.petname),
		}
		next()
	} catch (error) {
		next(error)
	}
}

module.exports = authorization
