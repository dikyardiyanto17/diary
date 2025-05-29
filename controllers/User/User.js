const { hashPassword } = require("../../helpers/bcryptjs.js")
const { generateRandomId } = require("../../helpers/index.js")
const User = require("../../schema/Users.js")
class Users {
	static async post(req, res, next) {
		try {
			const { username, password, petname } = req.body

			if (!username || !password || !petname) {
				throw { name: "badrequest", message: "User field is missing" }
			}

			if (password <= 7) {
				throw { name: "badrequest", message: "Password must be atleast 8 character" }
			}

			const duplicatedUser = await User.findOne({ username })
			if (duplicatedUser) {
				throw { name: "duplicateddata", message: "Username is already exist" }
			}

			let randomId
			let duplicatedRandomId
			do {
				randomId = await generateRandomId(8, "_", 4)
				duplicatedRandomId = await User.findOne({ userId: randomId })
			} while (duplicatedRandomId)

			const newUser = await User.create({ username, password: await hashPassword(password), petname, userId: randomId })
			const userResponse = newUser.toObject()
			delete userResponse.password

			await res.status(201).json({
				error: "",
				message: "Account created successfully",
				rawData: [userResponse],
			})
		} catch (error) {
			next(error)
		}
	}
}

module.exports = { Users }
