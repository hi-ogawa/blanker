save_options = ->
        pos = $("#POS").val()
        be  = $("#be")[0].checked
        chrome.storage.sync.set {pos_set: pos, be_set: be},
                -> $("#state").append 'saved!'

restore_options = ->
        chrome.storage.sync.get {pos_set: null, be_set: true}, (items) ->
                $("#POS").val items.pos_set
                $("#be").prop 'checked', items.be_set

set_default = ->
    $('#POS').val ['JJ', 'JJR', 'JJS', 'VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ']
    $('#be').prop 'checked', true
                                                        
$ ->
        restore_options();
        $("#save").click save_options
        $("#default").click set_default
