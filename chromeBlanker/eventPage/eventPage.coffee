chrome.runtime.onMessage.addListener (request, sender, callback) ->
                if request.type is "0"
                        console.log "--- type 0 ---"
                        xhr = new XMLHttpRequest()
                        param = "sentence=#{encodeURIComponent(request.sentence)}"
                        xhr.open "POST", request.url, true
                        xhr.setRequestHeader "Content-type", "application/x-www-form-urlencoded"
                        xhr.onreadystatechange = ->
                                if xhr.readyState is 4
                                        console.log "--- POST worked ---"
                                        console.log xhr.responseText
                                        callback xhr.responseText
                        xhr.send param
                true # prevents the callback from being called too early on return

