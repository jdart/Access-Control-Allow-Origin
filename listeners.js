
function Listeners() {
	var state = {
		config: null,
		requests: {}
	};

	return {activate};

	function updateAllowHeaders(requestId, headers) {
		var header = headers.find(headerNameEquals('Access-Control-Request-Headers'));

		if (header) {
			state.requests[requestId] = {
				allowHeaders: header.value
			};
		}
	}

	function setAllowHeaders(requestId, headers) {
		if (!state.requests[requestId])
			return;

		setHeader(
			headers,
			'Access-Control-Allow-Headers', 
			state.requests[requestId].allowHeaders
		);

		delete state.requests[requestId];
	}

	function request(details) {
		updateAllowHeaders(details.requestId, details.requestHeaders);

		setHeader(details.requestHeaders, 'Origin', 'http://evil.com');
		
		return {requestHeaders: details.requestHeaders};
	}

	function headerNameEquals(name) {
		return function(header) {	
			return header.name.toLowerCase() === name.toLowerCase();
		};
	}

	function setHeader(headers, name, value) {
		var header = headers.find(headerNameEquals(name));
		if (!value)
			return;
		if (!header) {
			header = {name};
			headers.push(header);
		} 
		header.value = value;
	}

	function response(details) {
		setHeader(details.responseHeaders, 'Access-Control-Allow-Origin', '*');
		setHeader(details.responseHeaders, 'Access-Control-Expose-Headers', state.config.exposeHeaders);
		setHeader(details.responseHeaders, 'Access-Control-Allow-Methods', state.config.allowMethods);
		setAllowHeaders(details.requestId, details.responseHeaders);

		return {responseHeaders: details.responseHeaders};
	}

	function remove() {
		/*Remove Listeners*/
		chrome.webRequest.onHeadersReceived.removeListener(response);
		chrome.webRequest.onBeforeSendHeaders.removeListener(request);
	}

	function add() {
		if (!state.config.active || !state.config.urls.length) 
			return;

		/*Add Listeners*/
		chrome.webRequest.onHeadersReceived.addListener(response, {
			urls: state.config.urls
		}, ['blocking', 'responseHeaders']);

		chrome.webRequest.onBeforeSendHeaders.addListener(request, {
			urls: state.config.urls
		}, ['blocking', 'requestHeaders']);
	}

	function activate(config) {
		state.config = config;
		remove();
		add();
	}
}

