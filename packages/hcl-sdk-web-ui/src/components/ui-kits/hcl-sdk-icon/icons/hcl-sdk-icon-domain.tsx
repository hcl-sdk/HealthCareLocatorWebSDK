import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'hcl-sdk-icon-domain',
  shadow: false,
})
export class HclSdkIconDomain {
  @Prop() color: string;
  @Prop() width: number = 24;
  @Prop() height: number = 24;

  render() {
    return (
      <Host>
        <svg version="1.2" preserveAspectRatio="none" viewBox="0 0 24 24" style={{ opacity: '1', mixBlendMode: 'normal', width: `${this.width}px`, height: `${this.height}px` }}>
          <path
            style={{ fill: this.color }}
            d="M18 15h-2v2h2m0-6h-2v2h2m2 6h-8v-2h2v-2h-2v-2h2v-2h-2V9h8M10 7H8V5h2m0 6H8V9h2m0 6H8v-2h2m0 6H8v-2h2M6 7H4V5h2m0 6H4V9h2m0 6H4v-2h2m0 6H4v-2h2m6-10V3H2v18h20V7H12z"
          />
        </svg>
      </Host>
    );
  }
}
