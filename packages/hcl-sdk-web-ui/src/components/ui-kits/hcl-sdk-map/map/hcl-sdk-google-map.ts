import { loadGoogleMapApi } from '../../../../core/google-api-loader';
import { IHclSdkMap } from './hck-sdk-map-interface';

export class HclSdkMapGoogleMap implements IHclSdkMap {
  map: google.maps.Map;
  markers: google.maps.Marker[] = [];

  async initMap(mapElm, options) {
    await loadGoogleMapApi(options);

    if (!options.center) {
      delete options['center'];
    }

    this.map = new google.maps.Map(mapElm, { ...options, mapId: options.googleMapId });

    if (options.dragging === false) {
      this.map.setOptions({ gestureHandling: 'none' });
    }
  }

  disable(): void {
    this.map.setOptions({
      draggable: false,
      disableDoubleClickZoom: true,
      scrollwheel: false,
      gestureHandling: 'none',
      keyboardShortcuts: false,
      disableDefaultUI: true,
    });
  }

  enable(): void {
    this.map.setOptions({
      draggable: true,
      disableDoubleClickZoom: false,
      scrollwheel: true,
      gestureHandling: 'auto',
      keyboardShortcuts: true,
      disableDefaultUI: false,
    });
  }

  onResize(): void {
    // no issues found with google map when changing breakpoints
  }

  onClick(cb: (event: any) => void): void {
    this.map.addListener('click', e => {
      cb(e);
    });
  }

  onDrag(cb) {
    this.map.addListener('drag', () => {
      cb({
        target: {
          getCenter: () => this.map.getCenter().toJSON(),
          getBounds: () => {
            const bounds = this.map.getBounds();
            return {
              getNorth: () => bounds.getNorthEast().lat(),
              getSouth: () => bounds.getSouthWest().lat(),
              getWest: () => bounds.getSouthWest().lng(),
              getEast: () => bounds.getNorthEast().lng(),
            };
          },
        },
      });
    });
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

  createIcon(colorStyle: string = '--hcl-color-marker', isCurrent?: boolean, _clusterNumber?: number) {
    const markerColor = getComputedStyle(document.querySelector('hcl-sdk').shadowRoot.host).getPropertyValue(colorStyle);

    const icon = {
      url: isCurrent ? this.createIconMeURL() : this.createIconURL(markerColor),
      scaledSize: isCurrent ? new google.maps.Size(20, 20) : new google.maps.Size(25, 40),
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0), // anchor
    };

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
      if (marker.get('_markerId') === targetMarker.get('_markerId')) {
        this.toggleMarkerIcon(marker, 'active');
      } else {
        this.toggleMarkerIcon(marker, 'inactive');
      }
    });
  }

  removePreviousMarkersIcon(): void {
    this.markers.forEach(marker => {
      if (marker.setMap) {
        marker.setMap(null);
      }
    });
  }

  setCurrentMarker(position) {
    new google.maps.Marker({
      position: position,
      icon: this.createIcon(undefined, true),
      map: this.map,
      // @ts-ignore
      _markerId: `gg-marker-current`,
    });
  }

  setMarker(option) {
    const newMarker = new google.maps.Marker({
      position: option.location,
      icon: option.icon,
      map: this.map,
      ...option,
    });
    if (option.onClickHandler) {
      newMarker.addListener('click', () =>
        option.onClickHandler({
          target: newMarker,
          latlng: option.location,
        }),
      );
    }
    this.markers.push(newMarker);
  }

  zoomPan(to) {
    this.map.setZoom(16);
    this.map.panTo(to);
  }

  zoomCenter(to) {
    this.map.setZoom(14);
    if (to) {
      this.map.setCenter(to);
    }
  }

  fitBounds(option): void {
    const { minLat, minLng, maxLat, maxLng, padding } = option;
    this.map.fitBounds(
      new google.maps.LatLngBounds(
        {
          lat: minLat,
          lng: minLng,
        },
        {
          lat: maxLat,
          lng: maxLng,
        },
      ),
      padding,
    );
  }

  panTo(option) {
    this.map.panTo(option);
  }
}
