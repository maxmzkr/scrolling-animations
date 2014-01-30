fact = (n) ->
  if (n > 0)
    return n*fact(n-1)
  return 1

ease_func = (ps, t, start, end) ->
    mult = (end - start)
    offset = start
    value = ease_bezier(ps, t)
    value *= mult
    value += offset

ease_bezier = (ps, t) ->
  value = 0
  eq = ''
  for i in [0...ps.length] by 1
    value += 
      fact(ps.length - 1)/(fact(ps.length - 1 - i)*fact(i))*
      Math.pow(1 - t, ps.length - 1 - i)*
      Math.pow(t, i)*
      ps[i]
    eq = eq + (ps.length - 1) + '!/(' + (ps.length - 1 - i) + '!*' + i + '!)*' + '(1 - t)^' + (ps.length - 1 -i) + '*t^' + i + '*' + ps[i] + ' + '
  return value
  
  
