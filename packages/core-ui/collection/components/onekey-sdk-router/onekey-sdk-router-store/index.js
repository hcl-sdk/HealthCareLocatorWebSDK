import { h, State, Component, Prop } from '@stencil/core';
import { RouterStore } from './provider';
export class OneKeySDKRouterStore {
  constructor() {
    this.activatedRoute = '';
    this.renderer = () => null;
    this.setActivatedRoute = (route) => {
      this.activatedRoute = route;
    };
  }
  componentWillLoad() {
    this.setActivatedRoute("/");
  }
  render() {
    return (h(RouterStore.Provider, { state: {
        activatedRoute: this.activatedRoute,
        setActivatedRoute: this.setActivatedRoute
      } }, this.renderer()));
  }
  static get is() { return "onekey-sdk-router-store"; }
  static get properties() { return {
    "renderer": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "Function",
        "resolved": "Function",
        "references": {
          "Function": {
            "location": "global"
          }
        }
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "defaultValue": "() => null"
    }
  }; }
  static get states() { return {
    "activatedRoute": {}
  }; }
}
