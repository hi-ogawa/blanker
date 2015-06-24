// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

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
    $("#unblank").click(function(){
    	if(b){
    	    $par.find("span.blank").css("color", col_before);
    	}else{
    	    $par.find("span.blank").css("color", col_after);
    	}
    	b = !b;
    })

    $dom.append($par);
}


function blank(){
    var txts = $("textarea").val().split("\n")
                                  .filter(function(x){ return x.trim() != ""; });
    var $dom = $(".texts");
    $dom.empty();

    $dom.css({
	"position": "relative",
	"top": "10px",
	"border": "solid 1px black",
	"height": "400px",
	"width": "300px",
	"overflow-y": "auto"
    });
    
    function loop(){
	var txt = txts.shift();

	var xhr = new XMLHttpRequest();
	var params = ["sentence=" + encodeURIComponent(txt)]
	xhr.open("POST", "http://160.16.87.98:3000/cont0/blank", true);
	// xhr.open("POST", "http://localhost:3000/cont0/blank", true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
	    if (xhr.readyState == 4) {
		console.log("----------- POST worked ---------------");
		console.log(xhr.responseText);
		var xml = $.parseXML(xhr.responseText);
		makeBlankableDom($dom, xml);
		$dom.append("<br>");
		if(txts.length > 0){ loop(); }
	    }
	}
	xhr.send(params.join("&"));
    }
    loop();
}

