import { Component, Host, h, State } from '@stencil/core';
import 'ionicons';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { searchMapStore, routerStore } from '../../../core/stores';
export class OnekeySdkSearch {
  constructor() {
    this.formData = {
      name: '',
      address: ''
    };
    this.searchResult = [];
    this.selectedAddress = {};
    this.provider = new OpenStreetMapProvider();
    this.onSearch = (e) => {
      e.preventDefault();
      searchMapStore.setState({
        search: Object.assign(Object.assign({}, this.formData), { selectedItem: this.selectedAddress })
      });
      routerStore.push('/search-result');
    };
    this.onChange = async (e) => {
      this.formData = Object.assign(Object.assign({}, this.formData), { [e.target.id]: e.target.value });
      if (e.target.id === 'address') {
        const results = await this.provider.search({ query: e.target.value });
        this.searchResult = [...results];
      }
    };
    this.onSelectAddress = (addr) => {
      this.selectedAddress = Object.assign({}, addr);
    };
  }
  render() {
    return (h(Host, null,
      h("div", { class: "main-block-full main-block--full" },
        h("div", { class: "search-hpc" },
          h("onekey-sdk-router-link", { url: "/", class: "btn-back" },
            h("ion-icon", { name: "arrow-back-outline", size: "large" })),
          h("form", { onSubmit: this.onSearch, class: "search-form" },
            h("div", null,
              h("input", { id: "name", placeholder: "Name, Speciality, Establishment...", onChange: this.onChange }),
              h("input", { value: this.selectedAddress.label, id: "address", placeholder: "Near me", onChange: this.onChange })),
            h("button", { class: "icon btn search-btn", type: "submit" },
              h("ion-icon", { name: "search-outline" }))))),
      h("div", { class: "main-contain" },
        h("ul", null, this.searchResult.map(elm => {
          var _a, _b;
          return (h("li", { class: `search-address-item ${((_b = (_a = this.selectedAddress) === null || _a === void 0 ? void 0 : _a.raw) === null || _b === void 0 ? void 0 : _b.place_id) === elm.raw.place_id ? 'active' : ''}`, onClick: () => this.onSelectAddress(elm) }, elm.label));
        })))));
  }
  static get is() { return "onekey-sdk-search"; }
  static get originalStyleUrls() { return {
    "$": ["onekey-sdk-search.scss"]
  }; }
  static get styleUrls() { return {
    "$": ["onekey-sdk-search.css"]
  }; }
  static get states() { return {
    "formData": {},
    "searchResult": {},
    "selectedAddress": {}
  }; }
}
