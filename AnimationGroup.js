/**
 * used to group animations better ex: first and last auto extrema
 * @param {object} values default values
 * @param {object} page the page the animation group will run on
 */
AnimationGroup = function(values, page) {  
  this.selector = default_val(values.selector || '');
  var groupIndex = page.selector_exists(this.selector)
  if (groupIndex) {
    this.animations = page.animationGroups[groupIndex].animations;
    this.word = page.animationGroups[groupIndex].word;
    this.page = page;
  } else {
    this.animations = default_val(values.animations || []);
    this.word = new Word({selector: this.selector}, page);
    this.page = page;
  }
}

/**
 * used to add an animation to the group
 * @param {object} values default values for the new animation
 */
AnimationGroup.prototype.add_animation = function(values) {
  values = values || {};
  var lastAnimation = this.animations[this.animations.length - 1];
  if (lastAnimation) {
    if (lastAnimation.endScroll != values.startScroll) {
      this.add_animation({
        startScroll: lastAnimation.endScroll,
        endScroll: values.startScroll
      });
    }
  }

  values.selector = default_val(values.selector, this.selector);
  values.extremaHigh = default_val(values.extremaHigh, true);

  var animation = new Animation(values, this.page, lastAnimation);
  this.animations.push(animation);
};

AnimationGroup.prototype.remove_index = function(index) {
  this.animations.splice(index, 1);
};

AnimationGroup.prototype.remove_label = function(label) {
  for (var i = 0; i < this.animations.length; i++) {
    if (this.animations[i].label == label) {
      this.remove_index(i);
      i--;
    }
  }
};
