
(function(corsExt) {

	var canvas,
		context,
		fontsReady;

	activate();

	function activate() {
		canvas = document.createElement('canvas'); 
		canvas.width = 19;
		canvas.height = 19;
		context = canvas.getContext('2d');

		WebFont.load({
			google: { families: ['Inconsolata'] },
			custom: { 
				families: ['FontAwesome'],
				urls: ['https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css']
			},
			active: function() { 
				fontsReady = true;
				update();
			}
		});
		
		drawWithoutFonts();
	}

	function drawWithoutFonts() {
		context.clearRect(0, 0, 19, 19);
		context.textAlign = 'left';
		context.textBaseline = 'top';
		context.font = '14px Arial';
		context.fillStyle = '#444';  
		context.fillText('c', 0, -4);
		context.fillText('o', 8, -4);
		context.fillText('r', 0, 6);
		context.fillText('s', 8, 6);

		chrome.browserAction.setIcon({
			imageData: context.getImageData(0, 0, 19, 19)
		});
	}

	function draw(config) {
		context.clearRect(0, 0, 19, 19);
		context.textAlign = 'left';
		context.textBaseline = 'top';
		context.font = '14px Inconsolata';

		if (!config.active) {
			context.fillStyle = '#999';  
			context.fillText('o', 8, -3);
		} else {
			context.font = '10px FontAwesome';
			context.fillStyle = corsExt.tabs.currentManipulated() ? 'green' : '#444';
			context.fillText(String.fromCharCode('0xf004'), 8, 0);
			context.fillStyle = '#444';  
		}

		context.font = '14px Inconsolata';
		context.fillText('c', 0, -3);
		context.fillText('r', 0, 7);
		context.fillText('s', 8, 7);

		chrome.browserAction.setIcon({
			imageData: context.getImageData(0, 0, 19, 19)
		});
	}

	function update() {
		if (fontsReady)
			corsExt.config.get(draw);
		else
			drawWithoutFonts();
	}

	corsExt.icon = update;

})(corsExt);
