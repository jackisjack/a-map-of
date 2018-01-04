// Utilisation de la variable public (module 'scene') : mainContainer

var menu; // container
var hauteur_menu;
var largeur_menu;
var NbBouton;

function ConstruireMenu()
{
    // Si le menu existe déjà (c'est-à-dire REconstruction)

    if (menu != null)
    {
        // Suppression de l'ensemble des enfants du container, tout sera construit ensuite.

        menu.removeAllChildren();

    }
    else
    {
        // S'il n'a jamais existé, alors :

        window.addEventListener("resize", handleResizeForMenu);
        menu = new Container();
        menu.snapToPixel = true;
        stage.addChild(menu);

    }


    // Dessin de la forme qui est l'existence visuelle du menu

    var TailleBordure = 2;

    largeur_menu = (stage.canvas.width / stage.scaleX) * 0.8 
    hauteur_menu = screen.height*0.13;

    var ContourMenu = new createjs.Shape();
    ContourMenu.graphics
                        .beginFill("#ffffff")
                        .beginStroke("#5b595b")
                        .setStrokeStyle(TailleBordure)
                        .drawRoundRect(0, 0, largeur_menu, hauteur_menu, 10);
    
    // Définition de la position du menu par rapport au stage 

    var posx_menu = (stage.canvas.width / stage.scaleX) * 0.1;
    var posy_menu = (stage.canvas.height / stage.scaleY) - TailleBordure - hauteur_menu;

    menu.x = posx_menu;
    menu.y = posy_menu;

    menu.addChild(ContourMenu);

    NbBouton = 0;

    // Ajout des boutons

    AjouterBouton("Individu", "Individu");
    AjouterBouton("Groupe d'individus", "GroupeIndividus");

}

function handleResizeForMenu()
{

    ConstruireMenu(); // reconstruire en vérité...

}

function AjouterBouton(libelle, NomClass)
{

    var ControlesButton = [];

    // Container qui contient le libellé, et la forme

    var largeur_bouton = 110;
    var buttonContainer = new createjs.Container();
    buttonContainer.x = NbBouton * largeur_bouton + 80;

    menu.addChild(buttonContainer);

    // libellé, centré horizontalement et verticalement

    var txt = new createjs.Text(libelle, "21px Lato", "#5b595b");
    txt.lineWidth = 100;
    var h = (txt.getMeasuredHeight()) * txt.scaleY;
    txt.regY = h/2; // s'il fallait centrer le texte verticalement
    txt.textAlign = 'center'
    txt.y = hauteur_menu * 0.75;

    buttonContainer.addChild(txt);

    // Icone

    var mShape = IconeFromLibelle(libelle);

    mShape.x = 0; 
    mShape.y = 50; 
    mShape.InitialX = mShape.x; // pour le tween d'animation
    mShape.InitialY = mShape.y; // pour le tween d'animation

    buttonContainer.addChild(mShape);

    // Icone et texte sont placés dans un tableau

    ControlesButton.push(mShape);
    ControlesButton.push(txt);

    // Association des events sur le bouton pour l'animation

    buttonContainer.on("click", function () { OuvrirForm(NomClass); });
    buttonContainer.on("mouseover", handleInteractionBouton, null, false, ControlesButton);
    buttonContainer.on("mouseout", handleInteractionBouton, null, false, ControlesButton);

    NbBouton += 1;

}

// Animation des mouse OVER et OUT sur le bouton

function handleInteractionBouton(event, ControlesButton) {
    
    var mShape = event.target;
    var duree = 2500;
    var ratio = 1.2;
    
    if (event.type == "mouseover")
    {

        // Pour chacun des contrôles du bouton

        for (var i = 0; i < ControlesButton.length; i++)
        {
            ControlesButton[i].scaleX = ControlesButton[i].scaleX * ratio;
            ControlesButton[i].scaleY = ControlesButton[i].scaleY * ratio;

        }       
    }

    if (event.type == "mouseout")
    {

        // Pour chacun des contrôles du bouton

        for (var i = 0; i < ControlesButton.length; i++)
        {

            ControlesButton[i].scaleX = 1;
            ControlesButton[i].scaleY = 1;

        }
    }
}

function IconeFromLibelle(libelle)
{
    // Entrée : libellé (ex: Individu)
    // Sortie : une shape (ex: un cercle) qui représente la forme du bouton dans le menu
    var _FormePourMenu = new createjs.Shape();

    switch (libelle)
    {
        case "Individu":
            _FormePourMenu.graphics
                                .beginFill("#ffffff")
                                .beginStroke("#283978")
                                .setStrokeStyle(3)
                                .drawCircle(0, 0, 25);
            break;

            // Forme par défaut

        case "Groupe d'individus":
            _FormePourMenu.graphics
                                .beginFill("#ffffff")
                                .beginStroke("#5b0455")
                                .setStrokeStyle(3)
                                .drawCircle(0, 0, 25);
            break;


        default:
            _FormePourMenu.graphics
                                .beginFill("#ffffff")
                                .beginStroke("#283978")
                                .setStrokeStyle(3)
                                .drawCircle(0, 0, 25);

    };
    
    return _FormePourMenu;

}
