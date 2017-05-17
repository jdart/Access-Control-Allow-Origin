
(function(corsExt) {

	var listeners;

	activate();

	function activate() {
		listeners = new corsExt.Listeners();

		Object.assign(corsExt, {reload});
		
		chrome.runtime.onInstalled.addListener(reload);
	}

	function icon(config) {
		chrome.browserAction.setIcon({
			path: config.active ? 'on.png' : 'off.png'
		});
	}

	function reload() {
		corsExt.config.get(function(config) {
			console.log(config);
			icon(config);
			listeners.activate(config);
		}); 
	}

})(corsExt);

