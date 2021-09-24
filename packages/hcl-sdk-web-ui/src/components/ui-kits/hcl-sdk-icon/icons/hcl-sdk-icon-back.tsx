import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'hcl-sdk-icon-back',
  shadow: false,
})
export class HclSdkIconBack {
  @Prop() color: string;
  @Prop() width: number = 20;
  @Prop() height: number = 20;

  render() {
    return (
      <Host>
        <svg
          version="1.2"
          preserveAspectRatio="none"
          viewBox="0 0 24 24"
          style={{ opacity: '1', mixBlendMode: 'normal', width: `${this.width}px`, height: `${this.height}px` }}
        >
          <g>
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" style={{ fill: this.color }} />
          </g>
        </svg>
      </Host>
    );
  }
}
