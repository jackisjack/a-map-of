function API_TypeObjet_GET_Favoris(handlerSuccess) {

    $.ajax({
        url: '/api/TypeObjet/GET/Favoris',
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
        url: '/api/TypeObjet/GET',
        type: 'GET',
        success: function (data) {
            console.log('Success - API_TypeObjet_GET');
            handlerSuccess(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });

}

function API_TypeObjet_GET_ColonneLibelle(handlerSuccess) {

    $.ajax({
        url: '/api/TypeObjet/GET?ColonnesAffichees=Libelle',
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
        url: '/api/TypeObjet/PUT/Favoris/' + idTypeObjet,
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
        url: '/api/TypeObjet/PUT/NonFavoris/' + idTypeObjet,
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

function API_TypeObjet_POST(JSONTypeObjet, handlerSuccess) {

    $.ajax({
        url: '/api/TypeObjet/POST',
        type: 'POST',
        data: JSON.stringify(JSONTypeObjet),
        contentType: "application/json",
        success: function (data) {
            console.log('Success - API_TypeObjet_POST');
            handlerSuccess(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });

}

function API_Objet_POST(jsonObjet, handlerSuccess) {

    $.ajax({
        url: '/api/Objet/POST',
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

function API_Objet_Autocomplete_GET(handlerSuccess) {

    $.ajax({
        url: '/api/Objet/Autocomplete/1/GET',
        type: 'GET',
        success: function (data) {
            console.log('Success - API_Objet_GET');
            handlerSuccess(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });

}

function API_Objet_ID_GET(IDTYPEOBJET, NOMOBJET, handlerSuccess) {

    $.ajax({
        url: '/api/Objet/ID/GET?IDTYPEOBJET=' + IDTYPEOBJET + '&NOMOBJET=' + NOMOBJET,
        type: 'GET',
        success: function (data) {
            console.log('Success - API_Objet_ID_GET');
            handlerSuccess(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });

}

function API_Vue_POST(jsonObjet, handlerSuccess) {

    $.ajax({
        url: '/api/Vue/POST',
        type: 'POST',
        data: JSON.stringify(jsonObjet),
        contentType: "application/json",
        success: function (data) {
            console.log('Success - API_Vue_POST');
            handlerSuccess(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });

}

function API_Vue_GET(NomVue, handlerSuccess) {

    // NomVue = null => Toutes les libellés des vues de l'utilisateurs sont renvoyés
    // Sinon un objet data.resultat contenant l'id de la vue (0 si inexistante)

    var url;
    if (NomVue !== null) {
        url = '/api/Vue/GET?NomVue=' + NomVue;
    } else {
        url = '/api/Vue/GET';
    }

    $.ajax({
        url: url, 
        type: 'GET',
        success: function (data) {
            console.log('Success - API_Vue_GET');
            handlerSuccess(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });

}

function API_Vue_Full_GET(IdVue, handlerSuccess) {

    $.ajax({
        url: '/api/Vue/Full/GET/' + IdVue,
        type: 'GET',
        success: function (data) {
            console.log('Success - API_Vue_Full_GET');
            handlerSuccess(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });

}

function API_Vue_DELETE(IdVue, handlerSuccess) {

    $.ajax({
        url: '/api/Vue/DELETE/' + IdVue,
        type: 'DELETE',
        success: function (data) {
            console.log('Success - API_Vue_DELETE');
            handlerSuccess(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });

}

function API_Tuto_GET(handlerSuccess){

    $.ajax({
        url: '/api/Tuto/GET',
        type: 'GET',
        success: function (data) {
            console.log('Success - API_Tuto_GET');
            handlerSuccess(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });

}

function API_Tuto_GET_Step(idTuto, handlerSuccess) {

    var that = this; // ça devrait potentiellement être partout...
    // this est l'objet global... sauf si on a spécifié autre chose
    // lors de son appel.

    $.ajax({
        url: '/api/Tuto/' + idTuto + '/GET/Step',
        type: 'GET',
        success: function (data) {
            console.log('Success - API_Tuto_GET_Step');
            handlerSuccess.apply(that,[data]); // ça aussi
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });

}

function API_Tuto_GET_Score(handlerSuccess) {

    var that = this; // ça devrait potentiellement être partout...
    // this est l'objet global... sauf si on a spécifié autre chose
    // lors de son appel.

    $.ajax({
        url: '/api/Tuto/GET/Score',
        type: 'GET',
        success: function (data) {
            console.log('Success - API_Tuto_GET_Score');
            handlerSuccess.apply(that, [data]); // ça aussi
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });

}

function API_Tuto_POST_Done(jsonObjet, handlerSuccess) {

    var that = this; // ça devrait potentiellement être partout...
    // this est l'objet global... sauf si on a spécifié autre chose
    // lors de son appel.

    $.ajax({
        url: '/api/Tuto/POST/Done',
        type: 'POST',
        data: JSON.stringify(jsonObjet),
        contentType: "application/json",
        success: function (data) {
            console.log('Success - API_Tuto_POST_Done');
            handlerSuccess(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });

}

function API_Tuto_GET_ToDo(handlerSuccess) {

    var that = this; // ça devrait potentiellement être partout...
    // this est l'objet global... sauf si on a spécifié autre chose
    // lors de son appel.

    $.ajax({
        url: '/api/Tuto/GET/ToDo',
        type: 'GET',
        success: function (data) {
            console.log('Success - API_Tuto_GET_Score');
            handlerSuccess.apply(that, [data]); // ça aussi
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });

}


