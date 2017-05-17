
function Listeners() {
	var state = {
		config: null,
		requests: {},
		tabOrigins: {}
	};

	return {activate};

	function updateAllowHeaders(details, headers) {
		var header = headers.find(headerNameEquals('Access-Control-Request-Headers'));

		if (header) {
			setRequestState(details, 'allowHeaders', header.value);
		}
	}

	function setAllowHeaders(details, headers) {
		var allowHeaders = getRequestState(details, 'allowHeaders');

		if (!allowHeaders)
			return;

		setHeader(
			headers,
			'Access-Control-Allow-Headers', 
			allowHeaders
		);
	}

	function urlToOrigin(url) {
		var parts = url.split('/');
		return parts[0] + '//' + parts[2];
	}

	function setTabOrigin(tab) {
		state.tabOrigins[tab.id] = urlToOrigin(tab.url);
	}

	function prepare(details) {
		state.requests[details.requestId] = {};
		chrome.tabs.get(details.tabId, setTabOrigin);		
	}

	function request(details) {
		updateAllowHeaders(details, details.requestHeaders);
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

	function getRequestState(details, key) {
		if (state.requests && state.requests[details.requestId])
			return state.requests[details.requestId][key];
		return null;
	}

	function setRequestState(details, key, value) {
		if (!state.requests[details.requestId])
			state.requests[details.requestId] = {};
		state.requests[details.requestId][key] = value;
	}

	function response(details) {
		var origin = state.tabOrigins[details.tabId] || '*';

		setHeader(details.responseHeaders, 'Access-Control-Allow-Origin', origin);
		setHeader(details.responseHeaders, 'Access-Control-Expose-Headers', state.config.exposeHeaders);
		setHeader(details.responseHeaders, 'Access-Control-Allow-Methods', state.config.allowMethods);
		setHeader(details.responseHeaders, 'Access-Control-Allow-Credentials', 'true');
		
		setAllowHeaders(details, details.responseHeaders);

		return {responseHeaders: details.responseHeaders};
	}

	function cleanup(details) {
		delete state.requests[details.requestId];
	}

	function remove() {
		chrome.webRequest.onBeforeRequest.removeListener(prepare);
		chrome.webRequest.onHeadersReceived.removeListener(response);
		chrome.webRequest.onBeforeSendHeaders.removeListener(request);
		chrome.webRequest.onCompleted.removeListener(cleanup);
	}

	function add() {
		if (!state.config.active || !state.config.urls.length) 
			return;

		chrome.webRequest.onBeforeRequest.addListener(prepare, {
			urls: state.config.urls
		}, ['blocking']);

		chrome.webRequest.onHeadersReceived.addListener(response, {
			urls: state.config.urls
		}, ['blocking', 'responseHeaders']);

		chrome.webRequest.onBeforeSendHeaders.addListener(request, {
			urls: state.config.urls
		}, ['blocking', 'requestHeaders']);

		chrome.webRequest.onCompleted.addListener(cleanup, {
			urls: state.config.urls
		});
	}

	function activate(config) {
		state.config = config;
		remove();
		add();
	}
}

