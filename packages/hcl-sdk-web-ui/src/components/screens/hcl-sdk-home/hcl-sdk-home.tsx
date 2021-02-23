import { Component, h, Host, Listen } from '@stencil/core';
import { routerStore, searchMapStore, uiStore, historyStore, configStore } from '../../../core/stores';
import { ModeViewType } from '../../../core/stores/ConfigStore';
import { t } from '../../../utils/i18n';
@Component({
  tag: 'hcl-sdk-home',
  styleUrl: 'hcl-sdk-home.scss',
  shadow: false,
})
export class HclSdkHome {
  @Listen('goSearchScreen')
  goSearchScreen() {
    routerStore.push('/search');
  }

  async componentWillLoad() {
    configStore.setState({
      modeView: ModeViewType.LIST
    })
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
      return <hcl-sdk-search searchText={t('search')} />;
    }

    return (
      <div class="header-block">
        <div class="search-home-hpc">
          <form onSubmit={this.onSubmit}>
            <input class="search-input" placeholder={t('find_healthcare_professional')} onFocus={this.onSearch} />
            <hcl-sdk-button primary icon="search" onClick={this.onSearch} class="hclsdk-btn-search-address" />
          </form>
        </div>
      </div>
    );
  }

  render() {
    const { searchItems, hcpItems } = historyStore.state;
    const displayHomeMin = !searchMapStore.isGrantedGeoloc && !searchItems.length && !hcpItems.length;
    return (
      <Host>
        <div class="main-contain">
          {this.renderHeader()}
          <div class="body-block">
            {
              displayHomeMin
                ? <hcl-sdk-home-min />
                : <hcl-sdk-home-full />
            }
          </div>
        </div>
      </Host>
    );
  }
}
