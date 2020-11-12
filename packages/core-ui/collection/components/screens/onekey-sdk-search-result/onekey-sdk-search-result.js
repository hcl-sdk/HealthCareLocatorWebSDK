import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { getHCPNearMe } from '../../../core/api/hcp';
import { Store } from '../../onekey-sdk-store/provider';
export class OnekeySdkSearchResult {
  constructor() {
    this.hcpNearMeLocations = [];
    this.onItemCardClick = () => {
    };
  }
  componentDidLoad() {
    getHCPNearMe(this.setStore);
    console.log(this.store);
  }
  watchHandler(newValue) {
    var _a;
    if ((_a = newValue.hcpNearMe) === null || _a === void 0 ? void 0 : _a.length) {
      this.hcpNearMeLocations = [...newValue.hcpNearMe];
    }
  }
  render() {
    return (h(Host, null,
      h("div", { class: "search-result", style: { height: this.store.config.appHeight } },
        h("div", { class: "search-header search-section" },
          h("div", null,
            h("onekey-sdk-router-link", { url: "/", class: "btn-back" },
              h("ion-icon", { name: "arrow-back-outline", size: "large" }))),
          h("div", null,
            h("strong", null, this.store.search.name),
            h("div", null, this.store.search.selectedItem.label))),
        h("div", { class: "search-toolbar search-section" },
          h("div", null,
            "Results: ",
            this.hcpNearMeLocations.length),
          h("div", null, "List View")),
        h("div", { class: "search-map search-section" },
          h("div", { class: "search-data" }, this.hcpNearMeLocations.map(elm => (h("onekey-sdk-doctor-item-swipe", Object.assign({}, elm, { onClick: this.onItemCardClick }))))),
          !!this.hcpNearMeLocations.length &&
            h("onekey-sdk-map", { class: "search-map__content", locations: this.hcpNearMeLocations, selectedLocationIdx: 0, defaultZoom: 5, mapTileLayer: this.store.config.mapTileLayer, mapLink: this.store.config.mapLink, markerIcon: this.store.config.markerIcon, markerIconCurrentLocation: this.store.config.markerIconCurrentLocation })))));
  }
  static get is() { return "onekey-sdk-search-result"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["onekey-sdk-search-result.scss"]
  }; }
  static get styleUrls() { return {
    "$": ["onekey-sdk-search-result.css"]
  }; }
  static get properties() { return {
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
    },
    "setStore": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "SetStore",
        "resolved": "(a: StoreProps) => void",
        "references": {
          "SetStore": {
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
  static get states() { return {
    "hcpNearMeLocations": {}
  }; }
  static get watchers() { return [{
      "propName": "store",
      "methodName": "watchHandler"
    }]; }
}
Store.injectProps(OnekeySdkSearchResult, ['store', 'setStore']);
