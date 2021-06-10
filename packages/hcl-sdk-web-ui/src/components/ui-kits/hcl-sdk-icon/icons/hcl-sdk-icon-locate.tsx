import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'hcl-sdk-icon-locate',
  shadow: false,
})
export class HclSdkIconLocate {
  @Prop() color: string;
  @Prop() width: number = 24;
  @Prop() height: number = 24;

  render() {
    return (
      <Host>
        <svg viewBox="0 0 512 512" version="1.2" preserveAspectRatio="none" style={{ opacity: '1', mixBlendMode: 'normal', width: `${this.width}px`, height: `${this.height}px` }}>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="48"
            d="M256 96V56M256 456v-40M256 112a144 144 0 10144 144 144 144 0 00-144-144zM416 256h40M56 256h40"
          ></path>
        </svg>
      </Host>
    );
  }
}
