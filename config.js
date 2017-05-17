
(function(corsExt) {
	
	function extend(target, defaults) {
		Object.keys(defaults).forEach(key => {
			if (typeof target[key] === 'undefined')
				target[key] = defaults[key];
		});
	}

	corsExt.config = {
		defaults: {
			active: false,
			urls: ['<all_urls>'],
			allowMethods: 'GET, PUT, POST, DELETE, HEAD, PATCH, OPTIONS', 
			exposeHeaders: ''
		},
		get: function(cb) {
			chrome.storage.sync.get(
				Object.keys(this.defaults),
				function(result) {
					extend(result, corsExt.config.defaults);
					cb(result);
				}
			);
		},
		set: function(key, value) {
			chrome.storage.sync.set({[key]: value});
		}
	};

})(corsExt);

