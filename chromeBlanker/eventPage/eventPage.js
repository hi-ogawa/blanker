// Generated by CoffeeScript 1.9.3
(function() {
  chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    var param, xhr;
    if (request.type === "0") {
      console.log("--- type 0 ---");
      xhr = new XMLHttpRequest();
      param = "sentence=" + (encodeURIComponent(request.sentence));
      xhr.open("POST", request.url, true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          console.log("--- POST worked ---");
          console.log(xhr.responseText);
          return callback(xhr.responseText);
        }
      };
      xhr.send(param);
    }
    return true;
  });

}).call(this);
