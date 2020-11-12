import 'leaflet.markercluster/dist/leaflet.markercluster';
export declare class OnekeySdkMap {
  /**
   * An array of locations
   */
  mapHeight: string;
  mapWidth: string;
  locations: any[];
  defaultZoom: number;
  selectedLocationIdx: number;
  mapTileLayer: string;
  mapLink: string;
  markerIconCurrentLocation: string;
  markerIcon: string;
  mapElm: HTMLInputElement;
  map: any;
  componentDidLoad(): void;
  handleChange(): void;
  currentLocation: () => void;
  private setMap;
  getIcon: (iconURL?: string) => any;
  private setMarkers;
  render(): any;
}
