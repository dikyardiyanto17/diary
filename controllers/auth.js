const { comparePassword } = require("../helpers/bcryptjs")
const { encodeToken } = require("../helpers/jwt.js")
const User = require("../schema/Users.js")

class Auth {
	static async login(req, res, next) {
		try {
			const { username, password } = req.body
			if (!username || !password) {
				throw { name: "badrequest", message: "Username and password are required" }
			}

			const user = await User.findOne({ username })
			if (!user) {
				throw { name: "invalid", message: "Invalid username or password" }
			}

			const isMatch = await comparePassword(password, user.password)
			if (!isMatch) {
				throw { name: "invalid", message: "Invalid username or password" }
			}

			const { password: _, ...userWithoutPassword } = user.toObject()

			const encodedUserToken = await encodeToken({
				id: user._id,
				username: user.username,
				petname: user.petname,
			})

			req.session.token = encodedUserToken

			await res.status(200).json({
				error: "",
				message: "Login successful",
				rawData: [userWithoutPassword],
			})
		} catch (error) {
			next(error)
		}
	}

	static async logout(req, res, next) {
		try {
			req.session.destroy((err) => {
				if (err) return next(err)
				res.redirect("/")
			})
		} catch (error) {
			next(error)
		}
	}
}

module.exports = Auth
