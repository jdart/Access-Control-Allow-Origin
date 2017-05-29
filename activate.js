
(function(corsExt) {

	var listeners;

	activate();

	function activate() {
		listeners = new corsExt.Listeners();

		Object.assign(corsExt, {reload});
		
		chrome.runtime.onInstalled.addListener(reload);
	}

	function reload() {
		corsExt.config.get(function(config) {
			corsExt.icon(config);
			listeners.activate(config);
		}); 
	}

})(corsExt);

