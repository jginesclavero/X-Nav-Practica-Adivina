var typeGame;
var TYPE_GAME1 = "capitales";
var TYPE_GAME2 = "monumentos";
var TYPE_GAME3 = "radio3";
var TYPE_GAME4 = "radio4";
var difficult;
checkURL();

function checkURL(){
	var param = document.URL.split('#')[1];
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
    	location.hash = TYPE_GAME1;
    	typeGame = TYPE_GAME1;
    	//pedir el GEOJSON correspondiente
    	//history.pushState(null, "Adivina: Capitales", window.location.href);
    }else if($("#radio2").prop("checked")){
    	console.log(TYPE_GAME2);
    	location.hash = TYPE_GAME2;
    	typeGame = TYPE_GAME2;
    }else if($("#radio3").prop("checked")){
    	console.log(TYPE_GAME3);
    	location.hash = TYPE_GAME3;
    	typeGame = TYPE_GAME3;
    }else if($("#radio4").prop("checked")){
    	console.log(TYPE_GAME4);
    	location.hash = TYPE_GAME4;
    	typeGame = TYPE_GAME4;
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
}