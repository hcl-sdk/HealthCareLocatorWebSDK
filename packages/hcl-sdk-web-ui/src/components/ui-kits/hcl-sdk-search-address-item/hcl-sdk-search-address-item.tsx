import { Component, Host, h, Prop, Event, EventEmitter, Listen } from '@stencil/core';
import { NEAR_ME } from '../../../core/constants';
import { t } from '../../../utils/i18n';

@Component({
  tag: 'hcl-sdk-search-address-item',
  styleUrl: 'hcl-sdk-search-address-item.scss',
  shadow: false,
})
export class HclSdkSearchItem {
  @Prop() item: any;
  @Prop() selected: boolean = false;
  @Prop() currentSearchText?: string;
  @Event() selectAddress: EventEmitter;

  renderIcon = type => {
    switch (type) {
      case 'history':
        return <hcl-sdk-icon name="history" />;
      default:
        return <hcl-sdk-icon name="location" />;
    }
  };

  highlight = (string: string, text: string, isAddress) => {
    const lowerCaseString = string.toLowerCase();
    const lowerCaseText = text.toLowerCase();
    const index = lowerCaseString.indexOf(lowerCaseText);

    return `
      <span style="color: ${isAddress ? `var(--hcl-color-secondary)` : `var(--hcl-color-grey_dark)`}">
        ${
          index >= 0
            ? `${string.substring(0, index)}<span style="color: var(--hcl-color-primary)">${string.substring(index, index + lowerCaseText.length)}</span>${string.substring(
                index + lowerCaseText.length,
              )}`
            : string
        }
      </span>
    `;
  };

  @Listen('click')
  onClick() {
    this.selectAddress.emit(this.item)
  }

  @Listen('keydown')
  onKeyboard(evt: KeyboardEvent) {
    if (evt.key === ' ' || evt.key === 'Enter' || evt.key === 'Spacebar') {
      this.selectAddress.emit(this.item)
    }
  }

  render() {
    return (
      <Host role="button" tabIndex={0}>
        <div class={`search-address-item ${this.selected ? 'selected' : ''}`} role="button">
          {
            (this.item.type || this.item.id === NEAR_ME) && <div class="search-address-item-icon-wrapper"><span class="search-address-item-icon">{this.renderIcon(this.item.type)}</span></div>
          }
          <span class={`search-address-item-text`}>
            {this.item.id === NEAR_ME && <span class="name">{t('near_me')}</span>}
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
