//t = current time
//b = start value
//c = change in value
//d = duration
const easeInOutQuad = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};

function animateScrollTo(element, scrollDirection, to, duration) {
  var start = element[scrollDirection],
    change = to - start,
    currentTime = 0,
    increment = 20;

  var animateScroll = function () {
    currentTime += increment;
    var val = easeInOutQuad(currentTime, start, change, duration);
    element[scrollDirection] = val;
    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  };
  animateScroll();
}




export default animateScrollTo