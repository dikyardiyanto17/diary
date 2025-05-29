class Controller {
	static home(req, res, next) {
		try {
			res.render("pages/home/index")
		} catch (error) {
			next.log(error)
		}
	}

	static login(req, res, next) {
		try {
			res.render("pages/login/index")
		} catch (error) {
			next.log(error)
		}
	}

	static signup(req, res, next) {
		try {
			res.render("pages/signup/index")
		} catch (error) {
			next.log(error)
		}
	}

	static user(req, res, next) {
		try {
			res.render("pages/user/index")
		} catch (error) {
			next(error)
		}
	}

	static series(req, res, next) {
		try {
			const urlUserId = req.params.userid
			const loggedInUserId = req.user?.id

			const canPost = urlUserId === loggedInUserId
			res.render("pages/series/index", {
				userId: urlUserId,
				canPost,
			})
		} catch (error) {
			next(error)
		}
	}
}
module.exports = Controller
