import { r as registerInstance, h, e as Host } from './index-b6524040.js';
import { r as routerStore, c as configStore } from './index-0fac55e3.js';

const onekeySdkRouteCss = ":host{display:block}";

const OneKeySDKRoute = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    if (routerStore.state.currentRoutePath !== this.path) {
      return null;
    }
    const styles = configStore.state.styles;
    return (h(Host, { style: styles }, h(this.component, null)));
  }
};
OneKeySDKRoute.style = onekeySdkRouteCss;

export { OneKeySDKRoute as onekey_sdk_route };
