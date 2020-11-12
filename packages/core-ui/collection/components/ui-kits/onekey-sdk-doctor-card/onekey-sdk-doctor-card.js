import { Component, Host, h, Prop } from '@stencil/core';
export class OnekeySdkDoctorCard {
  render() {
    return (h(Host, null,
      h("div", { class: "doctor-card" },
        h("span", { class: "text name" }, this.name),
        h("span", { class: "text gp" }, this.gp),
        h("span", { class: "text address" }, this.address),
        h("span", { class: "text distance" }, this.distance))));
  }
  static get is() { return "onekey-sdk-doctor-card"; }
  static get originalStyleUrls() { return {
    "$": ["onekey-sdk-doctor-card.scss"]
  }; }
  static get styleUrls() { return {
    "$": ["onekey-sdk-doctor-card.css"]
  }; }
  static get properties() { return {
    "name": {
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
      "attribute": "name",
      "reflect": false
    },
    "gp": {
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
      "attribute": "gp",
      "reflect": false
    },
    "address": {
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
      "attribute": "address",
      "reflect": false
    },
    "distance": {
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
      "attribute": "distance",
      "reflect": false
    }
  }; }
}
