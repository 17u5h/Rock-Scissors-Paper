function renderWaitingForStart() {
	window.application.timers.forEach(el => clearInterval(el))
	window.application.timers.splice(0, window.application.timers.length)
	app.textContent = ''

	const waitingMessage = document.createElement('h3')
	waitingMessage.classList.add('waiting-for-start')
	waitingMessage.textContent = 'Ожидаем подключение соперника'
	app.appendChild(waitingMessage)

	window.application.timers.push(setInterval(() => {
		request({
			url: `${BASE_URL}/game-status`,
			params: {
				token,
				id: gameID
			},
			onSuccess: response => {

				if (response['game-status'].status === 'waiting-for-your-move') {
					const rival = response['game-status'].enemy.login
					renderPlayScreen(rival)
				}
			},
			onError: () => {
				throw new Error('somewhere in waiting-for-start-screen')
			}
		})
	}, 500))
}