
var config = {
	defaults: {
		active: false,
		urls: ['<all_urls>'],
		allowedMethods: 'GET, PUT, POST, DELETE, HEAD, PATCH, OPTIONS', 
		exposedHeaders: ''
	},
	get: function(cb) {
		chrome.storage.local.get(Object.keys(config.defaults), function(result) {
			if (!result) {
				cb(config.defaults);
			} else {
				cb(result);
			}
		});
	},
	set: function(key, value) {
	}
};

