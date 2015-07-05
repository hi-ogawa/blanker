require 'nokogiri'
require 'open-uri'
require 'yaml'

page = Nokogiri::HTML(open('http://www.ling.upenn.edu/courses/Fall_2003/ling001/penn_treebank_pos.html'))

cols = page.css('table tr')
cols.shift

arr = cols.map do |col|
  tds = col.css('td')
  [tds[1].text.strip, tds[2].text.strip, ['ex1', 'ex2']]
end

File.open('tags.yaml', 'w') do |f|
  f.write(YAML.dump(arr))
end

# arr = YAML.load(File.open('tags-with-example.yaml').read)

