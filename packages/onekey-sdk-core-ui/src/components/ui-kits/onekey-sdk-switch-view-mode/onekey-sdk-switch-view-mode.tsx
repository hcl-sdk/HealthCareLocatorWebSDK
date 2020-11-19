import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'onekey-sdk-switch-view-mode',
  styleUrl: 'onekey-sdk-switch-view-mode.scss',
  shadow: true,
})
export class OnekeySdkSwitchViewMode {

  render() {
    return (
      <Host>
        <div class="mode-item">
          <ion-icon name="list"></ion-icon>
          <span>List view</span>
        </div>
        <div class="mode-item active">
          <ion-icon name="map-sharp"></ion-icon>
          <span>Map view</span>
        </div>
      </Host>
    );
  }

}
