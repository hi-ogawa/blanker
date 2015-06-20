function postRequest(s){
    chrome.runtime.sendMessage({
	url: "http://localhost:3000/cont0/blank",
	type: "0",
	sentence: s
    }, function(responseText) {
	console.log("--- post response ---");
	console.log(responseText);
    });
}

function listParentDoms($elem){
    console.log("---- list parent Doms ----");
    $elem.parents().slice(0,5).each(function(){
	console.log(this.tagName);
    });
}

$(function(){
    $(document).on('click', '*', function(e){
	e.stopPropagation();
	if(e.altKey){
	    console.log("---- clicked dom ----");
	    var tag = this.tagName;
	    var index = $(tag).index(this);
	    console.log("tag: " + tag + ", index: " + parseInt(index));
	    console.log("---- html() ----");
	    console.log($(this).html());
	    console.log("---- text() ----");
	    console.log($(this).text());

	    listParentDoms($(this));

	    postRequest($(this).text());
	}
    })
})

$(window).keydown(function (e) {
    // the list of key codes
    // http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes

    if(e.altKey && e.which == 66){
	listParentDoms();
	return;
    }    
    if(e.altKey && e.shiftKey && e.which == 66){
    	return;
    }
});
