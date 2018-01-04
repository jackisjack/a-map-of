//---------------------------------------------------------------------------------------------------
// MENU GAUCHE

var EnumModeAction = {
    AjoutUnitaire: 0,
    AjoutMultiple: 1,
    Focus: 2,
    Lier: 3,
    Deplacer: 4
};

function MenuGauche(e, ModeAction) {

    // couleur grise pour tout le monde !

    var AllButtons = document.getElementsByClassName('glyphicon');
    for (var i = 0, len = AllButtons.length; i < len; i++) {
        AllButtons[i].style["color"] = "lightgrey";
    }

    // couleur rouge pour celui sélectionné

    e.style.color = "#5b8bba";

    // en fonction de ce qui est cliqué

    VariablesGlobales.TypeSelection = ModeAction;

    // Comportements spécifiques de l'IHM en fonction du mode

    switch (VariablesGlobales.TypeSelection) {
        case EnumModeAction.Deplacer:
            // cache le menu et déplace les coordonnées en bas
            $('#MenuDuBas').toggle();
            $('.menu-bas-droite').css('bottom', '20px');
            break;
        default:
            // affiche le menu et déplace les coordonnées au dessus du menu
            $('#MenuDuBas').show();
            $('.menu-bas-droite').css('bottom', '180px');
            break;
        
    }

}

//---------------------------------------------------------------------------------------------------
// FENETRE : gérer les types d'objets

function toggleCheckbox(id, element) {

    var jsonObjet;
    if (element.checked === true) {

        API_TypeObjet_PUT_Favoris(id, MaJMenu_ApresMaJFavoris);

    }
    else {

        API_TypeObjet_PUT_NonFavoris(id, MaJMenu_ApresMaJFavoris);

    }

}

function MaJMenu_ApresMaJFavoris() {

    // Mise à jour du menu, après mise à jour de la coche 'Favoris'

    API_TypeObjet_GET_Favoris(TypeObjet_ListerFavorisMenu_Loaded);


}

function DataToTableListeToutObjet(data) {

    //construction du contexte

    var context = {
        ListeObjetTous: data
    };

    //appel du générateur HTML

    GenerateurHTML("#ListeTypeObjet-template", context, '.content-ListeObjetTous');

}

function OuvrirForm_dialogTypeObjetTous()
{
    
    // définition de la fenêtre

    $("#dialogTypeObjetTous").dialog
    (
        {
            autoOpen: false,
            show: {
                effect: "blind",
                duration: 0
            },
            hide: {
                effect: "clip",
                duration: 300
            },
            title: "Tous les objets",
            width: 590,
            height: 500,
            open: function (event, ui)
            {
                // déclenchement de l'appel à l'api (... qui déclenchera le remplissage de la grid)

                API_TypeObjet_GET(DataToTableListeToutObjet);

            }
        }
    );

    // ouverture du dialog

    $("#dialogTypeObjetTous").dialog("open");

}

//---------------------------------------------------------------------------------------------------
// FENETRE : saisie d'un objet 

function OuvrirForm_NomInstanceObjet(IdTypeObjet, Type, x, y) {

    // Définition de la fenêtre

    $("#dialogNomInstanceObjet").dialog
    (
        {
                autoOpen: false,
                show: {
                    effect: "blind",
                    duration: 0
                },
                title: "Ajouter un objet",
                width: 650,
                height:300
        }
    );

    $("#dialogNomInstanceObjet").dialog("open");

    // Réinitialisation des contrôles

    $("#dialogNomInstanceObjet #TypeObjet").val(Type);
    
    // Affichage du parent

    $("#dialogNomInstanceObjet #LienTypeObjet").text(Graphisme.VueFocus.ListeSelection[0].TypeObjet);
    $("#dialogNomInstanceObjet #LienObjet").text(Graphisme.VueFocus.ListeSelection[0].Libelle);
    
    $("#dialogNomInstanceObjet #NomObjet").val("");

    // Affectation des champs cachés

    $("#dialogNomInstanceObjet input:hidden[name = x]").val(x);
    $("#dialogNomInstanceObjet input:hidden[name = y]").val(y);
    $("#dialogNomInstanceObjet input:hidden[name = IdTypeObjet]").val(IdTypeObjet);

    // Contrôle actif = le nom d'objet'

    $("#dialogNomInstanceObjet #NomObjet").focus();
    
    // Autocomplete

    // destruction de l'autocomplete éventuel préalable
    if ($("#dialogNomInstanceObjet #NomObjet").hasClass("ui-autocomplete-input")) {
        $("#dialogNomInstanceObjet #NomObjet").autocomplete("destroy");
    }

    // création de l'autocomplete
    $("#dialogNomInstanceObjet #NomObjet").autocomplete({
        source: "/api/Objet/Autocomplete/" + IdTypeObjet + "/GET", // on obtient uniquement les noms des objets pour le type draggé.
        minLength: 2,
        select: function (event, ui) {
            // Extraire le nom de la structure : NomObjet (id:xxx) TypeObjet (id:xxx)
            // + éventuellement changé le type si nécessaire
            // affecter l'id à un champ invisible, et le passer à la création de l'objet
        }
    });

    // Touche entrée = validation

    $('#dialogNomInstanceObjet #NomObjet').unbind("keypress"); // suppression de l'event prééalable (causé par cette même fonction)

    $('#dialogNomInstanceObjet #NomObjet').keypress(function (event) {
        if (event.keyCode === 13 || event.which === 13) {
            Form_NomInstanceObjet_ClickValider();
             event.preventDefault();
        }
    });

}

function Form_NomInstanceObjet_ClickValider() {
    
    // récupération des variables de la form

    var TypeObjet = $("#dialogNomInstanceObjet #TypeObjet").val();
    var NomObjet = $("#dialogNomInstanceObjet #NomObjet").val();
    var IdTypeObjet = parseInt($("#dialogNomInstanceObjet input:hidden[name = IdTypeObjet]").val());
    var x = parseInt($("#dialogNomInstanceObjet input:hidden[name = x]").val());
    var y = parseInt($("#dialogNomInstanceObjet input:hidden[name = y]").val());

    // Définition du parent

    var Parent;
    Parent = Graphisme.VueFocus.ListeSelection[0]; 

    // récupération de l'id de l'objet (existant ou non)

    // S'il s'agit d'un hub, pas d'appel de l'api
    // ATTENTION DOUBLON DE CODE... ci-dessous

    if (IdTypeObjet === EnumTypeHub.IdTypeObjet){

        // Ajout de l'objet (au niveau de la vue)

        var tmpObjet = Graphisme.VueFocus.AjouterElement(
            {
                IdTypeObjet: IdTypeObjet,
                Libelle: NomObjet,
                x: x,
                y: y,
                x_delta: 0,
                y_delta: 0,
                IdObjet: EnumTypeHub.IdObjet , // la seule différence
                Forme: EnumPositionImage.EnLigneVertical
            });


        // Affectation de l'objet au hub (en tant qu'enfant de ce hub)

        Parent.AffecterEnfant(tmpObjet);

        // Actualisation remontante à partir de l'élément parent

        Graphisme.VueFocus.ActualisationRemontante(Parent);

        // cache le dialogue

        $("#dialogNomInstanceObjet").dialog("close");

    } else { // sinon appel de l'api pour obtenir l'id (en créant ou non)

        API_Objet_ID_GET(IdTypeObjet, NomObjet,

            function (data) {

                // Ajout de l'objet (au niveau de la vue)

                var tmpObjet = Graphisme.VueFocus.AjouterElement(
                    {
                        IdTypeObjet: IdTypeObjet,
                        Libelle: NomObjet,
                        x: x,
                        y: y,
                        x_delta: 0,
                        y_delta: 0,
                        IdObjet: data.resultat,
                        Forme: EnumPositionImage.EnLigneVertical
                    });


                // Affectation de l'objet au hub (en tant qu'enfant de ce hub)

                Parent.AffecterEnfant(tmpObjet);

                // Actualisation remontante à partir du hub parent

                Graphisme.VueFocus.ActualisationRemontante(Parent);

                // cache le dialogue

                $("#dialogNomInstanceObjet").dialog("close");

            }

        );

    }
    
}

//---------------------------------------------------------------------------------------------------
// FENETRE : ListeTuto et tuto indications

function OuvrirForm_Indication() {

    // Définition de la fenêtre

    $("#dialogTutosIndication").dialog
        (
        {
            autoOpen: false,
            show: {
                effect: "blind",
                duration: 0
            },
            title: "Exercice",
            width: 300,
            height: 'auto',
            position: { my: "right top", at: "right center" },
            close: function () {
                VariablesGlobales.TutoEnCours.Quitter();
            }
        }
        );


    $("#dialogTutosIndication").dialog("open");

    $("#TutoBoutonTerminer").hide();

}

function DataToTableListeTuto(data) {

    //construction du contexte

    var context = {
        ListeTuto: data
    };

    //appel du générateur HTML

    GenerateurHTML("#ListeTuto-template", context, '.content-ListeTuto');

}

function OuvrirForm_ListeTuto() {

    // Définition de la fenêtre

    $("#dialogListeTuto").dialog
        (
            {
                autoOpen: false,
                show: {
                    effect: "blind",
                    duration: 0
                },
                title: "Liste des tutoriels",
                width: 640,
                height :480,
                open: function (event, ui) {

                    // déclenchement de l'appel à l'api (... qui déclenchera le remplissage de la grid)
                    API_Tuto_GET(DataToTableListeTuto);

                    // déclenchement de l'appel à l'api (... qui déclenchera le taux de connaissance acquise)
                    API_Tuto_GET_Score(ActualisationTauxConnaissance);

                    }
            }
        );

    $("#dialogListeTuto").dialog("open");

}

function ActualisationTauxConnaissance(data) {

    var PourcentageCible = data.NbTutoDone; // récupération de la data de la WebApi
    var width = 1;
    var id = setInterval(frame, 10);
    function frame() {
        if (width >= PourcentageCible) {
            clearInterval(id);
        } else {
            width++;
            $("#progress-bar").width(width + '%');
            $("#progress-bar p").text(width + '%');
        }
    }

}

function FermerForm_ListeTuto() {

    $("#dialogListeTuto").dialog("close");

}

//---------------------------------------------------------------------------------------------------
// FENETRE : Enregistrement de la vue

function OuvrirForm_EnregistrerVue() {

    // Définition de la fenêtre

    $("#dialogVue").dialog
        (
        {
            autoOpen: false,
            show: {
                effect: "blind",
                duration: 0
            },
            title: "Enregistrer la carte",
            width: 650
        }
        );

    $("#dialogVue").dialog("open");

    // Initialisation du contrôle avec le dernier nom de la vue enregistré
    // (potentiellement vide si aucun enregistrement)
    $("#dialogVue #NomVue").val(Graphisme.VueFocus.NomVue);

}

function OuvrirForm_EnregistrerVue_BoutonEnregistrer() {

    var NomVue = $("#dialogVue #NomVue").val().trim();

    if (NomVue === '') {

        alert('Saisissez un nom pour cette carte svp.');
        return;

    } else {

        API_Vue_GET(NomVue, function (data) {

            // si le libellé de la vue existe déjà et que la vue n'avait jamais été enregistré'

            if (data.resultat !== 0 && Graphisme.VueFocus.IdVue === -1) {

                // une confirmation d'écrasement est demandé à l'utilisateur

                var answer = window.confirm('attention, vous avez déjà enregistré une carte avec ce nom. Etes-vous sur de vouloir lécraser ?');

                if (!answer) {
                    return;
                }
            }

            // Enregistrement de la vue active avec le nom souhaité

            Graphisme.SauvegarderVue(Graphisme.VueFocus, NomVue);
            
        });
       

    }

}

function OuvrirForm_EnregistrerVue_Fermer() {

    $("#dialogVue").dialog("close");
 
}

//---------------------------------------------------------------------------------------------------
// FENETRE : Ouvrir une vue

function OuvrirForm_OuvrirVue() {

    // Définition de la fenêtre

    $("#dialogListeMesVues").dialog
        (
        {
            autoOpen: false,
            show: {
                effect: "blind",
                duration: 0
            },
            title: "Ouvrir une carte",
            width: 650,
            height: 500,
            open: function (event, ui) {

                MaJListeVue_ApresMajVue();

            }
        }
        );

    $("#dialogListeMesVues").dialog("open");

}

function MaJListeVue_ApresMajVue() {

    // déclenchement de l'appel à l'api (... qui déclenchera le remplissage de la grid)
    
    API_Vue_GET(null, function (data) {

        //construction du contexte

        var context = {
            ListeMesVues: data
        };

        //appel du générateur HTML

        GenerateurHTML("#ListeMesVues-template", context, '.content-ListeMesVues');

    });

}

function OuvrirForm_OuvrirVue_Fermer() {

    $("#dialogListeMesVues").dialog("close");

}

function OuvrirForm_SupprimerVue(idVue) {

    if (confirm("Supprimer définitivement la vue ?") == true) {

        // Suppression de la vue

        API_Vue_DELETE(idVue, function () {

            // Mise à jour de la liste

            MaJListeVue_ApresMajVue();

        });
        
    }


}