const noop = () => {
}
const NO_PARAMS = {}
const NO_HEADERS = {}

function request({
									 method = 'GET',
									 url,
									 params = NO_PARAMS,
									 headers = NO_HEADERS,
									 body,
									 requestType = 'json',
									 checkStatusInResponse = false,
									 onSuccess = noop,
									 onError = noop,
								 }) {
	const req = new XMLHttpRequest()
	const urlParams = new URLSearchParams(params)
	const queryString = urlParams.toString()

	req.open(method, url + (queryString ? `?${queryString}` : ''))

	Object.keys(headers).forEach(key => {
		req.setRequestHeader(key, headers[key])
	})

	req.responseType = 'json'

	req.onload = function (event) {
		const target = event.target

		if (target.status >= 400) {
			onError(target.statusText)
			return
		}
		if (checkStatusInResponse && target.response.status !== 'ok') {
			onError(target.statusText)
			return
		}
		onSuccess(target.response)
	}
	req.onerror = function () {
		onError()
	}
	let dataBody = body

	if (requestType === 'urlencoded') {
		req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

		const bodyParams = new URLSearchParams({
			key: API_KEY,
			lang: 'ru-ru',
			text: inputWord.value,
		})
		dataBody = bodyParams.toString()
	}

	req.send()
}