import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'hcl-sdk-icon-account-outline',
  shadow: false,
})
export class HclSdkIconAccountOutline {
  @Prop() color: string;
  @Prop() width: number = 24;
  @Prop() height: number = 24;

  render() {
    return (
      <Host>
        <svg version="1.2" preserveAspectRatio="none" viewBox="0 0 24 24" style={{ opacity: '1', mixBlendMode: 'normal', width: `${this.width}px`, height: `${this.height}px` }}>
          <path
            style={{ fill: this.color }}
            d="M12 4a4 4 0 014 4 4 4 0 01-4 4 4 4 0 01-4-4 4 4 0 014-4m0 2a2 2 0 00-2 2 2 2 0 002 2 2 2 0 002-2 2 2 0 00-2-2m0 7c2.67 0 8 1.33 8 4v3H4v-3c0-2.67 5.33-4 8-4m0 1.9c-2.97 0-6.1 1.46-6.1 2.1v1.1h12.2V17c0-.64-3.13-2.1-6.1-2.1z"
          />
        </svg>
      </Host>
    );
  }
}
