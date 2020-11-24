import { Component, Prop, h, Host, Watch, State } from '@stencil/core';
import * as L from 'leaflet';
import { Event, EventEmitter } from '@stencil/core';
// import { GestureHandling } from 'leaflet-gesture-handling';
import 'leaflet.markercluster/dist/leaflet.markercluster';

@Component({
  tag: 'onekey-sdk-map',
  styleUrl: 'onekey-sdk-map.scss',
  shadow: false,
  assetsDirs: ['assets'],
})
export class OnekeySdkMap {
  /**
   * An array of locations
   */
  @Prop() mapHeight: string = '100%';
  @Prop() mapWidth: string = '100%';
  @Prop() locations = [];
  @Prop() defaultZoom: number;
  @Prop() selectedLocationIdx: number;
  @Prop() markerIcon: string;
  @Event() markerClick: EventEmitter;
  @State() currentLocation: any;
  @Event() setCurrentLocation: EventEmitter;
  mapElm: HTMLInputElement;
  map;

  componentDidLoad() {
    this.setMap();
    this.getCurrentLocation();
  }

  @Watch('locations')
  handleChange() {
    this.setMarkers();
  }

  getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const { coords: { latitude, longitude }} = position;
      this.currentLocation = { lat: latitude, lng: longitude }

      new L.marker([latitude, longitude], {
        draggable: true,
        autoPan: true,
        icon: this.getIcon()
      }).addTo(this.map);
    })
  }

  private setMap = () => {
    const mapTileLayer = 'https://mapsorigin.ns1.ff.avast.com/styles/osm-bright/{z}/{x}/{y}.png';
    const mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

    // L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);
    this.map = L.map(this.mapElm, {
      center: [this.locations[this.selectedLocationIdx].lat, this.locations[this.selectedLocationIdx].lng],
      zoom: this.defaultZoom,
      minZoom: 15,
      maxZoom: 20
      // gestureHandling: true,
      // gestureHandlingOptions: {
      //   text: {
      //     touch: 'Hey bro, use two fingers to move the map',
      //     scroll: 'Hey bro, use ctrl + scroll to zoom the map',
      //     scrollMac: 'Hey bro, use \u2318 + scroll to zoom the map',
      //   },
      // },
    });

    L.tileLayer(mapTileLayer, {
      attribution: '&copy; ' + mapLink + ' Contributors',
      maxZoom: 20,
    }).addTo(this.map);

    this.setMarkers();
  };

  getIcon = () => {
    const makerIconString = `
    <svg id="onekey-sdk-marker" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      viewBox="0 0 512 512" fill="rgb(254, 138, 18)" xml:space="preserve">
      <g><g><path d="M256,0C153.755,0,70.573,83.182,70.573,185.426c0,126.888,165.939,313.167,173.004,321.035
          c6.636,7.391,18.222,7.378,24.846,0c7.065-7.868,173.004-194.147,173.004-321.035C441.425,83.182,358.244,0,256,0z M256,278.719
          c-51.442,0-93.292-41.851-93.292-93.293S204.559,92.134,256,92.134s93.291,41.851,93.291,93.293S307.441,278.719,256,278.719z"/>
      </g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
    </svg>
    `
    let myIconUrl = encodeURI("data:image/svg+xml," + makerIconString).replace('#','%23');
    const icon = L.icon({
      iconUrl: myIconUrl,
      iconSize: [25, 40],
    });
    return icon
  }

  private setMarkers = () => {
    const markers = L.markerClusterGroup({
      showCoverageOnHover: false,
    });
    if (this.locations) {
      for (let i = 0; i < this.locations.length; i++) {
        markers.addLayer(L.marker([this.locations[i].lat, this.locations[i].lng], { icon: this.getIcon() })).addTo(this.map).on("click", this.markerClick.emit);
      }
    }
  };

  moveToCurrentLocation = () => {
    // this.setCurrentLocation.emit(this.currentLocation) // change label on the top
    this.map.panTo(this.currentLocation, 16);
  }

  render() {
    return (
      <Host>
        <div class="current-location" onClick={this.moveToCurrentLocation}><ion-icon name="locate" size="medium"></ion-icon></div>
        <div style={{ height: this.mapHeight, width: this.mapWidth }} id="map" ref={el => (this.mapElm = el as HTMLInputElement)} />
      </Host>
    );
  }
}
