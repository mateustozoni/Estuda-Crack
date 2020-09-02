function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

points_now = 0;
points_after = 0;

function setDefault() {
    let pointsPage = httpGet("https://app.estuda.com/usuarios_ranking_pontos/?box=sim");
    return points_now = parseInt($(pointsPage).find("tbody").find("td")[1].outerHTML.replace("<td>","").replace("</td>","").trim());
}

function getPoints() {
    var pointsPage = httpGet("https://app.estuda.com/usuarios_ranking_pontos/?box=sim");
    return points_after = parseInt($(pointsPage).find("tbody").find("td")[1].outerHTML.replace("<td>","").replace("</td>","").trim());
}

//https://app.estuda.com/apps/api/?acao=questoes_resposta&id=87859&resposta=2&tempo=8
function verifyQuestion(as, question) {
    setDefault();
    fetch(`https://app.estuda.com/apps/api/?acao=questoes_resposta&id=${question}&resposta=${as}&tempo=16`, {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "pragma": "no-cache",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrer": `https://app.estuda.com/questoes/?resolver=${getUrlParameter('resolver')}`,
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": `resposta_discursiva=&resolver=${getUrlParameter('resolver')}&prova=&q=&inicio=`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(res => {
        console.log(res)
        getPoints();
        if(points_after > points_now) return alert("Resposta "+(as+1));
        if(as >= 10) return alert("Não achei uma resposta");
        else verifyQuestion(as+1, question);
    });
    return;
}

function addButtons() {
    $(".panel").each(function() {
        var id = $(this).attr("id").replace("d_questao_","")
        $(this).append(`<button class='btn btn-block' onClick='verifyQuestion(0,${id})'>${id} Verificar</button>`)
    });
}

function initialize() {
    addButtons();
    v_bloquearsaida = "0";
}

initialize();