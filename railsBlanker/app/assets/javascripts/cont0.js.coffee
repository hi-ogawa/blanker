# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

bes = [ 'be'                # infinitive
        'am', 'are', 'is'   # present
        'was', 'ware'       # past
        'being', 'been'     # continuous, past particle
        "'m", "'re", "'s"   # abbreviation
      ]

makeBlankableDom = (xml) ->
        invisible = 'white'
        visible = 'black'
        $sp = $ "<span>"
        
        $(xml).find("wt").each ->
           pos =  $(this).find("pos").text()
           word = $(this).find("word").text()
           word =
                if      pos.match(/^\-LRB\-$/) then "("
                else if pos.match(/^\-LRB\-$/) then ")"
                else                                word
           # wrap all words by span with their POS tags
           $sp_word = $("<span>").attr("class", "blanker-#{pos}").text(word)     

           # add blankable class based on options
           if $('#POS').val().indexOf(pos) isnt -1
                console.log "you're gonna be blank - #{pos} - #{word}"
                $sp_word.addClass("blankable")

           # be verb is exceptional     
           if $("#be")[0].checked and pos.match(/^VB/) and bes.indexOf(word) isnt -1
                console.log "but you're exceptional be - #{word}"
                $sp_word.removeClass("blankable")
           
           $sp.append $sp_word, ' '

        $blankables = $sp.find(".blankable").css "color": invisible
        $blankables.css "border-bottom": "1px solid #{visible}"
                   .click ->
                        if $(this).css("color") is visible then $(this).css "color": invisible
                        else                                    $(this).css "color": visible
        b = false
        $("#unblank").click ->
                $blankables.css "color": (if b then invisible else visible)
                b = !b
        $sp

blank = ->
        txts = $("textarea").val().split("\n")
                                  .filter (x) -> x.trim() isnt ""
        $dom = $ ".texts"
        $dom.empty()
        $dom.css
                "position"   : "relative"
                "top"        : "10px"
                "border"     : "solid 1px black"
               	"height"     : "400px"
               	"width"      : "300px"
               	"overflow-y" : "scroll"
                "-webkit-overflow-scrolling": "touch"

        loopy = ->
                return if txts.length is 0
                txt = txts.shift()
                console.log "--- txt ---"
                console.log txt
                xhr = new XMLHttpRequest()
                param = "sentence=#{encodeURIComponent(txt)}"
                # xhr.open "POST", "http://often-test-app.xyz:3000/cont0/blank", true
                xhr.open "POST", "http://often-test-app2.xyz/cont0/blank", true
                xhr.setRequestHeader "Content-type", "application/x-www-form-urlencoded"
                xhr.onreadystatechange = ->
                    if xhr.readyState is 4
                        console.log "--- POST worked ---"
                        console.log xhr.responseText
                        xml = $.parseXML xhr.responseText
                        $dom.append makeBlankableDom(xml)
                        $dom.append "<br>"
                    loopy()    
                xhr.send param
                
        loopy()

set_default = ->
    $('#POS').val ['JJ', 'JJR', 'JJS', 'VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ']
    $('#be').prop 'checked', true

$ ->
        set_default()
        $("#default").click -> set_default()
        $("#blank").click -> blank()
