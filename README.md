# Word Blanker

Certain [parts of speech](https://en.wikipedia.org/wiki/Part_of_speech) in english sentences can be made blank.
Check it out here, [Blanker](http://often-test-app:3000/).

## Motivation

I found just reading full scripts dull, then I thought making some words of sentences blank would be interesting
(maybe this kind of idea comes from this vocabulary book [英単語ピーナッツ](http://www.amazon.co.jp/%E8%8B%B1%E5%8D%98%E8%AA%9E%E3%83%94%E3%83%BC%E3%83%8A%E3%83%84%E3%81%BB%E3%81%A9%E3%81%8A%E3%81%84%E3%81%97%E3%81%84%E3%82%82%E3%81%AE%E3%81%AF%E3%81%AA%E3%81%84-%E9%87%91%E3%83%A1%E3%83%80%E3%83%AB%E3%82%B3%E3%83%BC%E3%82%B9-%E6%B8%85%E6%B0%B4-%E3%81%8B%E3%81%A4%E3%81%9E%E3%83%BC/dp/452325155X/ref=pd_sim_sbs_14_1?ie=UTF8&refRID=0VFYFNNS68CBGTJ3Q9FV) which is famous in Japan).
I would even say you could practice sentence construction skills guessing the blank words while reading it.

First, I implemented the program which made words in sentence blank randomly, then I found this awesome software [Stanford Log-linear Part-Of-Speech Tagger](http://nlp.stanford.edu/software/tagger.shtml), which enable the program to choose which word to be blank based on its part of speech.

## How it works

There are two ways to use this.
	
- just access [here](http://often-test-app:3000/) and try it.
- or, you can use it with a chrome extension which can be installed (but actually the chrome extension is not published, sorry).

[![Alt text for your video](http://img.youtube.com/vi/HiqNG8jhgA8/0.jpg)](https://youtu.be/HiqNG8jhgA8)

## How it is implemented

- Server side: Ruby on Rails
  - Ruby on Rails handles requests and communicates with [Stanford POS Tagger](http://nlp.stanford.edu/software/tagger.shtml), which is working as a server mode, upon requests.
  
- Client side: Chrome extension

## Futue functions or fixes

- can select POS to choose which word to be blank.
- what else...

## Credits

- [Stanford Log-linear Part-Of-Speech Tagger](http://nlp.stanford.edu/software/tagger.shtml)
