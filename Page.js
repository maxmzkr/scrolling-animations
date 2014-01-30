/**
 * Page object
 * @param {object} values default values
 */
Page = function(values) {
  values = values || {};
  this.minWidth = values.minWidth || 800;
  this.maxWidth = values.maxWidth || 800;
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
 * used to add an animation
 * @param {object} values default value for animation
 */
Page.prototype.add_animation = function(values) {
  var animation = new Animation(values, this);
  this.animations.push(animation);
  this.max_scroll();
};

/**
 * used to see if the selector exists already
 * @param {string} selector the selector being added
 */
Page.prototype.selector_exists = function(selector) {
  for (var i = 0; i < this.animationGroups.length; i++) {
    if (this.animationGroups[i].selector == selector) {
      return i;
    }
  };
  return false;
};

/**
 * used to add an animation group
 * @param {object} values default values for animation
 */
Page.prototype.add_animation_group = function(values) {
  var animationGroup = new AnimationGroup(values, this);
  this.animationGroups.push(animationGroup);
  this.max_scroll();
}

/**
 * used to animation the animations
 */
Page.prototype.animate = function() {
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
  if (animation.should_animate()) {
    // get all the values into shorter variables
    var selector = animation.selector;

    // calculate the x and y
    var left = animation.get_x();
    var top = animation.get_y();
    var rot = animation.get_rot();
    var alpha = animation.get_alpha();
    var color = animation.get_color();
    var scale = animation.get_scale();
    if (color) {
      color = Math.round(color);
      color = color.toString(16);
    }

    $(selector).css(
      {'left': left,
       'top': top,
       'transform': 'rotate(' + rot + 'deg)' +
          'scale(' + scale + ',' + scale + ')',
       '-ms-transform': 'rotate(' + rot + 'deg)' +
          'scale(' + scale + ',' + scale + ')',
       '-webkit-transform': 'rotate(' + rot + 'deg)' +
          'scale(' + scale + ',' + scale + ')',
       'opacity': alpha,
       'filter': 'opacity(alpha=' + alpha*100 + ')',
       'color': '#' + color}
    );
  }
}

Page.prototype.max_scroll = function(scroll) {
  this.maxScroll = 0;
  // find the max scroll
  for (var i = 0; i < this.animations.length; i++) {
    var animation = this.animations[i];
    var scroll = animation.endScroll;
    page.max_scroll(animation.endScroll);
  }

  for (var i = 0; i < this.animationGroups.length; i++) {
    var animationGroup = this.animationGroups[i];
    for (var j = 0; j < animationGroup.animations.length; j++) {
      var animation = animationGroup.animations[j];
      var scroll = animation.endScroll;
      if (scroll > this.maxScroll) {
        this.maxScroll = scroll;
      }
    }
  }

  $('.page-contents').height(this.maxScroll + $(window).height() + this.animationOffset);
};

Page.prototype.remove_label = function(label) {
  for (var i = 0; i < this.animationGroups.length; i++) {
    this.animationGroups[i].remove_label(label);
  }
};
