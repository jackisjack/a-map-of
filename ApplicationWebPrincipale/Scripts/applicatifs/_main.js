var MainSiManager =
{
        Init: function () {

            // Fenêtre loading;

            ShowLoading();

            // Mode 'Ajout unitaire' cliqué par défaut

            document.getElementsByClassName('glyphicon glyphicon-plus')[0].click();

            // Pour gérer les mouvements suivants une ligne (non utilisé pour le moment)

            createjs.MotionGuidePlugin.install();

            // Chargement en mémoire des îcones (pour leur ajout futur sur la scène)

            SetLoadingMessage("Chargement de la carte");
            ChargerLesImagesEnMemoire_CallData();
            
            // !!! NE RIEN CODER APRES DANS CETTE FONCTION (chargement des images en cours)
            // POUR CODER, UTILISER LA FONCTION EN DESSOUS

        },

        Init_2: function () {

            // Initialisation de la vue

            Graphisme.Init();

            // Affichage du nombre de tuto à faire

            API_Tuto_GET_ToDo(function (data) {
                $('#NbTutoPasFait').text(data[0]);
            });

            // Fin du loading;

            HideLoading();

        }
        
}