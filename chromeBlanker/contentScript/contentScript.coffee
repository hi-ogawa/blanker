## load chrome extension options
pos_set = null
be_set = true
bes = [ 'be'                # infinitive
        'am', 'are', 'is'   # present
        'was', 'ware'       # past
        'being', 'been'     # continuous, past particle
        "'m", "'re", "'s"   # abbreviation
      ]

chrome.storage.sync.get {pos_set: null,  be_set: true}, (items) ->
            pos_set = items.pos_set
            be_set  = items.be_set

# given:      <span> fuck off </span>
# you get:    <span>    <span class='blanker-VB blankable'> fuck </span>
#                       <span class='blanker-RP'> off </span>              </span>

blankableChild = (visible, invisible, $sp, xml) ->
        $sp.empty()
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
           if pos_set.indexOf(pos) isnt -1   # which means pos is a member of pos_set
                console.log "you're gonna be blank - #{pos} - #{word}"
                $sp_word.addClass("blankable")

           # be verb is exceptional     
           if be_set and pos.match(/^VB/) and bes.indexOf(word) isnt -1
                console.log "but you're exceptional be - #{word}"
                $sp_word.removeClass("blankable")
                
           $sp.append $sp_word, ' '

        $blankables = $sp.find(".blankable").css "color": invisible 
        $blankables.css "border-bottom": "1px solid #{visible}"
                   .click ->
                        if $(this).css("color") is visible then $(this).css "color": invisible
                        else                                    $(this).css "color": visible
                                        
        b = false
        $sp.click (e) ->
                e.stopPropagation();
                if e.altKey
                        $blankables.css "color": (if b then invisible else visible)
                        b = !b


#  given:      <parent>    ..sentence1..    <br>
#                          ..sentence2..           </parent>
#  you get:    <parent>   blankableChild(  <span> ..sentence1.. </span>  ) <br>
#                         blankableChild(  <span> ..sentence2.. </span>  ) <br>  </parent>

blankableParent = ($dom) ->
        txts = $dom.html().split('<br>')
                          # unwrap any tags in children, then wrap each child by <span>
                          .map( (x) -> $("<span>").text($("<p> #{x} </p>").text()) )
        $dom.empty()
        txts.forEach( ($sp) -> $dom.append($sp).append("<br>") )
        loopy = ->
                return if txts.length is 0
                $sp = txts.shift()
                chrome.runtime.sendMessage
                        url: "http://often-test-app.xyz:3000/cont0/blank"
                        type: "0"
                        sentence: $sp.text()
                        , (responseText) ->
                                xml = $.parseXML(responseText)
                                blankableChild(
                                        $dom.css("color"),
                                        $dom.css("background-color"),
                                        $sp,
                                        xml)
                                loopy()
        loopy()



## document ready

$ ->
        $(document).on 'click', '*', (e) ->
                if e.altKey
                        e.stopPropagation()
                        blankableParent $(this)

