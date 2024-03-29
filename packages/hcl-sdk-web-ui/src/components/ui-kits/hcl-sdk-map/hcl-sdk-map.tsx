import { Component, Prop, h, Host, Watch, State } from '@stencil/core';
import { Event, EventEmitter } from '@stencil/core';
import { MapProvider, ModeViewType } from '../../../core/stores/ConfigStore';
import { Breakpoint } from '../../../core/types';
import { searchMapStore, configStore } from '../../../core/stores';
import * as geolib from 'geolib';
import { HclSdkMapGoogleMap } from './map/hcl-sdk-google-map';
import { HclSdkOpenStreetMap } from './map/hcl-sdk-openstreet-map';
import { IHclSdkMap } from './map/hck-sdk-map-interface';
import { GeoLocation } from '../../../core/stores/SearchMapStore';

@Component({
  tag: 'hcl-sdk-map',
  styleUrl: 'hcl-sdk-map.scss',
  shadow: false,
  assetsDirs: ['assets'],
})
export class HclSdkMap {
  @State() mapId: string = String(Date.now());
  @Prop() isZoomChanged: boolean = false;
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
  @Event() moveCurrentLocation: EventEmitter;
  @Event() mapClicked: EventEmitter;
  @Event() onMapDrag: EventEmitter;
  mapElm: HTMLInputElement;
  map: IHclSdkMap;

  @State() mapTileFullyLoaded = true

  connectedCallback() {
    configStore.onChange('map', () => {
      if (this.map && this.map['remove']) {
        this.map['remove']()
      }
      this.setMap();
    })
  }

  private setMap = async () => {
    if (!this.locations) {
      return;
    }

    const center = this.getCenterInitMap();

    this.map = configStore.state.map.provider === MapProvider.OPEN_STREETMAP ? new HclSdkOpenStreetMap() : new HclSdkMapGoogleMap();
    await this.map.initMap(this.mapElm, {
      center,
      zoom: this.isForcedZoomToMe ? 12 : this.defaultZoom,
      minZoom: 1,
      maxZoom: 20,
      googleMapApiKey: configStore.state.map.googleMapApiKey,
      googleMapId: configStore.state.map.googleMapId,
      zoomControl: this.zoomControl,
      dragging: this.dragging,
      iconMarker: configStore.state.icons['map_marker'],
      iconMarkerSelected: configStore.state.icons['map_marker_selected'],
      enableMapDarkMode: configStore.state.enableMapDarkMode,
      enableLeafletAttribution: configStore.state.map.enableLeafletAttribution,
    })

    this.map.onDrag(this.onMapDragHandler)
    this.map.onZoomend(this.onMapZoomend)

    if (this.map.onTileFullyLoaded) {
      this.mapTileFullyLoaded = false
      this.map.onTileFullyLoaded(() => {
        this.mapTileFullyLoaded = true
      })
    }

    this.setMarkers();
  };


  async componentDidLoad() {
    await this.setMap();
    this.setMarkerCurrentLocation();
    if (!this.interactive) {
      this.disableMap();
    }

    searchMapStore.storeInstance
      .onChange('geoLocation', this.handleChangeGeoLocation)
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
  handleChange(newValue, oldValue) {
    if (newValue.length === 1 && JSON.stringify(newValue) === JSON.stringify(oldValue)) {
      return
    }

    /**
     * There are two cases to show relaunch
     *  1. Drag and drop Event
     *    - After drag and drop, users click on the "Relaunch" button so the data will be rebooted
     *    - The zoom level will be adjusted automatically
     *      Reset zoom level when data is changed to avoid the conflict about zoomend event
     *  2. Zoomend Event
     */
    this.isZoomChanged = false;

    this.setMarkers();
  }

  @Watch('modeView')
  resetMapByModeView() {
    this.map.onResize();
  }

  @Watch('breakpoint')
  resetMapByViewPortSize() {
    this.map.onResize();
  }

  @Watch('zoomControl')
  resetMapByZoomControl() {
    this.map.onResize();
  }

  handleChangeGeoLocation = (newGeoLoc: GeoLocation) => {
    if (newGeoLoc.status === 'granted') {
      setTimeout(() => {
        this.setMarkerCurrentLocation()
      }, 10);
    }
  }

  setMarkerCurrentLocation = () => {
    if (!this.map) {
      return;
    }

    if (searchMapStore.isGrantedGeoloc && this.isShowMeMarker) {
      const { latitude: lat, longitude: lng } = searchMapStore.getGeoLocation();

      this.map.setCurrentMarker({ lat, lng });
    }
  };

  private disableMap() {
    this.map.disable()
  }

  private enableMap() {
    this.map.enable()
  }

  private onMapDragHandler = evt => {
    this.onMapDrag.emit(evt);
  }

  private onMapZoomend = (evt) => {
    if (!this.isZoomChanged) {
      this.isZoomChanged = true
      return
    }

    this.onMapDrag.emit(evt); // Active relaunch button
  }

  private getCenterInitMap() {
    if (this.locations.length === 0) {
      return undefined;
    }

    const points = this.getPoints();

    const centers = geolib.getCenter(points);

    const center: any = centers ? { lat: centers.latitude, lng: centers.longitude } : { lat: this.locations[0].lat, lng: this.locations[0].lng };

    return center;
  }

  private onSelectedMarker = marker => {
    this.onMarkerClick.emit(marker);
    this.updateMarkerIcon(marker.target);
  };
  private onSelectedGroupMarker = marker => {
    this.onMarkerClick.emit(marker);
    this.updateMarkerIcon(marker.target);
  };

  private updateMarkerIcon = targetMarker => {
    this.map.updateMarkerIcon(targetMarker)
  };

  private handleMapClick = e => {
    const target = e.target as HTMLElement;
    if (target.nodeName.toLowerCase() === 'a') {
      window.open((target as HTMLAnchorElement).href, '_blank');
      e.preventDefault();
      return;
    }
    this.mapClicked.emit(e);
  };

  private removePreviousMarkersIcon() {
    this.map.removePreviousMarkersIcon()
  }

  private setMarkers = () => {
    if (!this.locations) {
      return;
    }
    this.removePreviousMarkersIcon();

    this.generateSeperateMarkers();
    this.generateGroupsMarkers();

    if (this.isForcedZoomToMe && searchMapStore.isGrantedGeoloc) {
      this.map.zoomCenter({
        lat: searchMapStore.state.geoLocation.latitude,
        lng: searchMapStore.state.geoLocation.longitude,
      });
    } else if (this.locations.length > 1) {
      this.recalculateBoundView();
    } else if (this.locations.length === 1) {
      this.map.zoomPan(this.locations[0]);
    }
  };

  generateGroupsMarkers() {
    // Handle for me location
    this.locations
      .filter(l => l.isMeLocation)
      .forEach(({ lat, lng, isMeLocation }) => {
        this.map.setMarker({
          location: { lat, lng },
          icon: this.map.createIcon(undefined, isMeLocation),
          onClickHandler: this.onSelectedMarker,
        });
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
          },
        };
      }, {});

    for (const groupKey in hashFrequencyLocation) {
      const groupLocation = hashFrequencyLocation[groupKey];
      const { lat, lng } = groupLocation;
      const isMeLocation = false;

      this.map.setMarker({
        location: { lat, lng },
        icon: this.map.createIcon(undefined, isMeLocation),
        onClickHandler: this.onSelectedGroupMarker,
        _markerId: `gg-marker-${groupKey}`,
      });
    }
  }

  generateSeperateMarkers() {
    const markers = [];

    for (let i = 0; i < this.locations.length; i++) {
      const { lat, lng, isMeLocation } = this.locations[i];
      this.map.setMarker({
        location: { lat, lng },
        icon: this.map.createIcon(undefined, isMeLocation),
        onClickHandler: this.onSelectedMarker,
      });
    }

    return markers;
  }

  recalculateBoundView = () => {
    const points = this.getPoints();
    const bounds = geolib.getBounds(points);

    if (bounds) {
      this.map.fitBounds({ ...bounds, padding: 5 });
    }
  };

  getPoints() {
    return this.locations.map(location => {
      return { latitude: location.lat, longitude: location.lng };
    });
  }

  moveToCurrentLocation = () => {
    const currentLocation = searchMapStore.getGeoLocation(true);
    this.map.panTo(currentLocation);
    this.moveCurrentLocation.emit(currentLocation);
  };

  render() {
    return (
      <Host>
        {!this.noCurrentLocation && searchMapStore.isGrantedGeoloc && (
          <div class="current-location" onClick={this.moveToCurrentLocation}>
            <hcl-sdk-icon name="map_geoloc" />
          </div>
        )}
        <div class="map-box">
          {!this.mapTileFullyLoaded && <hcl-sdk-icon class="map-box__loading" name="circular" />}
        </div>
        <div
          class={this.zoomControl ? '' : 'map--no-controls'}
          onClick={this.handleMapClick}
          style={{
            height: this.mapHeight,
            width: this.mapWidth,
            minHeight: this.mapMinHeight,
            visibility: this.mapTileFullyLoaded ? 'visible' : 'hidden',
          }}
          id={`map-${this.mapId}`}
          ref={el => (this.mapElm = el as HTMLInputElement)}
        />
      </Host>
    );
  }
}
