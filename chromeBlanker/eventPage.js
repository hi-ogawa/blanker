chrome.runtime.onMessage.addListener(function(request, sender, callback) {

    if(request.type == "0"){
	console.log("----- type 0 ---------");
	var xhr = new XMLHttpRequest();
	var params = ["sentence=" + encodeURIComponent(request.sentence)]
	xhr.open("POST", request.url, true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
	    if (xhr.readyState == 4) {
		console.log("----------- POST worked ---------------");
		console.log(xhr.responseText);
		callback(xhr.responseText);
	    }
	}
	xhr.send(params.join("&"));
    }
    return true; // prevents the callback from being called too early on return
});
