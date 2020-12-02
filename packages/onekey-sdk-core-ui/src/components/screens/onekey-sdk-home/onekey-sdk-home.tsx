import { Component, h, Host } from '@stencil/core';
import { configStore, routerStore, searchMapStore } from '../../../core/stores';

@Component({
  tag: 'onekey-sdk-home',
  styleUrl: 'onekey-sdk-home.scss',
  shadow: false,
})
export class OnekeySdkHome {
  onGoSearchScreen = () => {
    routerStore.push('/search');
  };

  inputOnChange = (e: any) => {
    searchMapStore.setState({
      search: {
        name: e.target.value,
      },
    });
  };

  onSearch = () => {
    routerStore.push('/search');
  };

  onSubmit = e => {
    e.preventDefault();
  };

  render() {
    return (
      <Host class={`size-${configStore.state.viewPortSize}`}>
        <div class="main-contain">
          {['sm', 'md'].includes(configStore.state.viewPortSize) ? (
            <div class="main-block main-block--header">
              <div class="search-home-hpc">
                <form onSubmit={this.onSubmit}>
                  <input class="search-input" placeholder="Find Healthcare Professional" onFocus={this.onSearch} />
                  <onekey-sdk-button primary icon="search" onClick={this.onSearch} class="search-address-btn" />
                </form>
              </div>
            </div>
          ) : (
            <onekey-sdk-search searchText="Search" />
          )}

          <div class="main-block">
            <div class="home">
              <div class="header">
                <span class="title">Find and Locate</span>
                <span class="title">Healthcare Professional</span>
              </div>

              <div class="content">
                <div class="item">
                  <div class="item__icon">
                    <onekey-sdk-icon name="search" />
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
        </div>
      </Host>
    );
  }
}
