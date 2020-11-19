import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'onekey-sdk-search-address-item',
  styleUrl: 'onekey-sdk-search-address-item.scss',
  shadow: true,
})
export class OnekeySdkSearchItem {
  @Prop() item: any
  @Prop() type: string
  @Prop() activated: boolean = false
  @Event() selectAddress: EventEmitter

  render() {
    return (
      <Host>
        <div class="search-address-item">
          <div class="search-address-item-icon-wrapper">
            <span class="search-address-item-icon">
              <ion-icon name="location-outline"></ion-icon>
            </span>
            <span>{this.item.distance || 0} km</span>
          </div>
          <span class={`search-address-item-text ${this.activated ? 'active': ''}`} onClick={() => this.selectAddress.emit(this.item)}>{this.item.label}</span>
        </div>
      </Host>
    );
  }

}
