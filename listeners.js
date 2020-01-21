
corsExt.Listeners = function() {
    var state = {
        config: null,
        requests: {}
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

    function prepare(details) {
        state.requests[details.requestId] = {};
        corsExt.tabs.manipulated(details.tabId);
    }

    function request(details) {
        updateAllowHeaders(details, details.requestHeaders);
        setHeader(details.requestHeaders, 'Origin', state.config.origin);

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
        if (typeof state.requests[details.requestId] === 'object')
            return state.requests[details.requestId][key];
        return null;
    }

    function setRequestState(details, key, value) {
        state.requests[details.requestId][key] = value;
    }

    function response(details) {
        var origin = corsExt.tabs.origin(details.tabId, '*');

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
        }, ['blocking', 'responseHeaders', 'extraHeaders']);

        chrome.webRequest.onBeforeSendHeaders.addListener(request, {
            urls: state.config.urls
        }, ['blocking', 'requestHeaders', 'extraHeaders']);

        chrome.webRequest.onCompleted.addListener(cleanup, {
            urls: state.config.urls
        });
    }

    function activate(config) {
        state.config = config;
        remove();
        add();
    }
};

