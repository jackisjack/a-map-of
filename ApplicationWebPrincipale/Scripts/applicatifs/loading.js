function ShowLoading() {

    // Affichage du loading
    var modal = document.getElementById('myModal');
    modal.style.display = "block";

    // Masquage des menus
    $(".MenuACacher").hide();

}

function SetLoadingMessage(message) {

    if (message != '#hasard')
    {
        $("#myModal p:first").text(message);
    }
    else
    {
        ListeMessagesAttentesBidons = [
            'Calibrage du navigateur instantié',
            'Définition de la gravité ascensionnelle',
            'Libération des flux intemporels',
            'Chargement des éléments indistinguibles',
            'Recalibrage du module px-021',
            'Inversion des pôles bilatéraux',
            'Revalorisation de la nomenclature',
            'Encapulsation des membres internes du noyau',
            'Vidage du socle antinomique',
            'Analyse des vitesses invariables'
        ];

        MessageAuHasard = ListeMessagesAttentesBidons[Math.round(Math.random() * (ListeMessagesAttentesBidons.length - 1))];

        $("#myModal p:first").text(MessageAuHasard);

    }

}

function HideLoading(message) {

    //var modal = document.getElementById('myModal');
    //modal.style.display = "none";
    $("#myModal").fadeOut(2000);
    
    $(".MenuACacher").show();

}
