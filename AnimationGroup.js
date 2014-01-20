/**
 * used to group animations better ex: first and last auto extrema
 * @param {object} values default values
 * @param {object} page the page the animation group will run on
 */
AnimationGroup = function(values, page) {
  this.selector = default_val(values.selector || '');
  this.animations = default_val(values.animations || []);
  this.page = page;
}

/**
 * used to add an animation to the group
 * @param {object} values default values for the new animation
 */
AnimationGroup.prototype.add_animation = function(values) {
  values = values || {};
  if (this.animations[this.animations.length - 1]) {
    this.animations[this.animations.length - 1].extremaHigh = false;
  values.startX = default_val(
    values.startX, this.animations[this.animations.length - 1].endX);
  values.startY = default_val(
    values.startY, this.animations[this.animations.length - 1].endY);
  values.startRot = default_val(
    values.startRot, this.animations[this.animations.length - 1].endRot);
  values.startScroll = default_val(
    values.startScroll, this.animations[this.animations.length - 1].endScroll);
  values.xOrigin = default_val(
    values.xOrigin, this.animations[this.animations.length - 1].xOrigin);
  values.yOrigin = default_val(
    values.yOrigin, this.animations[this.animations.length - 1].yOrigin);
  } else {
    values.extremaLow = default_val(values.extremaLow, true);
  }

  values.selector = default_val(values.selector, this.selector);
  values.extremaHigh = default_val(values.extremaHigh, true);

  var animation = new Animation(values, this.page);
  this.animations.push(animation);
};