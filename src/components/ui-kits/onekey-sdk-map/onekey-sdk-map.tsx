import { Component, Prop, h, Host, Watch, getAssetPath } from '@stencil/core';
import * as L from 'leaflet';
import { GestureHandling } from 'leaflet-gesture-handling';
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
  @Prop() mapHeight = '100%';
  @Prop() mapWidth = '100%';
  @Prop() locations = [];
  @Prop() defaultZoom: number = 10;
  @Prop() selectedLocationIdx: number = 0;
  @Prop() mapTileLayer: string = 'http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
  @Prop() mapLink: string = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
  @Prop() markerIconCurrentLocation: string;
  @Prop() markerIcon: string;
  mapElm: HTMLInputElement;
  map;

  @Watch('locations')
  handleChange() {
    this.setMarkers();
  }

  currentLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const { coords: { latitude, longitude }} = position;
      var marker = new L.marker([latitude, longitude], {
        draggable: true,
        autoPan: true,
        icon: this.getIcon(this.markerIconCurrentLocation)
      }).addTo(this.map);
    
      console.log(marker);
    })
  }

  private setMap = () => {
    L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);
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
        markers.addLayer(L.marker([this.locations[i].lat, this.locations[i].lng], { icon: this.getIcon() }).bindPopup(this.locations[i].name)).addTo(this.map);
      }
    }
  };

  componentDidLoad() {
    this.setMap();
    this.currentLocation()
  }

  render() {
    return (
      <Host>
        <div style={{ height: this.mapHeight, width: this.mapWidth }} id="map" ref={el => (this.mapElm = el as HTMLInputElement)} />
      </Host>
    );
  }
}
