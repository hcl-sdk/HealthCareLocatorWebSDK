import { loadGoogleMapApi } from '../../../../core/google-api-loader';
import { IHclSdkMap, OptionsMap } from './hck-sdk-map-interface';

function generateEventDrag(map: google.maps.Map) {
  return {
    target: {
      getCenter: () => map.getCenter().toJSON(),
      getBounds: () => {
        const bounds = map.getBounds();
        return {
          getNorth: () => bounds.getNorthEast().lat(),
          getSouth: () => bounds.getSouthWest().lat(),
          getWest: () => bounds.getSouthWest().lng(),
          getEast: () => bounds.getNorthEast().lng(),
        };
      },
    },
  }
}

const stylesDarkMode = [
  {
    "featureType": "all",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "featureType": "all",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "lightness": -80
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#263c3f"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6b9a76"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2b3544"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9ca5b3"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#38414e"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#212a37"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#1f2835"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#f3d19c"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#38414e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#212a37"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2f3948"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#515c6d"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "lightness": -20
      }
    ]
  }
]

export class HclSdkMapGoogleMap implements IHclSdkMap {
  internalMapContainer: HTMLDivElement;
  map: google.maps.Map;
  markers: google.maps.Marker[] = [];

  iconMarker?: string;
  iconMarkerSelected?: string;

  remove() {
    if (this.map && this.internalMapContainer) {
      this.internalMapContainer.remove()
    }
  }

  async initMap(mapElm: HTMLElement, options: OptionsMap) {
    await loadGoogleMapApi(options);

    if (!options.center) {
      delete options['center'];
    }

    this.iconMarker = options.iconMarker;
    this.iconMarkerSelected = options.iconMarkerSelected;

    this.internalMapContainer = document.createElement('div');
    this.internalMapContainer.style.position = 'absolute';
    this.internalMapContainer.style.top = '0px';
    this.internalMapContainer.style.right = '0px';
    this.internalMapContainer.style.bottom = '0px';
    this.internalMapContainer.style.left = '0px';

    mapElm.style.position = 'relative';
    mapElm.appendChild(this.internalMapContainer)

    this.map = new google.maps.Map(mapElm, {
      ...options,
      fullscreenControl: false,
      zoomControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT,
      },
      styles: options.enableMapDarkMode ? stylesDarkMode : [
        {
          featureType: 'landscape.man_made',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'poi',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'transit',
          elementType: 'labels.icon',
          stylers: [{ visibility: 'off' }],
        },
      ],
    });

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
      cb(generateEventDrag(this.map));
    });
  }

  onZoomend(cb) {
    this.map.addListener('zoom_changed', () => {
      cb(generateEventDrag(this.map), this.map.getZoom())
    })
  }

  createIconURL = (markerColor, isSelected: boolean = false) => {
    const icon = isSelected ? this.iconMarkerSelected : this.iconMarker;
    const makerIconString = icon || `
    <svg id="hcl-sdk-marker" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      viewBox="0 0 512 512" fill="${markerColor}" xml:space="preserve">
      <g><g><path d="M256,0C153.755,0,70.573,83.182,70.573,185.426c0,126.888,165.939,313.167,173.004,321.035
          c6.636,7.391,18.222,7.378,24.846,0c7.065-7.868,173.004-194.147,173.004-321.035C441.425,83.182,358.244,0,256,0z M256,278.719
          c-51.442,0-93.292-41.851-93.292-93.293S204.559,92.134,256,92.134s93.291,41.851,93.291,93.293S307.441,278.719,256,278.719z"/>
      </g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
    </svg>
    `;

    const blob = new Blob([makerIconString], { type: 'image/svg+xml' });
    return URL.createObjectURL(blob);
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

  createIcon(colorStyle: string = '--hcl-color-marker', isCurrent?: boolean) {
    const isSelected = '--hcl-color-marker_selected' === colorStyle;
    const markerColor = getComputedStyle(document.querySelector('hcl-sdk').shadowRoot.host).getPropertyValue(colorStyle);

    const icon = {
      url: isCurrent ? this.createIconMeURL() : this.createIconURL(markerColor, isSelected),
      // (25, 28) -> fit the icon image without space around so anchor is at x-center, y-bottom:
      scaledSize: isCurrent ? new google.maps.Size(20, 20) : new google.maps.Size(25, 28),
      origin: new google.maps.Point(0, 0),
      anchor: isCurrent ? new google.maps.Point(10, 10) : new google.maps.Point(12.5, 28),
      // anchor depends on the shape of marker
      // icon me is a circle so we want to anchor it at the center
      // other icon is a pin we want to anchor it horizontally center, vertically bottom
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
