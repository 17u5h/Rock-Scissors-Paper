function renderLetsPlayScreen() {
	app.textContent = ''
	request({
		url: `${BASE_URL}/game-status`,
		params: {
			token,
			id: gameID
		},
		onSuccess: response => {
			const startingStatus = response['game-status'].status

			if (startingStatus === 'waiting-for-start' || startingStatus === 'waiting-for-your-move') {
				renderWaitingForStart()
			}

			if (startingStatus === 'error') {
				const errorMessage = document.createElement('h4')
				errorMessage.classList.add('warning-message')
				errorMessage.classList.add('center')
				app.appendChild(errorMessage)

				switch (response['game-status'].message) {
					case "no game id":
						errorMessage.textContent = 'Id игры не передан'
						break
					case "wrong game id":
						errorMessage.textContent = 'Id игры некорректный / бой не существует / бой закончен'
						break
					case "token doesn't exist":
						errorMessage.textContent = 'Нет игрока с таким токеном'
						break
					case "player is not in this game":
						errorMessage.textContent = 'Игрок не в этой игре'
						break
					default:
						errorMessage.textContent = 'Произошла неизвестная ошибка'

				}
			}
		}
	})
}