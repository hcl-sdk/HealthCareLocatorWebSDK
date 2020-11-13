import { r as registerInstance, h, e as Host } from './index-b6524040.js';

const onekeySdkLoadingCss = ":host{background:#0000005e;position:absolute;top:0;left:0;height:100%;width:100%;z-index:9999;display:flex;justify-content:center;align-items:center}:host .loader,:host .loader:before,:host .loader:after{background:#ffffff;-webkit-animation:load1 1s infinite ease-in-out;animation:load1 1s infinite ease-in-out;width:1em;height:4em}:host .loader{color:#ffffff;text-indent:-9999em;margin:88px auto;position:relative;font-size:11px;-webkit-transform:translateZ(0);-ms-transform:translateZ(0);transform:translateZ(0);-webkit-animation-delay:-0.16s;animation-delay:-0.16s}:host .loader:before,:host .loader:after{position:absolute;top:0;content:\"\"}:host .loader:before{left:-1.5em;-webkit-animation-delay:-0.32s;animation-delay:-0.32s}:host .loader:after{left:1.5em}@-webkit-keyframes load1{0%,80%,100%{box-shadow:0 0;height:4em}40%{box-shadow:0 -2em;height:5em}}@keyframes load1{0%,80%,100%{box-shadow:0 0;height:4em}40%{box-shadow:0 -2em;height:5em}}";

const OnekeySdkLoading = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("div", { class: "loader" }, "Loading...")));
  }
};
OnekeySdkLoading.style = onekeySdkLoadingCss;

export { OnekeySdkLoading as onekey_sdk_loading };
