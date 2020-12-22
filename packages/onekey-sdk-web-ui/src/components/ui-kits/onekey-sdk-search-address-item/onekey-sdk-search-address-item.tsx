import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { NEAR_ME } from '../../../core/constants';

@Component({
  tag: 'onekey-sdk-search-address-item',
  styleUrl: 'onekey-sdk-search-address-item.scss',
  shadow: false,
})
export class OnekeySdkSearchItem {
  @Prop() item: any;
  @Prop() activated: boolean = false;
  @Prop() currentSearchText?: string;
  @Event() selectAddress: EventEmitter;

  renderIcon = type => {
    switch (type) {
      case 'history':
        return <onekey-sdk-icon name="history" />;
      default:
        return <onekey-sdk-icon name="location" />;
    }
  };

  highlight = (string: string, text: string, isAddress) => {
    const lowerCaseString = string.toLowerCase();
    const lowerCaseText = text.toLowerCase();
    const index = lowerCaseString.indexOf(lowerCaseText);

    return `
      <span style="color: ${isAddress ? `var(--onekeysdk-color-secondary)` : `var(--onekeysdk-color-grey_dark)`}">
        ${
          index >= 0
            ? `${string.substring(0, index)}<span style="color: var(--onekeysdk-color-primary)">${string.substring(index, index + lowerCaseText.length)}</span>${string.substring(
                index + lowerCaseText.length,
              )}`
            : string
        }
      </span>
    `;
  };

  render() {
    return (
      <Host>
        <div class="search-address-item" role="button" onClick={() => this.selectAddress.emit(this.item)}>
          {
            (this.item.type || this.item.id === NEAR_ME) && <div class="search-address-item-icon-wrapper"><span class="search-address-item-icon">{this.renderIcon(this.item.type)}</span></div>
          }
          <span class={`search-address-item-text ${this.activated ? 'active' : ''}`}>
            {!!this.item.name && !this.currentSearchText && <span class="name">{this.item.name}</span>}
            {!!this.item.name && this.currentSearchText && <span class="name" innerHTML={this.highlight(this.item.name, this.currentSearchText, !!this.item.address)} />}
            {this.item.professionalType && <span class="specialty">{this.item.professionalType}</span>}
            {this.item.address && <span class="address">{this.item.address}</span>}
          </span>
        </div>
      </Host>
    );
  }
}
