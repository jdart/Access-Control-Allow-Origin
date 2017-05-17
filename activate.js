
(function(corsExt) {

	var listeners;

	activate();

	function activate() {
		listeners = new corsExt.Listeners();

		Object.assign(corsExt, {reload});
		
		chrome.runtime.onInstalled.addListener(reload);
	}

	function icon(active) {
		chrome.browserAction.setIcon({
			path: active ? 'on.png' : 'off.png'
		});
	}

	function reload() {
		corsExt.config.get(function(config) {
			icon(config.active);
			listeners.activate(config);
		}); 
	}

})(corsExt);

