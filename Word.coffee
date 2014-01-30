#
# First coffe script, be patient!
# Used to postion words!
# @param {object} values the default values for the word
#   selector best if a class with ids in it
#
class Word
  constructor: (values) ->
    values = values ? {}
    @selector = values.selector ? ''
    @x = values.x ? 0
    @y = values.y ? 0
    @xOrigin = values.xOrigin ? 0
    @yOrigin = values.yOrigin ? 0

  ###*
   * Will return the x's of all the ids when centered
  ###
  center: () ->
    cumWidth = 0
    cumWidthLast = 0
    widths = for elem in $(@selector)
      cumWidthLast = cumWidth
      cumWidth += $(elem).width()
      cumWidthLast
    widths = (elem - cumWidth/2 for elem in widths)
    widths

  
