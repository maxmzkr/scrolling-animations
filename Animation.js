/**
 * used to get the hex value of a number
 */
var hexDigits = new Array
        ("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"); 

//Function to convert hex format to a rgb color
function rgb2hex(rgb) {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  return parseInt("0x" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]));
}

function hex(x) {
  return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}

/**
 * used to determine if the variable is a function
 * @param {any} isFunction the thing to test
 */
is_function = function(isFunction) {
  var getType = {};
  return isFunction && getType.toString.call(isFunction) === '[object Function]';
}

/**
 * used to determine if the variable is a string
 * @param {object} obj the object to test
 */
var toString = Object.prototype.toString;

isString = function (obj) {
  return toString.call(obj) == '[object String]';
}

default_val = function(override, defaultVal) {
  return override === undefined ? defaultVal : override;
}

/**
 * animation object
 * @param {object} values default values
 * @param {object} page the page to run this animation on
 */
Animation = function(values, page, lastAnimation) {
  values = default_val(values, {});
  this.debug = default_val(values.debug, false);
  
  // this is used to create the default keyword values
  // api-ish crap here
  this.default_animation(values);
  this.default_x_origin(values);
  this.default_y_origin(values);

  if (lastAnimation) {
    // set default vals based on last animation
    // not the last animation should not continue past
    lastAnimation.extremaHigh = false;
    // default value is the end x of the last animation
    values.startX = default_val(
      values.startX, lastAnimation.endX);
    // default y values is the end y of the last animation
    values.startY = default_val(
      values.startY, lastAnimation.endY);
    // default start rotations is the end rot of the last animation
    values.startRot = default_val(
      values.startRot, lastAnimation.endRot);
    // default start scale is the end rot of the last animation
    values.startScale = default_val(
      values.startScale, lastAnimation.startScale);
    // default start color is the end rot of the last animation
    values.startColor = default_val(
      values.startColor, lastAnimation.endColor);
    // start scroll is the last animation
    values.startScroll = default_val(
      values.startScroll, lastAnimation.endScroll);
    // xOrigin is equal to the lasts
    values.xOrigin = default_val(
      values.xOrigin, lastAnimation.xOrigin);
    // yOrigin is equal to the lasts
    values.yOrigin = default_val(
      values.yOrigin, lastAnimation.yOrigin);
    // detect gaps. push a filler if there is one
  } else {
    values.extremaLow = default_val(values.extremaLow, true);
  }

  // selector to use animation on
  this.selector = default_val(values.selector, ''); 

  // startScroll, value in pixels to start the animation at
  // endScroll, value in pixels to end the animation at
  // extremaLow, keep first value even if before startScroll
  // extremaHigh, keep last value even if before endScroll
  this.startScroll = default_val(values.startScroll, 0);
  this.endScroll = default_val(values.endScroll, 0);
  this.extremaLow = default_val(values.extremaLow, false);
  this.extremaHigh = default_val(values.extremaHigh, false);

  this.type = default_val(values.type, 'linear');

  this.startX = default_val(values.startX, 0);
  this.endX = default_val(values.endX, this.startX);
  this.xEase = default_val(values.xEase, 'ease');
  this.xCenter = default_val(values.xCenter, true);

  this.startY = default_val(values.startY, 0);
  this.endY = default_val(values.endY, this.startY);
  this.yEase = default_val(values.yEase, 'ease');
  this.yCenter = default_val(values.yCenter, false);

  this.startRot = default_val(values.startRot, 0);
  this.endRot = default_val(values.endRot, this.startRot);
  this.rotEase = default_val(values.rotEase, false);

  this.startScale = default_val(values.startScale, 1);
  this.endScale = default_val(values.endScale, this.startScale);
  this.scaleEase = default_val(values.scaleEase, false);

  this.startColor = default_val(values.startColor, rgb2hex($(this.selector).css('color')));
  this.endColor = default_val(values.endColor, rgb2hex($(this.selector).css('color')));
  this.colorEase = default_val(values.colorEase, 'ease')

  this.startAlpha = default_val(values.startAlpha, 1);
  this.endAlpha = default_val(values.endAlpha, this.startAlpha);
  this.alphaEase = default_val(values.alphaEase, 'ease');
  
  this.xOrigin = default_val(values.xOrigin, 0);
  this.yOrigin = default_val(values.yOrigin, 0);

  this.label = default_val(values.label, '');
  
  this.page = page;
};

/**
 * used to create default animation
 * @param {object} values default values overrides default animations
 */
Animation.prototype.default_animation = function(values) {
  // default animations below!!!
  if (values.defaultAnimation == 'flyout bottom' ||
      values.defaultAnimation == 'flyout') {
    // fly out bottom animation
    // default for fly out
    var self = this;
    values.endX = default_val(values.endX, values.startX);
    values.endY = default_val(values.endY,
      function() {
        return $(window).height() + self.get_y_origin();
      }
    );
    values.xEase = default_val(values.xEase, true);
  } else if (values.defaultAnimation == 'flyout top') {
    // flyout top animation
    var self = this;
    values.endX = default_val(values.endX, values.startX);
    values.endY = default_val(values.endY,
      function() {
        return self.get_y_origin() - $(self.selector).height();
      }
    );
    values.xEase = default_val(values.xEase, true);
  } else if (values.defaultAnimation == 'flyout left') {
    // flyout left animation
    var self = this;
    values.endY = default_val(values.endY, values.startY);
    values.endX = default_val(values.endX,
      function() {
        return self.get_x_origin() - $(self.selector).width() - $(window).width()/2;
      }
    );
    values.yEase = default_val(values.yEase, true);
  } else if (values.defaultAnimation == 'flyout right') {
    // flyout right animation
    var self = this;
    values.endY = default_val(values.endY, values.startY);
    values.endX = default_val(values.endX,
      function() {
        return $(window).width() + self.get_x_origin();
      }
    );
    values.yEase = default_val(values.yEase, true);
  } if (values.defaultAnimation == 'flyin bottom' ||
      values.defaultAnimation == 'flyin') {
    // fly out bottom animation
    // default for fly out
    var self = this;
    values.endX = default_val(values.endX, values.startX);
    values.startY = default_val(values.startY,
      function() {
        return $(window).height() + self.get_y_origin();
      }
    );
    values.xEase = default_val(values.xEase, true);
  } else if (values.defaultAnimation == 'flyin top') {
    // flyin top animation
    var self = this;
    values.endX = default_val(values.endX, values.startX);
    values.startY = default_val(values.startY,
      function() {
        return self.get_y_origin() - $(self.selector).height();
      }
    );
    values.xEase = default_val(values.xEase, true);
  } else if (values.defaultAnimation == 'flyin left') {
    // flyin left animation
    var self = this;
    values.endY = default_val(values.endY, values.startY);
    values.startX = default_val(values.startX,
      function() {
        return self.get_x_origin() - $(self.selector).width() - $(window).width()/2;
      }
    );
    values.yEase = default_val(values.yEase, true);
  } else if (values.defaultAnimation == 'flyin right') {
    // flyin right animation
    var self = this;
    values.endY = default_val(values.endY, values.startY);
    values.startX = default_val(values.startX,
      function() {
        return $(window).width()/2 + self.get_x_origin();
      }
    );
    values.yEase = default_val(values.yEase, true);
  } else if (values.defaultAnimation == 'fade in') {
    // fade in animation
    var self = this;
    values.startAlpha = default_val(values.startAlpha, 0);
    values.endAlpha = default_val(values.endAlpha, 1);
    values.alphaEase = default_val(values.alphaEase, true);
  } else if (values.defaultAnimation == 'fade out') {
    // fade in animation
    var self = this;
    values.startAlpha = default_val(values.startAlpha, 1);
    values.endAlpha = default_val(values.endAlpha, 0);
    values.alphaEase = default_val(values.alphaEase, true);
  } else if (values.defaultAnimation == 'spinin clockwise') {
    // fade in animation
    var self = this;
    values.startRot = default_val(values.startRot, 0);
    values.endRot = default_val(values.endRot, 360*5);
    values.startScale = default_val(values.startScale, 0);
    values.endScale = default_val(values.endScale, 1);
  }
}

/**
 * used to create default x origin
 * @param {object} values default values overrides default x origin
 */
Animation.prototype.default_x_origin = function(values) {
  if (values.xOrigin == 'center') {
    var self = this;
    values.xOrigin = function() {
      return $(self.selector).width()/2;
    }
  }
  values.xOrigin = default_val(values.xOrigin, 0);};

/**
 * used to create default y origin
 * @param {object} values default values overrides default x origin
 */
Animation.prototype.default_y_origin = function(values) {
  if (values.yOrigin == 'center') {
    var self = this;
    values.yOrigin = function() {
      return $(self.selector).height()/2;
    }
  }
  values.yOrigin = default_val(values.yOrigin, 0);
};

/**
 * used to determine what the scroll should be
 */
Animation.prototype.get_scroll = function() {
  var scroll = $(window).scrollTop() - this.page.animationOffset;
  if (scroll > this.endScroll && this.extremaHigh == true) {
    scroll = this.endScroll;
  }
  if (scroll < this.startScroll && this.extremaLow == true) {
    scroll = this.startScroll;
  }
  return scroll;
}

/**
 * used to determine if the animation should animate
 */
Animation.prototype.should_animate = function() {
  var scroll = this.get_scroll();
  return scroll >= this.startScroll && scroll <= this.endScroll;
}

/**
 * used to get a value that could be a function
 * @param {object} value the possible function
 */
Animation.prototype.get_possible_function = function(value) {
  if (is_function(value)) {
    return value.call();
  } else {
    return value;
  }
};

/**
 * used to get x origin, usefull because x origin may be a function
 */
Animation.prototype.get_x_origin = function() {
  return this.get_possible_function(this.xOrigin)
};


/**
 * used to get y origin, usefull because y origin may be a function
 */
Animation.prototype.get_y_origin = function() {
  return this.get_possible_function(this.yOrigin)
};

/**
 * used to get the x value for the animation
 */
Animation.prototype.get_x = function() {
  var x = this.get_value(this.startX, this.endX, this.xEase);

  // center if need be
  if (this.xCenter == true) {
    x += $(window).width()/2;
  }

  x -= this.get_x_origin();

  return x;
};

/**
 * used to get the y value for the animation
 */
Animation.prototype.get_y = function() {
  var y = this.get_value(this.startY, this.endY, this.yEase);

  // center if need be
  if (this.yCenter == true) {
    y += $(window).height()/2;
  }

  // add the origin
  y -= this.get_y_origin();

  return y;
};

/**
 * used to get the rotation value
 */
Animation.prototype.get_rot = function() {
  return this.get_value(this.startRot, this.endRot, this.rotEase);
}

/**
 * used to get the scale value
 */
Animation.prototype.get_scale = function() {
  return this.get_value(this.startScale, this.endScale, this.scaleEase);
}

/**
 * used to get the color
 */
Animation.prototype.get_color = function() {
  var startR = (this.startColor & 0xFF0000) >> 16;
  var endR = (this.endColor & 0xFF0000) >> 16;
  var startG = (this.startColor & 0x00FF00) >> 8;
  var endG = (this.endColor & 0x00FF00) >> 8;
  var startB = (this.startColor & 0x0000FF) >> 0;
  var endB = (this.endColor & 0x0000FF) >> 0;
  var r = this.get_value(startR, endR, this.colorEase);
  var g = this.get_value(startG, endG, this.colorEase);
  var b = this.get_value(startB, endB, this.colorEase);
  return (r << 16) + (g << 8) + b;
}

/**
 * used to get the alpha value
 */
Animation.prototype.get_alpha = function() {
  return this.get_value(this.startAlpha, this.endAlpha, this.alphaEase);
};

/**
 * used to get the y value for the animation
 * @param {object} animation the animation to get y value for
 */
Animation.prototype.get_value = function(startValue, endValue, ease) {
  var startScroll = this.startScroll;
  var endScroll = this.endScroll;
  var scroll = this.get_scroll();

  if (is_function(startValue)) {
    startValue = startValue.call();
  }
  if (is_function(endValue)) {
    endValue = endValue.call();
  }
  if (isString(startValue)) {
    if (startValue.match(/[0-9]*\.?[0-9]+%/)) {
      var percent = parseFloat(startValue);
      percent = percent/100;
      startValue = $(window).height()*percent;
    }
  }
  if (isString(endValue)) {
    if (endValue.match(/[0-9]*\.?[0-9]+%/)) {
      var percent = parseFloat(endValue);
      percent = percent/100;
      endValue = $(window).height()*percent;
    }
  }


  var t = (scroll - startScroll)/(endScroll - startScroll);
  var value;

  if (isString(ease) && ease == 'ease') {
    value = ease_func([0, 0.25, 0.25, 1], t, startValue, endValue);
  } else if (isString(ease) && ease == 'easeOut') {
    value = ease_func([0, 0.80, 0.90, 1], t, startValue, endValue);
  } else if (isString(ease) && ease == 'easeBounce') {
    value = ease_func([0, 0.3, 3.6, -2.6, 3.4, 0.1, 1], t, startValue, endValue);
  } else if (Object.prototype.toString.call(ease) === '[object Array]') {
    value = ease_func(ease, t, startValue, endValue);
  } else {
    // get initial x value
    value = startValue +
            (endValue - startValue)*t;
  }
  return value;
};
