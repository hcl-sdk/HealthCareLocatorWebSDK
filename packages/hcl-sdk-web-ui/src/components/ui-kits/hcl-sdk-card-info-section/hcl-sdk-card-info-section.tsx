import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'hcl-sdk-card-info-section',
  styleUrl: 'hcl-sdk-card-info-section.scss',
  shadow: false,
})
export class HclSdkCardInfoSection {
  @Prop() title: string;
  @Prop() header: any;
  @Prop() map?: any;

  render() {
    return (
      <Host class="info-section">
        {this.map}
        <div class="info-section-header">
          {this.header ? this.header : <span class="info-section-header__title">{this.title}</span>}
        </div>
        <div class="info-section-body">
          <slot />
        </div>
      </Host>
    );
  }
}
