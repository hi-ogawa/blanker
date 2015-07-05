require 'nokogiri'
require 'socket'

class Cont0Controller < ApplicationController
  skip_before_filter  :verify_authenticity_token

  def index
  end

  def blank
    logger.debug "-- replaced params[:sentence] --"
    logger.debug(str = params[:sentence].tr("\n"," ")) # replace '\n' with ' '

    logger.debug "-- tagged params[:sentence] --"
    logger.debug(tagged_str = call_tagger(str))

    logger.debug "-- render xml --"
    logger.debug(xml_str = split_tag(tagged_str))
    render :text => xml_str
  end

  def call_tagger(input_str)
    # you have to run the pos tagger server like this
    # prompt> cd blanker/stanford-postagger-2011-04-20
    # prompt> java -mx300m -cp stanford-postagger.jar edu.stanford.nlp.tagger.maxent.MaxentTaggerServer -model models/left3words-wsj-0-18.tagger -port 3010

    ## the behaviour of POS-tagger (from input_str => output_str)
    # /(\ |\n)*/   ->  nil                    (any white spaces turn into nil)
    # 'suck it.'  -> "suck_VB it_PRP ._. "    (there is a white space at the tail)
    # '    suck    it  .   '  ->  "suck_VB it_PRP ._. "
    # 'suck it. \n suckiest sucker.'  ->  "suck_VB it_PRP ._. " (reads only one line)
    return "" if input_str =~ /^(\ |\n|\r)*$/
    s = TCPSocket.open('localhost', 3010)
    s.puts(input_str)
    output_str = s.gets
    s.close
    return output_str.strip # remove the trailing space
  end

  def split_tag(tagged_str)
    builder = Nokogiri::XML::Builder.new do |xml|
      xml.root {
        tagged_str.split(" ").each do |wt|
          m = wt.match(/^(.*)\_([^\_]*)$/)
          if m && m.length == 3
            xml.wt {
              xml.word m[1]
              xml.pos  m[2]
            }
          else
            logger.debug "split_tag -- wierd input"
          end
        end
      }
    end
    return builder.to_xml
  end

end
