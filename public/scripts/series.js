const deleteData = async (seriesId, type) => {
	try {
		const response = await fetch(`${baseUrl}/api/${type}/${seriesId}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		})

		const result = await response.json()

		if (response.ok) {
			await infoModal({ time: 3000, message: result.message, icons: "fa-solid fa-check fa-beat-fade", color: "#63E6BE" })
			window.location.reload()
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
}

const updatePrivacy = async (checkbox, id, type) => {
	const isPrivate = checkbox.checked

	try {
		const response = await fetch(`${baseUrl}/api/${type}/${id}`, {
			method: "put",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ private: isPrivate }),
		})

		const result = await response.json()

		if (response.ok) {
			await infoModal({ time: 3000, message: result.message, icons: "fa-solid fa-check fa-beat-fade", color: "#63E6BE" })
		} else {
			throw { message: result.message }
		}
	} catch (error) {
		console.log(error)
		checkbox.checked = !isPrivate
		await infoModal({
			time: 5000,
			message: error.message || "Something went wrong",
			icons: "fa-solid fa-triangle-exclamation fa-beat-fade",
			color: "#ff3d3d",
		})
	}
}
