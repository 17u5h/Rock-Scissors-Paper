const app = document.querySelector('.app')
let login = ''

function renderLoginScreen() {
	app.textContent = ''

	const logo = document.createElement('div')
	logo.classList.add('login-screen__logo')

	const title = document.createElement('h3')
	title.textContent = 'Камень Ножницы Бумага'
	title.classList.add('login-screen__title')

	const loginBlock = document.createElement('div')
	loginBlock.classList.add('login-screen__login-block')

	const input = document.createElement('input')
	input.classList.add('login-screen__input')
	input.placeholder = 'Введите логин'
	input.setAttribute('autofocus', 'autofocus')

	const buttonLogin = document.createElement('button')
	buttonLogin.classList.add('button')
	buttonLogin.textContent = 'Войти'

	const warningMessage = document.createElement('h5')
	warningMessage.classList.add('warning-message')

	const loginMinLengthValidator = () => {
		warningMessage.textContent = ''
		login = input.value
		const minLoginLength = 3
		if (login.length < minLoginLength) {
			warningMessage.textContent = 'Введите хотя бы 3 символа'
		} else {
			renderLobbyScreen()
		}
	}

	const loginMaxLengthValidator = event => {
		const minLoginLength = 20
		warningMessage.textContent = ''
		let inputValue = event.target.value

		if (inputValue.length > minLoginLength) {
			input.value = ''
			warningMessage.textContent = 'Превышена длина'
			inputValue = inputValue.substring(0, minLoginLength - 1)
			input.value = inputValue
		}
	}

	const loginKeyboardValidator = event => {
		warningMessage.textContent = ''

		if (!event.key.match(/^[а-яА-ЯёЁa-zA-Z0-9]$/)) {
			event.preventDefault()
			warningMessage.textContent = 'Только буквы или цифры'
		}
	}

	const enterOnPressEnter = event => {
		loginKeyboardValidator(event)
		if (event.key === 'Enter') {
			loginMinLengthValidator(event)
		}
	}
	const enterOnMouseClick = event => {
		loginMinLengthValidator(event)
	}

	input.addEventListener('keypress', enterOnPressEnter)
	input.addEventListener('input', loginMaxLengthValidator)
	buttonLogin.addEventListener('click', enterOnMouseClick)

	app.appendChild(logo)
	app.appendChild(title)
	app.appendChild(loginBlock)
	loginBlock.appendChild(input)
	loginBlock.appendChild(buttonLogin)
	loginBlock.appendChild(warningMessage)

}

window.application.renderScreen['login-screen'] = renderLoginScreen