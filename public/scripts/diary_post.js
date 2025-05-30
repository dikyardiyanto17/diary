$("#summernote").summernote({
	placeholder: "Create your diary",
	tabsize: 2,
	height: 300,
})

const previewButton = document.getElementById("preview-button")
const previewContainer = document.getElementById("preview-container")
const previewContent = document.getElementById("preview-content")

previewButton.addEventListener("click", async () => {
	try {
		if (previewContainer.classList.contains("show")) {
			previewContainer.classList.remove("show")
		} else {
			previewContainer.classList.add("show")
			let content = $("#summernote").summernote("code")
			previewContent.innerHTML = content
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

previewContainer.addEventListener("click", (e) => {
	e.stopPropagation()
	previewContainer.classList.remove("show")
})

previewContent.addEventListener("click", (e) => {
	e.stopPropagation()
})

document.querySelector(".container-create").addEventListener("submit", async (e) => {
	e.preventDefault()

	try {
		const title = document.querySelector('input[name="title"]').value.trim()
		const shortDescription = document.querySelector('input[name="shortDescription"]').value.trim()
		const content = $("#summernote").summernote("code")
		const isPrivate = document.getElementById("private-toogle").checked

		// Validation (optional)
		if (!title || !shortDescription || !content) {
			return await infoModal({
				time: 4000,
				message: "Please fill in all fields.",
				icons: "fa-solid fa-triangle-exclamation fa-beat-fade",
				color: "#ff3d3d",
			})
		}

		// Get series ID from hidden input or URL
		const seriesId = window.location.pathname.split("/").pop() // Assumes URL ends with seriesid

		const response = await fetch(`/api/diary/${seriesId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				title,
				description: shortDescription,
				content,
				isPrivate: isPrivate,
			}),
		})

		const result = await response.json()

		if (response.ok) {
			await infoModal({
				time: 3000,
				message: "Diary created successfully!",
				icons: "fa-solid fa-check fa-beat-fade",
				color: "#00c851",
			})
			window.location.href = window.location.origin
		} else {
			throw { message: result.message }
		}

		// window.location.href = `/diary/${seriesId}`
	} catch (error) {
		await infoModal({
			time: 5000,
			message: error.message || "Something went wrong",
			icons: "fa-solid fa-triangle-exclamation fa-beat-fade",
			color: "#ff3d3d",
		})
	}
})
