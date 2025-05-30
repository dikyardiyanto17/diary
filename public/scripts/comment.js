document.querySelector(".comment-container form").addEventListener("submit", async function (e) {
	e.preventDefault()
	try {
		const form = e.target
		const textarea = form.querySelector(".comment-input")
		const commentText = textarea.value.trim()

		if (!commentText) {
			throw { message: "Write a comment please!" }
		}

		const pathParts = window.location.pathname.split("/")
		const relatedId = pathParts[pathParts.length - 1]
		const relatedType = form.dataset.relatedtype

		const response = await fetch(`${baseUrl}/api/comment/${relatedId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				relatedtype: relatedType,
				comment: commentText,
			}),
		})

		const result = await response.json()

		if (response.ok) {
			await infoModal({ time: 3000, message: result.message, icons: "fa-solid fa-check fa-beat-fade", color: "#63E6BE" })
			textarea.value = ""

			const comment = result.rawData[0]
			const petname = comment.petname || "?"
			const newComment = document.createElement("div")
			newComment.className = "comment-box"
			newComment.id = `cid_${comment._id}`
			newComment.innerHTML = `
                            <div class="avatar">
                                <span>
                                ${(petname || "??").substring(0, 2).toUpperCase().padEnd(2, "?")}
                                </span>

                            </div>
                            <div class="comment-content">
                                <div class="comment-header">
                                    <strong>
                                        ${petname}
                                    </strong>
                                    <span class="timestamp" data-time="${comment.createdAt}">${await formatedDate(comment.createdAt)}</span>
								<form onsubmit="deleteComment(event, '${comment._id}')">
									<button type="submit" class="delete-btn">
										<i class="fa fa-trash"></i>
									</button>
								</form>
                                </div>
                                <p>
                                    ${comment.comment}
                                </p>
                            </div>
			`
			const commentContainer = document.getElementById("comment-container")
			commentContainer.insertBefore(newComment, commentContainer.children[1])
		} else {
			throw { message: result.message }
		}
	} catch (error) {
		console.log(error)
		await infoModal({
			time: 5000,
			message: error.message || "Something went wrong",
			icons: "fa-solid fa-triangle-exclamation fa-beat-fade",
			color: "#FF6B6B",
		})
	}
})

const formatedDate = (date) => {
	const t = new Date(date)
	const s = Math.floor((Date.now() - t) / 1000)
	return s < 60 ? `${s}s ago` : s < 3600 ? `${Math.floor(s / 60)}m ago` : s < 86400 ? `${Math.floor(s / 3600)}h ago` : `${Math.floor(s / 86400)}d ago`
}

document.querySelectorAll(".timestamp").forEach((el) => {
	try {
		const time = el.dataset.time
		el.textContent = "• " + formatedDate(time)
	} catch (error) {
		infoModal({
			time: 5000,
			message: error.message || "Something went wrong",
			icons: "fa-solid fa-triangle-exclamation fa-beat-fade",
			color: "#FF6B6B",
		})
	}
})

async function deleteComment(event, commentId) {
	event.preventDefault()
	try {
		const response = await fetch(`${baseUrl}/api/comment/${commentId}`, {
			method: "DELETE",
		})

		const result = await response.json()

		if (response.ok) {
			await infoModal({ time: 3000, message: result.message, icons: "fa-solid fa-check fa-beat-fade", color: "#63E6BE" })
			const commentBox = document.getElementById(`cid_${commentId}`)
			if (commentBox) {
				commentBox.remove()
			}
		} else {
			throw { message: result.message }
		}
	} catch (error) {
		await infoModal({
			time: 3000,
			message: error.message || "Error deleting comment",
			icons: "fa-solid fa-circle-xmark",
			color: "#FF6B6B",
		})
	}
}
