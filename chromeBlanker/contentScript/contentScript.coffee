## load chrome extension options
pos_set = null
be_set = true
bes = [ 'be'
        'am', 'are', 'is'
        'was', 'ware'
        'being', 'been' ]

chrome.storage.sync.get {pos_set: null,  be_set: true}, (items) ->
            pos_set = items.pos_set
            be_set  = items.be_set

# given:      <span> fuck off </span>
# you get:    <span>    <span class='blanker-VB blankable'> fuck </span>
#                       <span class='blanker-RP'> off </span>              </span>

blankableChild = (visible, invisible, $sp, xml) ->
        # wrap all words by span with their POS tags
        $ls = $(xml).find("wt").map ->
           pos =  $(this).find("pos").text()
           word = $(this).find("word").text()
           word =
                if      pos.match(/^\-LRB\-$/) then "("
                else if pos.match(/^\-LRB\-$/) then ")"
                else                                word
           $("<span>").attr("class", "blanker-#{pos}").text(word)
        $sp.empty()
        $ls.each -> $sp.append $(this), ' '

        # apply blank effect based on options
        pos_set.forEach (pos) ->
                $sp.find(".blanker-#{pos}").addClass("blankable")

        $sp.find(".blankable").css "border-bottom": "1px solid #{visible}"
                              .click ->
                                if $(this).css("color") is visible then $(this).css "color": invisible
                                else                                    $(this).css "color": visible
                                        
        b = false
        $sp.click (e) ->
                e.stopPropagation();
                if e.altKey
                        if b then $sp.find(".blankable").css "color": invisible
                        else      $sp.find(".blankable").css "color": visible
                        b = !b
        $sp.find(".blankable").css "color": invisible                        



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
                chrome.runtime.sendMessage({
                        url: "http://often-test-app.xyz:3000/cont0/chrome_blank"
                        type: "0"
                        sentence: $sp.text()
                        }, (responseText) ->
                                xml = $.parseXML(responseText)
                                blankableChild(
                                        $dom.css("color"),
                                        $dom.css("background-color"),
                                        $sp,
                                        xml)
                                loopy()
                )
        loopy()



## document ready

$ ->
        $(document).on 'click', '*', (e) ->
                if e.altKey
                        e.stopPropagation()
                        blankableParent $(this)

