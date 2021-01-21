import { Component, Prop, h, Host, Watch, State } from '@stencil/core';
import * as L from 'leaflet';
import { Event, EventEmitter } from '@stencil/core';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import { ModeViewType } from 'onekey-sdk-web-ui/src/core/stores/ConfigStore';
import { Breakpoint } from 'onekey-sdk-web-ui/src/core/types';
import { searchMapStore } from '../../../core/stores';
import * as geolib from 'geolib';

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
  @State() markers: any = [];
  @State() mapId: string = String(Date.now());
  @State() selectedMarkerIdx;
  @Prop() mapHeight: string = '100%';
  @Prop() mapWidth: string = '100%';
  @Prop() mapMinHeight: string = '0px';
  @Prop() locations = [];
  @Prop() defaultZoom: number;
  @Prop() selectedLocationIdx: number;
  @Prop() markerIcon: string;
  @Prop() noCurrentLocation: boolean = false;
  @Prop() zoomControl: boolean = false;
  @Prop() dragging: boolean = true;
  @Prop() modeView: ModeViewType;
  @Prop() breakpoint: Breakpoint;
  @Prop() interactive: boolean = true;
  @Event() markerClick: EventEmitter;
  @Event() setCurrentLocation: EventEmitter;
  @Event() mapClicked: EventEmitter;
  mapElm: HTMLInputElement;
  map;

  componentDidLoad() {
    this.setMap();
    this.getCurrentLocation();
    if (!this.interactive) {
      this.disableMap();
    }
  }

  @Watch('interactive')
  handleInteractiveChange() {
    if (this.interactive) {
      this.enableMap();
    } else {
      this.disableMap();
    }
  }

  @Watch('locations')
  handleChange() {
    this.setMarkers();
  }

  @Watch('modeView')
  resetMapByModeView() {
    this.map._onResize();
  }

  @Watch('breakpoint')
  resetMapByViewPortSize() {
    this.map._onResize();
  }

  @Watch('zoomControl')
  resetMapByZoomControl() {
    this.map._onResize();
    setTimeout(function () {
      this.map.invalidateSize(true);
    }, 500);
  }

  getCurrentLocation = () => {
    
    if (searchMapStore.isGrantedGeoloc) {
      const { latitude, longitude } = searchMapStore.getGeoLocation();

      L.marker([latitude, longitude], {
        draggable: true,
        autoPan: true,
        icon: this.getIcon(),
      }).addTo(this.map);
    }

  };

  private disableMap() {
    this.map.dragging.disable();
    this.map.touchZoom.disable();
    this.map.doubleClickZoom.disable();
    this.map.scrollWheelZoom.disable();
    this.map.boxZoom.disable();
    this.map.keyboard.disable();
    if (this.map.tap) {
      this.map.tap.disable();
    }
  }

  private enableMap() {
    this.map.dragging.enable();
    this.map.touchZoom.enable();
    this.map.doubleClickZoom.enable();
    this.map.scrollWheelZoom.enable();
    this.map.boxZoom.enable();
    this.map.keyboard.enable();
    if (this.map.tap) {
      this.map.tap.enable();
    }
  }

  private setMap = () => {
    if (!this.locations || this.locations.length === 0) {
      return;
    }

    const mapTileLayer = 'https://mapsorigin.ns1.ff.avast.com/styles/osm-bright/{z}/{x}/{y}.png';
    const mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

    let sameLocation = true;
    let previous;
    for (const location of this.locations) {
      if (!previous) {
        previous = location;
      } else {
        if (location.lat !== previous.lat || location.lng !== previous.lng) {
          sameLocation = false;
          break;
        }
      }
    }

    const points = this.getPoints();

    const centers = geolib.getCenter(points);

    const center: any = centers ? [centers.latitude, centers.longitude] : [
      this.locations[0].lat, this.locations[0].lng
    ];

    this.map = L.map(this.mapElm, {
      center,
      zoom: sameLocation ? 12 : this.defaultZoom,
      minZoom: 1,
      maxZoom: 20,
      zoomControl: this.zoomControl,
      dragging: this.dragging,
    });

    L.control
      .zoom({
        position: 'topright',
      })
      .addTo(this.map);

    L.tileLayer(mapTileLayer, {
      attribution: '&copy; ' + mapLink + ' Contributors',
      maxZoom: 20,
    }).addTo(this.map);

    this.setMarkers();
  };

  generateIconURL = markerColor => {
    const makerIconString = `
    <svg id="onekey-sdk-marker" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      viewBox="0 0 512 512" fill="${markerColor}" xml:space="preserve">
      <g><g><path d="M256,0C153.755,0,70.573,83.182,70.573,185.426c0,126.888,165.939,313.167,173.004,321.035
          c6.636,7.391,18.222,7.378,24.846,0c7.065-7.868,173.004-194.147,173.004-321.035C441.425,83.182,358.244,0,256,0z M256,278.719
          c-51.442,0-93.292-41.851-93.292-93.293S204.559,92.134,256,92.134s93.291,41.851,93.291,93.293S307.441,278.719,256,278.719z"/>
      </g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
    </svg>
    `;
    let myIconUrl = encodeURI('data:image/svg+xml,' + makerIconString).replace('#', '%23');

    return myIconUrl;
  };

  getIcon = (colorStyle = '--onekeysdk-color-marker') => {
    const markerColor = getComputedStyle(document.querySelector('onekey-sdk').shadowRoot.host).getPropertyValue(colorStyle);

    const icon = L.icon({
      iconUrl: this.generateIconURL(markerColor),
      iconSize: [25, 40],
    });
    return icon;
  };

  private onSelectedMarker = marker => {
    this.markerClick.emit(marker);
    this.updateMarkerIcon(marker.target);
  };

  private toggleMarkerIcon = (marker, status) => {
    let newMarkerIcon;
    if (status === 'active') {
      newMarkerIcon = this.getIcon('--onekeysdk-color-marker_selected');
    } else {
      newMarkerIcon = this.getIcon('--onekeysdk-color-marker');
    }
    marker.setIcon(newMarkerIcon);
  };

  private updateMarkerIcon = targetMarker => {
    this.markers.forEach(marker => {
      if (marker._leaflet_id === targetMarker._leaflet_id) {
        this.toggleMarkerIcon(marker, 'active');
      } else {
        this.toggleMarkerIcon(marker, 'inactive');
      }
    });
  };

  private handleMapClick = (e) => {
    const target = e.target as HTMLElement;
    if (target.nodeName.toLowerCase() === 'a') {
      window.open((target as HTMLAnchorElement).href, '_blank');
      e.preventDefault();
      return;
    }
    this.mapClicked.emit(e);
  }

  private setMarkers = () => {
    if (!this.locations || this.locations.length === 0) {
      return;
    }

    const markers = [];

    for (let i = 0; i < this.locations.length; i++) {
      const { lat, lng } = this.locations[i];
      const marker = L
        .marker(
          [ lat, lng ], 
          { icon: this.getIcon() }
        )
        .addTo(this.map);
      marker.on('click', this.onSelectedMarker);
      markers.push(marker);
    }

    if (this.locations.length > 1) {
      this.recalculateBoundView();
    }

    this.markers = [...markers];
  };

  recalculateBoundView = () => {
    const points = this.getPoints();
    const bounds = geolib.getBounds(points);

    if (bounds) {
      this.map.fitBounds([
        [bounds.maxLat, bounds.maxLng],
        [bounds.minLat, bounds.minLng],
      ], [5, 5])
    }
  }

  getPoints() {
    return this.locations.map(location => {
      return {
        latitude: location.lat, 
        longitude: location.lng
      }
    })
  }

  moveToCurrentLocation = () => {
    const currentLocation = searchMapStore.getGeoLocation(true);
    this.map.panTo(currentLocation, 16);
  };

  render() {

    return (
      <Host>
        {!this.noCurrentLocation && searchMapStore.isGrantedGeoloc && (
          <div class="current-location" onClick={this.moveToCurrentLocation}>
            <ion-icon name="locate" size="medium"></ion-icon>
          </div>
        )}
        <div
          class={this.zoomControl ? '' : 'map--no-controls'}
          onClick={this.handleMapClick}
          style={{ height: this.mapHeight, width: this.mapWidth, minHeight: this.mapMinHeight }}
          id={`map-${this.mapId}`}
          ref={el => (this.mapElm = el as HTMLInputElement)}
        />
      </Host>
    );
  }
}
