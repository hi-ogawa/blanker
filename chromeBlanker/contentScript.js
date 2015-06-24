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


	    chrome.runtime.sendMessage({
    		url: "http://localhost:3000/cont0/blank",
    		type: "0",
    		sentence: $(this).text()
	    }, function(responseText) {
    		console.log("--- post response ---");
    		// console.log(responseText);
		var xml = $.parseXML(responseText);

		var $dom = $($(tag)[index]);
		$dom.empty();
		$(xml).find("s").each(function(){
		    $(this).find("wt").each(function(){
			var pos = $(this).find("pos").text();
			var word = $(this).find("word").text();
			if( pos.match(/^JJ/) ){
			    $dom.append($("<span>").attr("class", "blank")
			     	                   .text(word));
			}else if(pos.match(/^VB/)){
			    $dom.append($("<span>").attr("class", "blank")
			     	                   .text(word));
			}else if(pos.match(/^\-LRB\-$/)){
			    $dom.append("(")
			}else if(pos.match(/^\-RRB\-$/)){
			    $dom.append(")")
			}else{
			    $dom.append(word);
			}
			$dom.append(" ");
		    });
		});

		var col_before = $dom.find("span.blank").css("color");
		var col_after = $dom.css("background-color");
		$dom.find("span.blank").css({"border-bottom": "1px solid",
					     "border-bottom-color": col_before,
					     "color": col_after});
		
		$dom.find("span.blank").click(function(){
		    if( $(this).css("color") == col_before ){
			$(this).css("color", col_after);		
		    }else{
			$(this).css("color", col_before);
		    }
		});

		var b = true;
		$dom.click(function(e){
		    e.stopPropagation();
		    if(e.altKey){
			if(b){
			    $dom.find("span.blank").css("color", col_before);
			}else{
			    $dom.find("span.blank").css("color", col_after);
			}
			b = !b;
		    }
		});
	    });
	}
    })
})

// $(window).keydown(function (e) {
//     // the list of key codes
//     // http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes

//     if(e.altKey && e.which == 66){
// 	listParentDoms();
// 	return;
//     }    
//     if(e.altKey && e.shiftKey && e.which == 66){
//     	return;
//     }
// });
