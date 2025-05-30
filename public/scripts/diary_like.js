document.querySelectorAll(".like-btn").forEach((button) => {
	button.addEventListener("click", async (e) => {
		e.preventDefault()
        e.stopPropagation()

		const diaryId = button.dataset.diaryid
		if (!diaryId) return

		const icon = button.querySelector("i")
		const countElem = button.querySelector("p")
		let count = parseInt(countElem.textContent, 10)

		const isLiked = icon.classList.contains("fa-solid")
		const url = isLiked ? `${baseUrl}/api/diary/unlike/${diaryId}` : `${baseUrl}/api/diary/like/${diaryId}`

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			})

			const result = await response.json()

			if (response.ok) {
				if (isLiked) {
					icon.classList.remove("fa-solid")
					icon.classList.add("fa-regular")
					count--
				} else {
					icon.classList.remove("fa-regular")
					icon.classList.add("fa-solid")
					count++
				}

				countElem.textContent = count
				await infoModal({ time: 3000, message: result.message, icons: "fa-solid fa-check fa-beat-fade", color: "#63E6BE" })
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
