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

function animateScrollTo({ element, scrollDirection, to, duration }) {

  const isVertical = scrollDirection === "scrollTop"
  let start = element[scrollDirection],
    change = isVertical ? to : to - start,
    currentTime = 0,
    increment = 20;

  const animateScroll = function () {
    currentTime += increment;
    var val = easeInOutQuad(currentTime, start, change, duration);
    element[scrollDirection] = val;
    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  };

  new Promise((resolve) => {
    if(isVertical) {
      start = 0
    }
    resolve(true)
  }).then(() => {
    setTimeout(() => {
      animateScroll();
    }, 200)
  })
  
}

export default animateScrollTo;
