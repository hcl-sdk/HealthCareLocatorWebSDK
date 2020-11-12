import { Component, Host, h, Prop } from '@stencil/core';
import { Store } from '../../onekey-sdk-store/provider';
import { RouterStore } from '../onekey-sdk-router-store/provider';
export class OneKeySDKRoute {
  render() {
    var _a;
    if (this.activatedRoute !== this.path) {
      return null;
    }
    const styles = (_a = this.store.config) === null || _a === void 0 ? void 0 : _a.styles;
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
    },
    "activatedRoute": {
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
      "attribute": "activated-route",
      "reflect": false
    },
    "store": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "StoreProps",
        "resolved": "StoreProps",
        "references": {
          "StoreProps": {
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
RouterStore.injectProps(OneKeySDKRoute, ['activatedRoute']);
Store.injectProps(OneKeySDKRoute, ['store']);
