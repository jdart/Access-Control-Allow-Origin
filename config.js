
var config = {
	defaults: {
		active: false,
		urls: ['<all_urls>'],
		allowMethods: 'GET, PUT, POST, DELETE, HEAD, PATCH, OPTIONS', 
		exposeHeaders: ''
	},
	get: function(cb) {
		chrome.storage.sync.get(Object.keys(config.defaults), function(result) {
			Object.keys(config.defaults).forEach(key => {
				if (typeof result[key] === 'undefined')
					result[key] = config.defaults[key];
			});
			cb(result);
		});
	},
	set: function(key, value) {
		chrome.storage.sync.set({[key]: value});
	}
};

