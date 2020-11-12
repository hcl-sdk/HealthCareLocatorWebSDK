import { Component, Prop, h, Host, Watch, getAssetPath } from '@stencil/core';
import * as L from 'leaflet';
import { GestureHandling } from 'leaflet-gesture-handling';
import 'leaflet.markercluster/dist/leaflet.markercluster';
export class OnekeySdkMap {
  constructor() {
    /**
     * An array of locations
     */
    this.mapHeight = '100%';
    this.mapWidth = '100%';
    this.locations = [];
    this.defaultZoom = 10;
    this.selectedLocationIdx = 0;
    this.mapTileLayer = 'http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
    this.mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
    this.currentLocation = () => {
      navigator.geolocation.getCurrentPosition(position => {
        const { coords: { latitude, longitude } } = position;
        var marker = new L.marker([latitude, longitude], {
          draggable: true,
          autoPan: true,
          icon: this.getIcon(this.markerIconCurrentLocation)
        }).addTo(this.map);
        console.log(marker);
      });
    };
    this.setMap = () => {
      L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);
      this.map = L.map(this.mapElm, {
        center: [this.locations[this.selectedLocationIdx].lat, this.locations[this.selectedLocationIdx].lng],
        zoom: this.defaultZoom,
      });
      const mapLink = this.mapLink;
      L.tileLayer(this.mapTileLayer, {
        attribution: '&copy; ' + mapLink + ' Contributors',
        maxZoom: 20,
      }).addTo(this.map);
      this.setMarkers();
    };
    this.getIcon = (iconURL = '') => {
      const icon = L.icon({
        iconUrl: iconURL || this.markerIcon || getAssetPath(`./assets/marker-icon-2x.png`),
        iconSize: [25, 40],
      });
      return icon;
    };
    this.setMarkers = () => {
      const markers = L.markerClusterGroup({
        showCoverageOnHover: false,
      });
      if (this.locations) {
        for (let i = 0; i < this.locations.length; i++) {
          markers.addLayer(L.marker([this.locations[i].lat, this.locations[i].lng], { icon: this.getIcon() }).bindPopup(this.locations[i].name)).addTo(this.map);
        }
      }
    };
  }
  handleChange() {
    this.setMarkers();
  }
  componentDidLoad() {
    this.setMap();
    this.currentLocation();
  }
  render() {
    return (h(Host, null,
      h("div", { style: { height: this.mapHeight, width: this.mapWidth }, id: "map", ref: el => (this.mapElm = el) })));
  }
  static get is() { return "onekey-sdk-map"; }
  static get originalStyleUrls() { return {
    "$": ["onekey-sdk-map.scss"]
  }; }
  static get styleUrls() { return {
    "$": ["onekey-sdk-map.css"]
  }; }
  static get assetsDirs() { return ["assets"]; }
  static get properties() { return {
    "mapHeight": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "An array of locations"
      },
      "attribute": "map-height",
      "reflect": false,
      "defaultValue": "'100%'"
    },
    "mapWidth": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "map-width",
      "reflect": false,
      "defaultValue": "'100%'"
    },
    "locations": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "any[]",
        "resolved": "any[]",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "defaultValue": "[]"
    },
    "defaultZoom": {
      "type": "number",
      "mutable": false,
      "complexType": {
        "original": "number",
        "resolved": "number",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "default-zoom",
      "reflect": false,
      "defaultValue": "10"
    },
    "selectedLocationIdx": {
      "type": "number",
      "mutable": false,
      "complexType": {
        "original": "number",
        "resolved": "number",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "selected-location-idx",
      "reflect": false,
      "defaultValue": "0"
    },
    "mapTileLayer": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "map-tile-layer",
      "reflect": false,
      "defaultValue": "'http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'"
    },
    "mapLink": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "map-link",
      "reflect": false,
      "defaultValue": "'<a href=\"http://openstreetmap.org\">OpenStreetMap</a>'"
    },
    "markerIconCurrentLocation": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "marker-icon-current-location",
      "reflect": false
    },
    "markerIcon": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "marker-icon",
      "reflect": false
    }
  }; }
  static get watchers() { return [{
      "propName": "locations",
      "methodName": "handleChange"
    }]; }
}
