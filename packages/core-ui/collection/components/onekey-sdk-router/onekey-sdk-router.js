import { Component, Host, h } from '@stencil/core';
export class OneKeySDKRouter {
  render() {
    return (h(Host, null,
      h("onekey-sdk-router-store", null,
        h("slot", null))));
  }
  static get is() { return "onekey-sdk-router"; }
  static get originalStyleUrls() { return {
    "$": ["onekey-sdk-router.css"]
  }; }
  static get styleUrls() { return {
    "$": ["onekey-sdk-router.css"]
  }; }
}
