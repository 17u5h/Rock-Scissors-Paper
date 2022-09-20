function renderLobbyScreen() {

	const warningMessage = document.createElement('h5')
	warningMessage.classList.add('warning-message')

	request({
		url: `${BASE_URL}/login`,
		params: {
			login
		},
		onSuccess: loginResponse => {
			if (loginResponse.status !== 'ok') {
				throw new Error('сервер ответил, что статус не ок')
			}
			token = loginResponse.token
			window.application.timers.push(setInterval(() => {
				request({
					url: `${BASE_URL}/player-status`,
					params: {
						token
					},
					onSuccess: playerStatusResponse => {
						if (playerStatusResponse['player-status'].status === 'lobby') {
							const playerNames = []
							request({
								url: `${BASE_URL}/player-list`,
								params: {
									token
								},
								onSuccess: playerListResponse => {
									playerListResponse.list.forEach(el => playerNames.push(el.login))
									showLobbyScreen(playerNames)
								}
							})
						}
						if (playerStatusResponse['player-status'].status === 'game') {
							gameID = playerStatusResponse['player-status'].game.id
							renderWaitingForStart()
						}
					}
				})
			}, 500))
		},
		onError: () => {
			throw new Error('Что-то не так в запросе')
		}
	})
}

const showLobbyScreen = playerNames => {
	app.textContent = ''

	const lobbyLogo = document.createElement('h3')
	lobbyLogo.classList.add('lobby-screen__lobby-logo')
	lobbyLogo.textContent = 'Лобби'

	const playerList = document.createElement('div')
	playerList.classList.add('lobby-screen__player-list')

	const players = []

	playerNames.forEach(() => {
		players.push(document.createElement('p'))
	})

	for (let i = 0; i < players.length; i++) {
		players[i].classList.add('lobby-screen__player')
		players[i].textContent = playerNames[i]
		playerList.appendChild(players[i])
	}

	const startButton = document.createElement('button')
	startButton.classList.add('button')
	startButton.textContent = 'Играть!'

	startButton.addEventListener('click', letsStart)

	app.appendChild(lobbyLogo)
	app.appendChild(playerList)
	app.appendChild(startButton)
}
