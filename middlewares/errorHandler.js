const errorHandler = (err, req, res, next) => {
	// console.log("- Error : ", err.name)
	console.log("- Error : ", err)
	if (err.name == "badrequest") {
		res.status(400).json({ name: err.name, message: err.message })
	} else if (err.name == "Registered" || err.name == "Invalid") {
		res.status(401).json({ name: err.name, message: err.message })
	} else if (err.name == "forbidden" || err.name == "unauthorized") {
		res.status(403).json({ name: err.name, message: err.message })
	} else if (err.name == "duplicateddata" || err.name == "notfounddata") {
		res.status(404).json({ name: err.name, message: err.message })
	} else if (err.name == "JsonWebTokenError") {
		res.status(401).json({ name: err.name, message: err.message })
	} else if (err.name == "CastError" || err.name == "notfoundpage") {
		res.render("pages/notfound/index")
	} {
		res.status(500).json({ name: "Internal Error Server", message: err.message })
	}
}

module.exports = errorHandler
