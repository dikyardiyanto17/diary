module.exports = {
	appName: "Diary",
	baseUrl: "http://localhost:9222",
	port: 9222,
	encodedLimit: "50mb",
	http: true,
	expressSessionConfiguration: {
		resave: false,
		saveUninitialized: false,
		cookie: {
			// secure: true,
			secure: false, // it should be true for production
			sameSite: true,
			maxAge: 2 * 60 * 60 * 1000, // 2 hour in milliseconds
		},
	},
}
