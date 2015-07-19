# 1. find a good design from here: http://www.iconarchive.com/category/alphabet-icons.html
# 2. fix the 'file' variable here to fit the url what you want.
# 3. put the command 
#    $ ruby wget_icons.rb

base = 'http://icons.iconarchive.com/icons/iconicon/alpha-magnets/'
file = '/Letter-b-icon.png'
sizes = %W[16 48 128]

sizes.each do |size|
  `wget #{base + size + file} -O #{size}.png`
end
