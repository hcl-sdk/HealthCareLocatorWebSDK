import { r as registerInstance, h, e as Host } from './index-b6524040.js';

const onekeySdkRouterCss = ":host{display:block}";

const OneKeySDKRouter = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("slot", null)));
  }
};
OneKeySDKRouter.style = onekeySdkRouterCss;

export { OneKeySDKRouter as onekey_sdk_router };
