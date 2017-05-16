
var listeners;

init();

function init() {
	listeners = new Listeners();

	/*On install*/
	chrome.runtime.onInstalled.addListener(reload);
}

function icon(config) {
	chrome.browserAction.setIcon({
		path: config.active ? 'on.png' : 'off.png'
	});
}

function reload() {
	config.get(function(config) {
		icon(config);
		listeners.activate(config);
	}); 
}

