// ui-dialog: The outer container of the dialog.
// ui-dialog-titlebar: The title bar containing the dialog's title and close button.
// ui-dialog-title: The container around the textual title of the dialog.
// ui-dialog-titlebar-close: The dialog's close button.
// ui-dialog-content: The container around the dialog's content. This is also the element the widget was instantiated with.

ui_dialog_css = {
    "list-style-type": "none",
    "font-size": "15px",
    "background-color": "black",
    "opacity": "0.8"
}

ui_dialog_titlebar_css = {
    "color": "rgb(255, 127, 61)",
    "font-size": "15px",
    "background-color": "rgb(20, 20, 20)",
    "padding": "0px"
}

ui_dialog_title_css = {
    "text-align": "center"
}

ui_dialog_titlebar_close_css = {
}

ui_dialog_content_css = {
    "color": "rgb(255, 127, 61)"
}

function dialog_css_apply(){
    $(".ui-dialog").css(ui_dialog_css);
    $(".ui-dialog-titlebar").css(ui_dialog_titlebar_css);
    $(".ui-dialog-title").css(ui_dialog_title_css);
    $(".ui-dialog-titlebar-close").css(ui_dialog_titlebar_close_css);
    $(".ui-dialog-content").css(ui_dialog_content_css);
    $(".ui-dialog-content ul").css({
	"list-style-type": "none",
	"list-style-position": "inside",
	"padding-left" : "0",
	"padding-top" : "0",
	"text-align": "left"
    });
    $(".ui-dialog-content li").mouseover(function (){
	$(this).css("border", "1px dotted rgb(255, 127, 61)");
    });
    $(".ui-dialog-content li").mouseout(function (){
	$(this).css("border", "none");
    });
}

var i = true;
var ws = [];
var s = "";
var ss = "";
var vocvoc = "";
var DELAY = 200, clicks = 0, timer = null;
$("body").on("mouseup", function(e){
    if(e.altKey || e.shiftKey){return; }
    clicks++;
    var w = window.getSelection().toString().trim();
    if(w == ""){return; }
    if(clicks === 1) {
        timer = setTimeout(function() {
    	    //// text selection handler ////
	    ws.push(w);
	    console.log("--- catched sentence ---");
	    s = window.getSelection().getRangeAt(0).startContainer.parentNode.textContent;
	    if(s.length > 300){ s = window.getSelection().getRangeAt(0).startContainer.textContent; }
	    console.log(s);
    	    //// text selection handler ////
            clicks = 0;
        }, DELAY);
    } else {
        clearTimeout(timer);
    	//// double click handler ////
	ws.push(w);
	console.log("--- catched sentence ---");
	s = window.getSelection().getRangeAt(0).startContainer.parentNode.textContent;
	if(s.length > 300){ s = window.getSelection().getRangeAt(0).startContainer.textContent; }
	console.log(s);
    	//// double click handler ////
        clicks = 0;
    }
}).on("dblclick", function(e){
    e.preventDefault();
});

function lookUpWord(){
    voc = ws.join(" ").trim();
    ws = [];
    if( voc == "" ){ return 0; }
    vocvoc = voc;
    ss = s;
    console.log("--- looking up this word ---");
    console.log(voc);
    var req_url = "http://www.dictionaryapi.com/api/v1/references/collegiate/xml/"
                   + encodeURIComponent(voc) + "?key=c4c815db-b3ae-4d2f-8e31-2e556ec300bd";
    // using message exchange to avoid https limitation
    chrome.runtime.sendMessage({
	url: req_url,
	type: "0",
	word: voc,
	sentence: s
    }, function(responseText) {
	console.log("--- we got response ---");
	console.log(responseText);
	if(responseText == "failure"){return 0;}

	var xml = $.parseXML(responseText);
	var dialog_n = "dialog" + i;
	var $div = $("<div>").attr({"id": dialog_n, "title": voc});
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
	$("div#" + dialog_n).dialog("destroy");
	$("div#" + dialog_n).remove();
	$("div#" + "dialog" + !i).dialog("destroy");
	$("div#" + "dialog" + !i).remove();
	$("body").append( $div.append( $ul ) );
	$("div#" + dialog_n).dialog({ 
	    close: function(event, ui){
		$("div#" + dialog_n).dialog("destroy");
		$("div#" + dialog_n).remove();
	    },
	    position: { my: "right top", at: "right bottom", of: window },
	    resizable: false,
	    // draggable: false,
	    height: ($(window).height() / 2.5)
	});
	dialog_css_apply();
	// if(!i){ 
	//     var t = parseInt($($("div#" + dialog_n).parent()[0]).css("top").substring(0,3))
        //             - ($(window).height() / 2.5);
	//     $($("div#" + dialog_n).parent()[0]).css("top", t + "px");
	// }
	i = !i;

	if($(".div-alc #alc").length != 0){
	    var l = "http://eow.alc.co.jp/search?q=" + voc;
	    $(".div-alc #alc").attr("src", l);
	    $(".div-alc #alc").load( function() {
		$( ".div-alc" ).scrollTop(350);
	    } );
	}
    });
}

function shootAndUpload(){
    chrome.runtime.sendMessage({
	type: "1",
	word: vocvoc,
	sentence: ss
    }, function(responseText) {
	if(responseText == "you got it uploaded")
	{ title = "upload completed" }
	else
	{ title = "!! uploading error !!" }
	var $d = $("<div>").attr("id", "completion")
	                   .attr("title", title );
	$("body").append($d);
	$("#completion").dialog({
	    dialogClass: "no-close",
	    // position: { my: "center top", at: "center top", of: window },
	    position: { my: "right center", at: "right center", of: window },
	    hide: {
		effect: "blind",
		duration: 1500
	    },
	    close: function(event, ui){
		$("#completion").dialog("destroy");
		$("#completion").remove();
	    },
	    height: 0
	});
	$("#completion").dialog( "close" );
    });
}

$(window).keydown(function (e) {
    if(e.altKey && e.shiftKey && e.which == 83){
	shootAndUpload();
	return;
    }
    if(e.altKey && e.which == 83)
	lookUpWord();
});
