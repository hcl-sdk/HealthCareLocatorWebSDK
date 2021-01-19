import { Component, Host, h } from '@stencil/core';
import { uiStore, routerStore } from 'onekey-sdk-web-ui/src/core/stores';
import { ROUTER_PATH } from '../../onekey-sdk-router/constants';
import { t } from '../../../utils/i18n';

@Component({
  tag: 'onekey-sdk-search-no-results',
  styleUrl: 'onekey-sdk-search-no-results.scss',
  shadow: false,
})
export class OnekeySdkSearchNoResults {

  goSearch() {
    routerStore.push(ROUTER_PATH.MAIN);
  }

  render() {

    return (
      <Host class={`size-${uiStore.state.breakpoint.screenSize} oksdk-search-no-results`}>
        <h3 class="oksdk-search-no-results__title">{t('search_no_results_title')}</h3>
        <div class="oksdk-search-no-results__icon">
          <onekey-sdk-icon name="search" width={22} height={22} />
        </div>
        <p class="oksdk-search-no-results__desc">{t('search_no_results_label')}</p>
        <onekey-sdk-button 
          isFull 
          primary 
          onClick={this.goSearch} 
          class="oksdk-search-no-results__btn"
        >
          {t('start_new_search')}
        </onekey-sdk-button>
      </Host>
    );
  }
}
