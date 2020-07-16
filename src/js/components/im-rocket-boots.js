const $element = $('.mascot');
const imagePath = './dist/img/mascot';
const totalFrames = 6;
const animationDuration = 1000;
const timePerFrame = animationDuration / totalFrames;
let timeWhenLastUpdate;
let timeFromLastUpdate;
let frameNumber = 1;


function step(startTime) {
  if (!timeWhenLastUpdate) timeWhenLastUpdate = startTime;
  timeFromLastUpdate = startTime - timeWhenLastUpdate;
  
  if (timeFromLastUpdate > timePerFrame) {
    $element.attr('src', imagePath + `/mascot${frameNumber}.png`);
    timeWhenLastUpdate = startTime;
    
    if (frameNumber >= totalFrames) {
      frameNumber = 1;
    } else {
      frameNumber = frameNumber + 1;
    }        
  }
  
  requestAnimationFrame(step);
}

// create a set of hidden divs
// and set their background-image attribute to required images
// that will force browser to download the images
$(document).ready(() => {
  for (var i = 1; i < totalFrames + 1; i++) {
    $('body').append(`<div id="preload-image-${i}" style="background-image: url('${imagePath}/mascot${i}.png');"></div>`);
  }
});

// wait for images to be downloaded and start the animation
$(window).on('load', () => {
  requestAnimationFrame(step);
});