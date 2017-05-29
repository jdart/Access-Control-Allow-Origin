
(function(corsExt) {

	var canvas = document.createElement('canvas'); 
	canvas.width = 19;
	canvas.height = 19;

	var context = canvas.getContext('2d');

	function activate() {

		//context.fillStyle = '#262626';
		//context.fillRect(0, 0, 19, 19);
		//context.fillStyle = '#FFFFFF';
		
		context.textAlign = 'left';
		context.textBaseline = 'top';
		context.font = '14px Arial';
		context.fillText('c', 0, -5);
		context.fillText('o', 10, -5);
		context.fillText('r', 1, 5);
		context.fillText('s', 10, 5);

		chrome.browserAction.setIcon({
			imageData: context.getImageData(0, 0, 19, 19)
		});
	}

	corsExt.icon = activate;

})(corsExt);
