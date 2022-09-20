function renderPlayScreen(rival) {
	window.application.timers.forEach(el => clearInterval(el))
	window.application.timers.splice(0, window.application.timers.length)
	app.textContent = ''

	const rivalName = document.createElement('h4')
	rivalName.classList.add('play-screen__rival-name')
	rivalName.textContent = rival

	const buttonsBlock = document.createElement('div')
	buttonsBlock.classList.add('play-screen__buttons-block')

	const rockButton = document.createElement('button')
	rockButton.classList.add('button')
	rockButton.textContent = 'Камень'

	const scissorsButton = document.createElement('button')
	scissorsButton.classList.add('button')
	scissorsButton.textContent = 'Ножницы'

	const paperButton = document.createElement('button')
	paperButton.classList.add('button')
	paperButton.textContent = 'Бумага'

	const message = document.createElement('h4')
	message.classList.add('warning-message')
	app.appendChild(message)

	app.appendChild(rivalName)
	app.appendChild(buttonsBlock)
	buttonsBlock.appendChild(rockButton)
	buttonsBlock.appendChild(scissorsButton)
	buttonsBlock.appendChild(paperButton)

	rockButton.setAttribute('data-item', 'rock')
	scissorsButton.setAttribute('data-item', 'scissors')
	paperButton.setAttribute('data-item', 'paper')

	rockButton.addEventListener('click', turn)
	scissorsButton.addEventListener('click', turn)
	paperButton.addEventListener('click', turn)
}

function turn(event) {
	event.preventDefault()
	const message = app.querySelector('.warning-message')
	const buttonsBlock = app.querySelector('.play-screen__buttons-block')

	window.application.timers.push(setInterval(() => {
			request({
				url: `${BASE_URL}/play`,
				params: {
					token,
					id: gameID,
					move: event.target.dataset.item
				},
				onSuccess: response => {

					const playStatus = response['game-status'].status

					if (playStatus === 'waiting-for-enemy-move') {
						buttonsBlock.textContent = ''
						message.textContent = 'Ожидаем ход соперника'
						window.application.timers.forEach(el => clearInterval(el))
						window.application.timers.splice(0, window.application.timers.length)

						const checkForEnemyTurn = () => {
								request({
									url: `${BASE_URL}/game-status`,
									params:{
										token,
										id: gameID},
										onSuccess: (response) =>{
											const endGameStatus = response['game-status'].status

											if (endGameStatus === 'lose' || endGameStatus === 'win') {
												renderEndBattleScreen(endGameStatus)
												return
											}

											if (endGameStatus === 'waiting-for-your-move' || endGameStatus === 'waiting-for-enemy-move'){
												const rival = response['game-status'].enemy.login
												renderPlayScreen(rival)

												const message = document.createElement('h4')
												message.classList.add('warning-message')
												message.textContent = 'Ничья, ходите заново'
												app.appendChild(message)
											}
										},
										onError: () => {
											throw new Error()
										}
								})
						}
						window.application.timers.push(setInterval( checkForEnemyTurn,2000))
						return
					}
					if (playStatus === 'waiting-for-your-move') {
						const rival = response['game-status'].enemy.login
						renderPlayScreen(rival)

						const message = document.createElement('h4')
						message.classList.add('warning-message')
						message.textContent = 'Ничья, ходите заново'
						app.appendChild(message)
					}
					else if (playStatus === 'waiting-for-start') {
						message.textContent = 'Ожидаем соперника'
					}
					else if (playStatus === 'lose' || playStatus === 'win') {
						renderEndBattleScreen(playStatus)
					} else {
						throw new Error(playStatus)
					}
				}
			})
		}
	, 500))
}