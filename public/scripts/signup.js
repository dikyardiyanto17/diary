document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("signup-form")
	form.addEventListener("submit", async (e) => {
		try {
			e.preventDefault()
			const inputs = form.querySelectorAll(".signup-input")
			const [username, petname, password] = [...inputs].map((input) => input.value.trim())
			if (!username || !petname || !password) {
				throw { message: "Field must be completed" }
			}

			if (password.length <= 7) {
				throw { message: "Password must be atleast 8 character" }
			}
			const response = await fetch(`${baseUrl}/api/user`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, petname, password }),
			})

			const result = await response.json()


			if (response.ok) {
				await infoModal({ time: 5000, message: result.message, icons: "fa-solid fa-check fa-beat-fade", color: "#63E6BE" })
				window.location.href = `${baseUrl}/login`
			} else {
				throw { message: result.message }
			}
		} catch (error) {
			await infoModal({
				time: 5000,
				message: error.message || "Something went wrong",
				icons: "fa-solid fa-triangle-exclamation fa-beat-fade",
				color: "#ff3d3d",
			})
		}
	})
})
