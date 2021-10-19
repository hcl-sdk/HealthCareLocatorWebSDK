
import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'hcl-sdk-icon-arrow_down',
  shadow: false,
})
export class HclSdkIconArrowDown {
  @Prop() color: string;
  @Prop() width: number = 20;
  @Prop() height: number = 20;

  render() {
    return (
      <Host>
        <svg 
          version="1.2" preserveAspectRatio="none" viewBox="0 0 24 24"
          style={{
            opacity: '1', 
            mixBlendMode: 'normal', 
            fill: this.color, 
            width: this.width + 'px', 
            height: this.height + 'px'
          }}
        > 
          <g><path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" fill={this.color} /></g>
        </svg >
      </Host>
    )
  }
}