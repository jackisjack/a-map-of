
// Renvoi un objet rectangle englobant
// tous les rectangles fournis en entrée.

function TU_UnionRect() {

    // Test unitaire (à placer à la fin de Main())
    
    var tableauDeRectangle = [];

    for (var i = 0; i < 10; i++) {

        var ObjetCoordRect =
            {
                x: Math.floor((Math.random() * 500) + 1),
                y: Math.floor((Math.random() * 500) + 1),
                w: Math.floor((Math.random() * 500) + 1),
                h: Math.floor((Math.random() * 500) + 1)
            };

        tableauDeRectangle.push(ObjetCoordRect);

        Graphisme.VueFocus.DrawRect(ObjetCoordRect,"black");

    };

    var RectEnglobant = UnionRect(tableauDeRectangle);

    Graphisme.VueFocus.DrawRect(RectEnglobant,"red");

}

function UnionRect(tableauDeRectangle) {

    // Initialisation des min
    var Min_x1 = tableauDeRectangle[0].x;
    var Min_y1 = tableauDeRectangle[0].y;

    // Initialisation des max
    var Max_x2 = tableauDeRectangle[0].x + tableauDeRectangle[0].w;
    var Max_y2 = tableauDeRectangle[0].y + tableauDeRectangle[0].h;

    // pour éviter les doubles additions
    var CurrentMax_x2;
    var CurrentMax_y2;

    for (var i = 0; i < tableauDeRectangle.length; i++) {
        
        if (tableauDeRectangle[i].x < Min_x1) {
            Min_x1 = tableauDeRectangle[i].x;
        }

        if (tableauDeRectangle[i].y < Min_y1) {
            Min_y1 = tableauDeRectangle[i].y;
        }

        CurrentMax_x2 = tableauDeRectangle[i].x + tableauDeRectangle[i].w;

        if (CurrentMax_x2 > Max_x2) {
            Max_x2 = CurrentMax_x2;
        }

        CurrentMax_y2 = tableauDeRectangle[i].y + tableauDeRectangle[i].h;

        if (CurrentMax_y2 > Max_y2) {
            Max_y2 = CurrentMax_y2;
        }

    }

    return {
        x: Min_x1,
        y: Min_y1,
        w: Max_x2 - Min_x1,
        h: Max_y2 - Min_y1
    };

}

// Renvoi un objet rectangle avec une marge

function AddMarginToRect(ObjetCoordRect, Marge) {
    
    return {
        x: ObjetCoordRect.x - Marge,
        y: ObjetCoordRect.y - Marge,
        w: ObjetCoordRect.w + 2 * Marge,
        h: ObjetCoordRect.h + 2 * Marge
    };

}

// renvoi le plus proche multiple du seuil

function ArrondirAu(Nombre, Seuil) {
    Multiple = Math.round(Nombre / Seuil);
    return Multiple * Seuil;
}
