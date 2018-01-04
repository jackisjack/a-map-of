function rndB(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function TU_rndEase()
{
	
    for (var i = 0; i < 99; i++) {
        
		var circle = new createjs.Shape();
		var diametre = 10;
        circle.graphics.setStrokeStyle(20);
		circle.graphics.beginFill("#00A1D8");
		circle.graphics.drawCircle(0, 0, diametre);
        circle.alpha = 1;
        circle.x = 800+(i+1)*10; 
        circle.y = (window["easeInOutExpo"]((i+1)/100,0,1,1))*1000; 
		mainContainer.addChild(circle);
		
	}
	
}

function rndEase(min, max, easetype) {
    return window[easetype](Math.random(),0,1,1) * (max - min + 1) + min;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}