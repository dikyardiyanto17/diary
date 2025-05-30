document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("login-form")
	form.addEventListener("submit", async (e) => {
		try {
			e.preventDefault()
			const inputs = form.querySelectorAll(".login-input")
			const [username, password] = [...inputs].map((input) => input.value.trim())
			if (!username || !password) {
				throw { message: "Field must be completed" }
			}

			const response = await fetch(`${baseUrl}/api/auth`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
			})

			const result = await response.json()

			if (response.ok) {
				await infoModal({ time: 3000, message: result.message, icons: "fa-solid fa-check fa-beat-fade", color: "#63E6BE" })
				window.location.href = `${baseUrl}/`
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
