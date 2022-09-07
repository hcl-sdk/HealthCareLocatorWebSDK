import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'hcl-sdk-icon-chevrons-down',
  shadow: false,
})
export class HclSdkChevronDown {
  @Prop() color: string = 'currentColor';
  @Prop() width: number = 20;
  @Prop() height: number = 20;

  render() {
    return (
      <Host>
        <svg xmlns="http://www.w3.org/2000/svg" width={this.width} height={this.height} fill={this.color} viewBox="0 0 24 24">
          <path d="m7.41 14.58 4.59 4.59 4.59-4.59 1.41 1.42-6 6-6-6zm0-6 4.59 4.59 4.59-4.59 1.41 1.42-6 6-6-6zm0-6 4.59 4.59 4.59-4.59 1.41 1.42-6 6-6-6z" />
        </svg>
      </Host>
    );
  }
}
