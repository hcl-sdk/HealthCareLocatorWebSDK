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
  @Prop() isShowMeMarker: boolean = false;
  @Prop() isForcedZoomToMe: boolean = false;

  @Event() onMarkerClick: EventEmitter;
  @Event() setCurrentLocation: EventEmitter;
  @Event() mapClicked: EventEmitter;
  @Event() onMapDrag: EventEmitter;
  mapElm: HTMLInputElement;
  map;

  componentDidLoad() {
    this.setMap();
    this.setMarkerCurrentLocation();
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

  setMarkerCurrentLocation = () => {
    if (!this.map) {
      return;
    }

    if (searchMapStore.isGrantedGeoloc && this.isShowMeMarker) {
      const { latitude, longitude } = searchMapStore.getGeoLocation();

      L.marker([latitude, longitude], {
        draggable: false,
        autoPan: true,
        icon: this.getIcon(undefined, true),
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

  private onMapDragHandler = (evt) => {
    this.onMapDrag.emit(evt);
  }

  private getCenterInitMap() {
    if (this.locations.length === 0) {
      return undefined;
    }

    const points = this.getPoints();

    const centers = geolib.getCenter(points);

    const center: any = centers ? [centers.latitude, centers.longitude] : [
      this.locations[0].lat, this.locations[0].lng
    ];

    return center;
  }

  private setMap = () => {
    if (!this.locations) {
      return;
    }

    const mapTileLayer = 'https://mapsorigin.ns1.ff.avast.com/styles/osm-bright/{z}/{x}/{y}.png';
    const mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

    const center = this.getCenterInitMap();

    this.map = L.map(this.mapElm, {
      center,
      zoom: this.isForcedZoomToMe ? 12 : this.defaultZoom,
      minZoom: 1,
      maxZoom: 20,
      zoomControl: this.zoomControl,
      dragging: this.dragging,
    });
    
    this.map.on('drag', this.onMapDragHandler)

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

  generateIconMeURL = () => {
    const iconString = `
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20">
      <title>my vector image</title>
      <rect width="100%" height="100%" x="0" y="0" fill="none" stroke="none" opacity="0" />
      <g>
        <title>Layer 1</title>
        <path fill="#4186f5" fill-opacity="1" stroke="#ffffff" stroke-opacity="1" stroke-width="2" stroke-dasharray="none"
          stroke-linejoin="miter" stroke-linecap="butt" fill-rule="nonzero" opacity="1"
          d="M1.1612908244132996,10.032258401922178 C1.1612908244132996,5.13117104614832 5.152825197956179,1.1612902879714966 10.08064541220665,1.1612902879714966 C15.008465626457118,1.1612902879714966 19,5.13117104614832 19,10.032258401922178 C19,14.933345757696033 15.008465626457118,18.90322651587286 10.08064541220665,18.90322651587286 C5.152825197956179,18.90322651587286 1.1612908244132996,14.933345757696033 1.1612908244132996,10.032258401922178 z" />
      </g>
    </svg>
    `;

    const blob = new Blob([iconString], {type: 'image/svg+xml'});
    return URL.createObjectURL(blob);
  }

  getIcon = (
    colorStyle = '--onekeysdk-color-marker', 
    isCurrent: boolean = false,
    clusterNumber: number = 1
  ) => {
    const markerColor = getComputedStyle(document.querySelector('onekey-sdk').shadowRoot.host).getPropertyValue(colorStyle);

    if (clusterNumber > 1) {
      const icon = L.divIcon({
          className: 'oksdk-cluster-icon',
          html: [
            `<div style="background-color:${markerColor};" class="oksdk-cluster-icon__marker-pin"></div>`,
            `<span class="oksdk-cluster-icon__number">${clusterNumber}</span>`
          ].join(''),
          iconSize: [30, 42],
          iconAnchor: [15, 42] // half of width, height
      });

      return icon
    }


    const icon = L.icon({
      iconUrl: isCurrent ? this.generateIconMeURL() : this.generateIconURL(markerColor),
      iconSize: isCurrent ? [20, 20] : [25, 40],
    });
    return icon;
  };

  private onSelectedMarker = marker => {
    this.onMarkerClick.emit(marker);
    this.updateMarkerIcon(marker.target);
  };
  private onSelectedGroupMarker = marker => {
    this.onMarkerClick.emit(marker);
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

  private removePreviousMarkersIcon() {
    if (!this.markers || this.markers.length === 0) {
      return;
    }
    this.markers.forEach(marker => {
      marker.remove();
    })
  }

  private setMarkers = () => {
    if (!this.locations) {
      return;
    }
    this.removePreviousMarkersIcon();

    // const markers = this.generateSeperateMarkers();
    const markers = this.generateGroupsMarkers();

    if (this.isForcedZoomToMe && searchMapStore.isGrantedGeoloc) {
      this.map.setView([
        searchMapStore.state.geoLocation.latitude,
        searchMapStore.state.geoLocation.longitude,
      ], 10);
    } else if (this.locations.length > 1) {
      this.recalculateBoundView();
    }

    this.markers = [...markers];
  };

  generateGroupsMarkers() {
    const markers = [];

    // Handle for me location
    this.locations
      .filter(l => l.isMeLocation)
      .forEach(({ lat, lng, isMeLocation }) => {
        const meMarker = L
          .marker(
            [ lat, lng ], 
            { icon: this.getIcon(undefined, isMeLocation) }
          )
          .addTo(this.map);
        meMarker.on('click', this.onSelectedMarker);
        markers.push(meMarker);
      });

    // Handle for HCP locations
    const hashFrequencyLocation = this.locations
      .filter(l => !l.isMeLocation)
      .reduce((acc, location) => {
        const { lat, lng } = location;
        const groupKey = `[${lat},${lng}]`;
        const frequencyLocation = acc[groupKey] || {};
        const dataId = frequencyLocation.dataId || [];

        return {
          ...acc,
          [groupKey]: {
            lat, 
            lng,
            dataId: [...dataId, location.id],
          }
        }
      }, {});

    for(const groupKey in hashFrequencyLocation) {
      const groupLocation = hashFrequencyLocation[groupKey];
      const { lat, lng, dataId } = groupLocation;
      const isMeLocation = false;
      const clusterNumber = dataId.length;
      const meMarker = L
          .marker(
            [ lat, lng ], 
            { icon: this.getIcon(undefined, isMeLocation, clusterNumber) }
          )
          .addTo(this.map);
        meMarker.on('click', this.onSelectedGroupMarker);
        markers.push(meMarker);
    }

    return markers;
  }

  generateSeperateMarkers() {
    const markers = [];

    for (let i = 0; i < this.locations.length; i++) {
      const { lat, lng, isMeLocation } = this.locations[i];
      const marker = L
        .marker(
          [ lat, lng ], 
          { icon: this.getIcon(undefined, isMeLocation) }
        )
        .addTo(this.map);
      marker.on('click', this.onSelectedMarker);
      markers.push(marker);
    }

    return markers;
  }

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
