
var config = {
	current: null,
	defaults: {
		active: false,
		urls: ['<all_urls>'],
		allowedMethods: 'GET, PUT, POST, DELETE, HEAD, PATCH, OPTIONS', 
		exposedHeaders: ''
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
	getSync: function(key) {
		return config.current[key];
	},
	set: function(key, value) {
	}
};

