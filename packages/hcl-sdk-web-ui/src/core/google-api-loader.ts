const CALLBACK_NAME = '__initCallbackGoogleMapApi';

let promise = null;

export function loadGoogleMapApi(options) {
  promise =
    promise ||
    new Promise(function (resolve, reject) {
      const timeoutId = setTimeout(function () {
        window[CALLBACK_NAME] = function () {};
        reject(new Error('Could not load the Google Maps API'));
      }, options.timeout || 10000);

      window[CALLBACK_NAME] = function () {
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }
        resolve(window.google.maps);
        delete window[CALLBACK_NAME];
      };

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${options.googleMapApiKey}&callback=${CALLBACK_NAME}`;
      document.getElementsByTagName('head')[0].appendChild(script);
    });
  return promise;
}
