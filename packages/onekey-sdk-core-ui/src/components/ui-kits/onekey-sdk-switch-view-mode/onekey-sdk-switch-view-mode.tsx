import { Component, Host, h, State, EventEmitter, Event } from '@stencil/core';
import cls from 'classnames'
@Component({
  tag: 'onekey-sdk-switch-view-mode',
  styleUrl: 'onekey-sdk-switch-view-mode.scss',
  shadow: true,
})
export class OnekeySdkSwitchViewMode {
  @State() selectedViewMode: string  = 'LIST'
  @Event() onSwitchViewMode: EventEmitter;

  onSwitch = (mode) => {
    this.selectedViewMode = mode
    this.onSwitchViewMode.emit(mode)
  }

  render() {
    const listViewClass = cls("mode-item", {
      'active': this.selectedViewMode === 'LIST'
    })

    const mapViewClass = cls("mode-item", {
      'active': this.selectedViewMode === 'MAP'
    })

    return (
      <Host>
        <div class={listViewClass} onClick={() => this.onSwitch("LIST")}>
          <ion-icon name="list"></ion-icon>
          <span>List view</span>
        </div>
        <div class={mapViewClass} onClick={() => this.onSwitch("MAP")}>
          <ion-icon name="map-sharp"></ion-icon>
          <span>Map view</span>
        </div>
      </Host>
    );
  }

}
