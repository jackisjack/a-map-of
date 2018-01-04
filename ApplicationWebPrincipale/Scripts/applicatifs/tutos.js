// Exemple :
// MacroEventsManager.SomethingHappened("DeplacementGrille",
// { MouseX: parseInt(this.MousePosX), MouseY: parseInt(this.MousePosY) });

var MacroEventsManager = {
    LogEverything: true,
    NombreActionHistorique: 10,
    EvenementsHistorique: [],
    IdEventToListen: null, // id de l'évènement en cours d'écoute
    handlerCheck: null, // handler de vérification à déclencher
    handlerSuccess: null, // handle de succès
    handlerFail:null, // et celui d'échec
    SomethingHappened: function (IdAction, ObjetParametre) {

        // Enregistrement de l'action dans l'historique (pour gérer du ctrl+z / ou du débuggage)
        this.EvenementsHistorique.push({ IdAction: IdAction, ObjetParametre:ObjetParametre })

        // Epuration de l'historique pour ne conserver que X actions en mémoire
        if (this.EvenementsHistorique.length > this.NombreActionHistorique) {
            this.EvenementsHistorique.shift(); // suppression du premier élément du tableau, soit le plus ancien
        }

        if (this.LogEverything == true) {
            console.log(IdAction);
        }

        // Si l'action qui est survenue est sur écoute
        if (IdAction == this.IdEventToListen) {

            // Si aucune fonction de vérification n'est définie
            if (this.handlerCheck == undefined) {
                // Succès par défaut
                this.handlerSuccess.apply(VariablesGlobales.TutoEnCours);
            } else
            {
                // Si les paramètres de l'action correspondent à un succès
                if (this.handlerCheck(ObjetParametre) == true) {
                    // Déclenchement du handler à succès
                    this.handlerSuccess.apply(VariablesGlobales.TutoEnCours);
                } else {
                // Déclenchement du handler à échec
                // au début, on se fera pas chier, ce sera rien du tout
                    this.handlerFail.apply(VariablesGlobales.TutoEnCours);
                }
            }
        } else {
            // si l'action n'est pas sur écoute, on ne fait rien.
        }
    },
    DefinirEcouteur: function (IdEventToListen, handlerCheck, handlerSuccess, handlerFail) {
        this.IdEventToListen = IdEventToListen;
        this.handlerCheck = handlerCheck;
        this.handlerSuccess = handlerSuccess;
        this.handlerFail = handlerFail;
    },
    SupprimerEcouteur: function () {
        this.IdEventToListen = null;
        this.handlerCheck = null;
        this.handlerSuccess = null;
        this.handlerFail = null;
    }
};

var TutoClass = Class.extend({

    initialize: function (IdTuto) {

        var that = this;
        this.StepActuel = 0;
        this.NbStepTotal = 0;
        this.IdTuto = IdTuto;

        // Affichage de la fenêtre
        OuvrirForm_Indication();

        // Chargement des étapes
        API_Tuto_GET_Step.apply(that,[IdTuto, that.PreparerStep]);

        
    },

    PreparerStep: function (data) {

        // Simple mise en mémoire dans l'objet de tous les steps
        this.Steps = data;

        this.NbStepTotal = data.length;

        // Passage au premier step 
        this.NextStep();

    },

    NextStep: function () {

        // cacher le bouton succès
        $("#TutoBoutonSucces").hide();

        // incrémentation du step
        this.StepActuel += 1;

        // Récupération de l'indication du step en cours
        var Indication = this.Steps[this.StepActuel - 1].INDICATION;

        // Ecrire l'indication dans la box
        $("#dialogTutosIndication p").text(Indication);

        // Calcul du nom de la fonction check
        var JSFONCTION = this.Steps[this.StepActuel - 1].JSFONCTION;
        
        var CheckHandler = window['CHECK_' + JSFONCTION];
        
        // Ajout de l'écouteur
        var IdEventToListen = this.Steps[this.StepActuel - 1].IDEVENTTOLISTEN;

        var that = this;
        MacroEventsManager.DefinirEcouteur(IdEventToListen,
                                            CheckHandler,
                                            that.TheSuccessHandler,
                                            that.TheFailHandler
                                            );

    },

    TheSuccessHandler: function () {

        // si c'est la dernière étape du tuto :
        if (this.NbStepTotal == this.StepActuel) {

            // Enregistrement que le tuto est réalisé 
            var jsonObjet = { "idTutoDone": parseInt(this.IdTuto) };

            API_Tuto_POST_Done(jsonObjet,

                // à la fin de l'enregistrement
                function () {

                    // Message de succès
                    $("#dialogTutosIndication p").text("Bravo ! Vous avez terminé le tutoriel avec succès !");

                    // gigotte la fenêtre
                    $("#dialogTutosIndication").effect("bounce", "slow");

                    // bouton terminer
                    $("#TutoBoutonTerminer").show();

                }
            );

        } else { // si ce n'est pas la dernière étape du tuto 

            // gigotte la fenêtre
            $("#dialogTutosIndication").effect("bounce", "slow");

            // bouton succès
            $("#TutoBoutonSucces").show();
            
        }

    },

    TheFailHandler: function () {
        console.log("close to success (or not, i don't really know)");
    },

    Recommencer: function () {
        this.StepActuel = 0;
        this.NextStep();
    },

    BackToListeTutos: function () {

        this.Quitter();

        $("#dialogTutosIndication").dialog('close');

        // réouverture de la liste des tutos (qui va s'autoactualiser)
        OuvrirForm_ListeTuto();

        // actualisation du nombre de tutos restant à faire (dans le badge du menu);
        API_Tuto_GET_ToDo(function (data) {
            $('#NbTutoPasFait').text(data[0]); 
        });

    },

    Quitter: function () {
        MacroEventsManager.SupprimerEcouteur();
    }

});

function Tuto_Execution(IdTuto) {

    // fermeture de la fenêtre de la liste des tutos
    FermerForm_ListeTuto();
    
    // création d'un objet tuto
    VariablesGlobales.TutoEnCours = new TutoClass(IdTuto);

}

// TUTO 1 : Se déplacer dans la vue

function CHECK_DeplacementPrecis(ObjetParametre) {

    if (ObjetParametre.MouseX > 1500 && ObjetParametre.MouseY > 1500) {
        return true;
    } else {
        return false;
    }

};


// TUTO 2 : Se déplacer dans la vue

function CHECK_DezoomMax(ObjetParametre) {

    if (ObjetParametre.Ratio <= 1/16 ) {
        return true;
    } else {
        return false;
    }

};

function CHECK_ZoomMax(ObjetParametre) {

    if (ObjetParametre.Ratio == 1) {
        return true;
    } else {
        return false;
    }

};