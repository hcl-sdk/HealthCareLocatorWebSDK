import { Component, Host, h } from '@stencil/core';
export class OnekeySdkAboutUs {
  render() {
    return (h(Host, null, "About us"));
  }
  static get is() { return "onekey-sdk-about-us"; }
  static get encapsulation() { return "shadow"; }
}
