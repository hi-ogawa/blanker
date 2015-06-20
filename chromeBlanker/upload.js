function dirOpen(){
    chrome.fileSystem.chooseEntry({type: 'openDirectory'}, function(theEntry) {
	if (!theEntry) {
	    $(".content").text('No Directory selected.');
	    return;
	}
	// use local storage to retain access to this file
	chrome.storage.local.set({'chosenFile': chrome.fileSystem.retainEntry(theEntry)});
	if (theEntry.isDirectory){
	    $(".content").text("it's directory.");	    
	}else{
	    $(".content").text("it's not directory");
	}
	// loadDirEntry(theEntry);
    });
}

$(function(){
});
