chrome.runtime.onMessage.addListener(function(request, sender, callback) {

    if(request.type == "0"){
	console.log("----- type 1 ---------");
	console.log("----- the searched word---------");
	console.log(request.word);
	console.log("----- the setence which includes the word ---------");
	console.log(request.sentence);
	var xhr = new XMLHttpRequest();
	xhr.open("GET", request.url, true);
	xhr.onload = function() {
	    callback(xhr.responseText);
	};
	xhr.onerror = function() {
	    callback("failure"); // to clean up the communication port.
	};
	xhr.send();
	return true; // prevents the callback from being called too early on return

    }else if(request.type == "1"){
	console.log("----- type 2 ---------");
	chrome.tabs.captureVisibleTab(function(dataurl) {
	    console.log("----- capture ---------");
	    console.log(dataurl);
	    var xhr = new XMLHttpRequest();
	    var req_url = "http://localhost:3001/posts/test";
	    var params = ["word=" + encodeURIComponent(request.word),
			  "sentence=" + encodeURIComponent(request.sentence),
			  "picture=" + encodeURIComponent(dataurl)];
	    xhr.open("POST", req_url, true);
	    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
		    console.log("----------- POST worked ---------------");
		    console.log(xhr.responseText);
		    callback(xhr.responseText);
		}
	    }
	    xhr.send(params.join("&"));
	});	
	return true;
    }else{
	return true;
    }
});
