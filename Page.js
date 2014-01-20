/**
 * Page object
 * @param {object} values default values
 */
Page = function(values) {
  values = values || {};
  this.minWidth = values.minWidth || 500;
  this.maxWidth = values.maxWidth || 500;
  this.animations = values.animations || [];
  this.animationGroups = values.animationGroups || [];
  this.animationOffset = values.animationOffset || 100;
  this.maxScroll = values.maxScroll || 0;
};

/**
 * used to return the center of the page
 */
Page.prototype.page_center = function() {
  var width = $(window).width();
  if (width < this.minWidth) {
    width = this.minWidth;
  }
  return width/2;
}

/**
 * center object on page
 * @param {string} selector the value of the selector of the object
 * @param {number} offset the offset relative to put the center of the obj
 */
Page.prototype.center = function(selector, offset) {
  offset = offset || 0;
  var page = this;
  $(selector).each(
    function() {
      var width = $(this).width();
      var pageWidth = $(window).width();
      if ($(window).width() < page.minWidth) {
        pageWidth = page.minWidth;
      }
      var position = pageWidth/2 + offset;
      position = position - width/2;
      $(this).css({'left': position});
    }
  );
};

/**
 * used to center a word
 * @param {string} selector selctor to center
 */
Page.prototype.center_word = function(selector) {
  var wordWidth = 0;
  var cumWidth = [];
  var page = this;
  $(selector).each(
    function() {
      cumWidth.push(wordWidth);
      wordWidth += $(this).width();
    }
  );
  var i = 0;
  $(selector).each(
    function() {
      var width = $(this).width();
      var pageWidth = $(window).width();
      if ($(window).width() < page.minWidth) {
        pageWidth = page.minWidth;
      }
      var position = -1*wordWidth/2 + cumWidth[i] + pageWidth/2;
      $(this).css({'left': position});
      i++;
    }
  );
};

/**
 * used to add an animation
 * @param {object} values default value for animation
 */
Page.prototype.add_animation = function(values) {
  var animation = new Animation(values, this);
  this.animations.push(animation);
};

/**
 * used to add an animation group
 * @param {object} values default values for animation
 */
Page.prototype.add_animation_group = function(values) {
  var animationGroup = new AnimationGroup(values, this);
  this.animationGroups.push(animationGroup);
  console.log('added');
}

/**
 * used to animation the animations
 */
Page.prototype.animate = function() {
  this.maxScroll = 0;
  // find the max scroll
  for (var i = 0; i < this.animations.length; i++) {
    var animation = this.animations[i];
    page.max_scroll(animation.endScroll);
  }

  for (var i = 0; i < this.animationGroups.length; i++) {
    var animationGroup = this.animationGroups[i];
    for (var j = 0; j < animationGroup.animations.length; j++) {
      var animation = animationGroup.animations[j];
      this.max_scroll(animation.endScroll);
    }
  }

  $('.page-contents').height(this.maxScroll + $(window).height() + this.animationOffset);

  // Go through each animation
  for (var i = 0; i < this.animations.length; i++) {
    // get all the values into shorter variables
    var animation = this.animations[i];
    this.animate_animation(animation);
  }

  for (var i = 0; i < this.animationGroups.length; i++) {
    var animationGroup = this.animationGroups[i];
    for (var j = 0; j < animationGroup.animations.length; j++) {
      var animation = animationGroup.animations[j];
      this.animate_animation(animation);
    }
  }
};


/**
 * used to animation an animation
 * @param {object} animation the animation to animate
 */
Page.prototype.animate_animation = function(animation) {
  // get all the values into shorter variables
  var selector = animation.selector;
  var startX = animation.startX;
  var endX = animation.endX;
  var startY = animation.startY;
  var endY = animation.endY;
  var startRot = animation.startRot;
  var endRot = animation.endRot;

  // calculate the x and y
  var left = animation.get_x();
  var top = animation.get_y();
  var rot = animation.get_value(startRot, endRot, this.rotEase);

  $(selector).css(
    {'left': left,
     'top': top,
     'transform': 'rotate(' + rot + 'deg)',
     '-ms-transform': 'rotate(' + rot + 'deg)',
     '-webkit-transform': 'rotate(' + rot + 'deg)'}
  );
}

Page.prototype.max_scroll = function(scroll) {
  if (scroll > this.maxScroll) {
    this.maxScroll = scroll;
  }
};
