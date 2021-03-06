// Generated by CoffeeScript 1.9.3
(function() {
  var be_set, bes, blankableChild, blankableParent, pos_set;

  pos_set = null;

  be_set = true;

  bes = ['be', 'am', 'are', 'is', 'was', 'ware', 'being', 'been', "'m", "'re", "'s"];

  chrome.storage.sync.get({
    pos_set: null,
    be_set: true
  }, function(items) {
    pos_set = items.pos_set;
    return be_set = items.be_set;
  });

  blankableChild = function(visible, invisible, $sp, xml) {
    var $blankables, b;
    $sp.empty();
    $(xml).find("wt").each(function() {
      var $sp_word, pos, word;
      pos = $(this).find("pos").text();
      word = $(this).find("word").text();
      word = pos.match(/^\-LRB\-$/) ? "(" : pos.match(/^\-LRB\-$/) ? ")" : word;
      $sp_word = $("<span>").attr("class", "blanker-" + pos).text(word);
      if (pos_set.indexOf(pos) !== -1) {
        console.log("you're gonna be blank - " + pos + " - " + word);
        $sp_word.addClass("blankable");
      }
      if (be_set && pos.match(/^VB/) && bes.indexOf(word) !== -1) {
        console.log("but you're exceptional be - " + word);
        $sp_word.removeClass("blankable");
      }
      return $sp.append($sp_word, ' ');
    });
    $blankables = $sp.find(".blankable").css({
      "color": invisible
    });
    $blankables.css({
      "border-bottom": "1px solid " + visible
    }).click(function() {
      if ($(this).css("color") === visible) {
        return $(this).css({
          "color": invisible
        });
      } else {
        return $(this).css({
          "color": visible
        });
      }
    });
    b = false;
    return $sp.click(function(e) {
      e.stopPropagation();
      if (e.altKey) {
        $blankables.css({
          "color": (b ? invisible : visible)
        });
        return b = !b;
      }
    });
  };

  blankableParent = function($dom) {
    var loopy, txts;
    txts = $dom.html().split('<br>').map(function(x) {
      return $("<span>").text($("<p> " + x + " </p>").text());
    });
    $dom.empty();
    txts.forEach(function($sp) {
      return $dom.append($sp).append("<br>");
    });
    loopy = function() {
      var $sp;
      if (txts.length === 0) {
        return;
      }
      $sp = txts.shift();
      return chrome.runtime.sendMessage({
        url: "http://often-test-app2.xyz/cont0/blank",
        type: "0",
        sentence: $sp.text()
      }, function(responseText) {
        var xml;
        xml = $.parseXML(responseText);
        blankableChild($dom.css("color"), $dom.css("background-color"), $sp, xml);
        return loopy();
      });
    };
    return loopy();
  };

  $(function() {
    return $(document).on('click', '*', function(e) {
      if (e.altKey) {
        e.stopPropagation();
        return blankableParent($(this));
      }
    });
  });

}).call(this);
