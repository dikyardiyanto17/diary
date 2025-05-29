const bcrypt = require("bcryptjs")

const hashPassword = async (password) => {
	let salt = await bcrypt.genSaltSync(10)
	let hash = await bcrypt.hashSync(password, salt)
	return (password = hash)
}

const comparePassword = async (inputPassword, password) => {
	let isValidPassword = await bcrypt.compareSync(inputPassword, password)
	return isValidPassword
}

module.exports = { hashPassword, comparePassword }
