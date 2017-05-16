
var config = {
	defaults: {
		active: false,
		urls: ['<all_urls>'],
		allowMethods: 'GET, PUT, POST, DELETE, HEAD, PATCH, OPTIONS', 
		exposeHeaders: ''
	},
	get: function(cb) {
		chrome.storage.local.get(Object.keys(config.defaults), function(result) {
			if (!result) {
				config.current = config.defaults;
				cb(config.defaults);
			} else {
				config.current = result;
				cb(result);
			}
		});
	},
	set: function(key, value) {
	}
};

