import { r as registerInstance, h, e as Host } from './index-b6524040.js';
import { s as searchMapStore, c as configStore } from './index-0fac55e3.js';

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
  searchMapStore.setState({ loading: true });
  setTimeout(() => {
    searchMapStore.setState({ hcpNearMe: data });
    searchMapStore.setState({ loading: false });
  }, 3000);
}

const onekeySdkSearchResultCss = ":host{display:block}:host .search-result{height:100%;display:flex;flex:1;flex-direction:column}:host .search-section{padding:1rem;border-bottom:1px solid #ddd;align-items:center}:host .search-header{display:flex}:host .search-toolbar{display:flex;justify-content:space-around}:host .search-map{padding:0;height:calc(100% - 121px);position:relative}:host .search-map__content{height:100%}:host .search-map .search-data{position:absolute;width:100%;bottom:1rem;height:8rem;display:flex;flex-direction:row;overflow-x:scroll;z-index:1000;overflow-y:hidden}";

const OnekeySdkSearchResult = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.onItemCardClick = () => {
    };
  }
  componentWillLoad() {
    getHCPNearMe();
  }
  render() {
    if (!searchMapStore.state.search) {
      return null;
    }
    const { hcpNearMe } = searchMapStore.state;
    return (h(Host, null, searchMapStore.state.loading && h("onekey-sdk-loading", null), h("div", { class: "search-result", style: { height: configStore.state.appHeight } }, h("div", { class: "search-header search-section" }, h("div", null, h("onekey-sdk-router-link", { url: "/", class: "btn-back" }, h("ion-icon", { name: "arrow-back-outline", size: "large" }))), h("div", null, h("strong", null, searchMapStore.state.search.name), h("div", null, searchMapStore.state.search.selectedItem.label))), h("div", { class: "search-toolbar search-section" }, h("div", null, "Results: ", hcpNearMe.length), h("div", null, "List View")), h("div", { class: "search-map search-section" }, h("div", { class: "search-data" }, hcpNearMe.map(elm => (h("onekey-sdk-doctor-card", Object.assign({}, elm, { onClick: this.onItemCardClick }))))), !!hcpNearMe.length &&
      h("onekey-sdk-map", { class: "search-map__content", locations: hcpNearMe, selectedLocationIdx: 0, defaultZoom: configStore.state.mapDefaultZoom, mapTileLayer: configStore.state.mapTileLayer, mapLink: configStore.state.mapLink, markerIcon: configStore.state.markerIcon, markerIconCurrentLocation: configStore.state.markerIconCurrentLocation })))));
  }
};
OnekeySdkSearchResult.style = onekeySdkSearchResultCss;

export { OnekeySdkSearchResult as onekey_sdk_search_result };
