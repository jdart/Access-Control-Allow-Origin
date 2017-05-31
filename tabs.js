(function(corsExt) {

	var tabs = {};
	var current;

	activate();

	function activate() {
		corsExt.tabs = { manipulated, origin, currentManipulated };
		chrome.tabs.onActivated.addListener(activated);
		chrome.tabs.onUpdated.addListener(updated);
	}
	
	function activated(details) {
		current = details.tabId;
		chrome.tabs.get(details.tabId, setTabOrigin);
	}

	function manipulated(tabId) {
		if (tabs[tabId] && tabs[tabId].manipulated === false) {
			tabs[tabId].manipulated = true;
		}
		corsExt.icon();
	}

	function origin(tabId, fallback) {
		if (tabs[tabId]) {
			return tabs[tabId].origin;
		} else {
			return fallback;
		}
	}

	function currentManipulated() {
		if (typeof tabs[current] === 'undefined')
			return false;
		return tabs[current].manipulated;
	}

	function urlToOrigin(url) {
		var parts = url.split('/');
		return parts[0] + '//' + parts[2];
	}

	function setTabOrigin(tab) {
		const origin = urlToOrigin(tab.url);
		const state = tabs[tab.id]

		if (typeof state === 'undefined' || origin !== state.origin) {
			tabs[tab.id] = { origin, manipulated: false };
		} 

		corsExt.icon();
	}

	function updated(tabId, changeInfo, tab) {
		if (tab.url) {
			setTabOrigin(tab);
			corsExt.icon();
		}
	}

})(corsExt);

