function renderEndBattleScreen(status) {
	window.application.timers.forEach(el => clearInterval(el))
	window.application.timers.splice(0, window.application.timers.length)
	app.textContent = ''

	const message = document.createElement('h4')
	message.classList.add('warning-message')
	if (status === 'win') message.textContent = 'Вы выиграли!'
	if (status === 'lose') message.textContent = 'Вы проиграли'

	const playAgainButton = document.createElement('button')
	playAgainButton.classList.add('button')
	playAgainButton.textContent = 'Играть еще'

	const toLobbyButton = document.createElement('button')
	toLobbyButton.classList.add('button')
	toLobbyButton.textContent = 'Лобби'

	playAgainButton.addEventListener('click', letsStart)
	toLobbyButton.addEventListener('click', renderLobbyScreen)

	app.appendChild(message)
	app.appendChild(playAgainButton)
	app.appendChild(toLobbyButton)
}