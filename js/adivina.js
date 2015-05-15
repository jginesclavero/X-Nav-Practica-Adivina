var typeGame;
var TYPE_GAME1 = "Capitales";
var TYPE_GAME2 = "Monumentos";
var TYPE_GAME3 = "Radio3";
var TYPE_GAME4 = "Radio4";
var difficult;
var indexList = [];
var placeList = [];
checkURL();

var map = L.map('map',{
    center:[0,0],
    zoom:2,
    minzoom:2
});
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {  // http://{s}.tile.osm.org/{z}/{x}/{y}.png
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


function checkURL(){
	var param = document.URL.split('?')[1];
	if(param != null){
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
	$('label[for=radio1]').html('Capitales');
	$('label[for=radio2]').html('Monumentos');
	$('label[for=radio3]').html('Radio3');
	$('label[for=radio4]').html('Radio4');

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
    	//history.pushState(null, "Adivina: Capitales", window.location.href);
    }else if($("#radio2").prop("checked")){
    	console.log("medio");
    	difficult = 2;
    }else if($("#radio3").prop("checked")){
    	console.log("dificil");
    	difficult = 3;
    }else if($("#radio4").prop("checked")){
    	difficult = 4;
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
        startGame();
    });
}

function startGame(){
    console.log("COMENZAMOOS");
    for(var i=0;i<placeList.length;i+=1){
        var index = randIndex(placeList.length);
        console.log(placeList[index].properties.Name);
    }
    console.log("Juego terminado");
}

function randIndex(max){
    do{
        var index = Math.floor((Math.random() * max));
    }while($.inArray(index,indexList) != -1);
    indexList.push(index);
    return index;
}