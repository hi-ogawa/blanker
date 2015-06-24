var i = 0;
function makeBlankableDom($dom, xml){
    i++;
    var col_before = $dom.css("color");
    var col_after = $dom.css("background-color");

    var class_name = "blank-paragraph" + i;
    var $par = $("<span>").attr("id", class_name);
    $(xml).find("s").each(function(){
	$(this).find("wt").each(function(){
	    var pos = $(this).find("pos").text();
	    var word = $(this).find("word").text();
	    if( pos.match(/^JJ/) ){
		$par.append($("<span>").attr("class", "blank")
			    .text(word));
	    }else if(pos.match(/^VB/)){
		$par.append($("<span>").attr("class", "blank")
			    .text(word));
	    }else if(pos.match(/^\-LRB\-$/)){
		$par.append("(")
	    }else if(pos.match(/^\-RRB\-$/)){
		$par.append(")")
	    }else{
		$par.append(word);
	    }
	    $par.append(" ");
	});
    });

    $par.find("span.blank").css({"border-bottom": "1px solid",
				 "border-bottom-color": col_before,
				 "color": col_after});

    $par.find("span.blank").click(function(){
	if( $(this).css("color") == col_before ){
	    $(this).css("color", col_after);
	}else{
	    $(this).css("color", col_before);
	}
    });

    var b = true;
    $par.click(function(e){
    	e.stopPropagation();
    	if(e.altKey){
    	    if(b){
    	    	$par.find("span.blank").css("color", col_before);
    	    }else{
    	    	$par.find("span.blank").css("color", col_after);
    	    }
    	    b = !b;
    	}
    });

    $dom.append($par);
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

	    // should any style of <br> (like <br />, <br/>) be covered ??
	    var txts = ($(this).html()).split("<br>")
                        .filter(function(x){ return x.trim() != ""; })
                        .map(function(x){ return $("<div>" + x + "</div>").text(); });

	    var $dom = $($(tag)[index]);
	    $dom.empty();
	    function loop(){
		var txt = txts.shift();
		chrome.runtime.sendMessage({
    		    url: "http://160.16.87.98:3000/cont0/blank",
    		    // url: "http://localhost:3000/cont0/blank",
    		    type: "0",
    		    sentence: txt
		}, function(responseText) {
    		    console.log("--- post response ---");
		    var xml = $.parseXML(responseText);

		    makeBlankableDom($dom, xml);
		    $dom.append("<br>");
		    
		    if(txts.length > 0){ loop(); }
		});
	    }
	    loop();

	    //// possibly not properly ordered
	    // txts.forEach(function(txt){
	    // 	chrome.runtime.sendMessage({
    	    // 	    url: "http://160.16.87.98:3000/cont0/blank",
    	    // 	    // url: "http://localhost:3000/cont0/blank",
    	    // 	    type: "0",
    	    // 	    sentence: txt
	    // 	}, function(responseText) {
    	    // 	    console.log("--- post response ---");
	    // 	    var xml = $.parseXML(responseText);

	    // 	    makeBlankableDom($dom, xml);
	    // 	    $dom.append("<br>");
	    // 	});
	    // });
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
