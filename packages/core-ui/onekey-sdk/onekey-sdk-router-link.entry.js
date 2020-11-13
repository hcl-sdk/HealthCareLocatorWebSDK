import { r as registerInstance, h, j as getElement } from './index-b6524040.js';
import { r as routerStore } from './index-0fac55e3.js';

const OneKeySDKRouterLink = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.activeClass = 'link-active';
    this.custom = 'a';
  }
  handleClick(e) {
    e.preventDefault();
    return routerStore.push(this.url);
  }
  render() {
    const isMatch = routerStore.state.currentRoutePath === this.url;
    let anchorAttributes = {
      class: {
        [this.activeClass]: isMatch,
      },
      onClick: this.handleClick.bind(this)
    };
    if (this.anchorClass) {
      anchorAttributes.class[this.anchorClass] = true;
    }
    if (this.custom === 'a') {
      anchorAttributes = Object.assign(Object.assign({}, anchorAttributes), { href: this.url, title: this.anchorTitle, role: this.anchorRole, tabindex: this.anchorTabIndex, 'aria-haspopup': this.ariaHaspopup, id: this.anchorId, 'aria-posinset': this.ariaPosinset, 'aria-setsize': this.ariaSetsize, 'aria-label': this.ariaLabel });
    }
    return (h(this.custom, Object.assign({}, anchorAttributes), h("slot", null)));
  }
  get el() { return getElement(this); }
};

export { OneKeySDKRouterLink as onekey_sdk_router_link };
