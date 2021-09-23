interface OnDragCallbackArg {
  target: {
    getCenter: () => { lat: number; lng: number };
    getBounds: () => {
      getNorth: () => number;
      getSouth: () => number;
      getWest: () => number;
      getEast: () => number;
    };
  };
}

export interface IHclSdkMap {
  map;

  remove(): void;

  setMarker(option: any): void;

  setCurrentMarker(latLng: any): void;

  disable(): void;

  enable(): void;

  onResize(): void;

  onClick(cb: (event: any) => void): void;
  onDrag(cb: (event: OnDragCallbackArg) => void): void;
  onZoomend(cb: (event: any, currentZoomlevel: number) => void): void;

  initMap(
    mapElm: any,
    options: {
      center: { lat: number; lng: number };
      zoom: number;
      minZoom: number;
      maxZoom: number;
      dragging: boolean;
      googleMapApiKey?: string;
      googleMapId?: string;
      zoomControl: boolean;
      iconMarker?: string;
      iconMarkerSelected?: string;
    },
  ): Promise<any>;

  createIconURL(markerColor: string): string;

  createIconMeURL(): string;

  createIcon(colorStyle: string, isCurrent?: boolean, clusterNumber?: number): any;

  toggleMarkerIcon(marker, status): void;

  updateMarkerIcon(targetMarker): void;

  removePreviousMarkersIcon(): void;

  fitBounds(option: any): void;

  zoomPan(to: any): void;

  zoomCenter(to: any): void;

  panTo(option: any): void;
}
