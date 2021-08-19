import { Component, Host, h } from '@stencil/core';
import { uiStore, routerStore } from '../../../core/stores';
import { ROUTER_PATH } from '../../hcl-sdk-router/constants';
// import { t } from '../../../utils/i18n';

@Component({
  tag: 'hcl-sdk-search-no-data-available',
  styleUrl: 'hcl-sdk-search-no-data-available.scss',
  shadow: false,
})
export class HclSdkSearchNoDataAvailable {

  goBack() {
    routerStore.push(ROUTER_PATH.MAIN);
  }

  render() {

    return (
      <Host class={`size-${uiStore.state.breakpoint.screenSize} hclsdk-search-no-data-available`}>
        <button class="hclsdk-search-no-data-available__back" onClick={this.goBack} >
          <hcl-sdk-icon name="arrow" width={24} height={24} />
        </button>
        <h3 class="hclsdk-search-no-data-available__title">No Data available</h3>
        <div class="hclsdk-search-no-data-available__icon">
          <hcl-sdk-icon name="no-accounts" width={70} height={70} />
        </div>
        <p class="hclsdk-search-no-data-available__sub-title">We're sorry!</p>
        <p class="hclsdk-search-no-data-available__desc">Data is temporarily not available for this application.</p>
        <p class="hclsdk-search-no-data-available__desc second">Please contact your Client Support provider for assistance.</p>
      </Host>
    );
  }
}
