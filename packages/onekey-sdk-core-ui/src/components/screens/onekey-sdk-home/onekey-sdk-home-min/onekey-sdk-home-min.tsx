import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'onekey-sdk-home-min',
  shadow: false,
})
export class OnekeySdkHomeMin {
  @Prop() onGoSearchScreen: any;
  render() {
    return (
      <Host>
        <div class="main-block">
          <div class="home">
            <div class="header">
              <span class="title">Find and Locate</span>
              <span class="title">Healthcare Professional</span>
            </div>

            <div class="content">
              <div class="item">
                <div class="item__icon">
                  <onekey-sdk-icon name="search" width={17} height={17} />
                </div>
                <div class="item__message">
                  <strong>Find and Locate other HCP</strong>
                  <span class="sub-text">Lorem ipsum dolor sit amet, consect adipiscing elit</span>
                </div>
              </div>

              <div class="item">
                <div class="item__icon">
                  <onekey-sdk-icon name="personal" />
                </div>
                <div class="item__message">
                  <strong>Consult Profile</strong>
                  <span class="sub-text">Lorem ipsum dolor sit amet, consect adipiscing elit</span>
                </div>
              </div>

              <div class="item">
                <div class="item__icon">
                  <onekey-sdk-icon name="edit" />
                </div>
                <div class="item__message">
                  <strong>Request my Information update</strong>
                  <span class="sub-text">Lorem ipsum dolor sit amet, consect adipiscing elit</span>
                </div>
              </div>
            </div>

            <div class="full-block hidden-lg hidden-xl">
              <onekey-sdk-button isFull primary onClick={this.onGoSearchScreen} class="search-btn">
                Start a New Search
              </onekey-sdk-button>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
