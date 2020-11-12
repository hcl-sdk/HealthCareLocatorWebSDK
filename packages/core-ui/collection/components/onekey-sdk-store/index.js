import { h } from '@stencil/core';
import { Component, Prop } from '@stencil/core';
import { Store } from './provider';
export class GlobalStore {
  constructor() {
    this.renderer = () => null;
    this.store = {};
    this.setStore = (data) => {
      this.store = Object.assign(Object.assign({}, this.store), data);
    };
  }
  render() {
    return (h(Store.Provider, { state: { store: this.store, setStore: this.setStore } }, this.renderer()));
  }
  static get is() { return "onekey-sdk-global-store"; }
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
            "path": "./provider"
          }
        }
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "defaultValue": "{}"
    }
  }; }
}
