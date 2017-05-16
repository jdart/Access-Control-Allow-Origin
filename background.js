
var listeners;

init();

function init() {
	listeners = new Listeners();

	/*On install*/
	chrome.runtime.onInstalled.addListener(function() {
		config.get(function(config) {
			icon(config);
			listeners.activate(config);
		}); 
	});
}

function icon(config) {
	chrome.browserAction.setIcon({
		path: config.active ? 'on.png' : 'off.png'
	});
}

