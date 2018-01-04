function API_TypeObjet_GET_Favoris(handlerSuccess) {

    $.ajax({
        //url: '../api/TypeObjet_Lecture_FavorisMenu',
        url: '../api/TypeObjet/GET/Favoris',
        type: 'GET',
        success: function (data) {
            console.log('Success - API_TypeObjet_GET_Favoris');
            handlerSuccess(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });

}

function API_TypeObjet_GET(handlerSuccess) {

    $.ajax({
        url: '../../api/TypeObjet/GET',
        type: 'GET',
        success: function (data) {
            console.log('Success - API_TypeObjet_GET_Favoris');
            handlerSuccess(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });

}

function API_TypeObjet_GET_ColonneLibelle(handlerSuccess) {

    $.ajax({
        url: '../../api/TypeObjet/GET?ColonnesAffichees=Libelle',
        type: 'GET',
        success: function (data) {
            console.log('Success - API_TypeObjet_GET_ColonneLibelle');
            handlerSuccess(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });

}

function API_TypeObjet_PUT_Favoris(idTypeObjet, handlerSuccess) {

    $.ajax({
        url: '../api/TypeObjet/PUT/Favoris/' + idTypeObjet,
        type: 'PUT',
        contentType: "application/json",
        success: function (data) {
            console.log('Success - API_TypeObjet_PUT_Favoris');
            handlerSuccess(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });


}

function API_TypeObjet_PUT_NonFavoris(idTypeObjet, handlerSuccess) {

    $.ajax({
        url: '../api/TypeObjet/PUT/NonFavoris/' + idTypeObjet,
        type: 'PUT',
        contentType: "application/json",
        success: function (data) {
            console.log('Success - Api - API_TypeObjet_PUT_NonFavoris');
            handlerSuccess(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });


}

function API_Objet_POST(jsonObjet, handlerSuccess) {

    $.ajax({
        url: '../api/Objet',
        type: 'POST',
        data: JSON.stringify(jsonObjet),
        contentType: "application/json",
        success: function (data) {
            console.log('Success - API_Objet_POST');
            handlerSuccess(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });

}