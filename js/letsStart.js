function letsStart(event) {
	event.preventDefault()
	window.application.timers.forEach(el => clearInterval(el))
	window.application.timers.splice(0, window.application.timers.length)

	request({
		url: `${BASE_URL}/start`,
		params: {
			token
		},
		onSuccess: response => {
			const showError = (text) => {
				const errorMessage = document.createElement('h4')
				errorMessage.classList.add('warning-message')
				errorMessage.textContent = text
				const startButton = app.querySelector('.button')
				app.insertBefore(errorMessage, startButton)
			}

			if (response.message === "token doesn't exist") {
				const text = "Нет игрока с таким токеном"
				showError(text)
				return
			}
			if (response.message === "player is already in game") {
				const text = "Игрок уже в игре, нельзя начать две игры одновременно"
				showError(text)
				return
			}
			if (response['player-status'].status === 'game') {
				gameID = response['player-status'].game.id
				renderLetsPlayScreen()
			}
			else {
				throw new Error('не сработали ifы')
			}
		}
	})
}