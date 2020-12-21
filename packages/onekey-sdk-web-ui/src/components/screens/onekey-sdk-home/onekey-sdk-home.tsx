import { Component, h, Host, Listen } from '@stencil/core';
import { configStore, routerStore, searchMapStore, uiStore } from '../../../core/stores';
@Component({
  tag: 'onekey-sdk-home',
  styleUrl: 'onekey-sdk-home.scss',
  shadow: false,
})
export class OnekeySdkHome {
  @Listen('goSearchScreen')
  goSearchScreen() {
    routerStore.push('/search');
  }

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

  renderHeader() {
    const { breakpoint } = uiStore.state;

    if (breakpoint.screenSize === 'desktop' || breakpoint.screenSize === 'tablet') {
      return <onekey-sdk-search searchText="Search" />;
    }

    return (
      <div class="header-block">
        <div class="search-home-hpc">
          <form onSubmit={this.onSubmit}>
            <input class="search-input" placeholder="Find Healthcare Professional" onFocus={this.onSearch} />
            <onekey-sdk-button primary icon="search" onClick={this.onSearch} class="btn--icon search-address-btn" />
          </form>
        </div>
      </div>
    );
  }

  render() {
    return (
      <Host>
        <div class="main-contain">
          {this.renderHeader()}
          <div class="body-block">
            {configStore.state.homeMode === 'min' && <onekey-sdk-home-min />}
            {configStore.state.homeMode === 'full' && <onekey-sdk-home-full />}
          </div>
        </div>
      </Host>
    );
  }
}
