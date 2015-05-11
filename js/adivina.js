function configuration() {
    if($("#radio1").prop("checked")){
    	console.log("capitales");
    	location.hash = 'capitales';
    	
    }else if($("#radio2").prop("checked")){
    	console.log("monumentos");
    	location.hash = 'monumentos';
    }else if($("#radio3").prop("checked")){
    	console.log("radio3");
    	location.hash = 'radio3';
    }else if($("#radio4").prop("checked")){
    	console.log("radio4");
    	location.hash = 'radio4';
    }
}