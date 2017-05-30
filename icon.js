
(function(corsExt) {

	var canvas,
		context;

	activate();

	function activate() {
		canvas = document.createElement('canvas'); 
		canvas.width = 19;
		canvas.height = 19;
		context = canvas.getContext('2d');

		loadFont('https://fonts.googleapis.com/css?family=Inconsolata');
		loadFont('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');

		setInterval(update, 500);
	}

	function loadFont(href) {
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = href;
		link.media = 'all';
		head.appendChild(link);
	}

	function draw(config) {
		context.clearRect(0, 0, 19, 19);
		
		context.textAlign = 'left';
		context.textBaseline = 'top';
		context.font = '14px Inconsolata';
		context.fillStyle = "#666";  
		
		context.fillText('c', 0, -3);
		context.fillText('r', 0, 7);
		context.fillText('s', 10, 7);

		if (config.active) {
			context.font = '10px FontAwesome';
			context.fillText(String.fromCharCode("0xf08a"), 8, 0);
		} else {
			context.fillText('o', 10, -3);
		}

		chrome.browserAction.setIcon({
			imageData: context.getImageData(0, 0, 19, 19)
		});
	}

	function update() {
		corsExt.config.get(draw);
	}

	corsExt.icon = update;

})(corsExt);
