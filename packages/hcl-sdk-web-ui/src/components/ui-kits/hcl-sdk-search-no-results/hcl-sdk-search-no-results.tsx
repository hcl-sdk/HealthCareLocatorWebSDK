import { Component, Host, h } from '@stencil/core';
import { uiStore, routerStore } from 'hcl-sdk-web-ui/src/core/stores';
import { ROUTER_PATH } from '../../hcl-sdk-router/constants';
import { t } from '../../../utils/i18n';

@Component({
  tag: 'hcl-sdk-search-no-results',
  styleUrl: 'hcl-sdk-search-no-results.scss',
  shadow: false,
})
export class HclSdkSearchNoResults {

  goSearch() {
    routerStore.push(ROUTER_PATH.MAIN);
  }

  render() {

    return (
      <Host class={`size-${uiStore.state.breakpoint.screenSize} hclsdk-search-no-results`}>
        <h3 class="hclsdk-search-no-results__title">{t('search_no_results_title')}</h3>
        <div class="hclsdk-search-no-results__icon">
          <hcl-sdk-icon name="search" width={22} height={22} />
        </div>
        <p class="hclsdk-search-no-results__desc">{t('search_no_results_label')}</p>
        <hcl-sdk-button 
          isFull 
          primary 
          onClick={this.goSearch} 
          class="hclsdk-search-no-results__btn"
        >
          {t('start_new_search')}
        </hcl-sdk-button>
      </Host>
    );
  }
}
