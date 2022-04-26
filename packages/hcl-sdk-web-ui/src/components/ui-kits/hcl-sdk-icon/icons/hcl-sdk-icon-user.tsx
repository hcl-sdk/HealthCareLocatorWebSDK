import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'hcl-sdk-icon-user',
  shadow: false,
})
export class HclSdkIconGeoloc {
  @Prop() color: string;
  @Prop() width: number = 13;
  @Prop() height: number = 20;

  render() {
    return (
      <Host>
        <svg width={this.width} height={this.height} version="1.2" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g>
            <path fill={this.color} d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" />
          </g>
        </svg>
      </Host>
    );
  }
}
