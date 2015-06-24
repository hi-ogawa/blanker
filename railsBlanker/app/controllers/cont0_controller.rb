require 'nokogiri'
require 'socket'

class Cont0Controller < ApplicationController
  skip_before_filter  :verify_authenticity_token

  # def blank
  #   # logger.debug "------ debug: cont0#blank -----"
  #   # logger.debug params[:sentence]
    
  #   input = Tempfile.new('input')
  #   input << params[:sentence]
  #   input.close

  #   tagger_path = Pathname.new(Rails.root).parent + "stanford-postagger-2011-04-20"
  #   # logger.debug "------ running tagger -----"
  #   output = `java -cp #{tagger_path + "stanford-postagger.jar"} edu.stanford.nlp.tagger.maxent.MaxentTagger -model #{tagger_path + "models/left3words-wsj-0-18.tagger"} -textFile #{input.path}`
  #   input.unlink

  #   logger.debug "------ hopefully tagged sentence -----"
  #   logger.debug output

  #   render :text => split_tag(output)
  # end

  def blank
    logger.debug params[:sentence]
    input = params[:sentence].tr("\n"," ")
    
    output = call_tagger(input)

    logger.debug output
    render :text => split_tag(output)
  end

  private

  def call_tagger(input_str)
    # you have to run the pos tagger server like this
    # prompt> cd blanker/stanford-postagger-2011-04-20
    # prompt> java -mx300m -cp stanford-postagger.jar edu.stanford.nlp.tagger.maxent.MaxentTaggerServer -model models/left3words-wsj-0-18.tagger -port 3010
    s = TCPSocket.open('localhost', 3010)
    s.puts(input_str)
    output_str = s.gets
    s.close
    return output_str
  end

  def split_tag(output)

    # the list of POS labels
    # http://www.ling.upenn.edu/courses/Fall_2003/ling001/penn_treebank_pos.html
    builder = Nokogiri::XML::Builder.new do |xml|
      xml.root {
        output.split("\n").each do |s|
          xml.s {
            s.split(" ").each do |wt|
              m = wt.match(/^(.*)\_([^\_]*)$/)
              xml.wt {
                if m && m.length >= 3
                  xml.word m[1]
                  xml.pos  m[2]
                end
              }
            end
          }
        end
      }
    end

    return builder.to_xml
  end
end
