/* Chargement de TOUTES les images en mémoire (peut-être à optimiser par la suite, selon les besoins) */

function ChargerLesImagesEnMemoire_DataLoaded(data) {

    // Images chargées correspondant à chaque type d'objet

    var image_temp;

    for (var i = 0; i < data.length; i++) {

        image_temp = new Image();
        image_temp.src = "../../Images/" + data[i].ICONE;
        VariablesGlobales.ImagesArray.push({ idtypeobjet: data[i].IDTYPEOBJET, libelle: data[i].LIBELLE, image: image_temp });

    }

    // Autres images à charger :

    image_temp = new Image();
    image_temp.src = "../../Images/hub.png";
    VariablesGlobales.ImagesArray.push({ idtypeobjet: -1, libelle: "#HUB", image: image_temp });

    MainSiManager.Init_2();

}

function ChargerLesImagesEnMemoire_CallData() {

    API_TypeObjet_GET(ChargerLesImagesEnMemoire_DataLoaded);

}