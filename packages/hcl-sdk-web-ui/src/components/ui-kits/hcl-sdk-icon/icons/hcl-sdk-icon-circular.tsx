
import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'hcl-sdk-icon-circular',
  shadow: false,
})
export class HclSdkIconCircular {
  @Prop() color: string;
  @Prop() width: number = 20;
  @Prop() height: number = 20;

  render() {
    return (
      <Host>
        <svg viewBox="22 22 44 44" stroke="currentColor" width={this.width} height={this.height}>
          <circle cx="44" cy="44" r="20.2" fill="none" stroke-width="3.6"></circle>
        </svg>
      </Host>
    );
  }
}
