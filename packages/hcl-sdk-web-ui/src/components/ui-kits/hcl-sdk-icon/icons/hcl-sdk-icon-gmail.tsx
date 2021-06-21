import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'hcl-sdk-icon-gmail',
  shadow: false,
})
export class HclSdkIconGmail {
  @Prop() color: string;
  @Prop() width: number = 20;
  @Prop() height: number = 20;

  render() {
    return (
      <Host>
        <svg 
          width={this.width} height={this.height}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg" 
          x="0px" y="0px" 
          viewBox="0 0 512 512" 
          style={{enableBackground: 'new 0 0 512 512'}} xmlSpace="preserve">
          <rect x={64} y={64} style={{fill: '#ECEFF1'}} width={384} height={384} />
          <polygon style={{fill: '#CFD8DC'}} points="256,296.384 448,448 448,148.672 " />
          <path style={{fill: '#F44336'}} d="M464,64h-16L256,215.616L64,64H48C21.504,64,0,85.504,0,112v288c0,26.496,21.504,48,48,48h16V148.672
          l192,147.68L448,148.64V448h16c26.496,0,48-21.504,48-48V112C512,85.504,490.496,64,464,64z" />
        </svg>

      </Host>
    );
  }
}
