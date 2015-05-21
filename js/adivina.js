var typeGame;
var TYPE_GAME1 = "Capitales";
var TYPE_GAME2 = "Peliculas";
var TYPE_GAME3 = "Monumentos";
var TYPE_GAME4 = "Radio4";
var CONST_LAT = 113.300;
var CONST_LNG = 111.100;
var MAX_SCORE = 1000;
var MARGIN_KM = 25;
var yourScore = 0;
var difficult;
var presentIndex = 0;
var indexList = [];
var placeList = [];
var linkList = [];
var handlerList = [];
var numPhotos = 0;
var map = L.map('map',{
    center:[0,0],
    zoom:2,
    minzoom:2
});
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {  // http://{s}.tile.osm.org/{z}/{x}/{y}.png
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function onMapClick(e) {
    if(indexList.length <= 12){ 
        var marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
        //Limpiar otros marcadores
        handlerOff();
        scoreCalc(e.latlng);
        saveHistory();
        nextSet();
    }else{
        console.log("Juego terminado");
    }
}
map.on('click', onMapClick);

window.onpopstate = function(event) {
    //alert("Historia recuperada");
    indexList = event.IndexList;
    $("#score").html(event.Score);
    console.log("Historia recuperada");
};

checkURL();

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
}



function saveHistory(){
    alert("Historia guardada");
    var score = parseInt($("#score").html());
    var saveObjet = {Score: score, IndexList: indexList};
    history.pushState(saveObjet,null, "?"+typeGame);
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

function typeGame() {
    if($("#radio1").prop("checked")){
    	console.log(TYPE_GAME1);
    	typeGame = TYPE_GAME1;
        document.title = 'Adivina - ' + TYPE_GAME1;
    	//history.pushState(null,null, "?"+TYPE_GAME1);
    }else if($("#radio2").prop("checked")){
    	console.log(TYPE_GAME2);
    	typeGame = TYPE_GAME2;
        document.title = 'Adivina - ' + TYPE_GAME2;
        //history.pushState(null, null, "?"+TYPE_GAME2);
    }else if($("#radio3").prop("checked")){
    	console.log(TYPE_GAME3);
    	typeGame = TYPE_GAME3;
        document.title = 'Adivina - ' + TYPE_GAME3;
        //history.pushState(null, null, "?"+TYPE_GAME3);
    }else if($("#radio4").prop("checked")){
    	console.log(TYPE_GAME4);
    	typeGame = TYPE_GAME4;
         document.title = 'Adivina - ' + TYPE_GAME4;
        //history.pushState(null, null, "?"+TYPE_GAME4);
    }
    showDifficult();
}

function showTypeGame(){

	$('#configTitle').html("Seleccione el tipo de juego");
	$('label[for=radio1]').html(TYPE_GAME1);
	$('label[for=radio2]').html(TYPE_GAME2);
	$('label[for=radio3]').html(TYPE_GAME3);
	$('label[for=radio4]').html(TYPE_GAME4);

}

function showDifficult(){

    $("#confWindow").show();
	$('#configTitle').html("Seleccione la dificultad");
	$('label[for=radio1]').html('Facil');
	$('label[for=radio2]').html('Medio');
	$('label[for=radio3]').html('Dificil');
	$('label[for=radio4]').html('Extremo');
	$("#nextButton").hide();
	$('#startButtonDiv').css('visibility', 'visible');

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
        TIME_DIFFICULT = 4000;
    }else if($("#radio3").prop("checked")){
    	console.log("dificil");
    	difficult = 3;
        TIME_DIFFICULT = 3000;
    }else if($("#radio4").prop("checked")){
    	difficult = 4;
        TIME_DIFFICULT = 2000;
    	console.log("extremo");
    }

    getJson(typeGame);
}

function getJson(filename){
    var path = "/juegos/" + filename + ".json";
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