
function requestListener(details) {
	var flag = false,
		i,
		rule = {
			name: 'Origin',
			value: 'http://evil.com/'
		};

	for (i = 0; i < details.requestHeaders.length; ++i) {
		if (details.requestHeaders[i].name.toLowerCase() === rule.name.toLowerCase()) {
			flag = true;
			details.requestHeaders[i].value = rule.value;
			break;
		}
	}

	if (!flag)
		details.requestHeaders.push(rule);
	
	for (i = 0; i < details.requestHeaders.length; ++i) {
		if (details.requestHeaders[i].name.toLowerCase() === 'access-control-request-headers') {
			accessControlRequestHeaders = details.requestHeaders[i].value	
		}
	}	
	
	return {requestHeaders: details.requestHeaders};
}

function responseListener(details) {
	var flag = false,
		accessControlRequestHeaders = config.getSync('accessControlRequestHeaders'),
		exposedHeaders = config.getSync('exposedHeaders'),
		allowedMethods = config.getSync('allowedMethods'), 
		i,
		rule = {
			name: 'Access-Control-Allow-Origin',
			value: '*'
		};

	for (i = 0; i < details.responseHeaders.length; ++i) {
		if (details.responseHeaders[i].name.toLowerCase() === rule.name.toLowerCase()) {
			flag = true;
			details.responseHeaders[i].value = rule.value;
			break;
		}
	}

	if (!flag) 
		details.responseHeaders.push(rule);

	if (accessControlRequestHeaders) 
		details.responseHeaders.push({
			name: 'Access-Control-Allow-Headers',
			value: accessControlRequestHeaders
		});

	if (exposedHeaders) 
		details.responseHeaders.push({
			name: 'Access-Control-Expose-Headers',
			value: exposedHeaders
		});

	details.responseHeaders.push({
		name: 'Access-Control-Allow-Methods',
		value: allowedMethod
	});

	return {responseHeaders: details.responseHeaders};
}

/*On install*/
chrome.runtime.onInstalled.addListener(function() {
	config.get(function(config) {
		icon(config);
		events(config);
	}); 
});

function icon(config) {
	chrome.browserAction.setIcon({
		path: config.active ? 'on.png' : 'off.png'
	});
}

function events(config) {
	/*Remove Listeners*/
	chrome.webRequest.onHeadersReceived.removeListener(responseListener);
	chrome.webRequest.onBeforeSendHeaders.removeListener(requestListener);

	if (!config.active || !config.urls.length) 
		return;

	/*Add Listeners*/
	chrome.webRequest.onHeadersReceived.addListener(responseListener, {
		urls: config.urls
	}, ['blocking', 'responseHeaders']);

	chrome.webRequest.onBeforeSendHeaders.addListener(requestListener, {
		urls: config.urls
	}, ['blocking', 'requestHeaders']);
}
