import { Component, Prop, h, Host, Watch, getAssetPath, State } from '@stencil/core';
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
  @Prop() mapTileLayer: string;
  @Prop() mapLink: string;
  @Prop() markerIconCurrentLocation: string;
  @Prop() markerIcon: string;
  @Event() markerClick: EventEmitter;
  @State() currentLocation: any;
  @Event() setCurrentLocation: EventEmitter;
  mapElm: HTMLInputElement;
  map;

  componentDidLoad() {
    this.setMap();
    this.getCurrentLocation()
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
        icon: this.getIcon(this.markerIconCurrentLocation)
      }).addTo(this.map);
    })
  }

  private setMap = () => {
    // L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);
    this.map = L.map(this.mapElm, {
      center: [this.locations[this.selectedLocationIdx].lat, this.locations[this.selectedLocationIdx].lng],
      zoom: this.defaultZoom,
      // gestureHandling: true,
      // gestureHandlingOptions: {
      //   text: {
      //     touch: 'Hey bro, use two fingers to move the map',
      //     scroll: 'Hey bro, use ctrl + scroll to zoom the map',
      //     scrollMac: 'Hey bro, use \u2318 + scroll to zoom the map',
      //   },
      // },
    });

    const mapLink = this.mapLink;
    L.tileLayer(this.mapTileLayer, {
      attribution: '&copy; ' + mapLink + ' Contributors',
      maxZoom: 20,
    }).addTo(this.map);

    this.setMarkers();
  };

  getIcon = (iconURL = '') => {
    const icon = L.icon({
      iconUrl: iconURL || this.markerIcon || getAssetPath(`./assets/marker-icon-2x.png`),
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
        markers.addLayer(L.marker([this.locations[i].lat, this.locations[i].lng], { icon: this.getIcon() }).bindPopup(this.locations[i].name)).addTo(this.map).on("click", this.markerClick.emit);
      }
    }
  };

  moveToCurrentLocation = () => {
    this.setCurrentLocation.emit(this.currentLocation)
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
