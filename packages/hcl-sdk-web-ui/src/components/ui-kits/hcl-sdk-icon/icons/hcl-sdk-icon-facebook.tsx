import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'hcl-sdk-icon-facebook',
  shadow: false,
})
export class HclSdkIconFacebook {
  @Prop() color: string = '#4267b2';
  @Prop() width: number = 24;
  @Prop() height: number = 24;

  render() {
    return (
      <Host>
        <svg xmlns="http://www.w3.org/2000/svg" width={this.width} height={this.height} fill={this.color} viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
      </Host>
    );
  }
}
