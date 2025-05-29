const { decodeToken } = require("../helpers/jwt")

const authCheck = async (req, res, next) => {
	try {
		if (req.session.token) {
			const decodedToken = await decodeToken(req.session.token)
			if (!decodedToken) {
				await res.redirect("/")
				return
			}
			next()
		}

		next()
	} catch (error) {
		next(error)
	}
}

module.exports = authCheck
