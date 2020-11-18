import StoreProvider from "./StoreProvider";

export interface AppConfigStyles {
  fontFamily?: string;
  fontColor?: string;
}

export interface OneKeySDKConfigData {
  appHeight?: string;
  appWidth?: string;
  mapTileLayer?: string;
  mapLink?: string;
  mapDefaultZoom?: number;
  markerIcon?: string;
  markerIconCurrentLocation?: string;
  styles?: AppConfigStyles | any;
}

console.log(document.querySelector('onekey-sdk').offsetHeight)
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

class ConfigStore extends StoreProvider<OneKeySDKConfigData> {
  constructor(state: OneKeySDKConfigData) {
    super(state);
    this.state = state;
  }
}


export default ConfigStore