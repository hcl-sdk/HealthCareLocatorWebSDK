import * as L from 'leaflet';
import { IHclSdkMap } from './hck-sdk-map-interface';

export class HclSdkOpenStreetMap implements IHclSdkMap {
  map: any;
  markers: any[] = [];

  remove() {
    if (this.map) {
      this.map.remove()
    }
  }

  async initMap(mapElm, options) {
    const mapTileLayer = 'https://mapsorigin.ns1.ff.avast.com/styles/osm-bright/{z}/{x}/{y}.png';
    const mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

    this.map = L.map(mapElm, { ...options, center: options.center ? [options.center.lat, options.center.lng] : null });

    L.control
      .zoom({
        position: 'topright',
      })
      .addTo(this.map);

    L.tileLayer(mapTileLayer, {
      attribution: '&copy; ' + mapLink + ' Contributors',
      maxZoom: 20,
    }).addTo(this.map);
  }

  disable(): void {
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

  enable(): void {
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

  onResize(): void {
    this.map._onResize();
    setTimeout(() => {
      this.map.invalidateSize(true);
    }, 500);
  }

  onClick(cb: (event: any) => void): void {
    this.map.on('click', e => {
      cb(e);
    });
  }

  onDrag(cb) {
    this.map.on('drag', cb);
  }

  onZoomend(cb: (event: any, currentZoomlevel: number) => void) {
    this.map.on('zoomend', evt => {
      cb(evt, this.map.getZoom())
    })
  }

  createIconURL = markerColor => {
    const makerIconString = `
    <svg id="hcl-sdk-marker" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
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

  createIconMeURL = () => {
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

    const blob = new Blob([iconString], { type: 'image/svg+xml' });
    return URL.createObjectURL(blob);
  };

  createIcon(colorStyle: string = '--hcl-color-marker', isCurrent?: boolean, clusterNumber?: number) {
    const markerColor = getComputedStyle(document.querySelector('hcl-sdk').shadowRoot.host).getPropertyValue(colorStyle);

    if (clusterNumber > 1) {
      const icon = L.divIcon({
        className: 'hclsdk-cluster-icon',
        html: [
          `<div style="background-color:${markerColor};" class="hclsdk-cluster-icon__marker-pin" title="${clusterNumber}"></div>`,
          `<span class="hclsdk-cluster-icon__number">${clusterNumber}</span>`,
        ].join(''),
        iconSize: [30, 42],
        iconAnchor: [15, 42], // half of width, height
      });

      return icon;
    }

    const icon = L.icon({
      iconUrl: isCurrent ? this.createIconMeURL() : this.createIconURL(markerColor),
      iconSize: isCurrent ? [20, 20] : [25, 40],
    });
    return icon;
  }

  toggleMarkerIcon(marker: any, status: any): void {
    let newMarkerIcon;
    if (status === 'active') {
      newMarkerIcon = this.createIcon('--hcl-color-marker_selected');
    } else {
      newMarkerIcon = this.createIcon('--hcl-color-marker');
    }
    marker.setIcon(newMarkerIcon);
  }

  updateMarkerIcon(targetMarker: any): void {
    this.markers.forEach(marker => {
      if (marker._leaflet_id === targetMarker._leaflet_id) {
        this.toggleMarkerIcon(marker, 'active');
      } else {
        this.toggleMarkerIcon(marker, 'inactive');
      }
    });
  }

  removePreviousMarkersIcon(): void {
    this.markers.forEach(marker => {
      if (marker.remove) {
        marker.remove();
      }
    });
  }

  setCurrentMarker(position) {
    L.marker([position.lat, position.lng], {
      draggable: false,
      autoPan: true,
      icon: this.createIcon(undefined, true),
    }).addTo(this.map);
  }

  setMarker(option) {
    const position = option.location;
    const newMarker = L.marker([position.lat, position.lng], { icon: option.icon }).addTo(this.map);

    if (option.onClickHandler) {
      newMarker.on('click', option.onClickHandler);
    }
    this.markers.push(newMarker);
  }

  zoomPan(to) {
    this.map.setZoom(16);
    this.map.panTo([to.lat, to.lng]);
  }

  zoomCenter(to) {
    this.map.setView([to.lat, to.lng], 14);
  }

  fitBounds(option): void {
    const { minLat, minLng, maxLat, maxLng, padding } = option;
    this.map.fitBounds(
      [
        [maxLat, maxLng],
        [minLat, minLng],
      ],
      [padding, padding],
    );
  }

  panTo(option) {
    this.map.panTo(option, 16);
  }
}
