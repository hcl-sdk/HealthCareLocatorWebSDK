'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-7beb5087.js');
const index$1 = require('./index-5625a1c6.js');

function getHCPNearMe() {
  const data = [
    {
      name: "Dr Hababou Danielle",
      gp: "General Practitioner",
      address: "13 Rue Tronchet, 75008 Paris",
      createdAt: "3 days go",
      lat: 45.257002,
      lng: 0.130000,
      distance: '56m'
    },
    {
      name: "Grégoire Chardin",
      gp: "General Practitioner",
      address: "75008, Paris",
      createdAt: "5 minutes ago",
      lat: 50.328398,
      lng: 1.644700,
      distance: '73m'
    },
    {
      name: "Marcel Trouvé",
      gp: "General Practitioner",
      address: "75008, Paris",
      createdAt: "5 minutes ago",
      lat: 48.869699,
      lng: 2.486300,
      distance: '153m'
    },
    {
      name: "Dr Adam Deslys",
      gp: "General Practitioner",
      address: "13 Rue Tronchet, 75008 Paris",
      createdAt: "3 days go",
      lat: 45.955002,
      lng: 0.166000,
      distance: '167m'
    },
    {
      name: "Dr Roméo Magnier",
      gp: "General Practitioner",
      address: "75008, Paris",
      createdAt: "5 minutes ago",
      lat: 50.836398,
      lng: 1.614700,
      distance: '183m'
    },
    {
      name: "Dr Marc Vandame",
      gp: "General Practitioner",
      address: "75008, Paris",
      createdAt: "5 minutes ago",
      lat: 48.266699,
      lng: 2.483700,
      distance: '192m'
    },
    {
      name: "Dr Lucas Chappelle",
      gp: "General Practitioner",
      address: "13 Rue Tronchet, 75008 Paris",
      createdAt: "3 days go",
      lat: 43.650002,
      lng: 0.160300,
      distance: '321m'
    },
    {
      name: "Frédéric Bescond",
      gp: "General Practitioner",
      address: "75008, Paris",
      createdAt: "5 minutes ago",
      lat: 44.726398,
      lng: 1.614500,
      distance: '424m'
    },
    {
      name: "Henry Lacan",
      gp: "General Practitioner",
      address: "75008, Paris",
      createdAt: "5 minutes ago",
      lat: 49.866699,
      lng: 2.482300,
      distance: '822m'
    }
  ];
  return data;
}

const onekeySdkSearchResultCss = ":host{display:block}:host .search-result{height:100%;display:-ms-flexbox;display:flex;-ms-flex:1;flex:1;-ms-flex-direction:column;flex-direction:column}:host .search-section{padding:1rem;border-bottom:1px solid #ddd;-ms-flex-align:center;align-items:center}:host .search-header{display:-ms-flexbox;display:flex}:host .search-toolbar{display:-ms-flexbox;display:flex;-ms-flex-pack:distribute;justify-content:space-around}:host .search-map{padding:0;height:calc(100% - 121px);position:relative}:host .search-map__content{height:100%}:host .search-map .search-data{position:absolute;width:100%;bottom:1rem;height:8rem;display:-ms-flexbox;display:flex;-ms-flex-direction:row;flex-direction:row;overflow-x:scroll;z-index:1000;overflow-y:hidden}";

const OnekeySdkSearchResult = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.onItemCardClick = () => {
    };
  }
  componentWillLoad() {
    const data = getHCPNearMe();
    index$1.searchMapStore.setState({
      hcpNearMe: data
    });
  }
  render() {
    if (!index$1.searchMapStore.state.search) {
      return null;
    }
    const { hcpNearMe } = index$1.searchMapStore.state;
    return (index.h(index.Host, null, index.h("div", { class: "search-result", style: { height: index$1.configStore.state.appHeight } }, index.h("div", { class: "search-header search-section" }, index.h("div", null, index.h("onekey-sdk-router-link", { url: "/", class: "btn-back" }, index.h("ion-icon", { name: "arrow-back-outline", size: "large" }))), index.h("div", null, index.h("strong", null, index$1.searchMapStore.state.search.name), index.h("div", null, index$1.searchMapStore.state.search.selectedItem.label))), index.h("div", { class: "search-toolbar search-section" }, index.h("div", null, "Results: ", hcpNearMe.length), index.h("div", null, "List View")), index.h("div", { class: "search-map search-section" }, index.h("div", { class: "search-data" }, hcpNearMe.map(elm => (index.h("onekey-sdk-doctor-card", Object.assign({}, elm, { onClick: this.onItemCardClick }))))), !!hcpNearMe.length &&
      index.h("onekey-sdk-map", { class: "search-map__content", locations: hcpNearMe, selectedLocationIdx: 0, defaultZoom: index$1.configStore.state.mapDefaultZoom, mapTileLayer: index$1.configStore.state.mapTileLayer, mapLink: index$1.configStore.state.mapLink, markerIcon: index$1.configStore.state.markerIcon, markerIconCurrentLocation: index$1.configStore.state.markerIconCurrentLocation })))));
  }
};
OnekeySdkSearchResult.style = onekeySdkSearchResultCss;

exports.onekey_sdk_search_result = OnekeySdkSearchResult;
