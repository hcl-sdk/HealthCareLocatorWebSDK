import { Component, Host, h } from '@stencil/core';
import { getHCPNearMe } from '../../../core/api/hcp';
import { configStore, searchMapStore } from '../../../core/stores';
export class OnekeySdkSearchResult {
  constructor() {
    this.onItemCardClick = () => {
    };
  }
  componentWillLoad() {
    const data = getHCPNearMe();
    searchMapStore.setState({
      hcpNearMe: data
    });
  }
  render() {
    if (!searchMapStore.state.search) {
      return null;
    }
    const { hcpNearMe } = searchMapStore.state;
    return (h(Host, null,
      h("div", { class: "search-result", style: { height: configStore.state.appHeight } },
        h("div", { class: "search-header search-section" },
          h("div", null,
            h("onekey-sdk-router-link", { url: "/", class: "btn-back" },
              h("ion-icon", { name: "arrow-back-outline", size: "large" }))),
          h("div", null,
            h("strong", null, searchMapStore.state.search.name),
            h("div", null, searchMapStore.state.search.selectedItem.label))),
        h("div", { class: "search-toolbar search-section" },
          h("div", null,
            "Results: ",
            hcpNearMe.length),
          h("div", null, "List View")),
        h("div", { class: "search-map search-section" },
          h("div", { class: "search-data" }, hcpNearMe.map(elm => (h("onekey-sdk-doctor-card", Object.assign({}, elm, { onClick: this.onItemCardClick }))))),
          !!hcpNearMe.length &&
            h("onekey-sdk-map", { class: "search-map__content", locations: hcpNearMe, selectedLocationIdx: 0, defaultZoom: configStore.state.mapDefaultZoom, mapTileLayer: configStore.state.mapTileLayer, mapLink: configStore.state.mapLink, markerIcon: configStore.state.markerIcon, markerIconCurrentLocation: configStore.state.markerIconCurrentLocation })))));
  }
  static get is() { return "onekey-sdk-search-result"; }
  static get originalStyleUrls() { return {
    "$": ["onekey-sdk-search-result.scss"]
  }; }
  static get styleUrls() { return {
    "$": ["onekey-sdk-search-result.css"]
  }; }
}
