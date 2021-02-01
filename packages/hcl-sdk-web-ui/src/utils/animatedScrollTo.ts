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

type ScrollDir = 'scrollLeft' | 'scrollTop';
type AnimateScrollTo = {
  element: any;
  scrollDirection: ScrollDir,
  to: number,
  duration: number
}

function animateScrollTo({ element, scrollDirection, to, duration }: AnimateScrollTo) {

  let scrollDirType = 'normal'; // ScrollDown (desktop) or ScrollRight (mobile)
  let fromPosition = element[scrollDirection];
  let change = to - fromPosition;
  let currentTime = 0;
  let increment = 20;
  
  if (fromPosition > to) {
    scrollDirType = 'opposite'; // isScrollUp or isScrollLeft
    change = change * (-1);
  }

  const animateScroll = function () {
    currentTime += increment;
    var val = easeInOutQuad(currentTime, fromPosition, change, duration);

    if (scrollDirType === 'normal') {
      element[scrollDirection] = val;
    } else {
      /**
       * Example: 
       * fromScrollValue = 600
       * toScrollValue = 100
       * changeValue = 500
       * easeInOutQuad(x, 600, 500, 10000) -> 610, 640, ... -> scrollOpposite to 590, 560, ...
       */
      element[scrollDirection] = fromPosition - (val - fromPosition); 
    }

    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  };

  new Promise((resolve) => {
    resolve(true)
  }).then(() => {
    setTimeout(() => {
      animateScroll();
    }, 200)
  })
  
}

export default animateScrollTo;
