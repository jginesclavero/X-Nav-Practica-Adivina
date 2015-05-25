var typeGame;
var TYPE_GAME1 = "Capitales";
var TYPE_GAME2 = "Peliculas";
var TYPE_GAME3 = "España";
var CONST_LAT = 113.300;
var CONST_LNG = 111.100;
var MAX_SCORE = 1000;
var MARGIN_KM = 25;
var yourScore = 0;
var difficult;
var numGame = 0;
var presentIndex = 0;
var indexList = [];
var placeList = [];
var linkList = [];
var handlerList = [];
var numPhotos = 0;
var marker;
var haveJson = false;
var finishGame = false;
var map = L.map('map',{
    center:[0,0],
    zoom:2,
    minzoom:2
});
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {  // http://{s}.tile.osm.org/{z}/{x}/{y}.png
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function onMapClick(e) {
    if (marker != null){
           map.removeLayer(marker);
    }
    marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
    handlerOff();
    scoreCalc(e.latlng);
    if(indexList.length == 5){ // PONERLO A 12 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        var score = $("#score").html();
        alert("Juego completado. Tu puntuación es de " + score + " puntos");
        finishGame = true;
        //saveHistory();
    }else{
        nextSet();
    }
}
map.on('click', onMapClick);
checkURL();

function checkScreen(){
    if($(window).width()<600){
        $("#generalButtonDiv").css("margin-top", "43%")
    }
}

window.onpopstate = function(event) {
    difficult = event.state.Difficult;
    typeGame = event.state.TypeGame;
    indexList = event.state.IndexList;
    numGame = event.state.NumGame;
    handlerOff();
    placeList = [];
    finishGame = false;
    $("#score").html(event.state.Score);
    getJson(typeGame);
};



function handlerOff(){
    for(var i=0;i<handlerList.length;i+=1){
        clearTimeout(handlerList[i]);
    }
    handlerList = [];
}


function scoreCalc(latlngClick){
    var latlngPhoto = placeList[presentIndex].geometry.coordinates;
    var distance = latlngClick.distanceTo(latlngPhoto)/1000;
    if(distance <= MARGIN_KM){
        yourScore = MAX_SCORE / numPhotos;
    }else{
        yourScore = (1 - ((distance - MARGIN_KM) / distance)) * MAX_SCORE / numPhotos ;
    }
    var score = parseInt($("#score").html());
    $("#score").html(Math.trunc(score + yourScore));
    yourScore = 0;
    alert("Solución: " + placeList[presentIndex].properties.Name);
}



function saveHistory(){
    var score = parseInt($("#score").html());
    numGame++;
    var saveObject = {"Difficult": difficult, "TypeGame": typeGame, "IndexList": indexList,"Score":score, "NumGame": numGame};
    var score = $("#score").html();
    history.pushState(saveObject,null, "?"+typeGame + "?score=" + score);
    $("#historyListDiv").append("<a href=javascript:historyCallback(" + numGame + ")>Adivina - " + typeGame + " " 
        + " Punt: "+ score + "Lvl: " + indexList.length +  "<br>");
    indexList = [];
}

function historyCallback(gameTogo){
    alert("history callback");
    if((gameTogo - numGame) == 0 ){
        alert("No puedes ir a este juego");
    }else{
        alert("IndexList.length :" + indexList.length);

        if(!finishGame){ 
            saveHistory();
        }
        history.go(gameTogo - numGame);
    }
}


function checkURL(){
	var param = document.URL.split('?')[1];
	if(param != null){
        param = param.split('/')[0];
		typeGame = param;
		console.log(typeGame);
		showDifficult();
	}else{
		showTypeGame();
	}
}

function showTypeGame(){
    checkScreen();
    $("#radio4Div").hide();
    $('#startButtonDiv').hide();
    $("#confWindow").show();
    $("#nextButton").show();
    $("#score").html(0);
    handlerOff();
    $('#configTitle').html("Seleccione el tipo de juego");
    $('label[for=radio1]').html(TYPE_GAME1);
    $('label[for=radio2]').html(TYPE_GAME2);
    $('label[for=radio3]').html(TYPE_GAME3);
    $("#nextButtonDiv").attr('onclick', '').click(function() {
        if($("#radio1").prop("checked")){
            console.log(TYPE_GAME1);
            typeGame = TYPE_GAME1;
            document.title = 'Adivina - ' + TYPE_GAME1;
        }else if($("#radio2").prop("checked")){
            console.log(TYPE_GAME2);
            typeGame = TYPE_GAME2;
            document.title = 'Adivina - ' + TYPE_GAME2;
        }else if($("#radio3").prop("checked")){
            console.log(TYPE_GAME3);
            typeGame = TYPE_GAME3;
            document.title = 'Adivina - ' + TYPE_GAME3;
        }
        showDifficult();
    });

}

function typeGame() {
    if($("#radio1").prop("checked")){
    	console.log(TYPE_GAME1);
    	typeGame = TYPE_GAME1;
        document.title = 'Adivina - ' + TYPE_GAME1;
    }else if($("#radio2").prop("checked")){
    	console.log(TYPE_GAME2);
    	typeGame = TYPE_GAME2;
        document.title = 'Adivina - ' + TYPE_GAME2;
    }else if($("#radio3").prop("checked")){
    	console.log(TYPE_GAME3);
    	typeGame = TYPE_GAME3;
        document.title = 'Adivina - ' + TYPE_GAME3;
    }else if($("#radio4").prop("checked")){
    	console.log(TYPE_GAME4);
    	typeGame = TYPE_GAME4;
         document.title = 'Adivina - ' + TYPE_GAME4;
    }
    showDifficult();
}


function showDifficult(){
    $("#radio4Div").show();
    $("#confWindow").show();
	$('#configTitle').html("Seleccione la dificultad");
	$('label[for=radio1]').html('Facil');
	$('label[for=radio2]').html('Medio');
	$('label[for=radio3]').html('Dificil');
	$('label[for=radio4]').html('Extremo');
	$("#nextButton").hide();
	$('#startButtonDiv').show();
}

function selectDifficult(){
	$("#confWindow").hide();
	if($("#radio1").prop("checked")){
    	console.log("facil");
    	difficult = 1;
        TIME_DIFFICULT = 5000;
    }else if($("#radio2").prop("checked")){
    	console.log("medio");
    	difficult = 2;
        TIME_DIFFICULT = 3500;
    }else if($("#radio3").prop("checked")){
    	console.log("dificil");
    	difficult = 3;
        TIME_DIFFICULT = 2000;
    }else if($("#radio4").prop("checked")){
    	difficult = 4;
        TIME_DIFFICULT = 1000;
    	console.log("extremo");
    }
    if(!haveJson){
        getJson(typeGame);
        haveJson = true;
    }
}

function getJson(filename){
    var path = "/juegos/" + filename + ".json";
    placeList = [];
    $.getJSON(path, function(data) {
        $.each(data.features,function(posicion, place){
            placeList.push(place);
        });
        nextSet();
    });
}

function nextSet(){
     if(indexList.length <= 12){    // QUITAR SI QUITAMOS EL BOTON DE DEBUG
        presentIndex = randIndex(placeList.length);
        console.log(placeList[presentIndex].properties.Name);
        getPictures(placeList[presentIndex].properties.Name);
    }else{
        console.log("juego terminado");
    }
}

function randIndex(max){
    do{
        var index = Math.floor((Math.random() * max));
    }while($.inArray(index,indexList) != -1);
    indexList.push(index);
    return index;
}

function getPictures(tag){
    jQuery(document).ready(function() {
        linkList = [];
        numPhotos = 0;
        var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?tagmode=any&id=132464580@N05&format=json&jsoncallback=?";
        $.getJSON(flickerAPI, {
            tags: tag,
        }).done(function(data) {
            $.each(data.items, function(i, item) {
                linkList.push(item.media.m);
            });
            changePhoto();
        });
    });
}

function changePhoto(){
    var j=0;
    for(var i=0;i<linkList.length;i+=1){ 
        setHandler(i);
    }
}

function setHandler(photoindex){
    var handler = setTimeout(function(){ 
        var img = $("<img>").attr("src",linkList[photoindex]);
        $("#picturesDiv").html(img);
        numPhotos+=1;
    }, photoindex*TIME_DIFFICULT,linkList,photoindex); 

    handlerList.push(handler);
}


function newGame(){
    haveJson = false;
    finishGame = false;
    saveHistory();
    showTypeGame();
}