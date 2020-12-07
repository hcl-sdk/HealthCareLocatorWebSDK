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
    console.log(configStore.state.homeMode)
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

          {configStore.state.homeMode === 'min' && <onekey-sdk-home-min onGoSearchScreen={this.onGoSearchScreen} />}
          {configStore.state.homeMode === 'full' && <onekey-sdk-home-full onGoSearchScreen={this.onGoSearchScreen} />}
        </div>
      </Host>
    );
  }
}
