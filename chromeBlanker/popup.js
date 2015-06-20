$(function(){
    $("#word").Watermark("(Word)");
    $("#sentence").Watermark("(Sentence)");

    $("#search").click(function(){
	var voc = $("#word").val();
	var req_url = "http://www.dictionaryapi.com/api/v1/references/collegiate/xml/"
            + encodeURIComponent(voc) + "?key=c4c815db-b3ae-4d2f-8e31-2e556ec300bd";

	var xhr = new XMLHttpRequest();
	xhr.open("GET", req_url, true);
	xhr.onload = function() {
	    var xml = $.parseXML(xhr.responseText);
	    var $ul = $("<ul>");
	    if( $(xml).find("dt").size() != 0 ){
		// show the meanings
		$(xml).find("dt").each(function(){
		    $ul.append(
			$("<li>").text($(this).text()));
		});
	    }else{
		// show the suggestions
		$(xml).find("suggestion").each(function(){
		    $ul.append(
			$("<li>").text($(this).text()));
		});
	    }
	    $(".popup").append( $ul );
	};
	xhr.onerror = function() {
	    $(".popup").append( "maybe error.." );
	};
	xhr.send();
    });

    // shoot button click handle
    $("#shoot").click(function(){
	chrome.tabs.captureVisibleTab(function(dataurl) {
	    // chrome.tabs.create({url: dataurl});
	    var xhr = new XMLHttpRequest();
	    var req_url = "http://localhost:3001/posts/test";
	    var params = ["word=" + encodeURIComponent($("#word").val()),
			  "sentence=" + encodeURIComponent($("#sentence").val()),
			  "picture=" + encodeURIComponent(dataurl)];
	    xhr.open("POST", req_url, true);
	    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
		    $(".popup").append($("<p>").text("uploaded completed"));
		}
	    }
	    xhr.send(params.join("&"));
	});
    });

    $('#word').keypress(function(event) {
        if (event.keyCode == 13) {
	    $('#search').click();
	    return false;
        }
    });

    $('#sentence').keypress(function(event) {
        if (event.keyCode == 13) {
	    $('#shoot').click();
	    return false;
        }
    });
});
