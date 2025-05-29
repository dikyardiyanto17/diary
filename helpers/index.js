const generateRandomId = (length = 12, separator = "-", separatorInterval = 4) => {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	let randomId = ""

	for (let i = 0; i < length; i++) {
		if (i > 0 && i % separatorInterval === 0) {
			randomId += separator
		}

		const randomIndex = Math.floor(Math.random() * characters.length)
		randomId += characters.charAt(randomIndex)
	}

	return randomId
}

const getInitials = (petname) => {
	const words = petname
		.trim()
		.split(/\s+/)
		.map((w) => w.replace(/[^a-z]/gi, ""))

	if (words.length === 1) {
		return words[0].substring(0, 2).toUpperCase()
	}

	return (words[0][0] + words[1][0]).toUpperCase()
}

module.exports = { generateRandomId, getInitials }
