/animation.js
the compressed version of the following files.

/Animation.js
This controls each individual animation. This is where a single change is located. Can be combined with a single change for different values. For example, there can be a change in x, change in y, and a change in rot. However there can not be two changes in x and a change in y.

/AnimationGroup.js
This holds multiple animations for a single selector. This allows for adding animations to the end of another more easily.

/Page.js
This holds all the animation groups. This would be better called as window but I don't want to change it and it's already taken by the browser. This is were the animate functions can all be called. The best way to perform the animations is to have a scroll event and call the page that you've setup.

/Word.js
This is for calculating the positions of words. For example, if you wanted each letter of a word to be individually positioned center on the page. You could run word.center() and it will return an array of the x position of all the letters in the word.
