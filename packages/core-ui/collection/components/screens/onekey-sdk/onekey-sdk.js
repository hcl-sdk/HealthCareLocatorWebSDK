import { Component, Host, h, Prop } from '@stencil/core';
export class OneKeySDK {
  render() {
    return (h(Host, null,
      h("onekey-sdk-global-store", { store: { config: this.config } },
        h("onekey-sdk-router", null,
          h("onekey-sdk-route", { component: "onekey-sdk-home", path: "/" }),
          h("onekey-sdk-route", { component: "onekey-sdk-search-result", path: "/search-result" }),
          h("onekey-sdk-route", { component: "onekey-sdk-search", path: "/search" })))));
  }
  static get is() { return "onekey-sdk"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["onekey-sdk.scss"]
  }; }
  static get styleUrls() { return {
    "$": ["onekey-sdk.css"]
  }; }
  static get properties() { return {
    "config": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "OneKeySDKConfigData",
        "resolved": "OneKeySDKConfigData",
        "references": {
          "OneKeySDKConfigData": {
            "location": "import",
            "path": "../../onekey-sdk-store/provider"
          }
        }
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      }
    }
  }; }
}
