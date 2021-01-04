import { Component, Host, h, Prop, Method, Element } from '@stencil/core';
import merge from 'lodash.merge';
import debounce from 'lodash.debounce';
import { applyDefaultTheme } from 'onekey-sdk-web-ui/src/utils/helper';
import ResizeObserver from 'resize-observer-polyfill';
import { configStore, uiStore, searchMapStore, routerStore } from '../../../core/stores';
import { OneKeySDKConfigData } from '../../../core/stores/ConfigStore';
import { ROUTER_PATH } from '../../onekey-sdk-router/constants';
import { NEAR_ME_ITEM } from '../../../core/constants';
import { searchLocationWithParams } from '../../../core/api/hcp';
import { getI18nLabels, t } from '../../../utils/i18n';
import { HTMLStencilElement } from '@stencil/core/internal';

const defaults = {
  homeMode: 'min',
};
@Component({
  tag: 'onekey-sdk',
  styleUrl: 'onekey-sdk.scss',
  shadow: true,
})
export class OneKeySDK {
  @Element() el: HTMLStencilElement;
  @Prop() config: OneKeySDKConfigData;

  parentEl;

  @Method()
  updateConfig(patch: any) {
    configStore.setState(merge({}, this.config, patch));
    return Promise.resolve(configStore.state);
  }

  @Method()
  searchNearMe({ specialtyCode, specialtyLabel }) {
    searchMapStore.setSearchFieldValue('address', t('near_me'));
    searchMapStore.setSearchFieldValue('name', specialtyLabel);
    searchMapStore.setState({
      locationFilter: NEAR_ME_ITEM,
      specialtyFilter: { id: specialtyCode },
    });
    if (routerStore.state.currentRoutePath !== ROUTER_PATH.SEARCH_RESULT) {
      routerStore.push('/search-result');
    } else {
      searchLocationWithParams();
    }
  }

  async componentWillLoad() {
    const closestElement = this.el.closest('[lang]') as HTMLElement;
    const lang = closestElement ? closestElement.lang : 'en';

    if (closestElement) {
      this.observeChangeLang(closestElement);
    }

    await getI18nLabels(lang);

    applyDefaultTheme();
    configStore.setState(merge({}, defaults, this.config));

    const parent = this.el.parentElement;
    parent.style.padding = '0';
    // add a position (if not defined) to parent element in order to stretch
    // the sdk wrapper dimensions using absolute position
    if (getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative';
    }

    this.parentEl = parent;

    const update = debounce(this.updateParentDims.bind(this), 100);

    update();

    const ro = new ResizeObserver(update);

    ro.observe(parent);

    // Search near me entry
    if (this.config && this.config.entry && this.config.entry.screenName === 'nearMe') {
      const { specialtyCode, specialtyLabel } = this.config.entry;
      if (!specialtyCode) {
        console.error('missing specialtyCode for "near me" search');
        return;
      }
      if (!specialtyLabel) {
        console.error('missing specialtyLabel for "near me" search');
        return;
      }
      this.searchNearMe({ specialtyCode, specialtyLabel });
    }
  }

  observeChangeLang(targetElement: Element) {
    const observer = new MutationObserver(mutationsList => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
          const lang = targetElement.getAttribute('lang');
          getI18nLabels(lang);
        }
      }
    });
    observer.observe(targetElement, { attributes: true, childList: false, subtree: false });
  }

  updateParentDims() {
    uiStore.setParentDims(this.parentEl.getBoundingClientRect());
  }

  render() {
    const { screenSize, orientation } = uiStore.state.breakpoint;
    if (screenSize === 'unknown') {
      return null;
    }
    return (
      <Host>
        <div class={`wrapper size-${screenSize} orientation-${orientation}`}>
          <onekey-sdk-router>
            <onekey-sdk-route component="onekey-sdk-home" path={ROUTER_PATH.MAIN} />
            <onekey-sdk-route component="onekey-sdk-search-result" path={ROUTER_PATH.SEARCH_RESULT} />
            <onekey-sdk-route component="onekey-sdk-search" path={ROUTER_PATH.SEARCH} />
          </onekey-sdk-router>
          <onekey-sdk-modal modal={configStore.state.modal} />
        </div>
      </Host>
    );
  }
}
