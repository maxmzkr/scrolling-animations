#
# used to get the scale of the object
#
$.fn.scale = ->
  transform = $(this).css('transform') || 0
  console.log(transform)
  transform = transform.substring(
    transform.indexOf(
      'scale(')+6,
      transform.indexOf(
        ')',
        transform.indexOf('scale(')))
  transform = transform.substring(0, transform.indexOf(','))
  return transform
