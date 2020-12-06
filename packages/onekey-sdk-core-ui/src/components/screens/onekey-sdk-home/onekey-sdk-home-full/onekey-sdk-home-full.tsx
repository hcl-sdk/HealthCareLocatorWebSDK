import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'onekey-sdk-home-full',
  shadow: false,
})
export class OnekeySdkHomeFull {
  @Prop() onGoSearchScreen: any;
  render() {
    return (
      <Host>
        <div class="main-block">
          <div class="home-full-card">
            <div class="home-full-card__title-wrapper">
              <h3 class="home-full-card__title">HCPs near me</h3>
            </div>
          </div>
          <div class="home-full-card">
            <div class="home-full-card__title-wrapper">
              <h3 class="home-full-card__title">Last searches</h3>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
