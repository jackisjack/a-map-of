
function Forme_FullScreen() {

    // Dessin d'une forme qui rempli exactement l'écran à son démarrage

    var rect = new createjs.Shape();
    rect.graphics.setStrokeStyle(20);
    rect.graphics.beginFill("#00A1D8");
    rect.graphics.drawRect(0, 0, (stage.canvas.width / stage.scaleX), (stage.canvas.height / stage.scaleY));
    rect.alpha = 1;
    rect.x = 0;
    rect.y = 0;

    mainContainer.addChild(rect);

    Scene.tweens.push({ ref: rect });

}

function Boom() {

    for (var j = 0; j < tweens.length; j++) {

        var ref1 = tweens[j].ref;

        createjs.Tween
		.get(ref1, { override: true })
		.wait(2000 * rndEase(0, 1, "easeOutExpo"))
		.to({
		    x: ref1.x + rndB(-5000, 5000),
		    y: ref1.y + rndB(-5000, 5000)
		},
			10000, createjs.Ease.bounceOut);

    }

}

function UnitTest() {

    Graphisme.VueFocus.Focus(600, 600);

    var cache = [];
    console.log(
        JSON.stringify(
            Graphisme.VueFocus,
            function (key, value) {

                if (key.substring(0, 2) !== 'P_') {
                    return;
                }

                if (TypeValeur === 'object' && value !== null) {

                    if (cache.indexOf(value) !== -1) {
                        // Circular reference found, discard key
                        return;
                    }

                    // Store value in our collection
                    cache.push(value);
                }

                return value;
            }
        ))
    cache = null;
}


