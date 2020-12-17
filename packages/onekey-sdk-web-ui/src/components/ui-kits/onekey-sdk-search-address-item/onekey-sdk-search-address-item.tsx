import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'onekey-sdk-search-address-item',
  styleUrl: 'onekey-sdk-search-address-item.scss',
  shadow: true,
})
export class OnekeySdkSearchItem {
  @Prop() item: any
  @Prop() activated: boolean = false
  @Prop() currentSearchText?: string
  @Event() selectAddress: EventEmitter

  renderIcon = (type) => {
    switch(type) {
      case 'history':
        return <onekey-sdk-icon name="history" />
      default:
        return <onekey-sdk-icon name="location" />
    }
  }

  highlight = (string: string, text: string, isAddress) => {
    const lowerCaseString = string.toLowerCase()
    const lowerCaseText = text.toLowerCase()
    const index = lowerCaseString.indexOf(lowerCaseText);

    return `
      <span style="color: ${isAddress ? `var(--onekeysdk-color-secondary)`: `var(--onekeysdk-color-grey_darke)`}">
        ${index >= 0 
          ? `${string.substring(0,index)}<span style="color: var(--onekeysdk-color-primary)">${string.substring(index,index+lowerCaseText.length)}</span>${string.substring(index + lowerCaseText.length)}`
          : string
        }
      </span>
    `;
  }

  render() {
    return (
      <Host>
        <div class="search-address-item">
          <span class={`search-address-item-text ${this.activated ? 'active': ''}`} onClick={() => this.selectAddress.emit(this.item)}>
            <span class="name" innerHTML={this.highlight(this.item.name, this.currentSearchText, !!this.item.address)} />
            <span class="specialty">{Array.isArray(this.item.specialties)? this.item.specialties[0]: this.item.specialties }</span>
            <span class="address">{this.item.address}</span>
          </span>
        </div>
      </Host>
    );
  }

}
