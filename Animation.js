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
Animation = function(values, page) {
  values = default_val(values, {});
  this.debug = default_val(values.debug, false);
  
  // this is used to create the default keyword values
  // apish crap here
  this.default_animation(values);
  this.default_x_origin(values);
  this.default_y_origin(values);


  this.selector = default_val(values.selector, ''); 
  this.startX = default_val(values.startX, 0);
  this.startY = default_val(values.startY, 0);
  this.endX = default_val(values.endX, 0);
  this.endY = default_val(values.endY, 0);
  this.startScroll = default_val(values.startScroll, 0);
  this.endScroll = default_val(values.endScroll, 0);
  this.type = default_val(values.type, 'linear');
  this.xCenter = default_val(values.xCenter, true);
  this.yCenter = default_val(values.yCenter, false);
  this.xOrigin = default_val(values.xOrigin, 0);
  this.yOrigin = default_val(values.yOrigin, 0);
  this.extremaLow = default_val(values.extremaLow, false);
  this.extremaHigh = default_val(values.extremaHigh, false);
  this.startRot = default_val(values.startRot, 0);
  this.endRot = default_val(values.endRot, 0);
  this.xEase = default_val(values.xEase, 'ease');
  this.yEase = default_val(values.yEase, 'ease');
  this.rotEase = default_val(values.rotEase, 'ease');
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
    values.endX = default_val(values.startX, 0);
    values.endY = default_val(values.endY,
      function() {
        return $(window).height() + self.get_y_origin();
      }
    );
    values.xEase = default_val(values.xEase, false);
  } else if (values.defaultAnimation == 'flyout top') {
    // flyout top animation
    var self = this;
    values.endX = default_val(values.startX, 0);
    values.endY = default_val(values.endY,
      function() {
        return -1*$(window).height() - self.get_y_origin();
      }
    );
    values.xEase = default_val(values.xEase, false);
  } else if (values.defaultAnimation == 'flyout left') {
    // flyout left animation
    var self = this;
    values.endY = default_val(values.startY, 0);
    values.endX = default_val(values.endX,
      function() {
        return -1*$(window).width() - self.get_x_origin();
      }
    );
    values.yEase = default_val(values.yEase, false);
  } else if (values.defaultAnimation == 'flyout right') {
    // flyout right animation
    var self = this;
    values.endY = default_val(values.startY, 0);
    values.endX = default_val(values.endX,
      function() {
        return $(window).width() + self.get_x_origin();
      }
    );
    values.yEase = default_val(values.yEase, false);
    // flyout top animation
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
      console.log($(self.selector).height());
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
  console.log(scroll);
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
  var rot = this.get_value(this.startRot, this.endRot, this.rotEase);
}

/**
 * used to get the y value for the animation
 * @param {object} animation the animation to get y value for
 */
Animation.prototype.get_value = function(startValue, endValue, ease) {
  var startScroll = this.startScroll;
  var endScroll = this.endScroll;
  var scroll = this.get_scroll();
  if (this.should_animate()) {
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
      // cubic function
      var p0 = 0;
      var p1 = 0;
      var p2 = 0;
      var p3 = 1;
      var mult = (endValue - startValue);
      var offset = startValue;
      p0 *= mult;
      p1 *= mult;
      p2 *= mult;
      p3 *= mult;
      value =
        (1 - t)*p0 +
        3*Math.pow(1 - t, 2)*t*p1 +
        3*(1 - t)*Math.pow(t, 2)*p2 +
        Math.pow(t, 3)*p3;
      value += offset;
    } else {
      // get initial x value
      value = startValue +
              (endValue - startValue)*t;
    }
    return value;
  }
};
