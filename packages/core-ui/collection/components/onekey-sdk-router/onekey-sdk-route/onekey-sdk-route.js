import { Component, Host, h, Prop } from '@stencil/core';
import { routerStore, configStore } from '../../../core/stores';
export class OneKeySDKRoute {
  render() {
    if (routerStore.state.currentRoutePath !== this.path) {
      return null;
    }
    const styles = configStore.state.styles;
    return (h(Host, { style: styles },
      h(this.component, null)));
  }
  static get is() { return "onekey-sdk-route"; }
  static get originalStyleUrls() { return {
    "$": ["onekey-sdk-route.css"]
  }; }
  static get styleUrls() { return {
    "$": ["onekey-sdk-route.css"]
  }; }
  static get properties() { return {
    "component": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "component",
      "reflect": true
    },
    "path": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "path",
      "reflect": true
    }
  }; }
}
