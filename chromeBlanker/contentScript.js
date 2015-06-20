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
	    var tag = this.tagName;
	    var index = $(tag).index(this);
	    console.log("tag: " + tag + ", index: " + parseInt(index));
	    console.log($(this).html());

	    listParentDoms($(this));
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
