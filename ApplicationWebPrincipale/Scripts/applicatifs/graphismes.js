

var VariablesGlobales = {
    ImagesArray: [],
    TypeSelection: EnumModeAction.AjoutUnitaire,
    TutoEnCours: null
};

// Liste des énumérations

var EnumPositionImage = {
    EnCercle: 0,
    EnCarre: 1,
    EnLigneHorizontal: 2,
    EnLigneVertical: 3
};

var EnumPositionLibelle = {
    Bas: 0,
    Haut: 1,
    Gauche: 2,
    Droite: 3
};

var EnumChildType = {
    Bitmap: 0,
    Text: 1,
    Element: 2, // container principal de l'élément
    SurfaceCliquable:3 
}

var EnumTypeCoord = {
    Local: 0,
    Global:1 // MainContainer
}

var EnumTypeHub = {
    IdTypeObjet: 25, 
    IdObjet: 1  
}

// Objet principal : Graphisme

var Graphisme = {

    ListeVue: [],
    VueFocus: 0,

    Init: function () {

        // création d'une vue par défaut

        var mVue;
        mVue = this.NouvelleVueVierge();

        // La vue par défaut 

        this.SelectionnerVue(mVue);

        // Evènement de rafraichissement d'animation

        var self = this;
        createjs.Ticker.addEventListener("tick", function (e) { self.tick(e); });

    },

    tick: function (event) {
        this.VueFocus.stage.update(event);
    },

    SelectionnerVue: function (Vue) {

        that = this;

        // Sélection de la vue passée en paramètre

        this.VueFocus = Vue;

    },

    NouvelleVueVierge: function () {

        // Instantiation d'une vue

        var mVue = new VueClass({
            IdCanvas: "MainCanvas",
            mainContainerX: 0,
            mainContainerY: 0,
            NomVue: "",
            IdVue: -1
        });

        this.ListeVue.push(mVue);

        // Ajout d'un premier élément sans parent

        var ElementSansParent = mVue.AjouterElement({
            IdTypeObjet: EnumTypeHub.IdTypeObjet, // en dur 
            IdVue:-1,
            Libelle: "Sujet",
            IdObjet: EnumTypeHub.IdObjet, // c'est moche'
            x: 200,
            y: 200,
            Forme: EnumPositionImage.EnLigneVertical,
            x_delta: 0,
            y_delta: 0
        });

        ElementSansParent.Visible(true);

        ElementSansParent.Selectionner();

        // Focus sur les coordonnées du hub

        mVue.Focus(200, 200);

        return mVue;
    },

    SauvegarderVue: function (ObjVue, NomVue) {

        // Affectation du nom de la vue

        ObjVue.NomVue = NomVue;

        // Sequentialisation && packaging de la liste des objets

        var ListeObjetSequentiel = [];

        var j = 0;
        for (var i = 0; i < ObjVue.ListeElement.length; i++)
        {

            // pour chacun des objets

            if (ObjVue.ListeElement[i] !== null) { // si il a été supprimé

                // réattribution d'un id sequentiel

                ObjVue.ListeElement[i].idObjetVue = j;
                j = j + 1;

                // Ajout de l'élément standardisé dans la liste

                ListeObjetSequentiel.push(ObjVue.ListeElement[i].ElementSauvegarde()); // enregistrement de l'objet sauvegardable

            }
            
        }

        // Création de l'objet global 'Vue'

        var Vue_POST = {
            mVueCore_POST: ObjVue.VueSauvegarde(), // Informations générales de la vue
            mElement_POST: ListeObjetSequentiel, // Tous les éléments
        };

        // Post de la vue entière avec tous ses éléments

        API_Vue_POST
            (
            Vue_POST,
            function (data) {

                ObjVue.IdVue = data; // id renvoyé par la webapi
                ObjVue.NomVue = NomVue // nom souhaité lors de l'enregistrement

                // fermeture de la fenêtre d'enregistrement
                OuvrirForm_EnregistrerVue_Fermer();

            }
            );

    },

    OuvrirVue: function (IdVue) {

        var that = this;

        // récupération des informations nécessaires à l'instantiation de la vue'

        API_Vue_Full_GET(IdVue, function (data) {
            
            // Instantiation d'une vue
            
            var mVue = new VueClass(
                {
                    IdCanvas: "MainCanvas",
                    NomVue: data.Vue.LIBELLE,
                    IdVue: data.Vue.IDVUE,
                    mainContainerX: data.Vue.MAINCONTAINERX,
                    mainContainerY: data.Vue.MAINCONTAINERY
                });

            // Création des éléments

            var tmpElement;

            for (var i = 0; i < data.ListeElement.length; i++){

                tmpElement = mVue.AjouterElement(
                                {
                                    IdTypeObjet: data.ListeElement[i].IDTYPEOBJET,
                                    IdObjet: data.ListeElement[i].IDOBJET,
                                    IdTypeObjet: data.ListeElement[i].IDTYPEOBJETVUE, 
                                    Libelle: data.ListeElement[i].LIBELLE,
                                    x: data.ListeElement[i].X,
                                    y: data.ListeElement[i].Y,
                                    Forme: data.ListeElement[i].FORME,
                                    x_delta: data.ListeElement[i].X_DELTA,
                                    y_delta: data.ListeElement[i].Y_DELTA
                                }
                            );

            }

            // Affectation de chaque enfant à son parent

            var IdParent;
            var IdEnfant;

            for (var i = 0; i < data.ListeElement.length; i++) {

                IdParent = data.ListeElement[i].IDELEMENTVUEPARENT;
                IdEnfant = data.ListeElement[i].IDELEMENTVUE;

                if (IdParent !== -1) {

                    mVue.ListeElement[IdParent].AffecterEnfant(mVue.ListeElement[IdEnfant]);

                }

            }

            // Visibilité pour tous

            for (var i = 0; i < mVue.ListeElement.length; i++) {

                mVue.ListeElement[i].Visible(true);

            }
            
            // Actualisation de tous les hubs racines

            mVue.ActualiserTout();

            // Collection de la vue au niveau global

            that.ListeVue.push(mVue);

            // Focus sur la vue

            that.SelectionnerVue(mVue);

            // Fermerture de la fenêtre de sélection d'une vue

            OuvrirForm_OuvrirVue_Fermer();

        });
        
    }
    
};

var VueClass = Class.extend({

    initialize: function (ParametresVue) {

        // Stockage au niveau de la vue de la liste de toutes les références de ses objets enfants (pour faciliter la recherche d'un objet par exemple) = linéarisation des données.

        this.ListeElement = [];
        this.ListeSelection = [];

        // Variable pseudo-globale pour les composants essentiels de la scène
        
        this.canvas = document.getElementById(ParametresVue.IdCanvas);
        
        this.stage = new createjs.Stage(this.canvas);
        this.mainContainer = null;

        // Récupération de la taille de la fenêtre

        var w = document.body.clientWidth;
        var h = document.body.clientHeight;

        // Nom de la vue (vide car pas encore enregistré)

        this.NomVue = ParametresVue.NomVue;
        this.IdVue = ParametresVue.IdVue;

        // Création de la scène

        this.stage.enableDOMEvents(false); // nécessaire pour reset
        this.stage.canvas = document.getElementById("MainCanvas");
        this.stage.enableDOMEvents(true);
        this.stage.snapToPixelsEnabled = true;
        this.stage.autoClear = true;
        this.stage.canvas.width = w; // essentiel pour le fullscreen : le overflow en css
        this.stage.canvas.height = h;
        document.body.style.cursor = "url(../../Images/icone/grab.cur), auto";
        this.stage.enableMouseOver();
        createjs.Touch.enable(this.stage);

        // Création du container principal dans lequel seront ajoutés tous les objets.

        this.mainContainer = new createjs.Container();
        this.mainContainer.snapToPixel = true;
        this.mainContainer.x = ParametresVue.mainContainerX;
        this.mainContainer.y = ParametresVue.mainContainerY;
        this.stage.addChild(this.mainContainer);

        /*************************************************/
        // Evènements

        var self = this; // va savoir pourquoi j'écris ça... (maintenant je sais, mais c'est pas mieux)

        // Evènements pour glisser-déplacer la scène

        this.stage.addEventListener("stagemouseup", function (e) { self.handleMouseUp(e); });
        this.stage.addEventListener("stagemousedown", function (e) { self.handleMouseDown(e); });
        this.stage.addEventListener("stagemousemove", function (e) { self.handleMouseMove(e); });

        // Evènement pour dézoom

        if (window.addEventListener)
            /** DOMMouseScroll is for mozilla. */
            window.addEventListener('DOMMouseScroll', function (e) { self.wheel(e); }, false);
        /** IE/Opera. */
        window.onmousewheel = document.onmousewheel = function (e) { self.wheel(e); };

        // Evènement pour ajustement du ratio si redimensionnement de la fenêtre

        window.addEventListener("resize", function (e) { self.handleResize(e); });

        // Initialisation de variable nécessaire au mode 'ModeMouseOnly'

        this.ModeMouseMoveOnly_InitialiserVariables();

        // Dessin de la grille

        this.DessinerGrille();

    },

    // Carte resize auto

    lastX: -1, // coordonnées de la souris entre mouse down et mouse up
    lastY: -1,
    firstlastX: -1, // coordonnées du premier mouse down
    firstlastY: -1,
    ZoomInProgress: false,
    ActualRatio: 1,

    handleResize: function () {

        // scale du canvas

        var w = document.body.clientWidth;
        var h = document.body.clientHeight * 0.99;  // sorry for 0.99 : asp.net forced me

        this.stage.canvas.width = w;
        this.stage.canvas.height = h;

    },

    // Carte zoommable

    wheel: function (event) {
        
        var delta = 0;
        if (!event) /* For IE. */
            event = window.event;
        if (event.wheelDelta) { /* IE/Opera. */
            delta = event.wheelDelta / 120;
        } else if (event.detail) { /** Mozilla case. */
            /** In Mozilla, sign of delta is different than in IE.
             * Also, delta is multiple of 3.
             */
            delta = -event.detail / 3;
        }
        /** If delta is nonzero, handle it.
         * Basically, delta is now positive if wheel was scrolled up,
         * and negative, if wheel was scrolled down.
         */
        if (delta) {
            // Si aucun zoom en cours
            if (!this.ZoomInProgress) {

                // Si Wheel down
                if (delta < 0) {
                    this.Zoom(0.5);

                    // Diffusion de l'évènement
                    MacroEventsManager.SomethingHappened("Dezoom", null);

                }

                // Si Wheel up (et impossibilité de zoomer davantage que le ratio initial) 
                if (delta > 0 && this.ActualRatio < 1) {
                    this.Zoom(1 / 0.5);

                    // Diffusion de l'évènement
                    MacroEventsManager.SomethingHappened("Zoom", null);

                }

            }

        }

        /** Prevent default actions caused by mouse wheel.
         * That might be ugly, but we handle scrolls somehow
         * anyway, so don't bother here..
         */
        if (event.preventDefault)
            event.preventDefault();
        event.returnValue = false;
    },

    Zoom: function (ratiozoom) {

        this.ZoomInProgress = true;
        this.ActualRatio = this.ActualRatio * ratiozoom;
        
        // zoom qui garantie que le centre reste au centre

        var pos_x_centre = this.stage.canvas.width / 2;
        var pos_y_centre = this.stage.canvas.height / 2;

        var ecart_x_container_centre = this.mainContainer.x - pos_x_centre;
        var ecart_y_container_centre = this.mainContainer.y - pos_y_centre;

        var that = this;

        var tween = createjs.Tween
            .get(this.mainContainer)
            .to({
                scaleX: this.mainContainer.scaleX * ratiozoom,
                scaleY: this.mainContainer.scaleY * ratiozoom,
                x: this.mainContainer.x - ecart_x_container_centre * (1 - ratiozoom),
                y: this.mainContainer.y - ecart_y_container_centre * (1 - ratiozoom)
            },
            300,
            createjs.Ease.linear)
            .call(function () {
                // il faut dire que c'est terminé
                that.ZoomInProgress = false;
                // affichage du zoom
                $("#zoomratio").text('zoom: ' + (that.mainContainer.scaleX === 1 ? 1 : '1/' + (1 / that.mainContainer.scaleX))); // affichage sous forme de fraction
            });

        MacroEventsManager.SomethingHappened("ZoomRatio", { Ratio: that.mainContainer.scaleX * ratiozoom });

    },

    // Carte déplaçable

    /* Les coordonnées de la souris en référentiel graphique */
    MousePosX: 0,
    MousePosY: 0,

    ObjetToMove: null,

    handleMouseDown: function (evt) {
        
        this.lastX = evt.stageX;
        this.lastY = evt.stageY;
        this.firstlastX = evt.stageX;
        this.firstlastY = evt.stageY;

        if (VariablesGlobales.TypeSelection === EnumModeAction.Deplacer) {

            // On récupère la surface cliquable ci-dessous (si clic sur un élément, ou null si le clic s'effectue sur le MainContainer)
            this.ObjetToMove = this.stage.getObjectUnderPoint(evt.stageX, evt.stageY, 2);

            if (this.ObjetToMove !== null) {
                // On utilise la référence vers le bitmap
                this.ObjetToMove = this.ObjetToMove.ReferenceToBitmap;

            }
        }

        document.body.style.cursor = "url(../../Images/icone/grabbing.cur), auto";

    },

    ModeMouseMoveOnly_InitialiserVariables: function () {
        this.ModeMouseMoveOnly = false; 
        this.MouvementEnCours_Droite = -1;
        this.MouvementEnCours_Gauche = -1;
        this.MouvementEnCours_Haute = -1;
        this.MouvementEnCours_Basse= -1;
        this.MouvementDelta = 50;
        this.MouvementFrequence =100;
    },

    handleMouseMove: function (evt) {

        /* coordonnées de la souris sur la map */

        this.MousePosX = Math.round((evt.stageX - this.mainContainer.x) / this.mainContainer.scaleX);
        this.MousePosY = Math.round((evt.stageY - this.mainContainer.y) / this.mainContainer.scaleY);

        // affichage des coordonnées

        $("#x_mouse").text('x: ' + this.MousePosX + ',');
        $("#y_mouse").text('y: ' + this.MousePosY + ',');
        
        /* déclenché en cas de drag drop du main container ou d'un objet/hub */

        if (this.lastX !== -1 && this.lastY !== -1 && this.ModeMouseMoveOnly === false) {

            var stageX = evt.stageX;
            var stageY = evt.stageY;

            var diffX = stageX - this.lastX;
            var diffY = stageY - this.lastY;

            this.lastX = stageX;
            this.lastY = stageY;

            if (this.ObjetToMove===null)
            {
                this.mainContainer.x += diffX;
                this.mainContainer.y += diffY;
            }
            else
            {   

                var posX = this.MousePosX - this.ObjetToMove.image.width / 2;
                var posY = this.MousePosY - this.ObjetToMove.image.height / 2;

                // Déplacement de l'objet/hub

                this.ObjetToMove.ReferenceToObjet.x(posX, EnumTypeCoord.Global); // 'ObjetToMove' n'est que le bitmap... ReferenceToObjet permet de remonter à l'objet/hub surjacent
                this.ObjetToMove.ReferenceToObjet.y(posY, EnumTypeCoord.Global); 

            }
        }

        /* déclenché en cas de MouseMoveOnly */

        if (this.ModeMouseMoveOnly === true) {

            var bordure_gauche = 0.25 * this.stage.canvas.width;
            var bordure_droite = 0.75 * this.stage.canvas.width;
            var bordure_haute = 0.25 * this.stage.canvas.height;
            var bordure_basse = 0.75 * this.stage.canvas.height;

            // si la souris est dans la zone gauche

            var that = this;

            if (evt.stageX < bordure_gauche && this.MouvementEnCours_Gauche === -1) {
                this.MouvementEnCours_Gauche = setInterval(function () { that.mainContainer.x += that.MouvementDelta; }, this.MouvementFrequence);
            }
            else if (this.MouvementEnCours_Gauche !== -1 && evt.stageX > bordure_gauche) {
                clearInterval(this.MouvementEnCours_Gauche);
                this.MouvementEnCours_Gauche = -1;
            }

            // si la souris est dans la zone droite

            if (evt.stageX > bordure_droite && this.MouvementEnCours_Droite === -1) {
                this.MouvementEnCours_Droite = setInterval(function () { that.mainContainer.x -= that.MouvementDelta; }, this.MouvementFrequence);
            }
            else if (this.MouvementEnCours_Droite !== -1 && evt.stageX < bordure_droite) {
                clearInterval(this.MouvementEnCours_Droite);
                this.MouvementEnCours_Droite = -1;
            }

            // si la souris est dans la zone haute

            if (evt.stageY < bordure_haute && this.MouvementEnCours_Haute === -1) {
                this.MouvementEnCours_Haute = setInterval(function () { that.mainContainer.y += that.MouvementDelta; }, this.MouvementFrequence);
            }
            else if (this.MouvementEnCours_Haute !== -1 && evt.stageY > bordure_haute) {
                clearInterval(this.MouvementEnCours_Haute);
                this.MouvementEnCours_Haute = -1;
            }

            // si la souris est dans la zone basse

            if (evt.stageY > bordure_basse && this.MouvementEnCours_Basse === -1) {
                this.MouvementEnCours_Basse = setInterval(function () { that.mainContainer.y -= that.MouvementDelta; }, this.MouvementFrequence);
            }
            else if (this.MouvementEnCours_Basse !== -1 && evt.stageY < bordure_basse) {
                clearInterval(this.MouvementEnCours_Basse);
                this.MouvementEnCours_Basse = -1;
            }

        }

    },

    handleMouseUp: function (evt) {

        var that = this;

        // actualisation du hub parent dans le cas où l'on déplaçait un objet

        if (this.ObjetToMove !== null) {
            
            // Actualisation remontante en partant de l'élément bougé

            if (that.ObjetToMove.ReferenceToObjet.Parent !== null) {

                // définition du delta

                // calcul de la distance entre le mouse down et le mouseup
                var deltaX = (this.lastX - this.firstlastX) / this.mainContainer.scaleX;
                var deltaY = (this.lastY - this.firstlastY) / this.mainContainer.scaleY;

                this.ObjetToMove.ReferenceToObjet.Parent.x_delta += deltaX;
                this.ObjetToMove.ReferenceToObjet.Parent.y_delta += deltaY;

                this.ActualisationRemontante(that.ObjetToMove.ReferenceToObjet);
            }

            MacroEventsManager.SomethingHappened("DeplacementManuelElement", null);

        } 
        else {
            MacroEventsManager.SomethingHappened("DeplacementGrille",
            { MouseX: parseInt(this.MousePosX), MouseY: parseInt(this.MousePosY) });
        }
        
        this.lastX = -1;
        this.lastY = -1;
        this.ObjetToMove = null;

        document.body.style.cursor = "url(../../Images/icone/grab.cur), auto";
    },
    
    SupprimerToutesLesFormes: function () {

        this.mainContainer.removeAllChildren();

    },

    // Fonctions d'affichage d'élément basiques au sein de la scène

    QuelqueChoseAuMilieu: function () {

        var circle = new createjs.Shape();
        var diametre = 500;
        circle.graphics.setStrokeStyle(20);
        circle.graphics.beginFill(getRandomColor());
        //circle.graphics.drawRect((stage.canvas.width / stage.scaleX) / 2, (stage.canvas.height / stage.scaleY) / 2, 20, 20);
        var x = (this.stage.canvas.width / this.stage.scaleX) / 2;
        var y = (this.stage.canvas.height / this.stage.scaleY) / 2;
        x = ArrondirAu(x, 50);
        y = ArrondirAu(y, 50);
        circle.alpha = 1;
        circle.graphics.drawCircle(0, 0, 22);
        circle.x = x;
        circle.y = y;
        circle.scaleX = 0;
        circle.scaleY = 0;

        this.mainContainer.addChild(circle);

        this.ObjetEnCoursDeCreation = circle;

    },

    DessinerGrille: function () {

        var taille_carreau = 25;
        this.taille_carreau = 25;

        var longeur_trait = 1000 * taille_carreau;
        var NbLigne = 1000;

        var x1 = (-(taille_carreau * NbLigne) / 2);
        var y1 = (-(taille_carreau * NbLigne) / 2);

        for (var i = 0; i < NbLigne; i++) {
            this.DrawLine(x1 + i * taille_carreau, y1, x1 + i * taille_carreau, y1 + longeur_trait);
        }

        for (var j = 0; j < NbLigne; j++) {
            this.DrawLine(x1, y1 + j * taille_carreau, x1 + longeur_trait, y1 + j * taille_carreau);
        }

    },

    DrawLine: function (startX, startY, endX, endY) {

        var line = new createjs.Shape();
        line.graphics.setStrokeStyle(1);
        line.graphics.beginStroke("#DFE9F0");
        line.graphics.moveTo(startX, startY);
        line.graphics.lineTo(endX, endY);
        line.graphics.endStroke;

        this.mainContainer.addChild(line);

    },

    DrawRect: function (ObjetCoordRect, color) {

        var rect = new createjs.Shape();

        rect.graphics
            .beginStroke(color)
            .drawRect(0, 0, ObjetCoordRect.w, ObjetCoordRect.h);

        rect.x = ObjetCoordRect.x;
        rect.y = ObjetCoordRect.y;

        this.mainContainer.addChild(rect);

        return rect;

    },

    AjouterTexte: function (X, Y, contenu) {

        // Le texte
        var text = new createjs.Text();
        text.set({
            text: contenu,
            textAlign: 'left',
            font: '12px Arial',
            color: 'black'
        });
        text.x = X;
        text.y = Y;
        text.lineWidth = 600;
        text.lineHeight = 20;

        this.mainContainer.addChild(text);
    },

    // Gestion des objets de la vue

    AjouterElement: function (Args) {

        var that = this;

        // instantiation du nouvel objet
        var nouvelElement = new ElementClass(
                                            {
                                                Vue:that,
                                                IdTypeObjet: Args.IdTypeObjet,
                                                idObjetVue: this.ListeElement.length,
                                                IdObjet: Args.IdObjet,
                                                Libelle: Args.Libelle,
                                                x: Args.x,
                                                y: Args.y,
                                                Forme: Args.Forme,
                                                x_delta: Args.x_delta,
                                                y_delta: Args.y_delta
                                            }
                                        );                                 

        this.ListeElement.push(nouvelElement);

        return nouvelElement;

    },
    
    ClicObjet: function (Element) {
        
        // centralisation de la gestion de l'évènement clic au niveau de la vue, 
        // de façon à gérer simplement ses impacts sur les enfants
        switch (VariablesGlobales.TypeSelection)
        {
            case EnumModeAction.AjoutUnitaire:
                // sélectionner l'objet
                this.Selectionner(Element);
                break;
        }
       
    },

    Selectionner: function (Element) {

        switch (VariablesGlobales.TypeSelection) {

            case EnumModeAction.AjoutUnitaire:

                // Désélection de l'ensemble
                
                for (i = 0; i < this.ListeSelection.length; i++) {
                    this.DeSelectionner(this.ListeSelection[i]);
                }

                this.ListeSelection = [];

                // Visuel de la sélection
                
                Element.bitmap.shadow = new createjs.Shadow("#7b7b7b", 0, 0, 10);

                // Ajout de la sélection en mémoire

                this.ListeSelection.push(Element);

                //*****************************************************
                //********************** DEBUG ************************

                // debug : visibilité de l'objet sauvegardé
                
                console.log(JSON.stringify(Element.ElementSauvegarde()));
                
                // debug : visbilité du container
                //var line = new createjs.Shape();
                //line.graphics.setStrokeStyle(1);
                //line.graphics.beginStroke("#770000");
                //line.graphics.moveTo(0, 0);
                //line.graphics.lineTo(0, 10);
                //line.graphics.moveTo(0, 0);
                //line.graphics.lineTo(10, 0);
                //line.graphics.endStroke;

                //Element.Container.addChild(line);


                // debug : visibilité des limites
                console.log('INNER rect : ' + JSON.stringify(Element.innerRect()));
                console.log('OUTER rect : ' + JSON.stringify(Element.outerRect()));
                
                break;
                
            default:
                console('abruti de développeur !');
                break;
        }

    },

    DeSelectionner: function (Objet) {

        Objet.bitmap.shadow = null;
        
    },

    Focus: function (x, y) {

        // Verrouilage des autres zoom pendant que celui ci fonctionne

        this.ZoomInProgress = true;

        var w = document.body.clientWidth;
        var h = document.body.clientHeight;

        // zoom qui garantie que le centre reste au centre
        var pos_x_final = ((w / 2) - x * this.mainContainer.scaleX) ;
        var pos_y_final = ((h / 2) - y * this.mainContainer.scaleY) ;
        
        var that = this;

        var tween = createjs.Tween
            .get(this.mainContainer)
            .to({
                x: pos_x_final,
                y: pos_y_final
            },
            1000,
            createjs.Ease.cubicOut)
            .call(function () { that.ZoomInProgress = false; });

    },

    ActualiserTout: function () {

        // pour chacun des éléments sans parent..

        for (var k = 0; k < this.ListeElement.length; k++) {

            if (this.ListeElement[k].Parent === null) {

                this.ActualisationDescendante(this.ListeElement[k]);

            }

        }

    },

    VueSauvegarde: function () {
        return {
            IDVUE: this.IdVue,
            LIBELLE: this.NomVue,
            MAINCONTAINERX: parseInt(this.mainContainer.x),
            MAINCONTAINERY: parseInt(this.mainContainer.y)
        };
    },

    ActualisationDescendante: function (ElementAActualiser) {

        ElementAActualiser.Actualiser();

        // actualisation descendante
        
        for (var i = 0; i < ElementAActualiser.ListeEnfants.length; i++) {
            
            // recursif
            this.ActualisationDescendante(ElementAActualiser.ListeEnfants[i][0])

        }

    },
    
    ActualisationRemontante: function (ElementAActualiser) {

        ElementAActualiser.Actualiser();

        // Actualisation remontante

        while (ElementAActualiser.Parent !== null && ElementAActualiser.Parent !== undefined) {

            ElementAActualiser = ElementAActualiser.Parent;

            ElementAActualiser.Actualiser();
         
        }

    },

    ResetRemontant: function (ElementAReseter) {

        // Méthode technique pour ne réaliser les calculs de dimension que lorsque nécessaire
        
        // Actualisation remontante

            do 
            {

                ElementAReseter.innerRect(null);
                ElementAReseter.outerRect(null);

                for (var i = 0; i < ElementAReseter.ListeEnfants.length; i++) {
                    ElementAReseter.ListeEnfants[i][0].innerRect(null);
                    ElementAReseter.ListeEnfants[i][0].outerRect(null);
                }

                ElementAReseter = ElementAReseter.Parent;
                
            } while (ElementAReseter !== null && ElementAReseter !== undefined)

    },

    TU_AfficherImageDirect: function (URL, x, y) {

        var image = new Image();
        image.src = "../../Images/blocnote.png";
        var bitmap = new createjs.Bitmap(image);
        bitmap.x = ArrondirAu(x - (bitmap.image.width / 2), 50);
        bitmap.y = ArrondirAu(y - (bitmap.image.height / 2), 50);

        this.mainContainer.addChild(bitmap);

    },

});

var ElementClass = Class.extend({

    initialize: function (ParametresElement) {

        // Contrôle des paramètres
        if (ParametresElement.Vue === null || ParametresElement.Vue === undefined) { console.log('PostCompilation erreur : ParametresElement.Vue'); };
        if (ParametresElement.IdTypeObjet === undefined || ParametresElement.IdTypeObjet === undefined) { console.log('PostCompilation erreur : ParametresElement.IdTypeObjet '); };
        if (ParametresElement.Libelle === null || ParametresElement.Libelle === undefined) { console.log('PostCompilation erreur : ParametresElement.Libelle'); };
        if (ParametresElement.x === null || ParametresElement.x === undefined) { console.log('PostCompilation erreur : ParametresElement.x'); };
        if (ParametresElement.y === null || ParametresElement.y === undefined) { console.log('PostCompilation erreur : ParametresElement.y'); };
        if (ParametresElement.idObjetVue === null || ParametresElement.idObjetVue === undefined) { console.log('PostCompilation erreur : ParametresElement.idObjetVue'); };
        if (ParametresElement.IdObjet === null || ParametresElement.IdObjet === undefined) { console.log('PostCompilation erreur : ParametresElement.IdObjet'); };
        if (ParametresElement.x_delta === null || ParametresElement.x_delta === undefined) { console.log('PostCompilation erreur : ParametresElement.x_delta'); };
        if (ParametresElement.y_delta === null || ParametresElement.y_delta === undefined) { console.log('PostCompilation erreur : ParametresElement.y_delta'); };
        if (ParametresElement.Forme === null || ParametresElement.Forme === undefined) { console.log('PostCompilation erreur : ParametresElement.Forme'); };
        
        // Privatisation du this
        var that = this;

        // La vue - une référence à la vue est stockée dans tous les objets de la vue
        this.Vue = ParametresElement.Vue; // cela permet l'appel de méthode de la vue parente depuis l'enfant

        this.idObjetVue = ParametresElement.idObjetVue; // attribué par la vue
        this.IdObjet = ParametresElement.IdObjet; // attribué par la webapi (0 = objet inexistant en base)

        // L'id du type objet et le nom
        this.IdTypeObjet = parseInt(ParametresElement.IdTypeObjet);
        this.Libelle = ParametresElement.Libelle;

        this.Parent = null; // le parent doit être affecté par la méthode 'ajouterEnfant' du parent
        this.Visible(false); // c'est le hub qui rend visible l'objet

        // Dimension extérieure / intérieure
        this.P_innerRect = null;
        this.P_outerRect = null;

        // Le delta se calculera au premier besoin, au départ : c'est null
        this.P_DeltaFromFirstElement = null;

        // Container principal de l'objet
        this.Container = new createjs.Container();
        this.Container.ChildType = EnumChildType.Element;

        // tableau de tableau : contient les objets et ses coordonnées
        this.ListeEnfants = []; 

        // Propriétés graphiques
        this.x_delta = ParametresElement.x_delta;
        this.y_delta = ParametresElement.y_delta;
        this.Forme = ParametresElement.Forme;

        // L'image
        var objImage = $.grep(VariablesGlobales.ImagesArray, function (e) { return e.idtypeobjet === that.IdTypeObjet; });
        if (objImage[0].image === undefined) {
            console.log(that.IdTypeObjet);
        }
        this.bitmap = new createjs.Bitmap(objImage[0].image);
        this.bitmap.ChildType = EnumChildType.Bitmap; // typage du child pour bien faire sa mesure
        this.bitmap.ReferenceToObjet = this; // nécessaire pour récupérer la référence du bitmap au clic

        var text = new createjs.Text();
        text.set({
            text: that.Libelle,
            textAlign: 'left',
            font: '12px Arial',
            color: 'black'
        });
        //text.lineWidth = this.bitmap.image.width;
        text.lineHeight = 14;
        text.x = this.bitmap.image.width + 5;
        text.y = (this.bitmap.image.height / 2) - (text.lineHeight / 2);
        text.ChildType = EnumChildType.Text; // typage du child pour bien faire sa mesure
        this.text = text;

        // Ajout au container des éléments principaux
        this.Container.addChild(this.bitmap);
        this.Container.addChild(this.text);

        // Position du texte et de l'image
        this.x(ParametresElement.x, EnumTypeCoord.Local);
        this.y(ParametresElement.y, EnumTypeCoord.Local);

        // Visibilité des inner et outer Rect
        this.innerRectShape = new createjs.Shape();
        this.outerRectShape = new createjs.Shape();
        this.Container.addChild(this.innerRectShape);
        this.Container.addChild(this.outerRectShape);

        // Calcul du rectangle contenant tous les éléments
        console.log('Objet : ' + this.Libelle + ' | Besoin du innerRect pour la surface cliquable')
        var minnerRect = this.innerRect();

        // Création de la surface cliquable
        this.hit = new createjs.Shape();
        this.hit.graphics.beginFill("rgba(128, 128, 128, 0.01)").rect(0, 0, minnerRect.w, minnerRect.h); // ...transparente
        this.hit.cursor = "pointer";
        this.hit.ChildType = EnumChildType.SurfaceCliquable;
        this.hit.ReferenceToBitmap = this.bitmap;
        this.Container.addChild(this.hit);

        // Ce qui touche la surface cliquable, touche le bitmap
        this.bitmap.hitArea = this.hit;
        
        // L'évènement clic sur la surface cliquable
        this.hit.addEventListener("click", function (e) { that.Vue.ClicObjet(that); });

    },
    
    Draw_innerouterRectShape: function (ObjCoord) {

        if (this.P_innerRect !== null) {

            var x = this.x();
            var y = this.y();

            this.innerRectShape.graphics.clear().setStrokeStyle(1).beginStroke("rgba(0,62,232,1)").drawRect(this.P_innerRect.x - x, this.P_innerRect.y - y, this.P_innerRect.w, this.P_innerRect.h);


        } else {

            this.innerRectShape.graphics.clear();

        }

        if (this.P_outerRect !== null) {
            
            var x = this.x();
            var y = this.y();

            this.outerRectShape.graphics.clear().setStrokeStyle(1).beginStroke("rgba(49,205,27,1)").drawRect(this.P_outerRect.x - x - 1, this.P_outerRect.y - y - 1, this.P_outerRect.w + 2, this.P_outerRect.h + 2);

        } else {

            this.outerRectShape.graphics.clear();

        }
    },

    ElementSauvegarde: function () {

        var IdParent;
        if (this.Parent === null) {
            IdParent = -1
        } else {
            IdParent = this.Parent.idObjetVue;
        }

        return {
            IDELEMENTVUE: this.idObjetVue,
            IDELEMENTVUEPARENT: IdParent,
            IDOBJET: this.IdObjet,
            IDTYPEOBJETVUE: this.IdTypeObjet,
            LIBELLE: this.Libelle,
            X: this.x(),
            Y: this.y(),
            X_DELTA: this.x_delta,
            Y_DELTA: this.y_delta,
            FORME: this.Forme
        }

    },

    x: function (_x, _EnumTypeCoord) {

        if (_x !== undefined) {

            _x = parseInt(_x);

            if (_EnumTypeCoord === EnumTypeCoord.Global) {
                var Delta = this.DeltaFromFirstElement()
                this.Container.x = _x - Delta.x;
            } else {
                this.Container.x = _x;
            }
            //this.P_x = _x;
            this.P_x = this.Container.x;
        } else {

            if (_EnumTypeCoord === EnumTypeCoord.Global) {
                //var Delta = this.DeltaFromFirstElement()
                //return this.P_x + Delta.x;
            } else {
                //return this.P_x;
            }
            return this.Container.x;
        }

    },

    y: function (_y, _EnumTypeCoord) {

        if (_y !== undefined) {

            _y = parseInt(_y);

            if (_EnumTypeCoord === EnumTypeCoord.Global) {
                var Delta = this.DeltaFromFirstElement();
                this.Container.y = _y - Delta.y;
            } else {
                this.Container.y = _y;
            }
            //this.P_y = _y;
            this.P_y = this.Container.y;
        } else {

            if (_EnumTypeCoord === EnumTypeCoord.Global) {
                var Delta = this.DeltaFromFirstElement();
                return this.P_y + Delta.y;
            } else {
                return this.P_y;
            }

        }

    },

    innerRect: function (Reset) { // renvoi un objet rectangle {x,y,w,h} en coordonnées réels.

        if (Reset !== undefined) {
            console.log('Objet : ' + this.Libelle + ' | Reset inner/outer');
            this.P_innerRect = null;
            this.outerRect(null); // outer n'a plus de sens si inner est null'
            return null;
        }

        // si les dimensions n'ont jamais été calculées ou ont été remises à null

        if (this.P_innerRect === this.P_innerRect) { //=== this.P_innerRect) {

            // alors on les calcul 

            var TableauDeRectangles = [];

            for (var i = 0 ; i < this.Container.children.length ; i++) {

                switch (this.Container.children[i].ChildType) {

                    case EnumChildType.Bitmap:

                        TableauDeRectangles.push(
                            {
                                x: this.x() + this.Container.children[i].x,
                                y: this.y() + this.Container.children[i].y,
                                w: this.Container.children[i].image.width,
                                h: this.Container.children[i].image.height
                            }
                        );
                        break;

                    case EnumChildType.Text:

                        TableauDeRectangles.push(
                            {
                                x: this.x() + this.Container.children[i].x,
                                y: this.y() + this.Container.children[i].y,
                                w: this.Container.children[i].getMeasuredWidth(),
                                h: this.Container.children[i].getMeasuredHeight()
                            }
                        );
                        break;
                    case EnumChildType.Element:
                        break;
                    case EnumChildType.SurfaceCliquable:
                        break;
                    default:
                        console.log('tu as raté un truc mon loulou');
                        break;
                }

            }

            this.P_innerRect = UnionRect(TableauDeRectangles);
            
            console.log('Objet : ' + this.Libelle + ' | Fin du calcul innerRect. résultat :' + JSON.stringify(this.P_innerRect));

        } else {

            console.log('Objet : ' + this.Libelle + ' | Simple renvoi du innerRect précalculé. résultat :' + JSON.stringify(this.P_innerRect));

        }

        this.Draw_innerouterRectShape();

        return this.P_innerRect;

    },

    outerRect: function (Reset) {

        // renvoi le rectangle des limites max du hub incluant 
        // ses éléments enfants directs

        if (Reset !== undefined) {
            
            this.P_outerRect = null;
            return null;
        }

        if (this.ListeEnfants.length === 0) {
            console.log('Objet : ' + this.Libelle + ' | Aucun enfant donc outerRect = innerRect');
            return this.innerRect();
        }

        if (this.P_outerRect === this.P_outerRect) { //=== this.P_outerRect) {

            var TableauDeRectangles = [];

            // Ajout des dimensions de l'élément courant
            console.log('Objet : ' + this.Libelle + ' | Pour le calcul du outerrect, il faut connnaitre son propre innerRect');
            var MeInnerRect = this.innerRect();

            TableauDeRectangles.push(MeInnerRect);

            // Pour chacun des enfants
            for (var i = 0; i < this.ListeEnfants.length; i++) {

                // Récupération de la dimension des enfants

                console.log('Objet : ' + this.Libelle + ' | Pour le calcul du outerrect, il faut connnaitre le outerRect de son enfant');
                var EnfantOuterRect = this.ListeEnfants[i][0].outerRect();

                // Traduction des coordonnées de l'enfant dans l'élément courant
                EnfantOuterRect.x = EnfantOuterRect.x + MeInnerRect.x;
                EnfantOuterRect.y = EnfantOuterRect.y + MeInnerRect.y;

                // Ajout dans le tableau
                TableauDeRectangles.push(EnfantOuterRect);

            }
            
            // Récupération d'un unique tableau englobant tous les autres
            this.P_outerRect = UnionRect(TableauDeRectangles);

            
            console.log('Objet : ' + this.Libelle + ' | Fin du calcul OuterRect. résultat :' + JSON.stringify(this.P_outerRect));

        } else {

            console.log('Objet : ' + this.Libelle + ' | Simple renvoi du OuterRect précalculé. résultat :' + JSON.stringify(this.P_outerRect));

        }

        this.Draw_innerouterRectShape();
        
        return this.P_outerRect;

    },

    DeplacerParTween: function (_x_cible, _y_cible) {

        var x_cible_rect = ArrondirAu(_x_cible, 1);
        var y_cible_rect = ArrondirAu(_y_cible, 1);

        // c'est comme si on y était...
        this.P_x = x_cible_rect;
        this.P_y = y_cible_rect;

        this.innerRect(null);
        this.outerRect(null);

        var that = this;

        // tween du container
        var tween = createjs.Tween
            .get(this.Container)
            .to({
                x: x_cible_rect,
                y: y_cible_rect
            },
            500,
            createjs.Ease.sineOut);

    },

    Selectionner: function () {
        this.Vue.Selectionner(this);
    },

    Visible: function (_visible) {

        if (_visible !== undefined) {

            if (_visible === true) {

                if (this.Parent !== null) {
                    this.Parent.Container.addChild(this.Container);
                }
                else {
                    this.Vue.mainContainer.addChild(this.Container);
                }
                this.P_Visible = true;
            }

            if (_visible === false) {

                if (this.Parent !== null) { // si on n'est pas le cas exceptionnel où l'objet n'est pas encore attaché à un hub

                    this.Parent.Container.removeChild(this.Container);
                }

                this.P_Visible = false;
            }

        }

        return this.P_Visible;

    },

    DeltaFromFirstElement: function (Reset) {

        if (Reset === undefined) { // si aucun arguement n'est passé c'est que l'on souhaite connaitre le delta existant

            // ...calcul du delta

            var Element = this;
            var x = 0;
            var y = 0;
            while (Element.Parent !== null) {

                x = x + Element.Parent.Container.x;
                y = y + Element.Parent.Container.y;

                Element = Element.Parent;

            }

            this.P_DeltaFromFirstElement = { x: x, y: y };

            return this.P_DeltaFromFirstElement;

        } else { // si un argument est passé, cela signifie que l'on reset

            this.P_DeltaFromFirstHub = null; // reset du delta

        }
    },

    TU_AfficherReference: function () {
        alert('Objet cliqué est :' + this.TypeObjet + ' - ' + this.Libelle);
    },

    Actualiser: function () {

        // si c'est un hub sans objet, rien à faire

        if (this.ListeEnfants.length === 0) {
            return;
        }

        // Affichage des objets non encore ajoutés (on parcours chacun des objets)

        for (i = 0; i < this.ListeEnfants.length; i++) {

            if (this.ListeEnfants[i][0].Visible() === false) {

                this.ListeEnfants[i][0].Visible(true);

            }

        }

        // Calcul des coordonnées des objets selon les règles du hub

        this.CalculerCoordonnees();

        // Déplacement des objets vers les coordonnées calculés.

        for (i = 0; i < this.ListeEnfants.length; i++) {

            this.ListeEnfants[i][0].DeplacerParTween(
                this.ListeEnfants[i][1][0], // ième item, objet, coordonnées, x
                this.ListeEnfants[i][1][1] // ième item, objet, coordonnées, y
            );
        }

    },

    CalculerCoordonnees: function () {

        switch (this.Forme) {

            case EnumPositionImage.EnLigneVertical:

                // Définition des marges
                var MarginH = 5;
                var MarginW = 20;

                // Calcul du nombre d'enfant de l'élément en cours d'actualisation
                var NbEnfants = this.ListeEnfants.length;

                // Dimension interne de l'élément en cours d'actualisation
                var wParent;
                var hParent;

                console.log('Objet : ' + this.Libelle + ' | Calcul des futures coordonnées des enfants. On commence par soi-même');

                var Dimension = this.innerRect(); // c'est sa dimension qui servira de marge gauche minimal
                wParent = Dimension.w; // récupération de la largeur du parent
                hParent = Dimension.h; // permet l'alignement vertical'

                var HauteurTotal = 0;

                for (i = 0; i < NbEnfants; i++) {

                    // récupération des dimensions complètes uniquement pour la hauteur

                    console.log('Objet : ' + this.Libelle + ' | Calcul des futures coordonnées des enfants. InnerRect de lenfant');

                    var InnerObjet = this.ListeEnfants[i][0].innerRect();

                    console.log('Objet : ' + this.Libelle + ' | Calcul des futures coordonnées des enfants. OuterRect de lenfant');

                    var OuterObjet = this.ListeEnfants[i][0].outerRect();

                    // coordonnée x

                    var x = this.x_delta
                            + wParent
                            + (InnerObjet.x - OuterObjet.x)
                            + MarginW;

                    // coordonnée y

                    var y = HauteurTotal // incrémenté ci-après
                            + (InnerObjet.y - OuterObjet.y) // voir schéma slide 42
                            + this.y_delta; // delta personnalisable par le mouvement

                    // incrémentation de la hauteur

                    HauteurTotal = HauteurTotal // 0 au début
                                 + OuterObjet.h; // taille de l'objet que l'on vient de placer

                    // affectation des coordonnées

                    this.ListeEnfants[i][1] = [x, y];

                }

                // alignement vertical des objets (car la longueur totale est connnue à présent)

                for (i = 0; i < NbEnfants; i++) {

                    this.ListeEnfants[i][1][1] = this.ListeEnfants[i][1][1] - HauteurTotal / 2 + hParent / 2

                }

                console.log('Objet : ' + this.Libelle + ' | Fin du calcul des coordonnées des enfants');

                break;


        }
    },
    
    AffecterEnfant: function (Element) {

        var that = this;

        // Le parent fait rentrer dans la tête de l'enfant : 
        // 'le parent c'est moi'
        Element.Parent = that;

        // Ajout de l'objet dans la mémoire du hub
        this.ListeEnfants.push([
            Element,
            [0, 0] // coordonnées affectés par le hub
        ]);

        this.Vue.ResetRemontant(Element.Parent);
    }

});

