import StoreProvider from "./StoreProvider";
console.log(document.querySelector('onekey-sdk').offsetHeight);
export const initStateConfigStore = {
  appWidth: '300px',
  appHeight: '700px',
  styles: {
    fontFamily: 'Roboto',
    color: 'black'
  },
  mapTileLayer: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png',
  mapLink: '<a href="http://openstreetmap.org">OpenStreetMap</a>',
  mapDefaultZoom: 5,
  markerIcon: '',
  markerIconCurrentLocation: ''
};
class ConfigStore extends StoreProvider {
  constructor(state) {
    super(state);
    this.state = state;
  }
}
export default ConfigStore;
