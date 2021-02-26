import { Component, Host, h, Method, Element, State } from '@stencil/core';
import merge from 'lodash.merge';
import debounce from 'lodash.debounce';
import { applyDefaultTheme } from 'hcl-sdk-web-ui/src/utils/helper';
import ResizeObserver from 'resize-observer-polyfill';
import { configStore, uiStore, searchMapStore, routerStore, i18nStore } from '../../../core/stores';
import { ModeViewType } from '../../../core/stores/ConfigStore';
import { ROUTER_PATH } from '../../hcl-sdk-router/constants';
import { NEAR_ME_ITEM } from '../../../core/constants';
import { searchLocationWithParams } from '../../../core/api/hcp';
import { getI18nLabels, t } from '../../../utils/i18n';
import { HTMLStencilElement } from '@stencil/core/internal';
import { GEOLOC } from '../../../core/constants';
import { graphql } from 'hcl-sdk-core';
import { dateUtils } from '../../../utils/dateUtils';
import { OKSDK_GEOLOCATION_HISTORY, storageUtils } from '../../../utils/storageUtils';

const defaults = {
  apiKey: '',
  i18nBundlesPath: '/i18n',
};
@Component({
  tag: 'hcl-sdk',
  styleUrl: 'hcl-sdk.scss',
  shadow: true,
})
export class HclSDK {
  @Element() el: HTMLStencilElement;
  @State() retriesCounter: number = 0;
  @State() loading = false;

  parentEl;

  @Method()
  updateConfig(patch: any) {
    configStore.setState(merge({}, configStore.state, patch));
    return Promise.resolve(configStore.state);
  }

  @Method()
  async searchNearMe({ specialtyCode }) {
    this.loading = true;

    let specialtyLabel = specialtyCode;
    try {
      const res = await graphql.labelsByCode({ first: 1, criteria: specialtyCode, codeTypes: ['SP'], country: 'ca', locale: i18nStore.state.lang }, configStore.configGraphql);
      if (res.labelsByCode && res.labelsByCode.codes && res.labelsByCode.codes.length > 0) {
        specialtyLabel = res.labelsByCode.codes[0].longLbl;
      }
    } catch (err) {}

    this.loading = false;

    searchMapStore.setSearchFieldValue('address', t('near_me'));
    searchMapStore.setSearchFieldValue('name', specialtyLabel);
    searchMapStore.setState({
      locationFilter: NEAR_ME_ITEM,
      specialtyFilter: { id: specialtyCode },
    });
    configStore.setState({
      modeView: ModeViewType.MAP,
    });
    if (routerStore.state.currentRoutePath !== ROUTER_PATH.SEARCH_RESULT) {
      routerStore.push('/search-result');
    } else {
      searchLocationWithParams();
    }
  }

  @Method()
  async init(config: any = {}) {
    if (config.apiKey === undefined) {
      throw new Error('Please provide an apiKey to the configuration object.');
    }

    this.loadCurrentPosition();

    configStore.setState(merge({}, defaults, config));

    const closestElement = this.el.closest('[lang]') as HTMLElement;
    const lang = closestElement ? closestElement.lang : i18nStore.state.lang;

    if (closestElement) {
      this.observeChangeLang(closestElement);
    }

    await getI18nLabels(lang);

    applyDefaultTheme();

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
    if (config && config.entry && config.entry.screenName === 'searchNearMe') {
      const { specialtyCode } = config.entry;
      if (!specialtyCode) {
        console.error('missing specialtyCode for "near me" search');
        return;
      }
      this.searchNearMe({ specialtyCode });
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

  retryFindGeoloc = err => {
    if (err.code === GEOLOC.TIMEOUT_CODE && this.retriesCounter < GEOLOC.MAX_TRIES) {
      this.retriesCounter = this.retriesCounter + 1;
      this.tryFindGeoloc();
    }
  };

  tryFindGeoloc() {
    navigator.geolocation.getCurrentPosition(
      data => {
        const {
          coords, //: { longitude, latitude }
        } = data;

        searchMapStore.setGeoLocation(coords);
      },
      this.retryFindGeoloc,
      {
        maximumAge: GEOLOC.MAXAGE,
        timeout: GEOLOC.TIMEOUT,
      },
    );
  }

  findCurrentPosition() {
    if (!navigator.geolocation) {
      console.error('[Geolocation] is not supported by your browse');
    } else {
      this.tryFindGeoloc();
    }
  }

  loadCurrentPosition() {
    const dataGeolocation = storageUtils.getObject(OKSDK_GEOLOCATION_HISTORY);
    if (dataGeolocation) {
      const time = Number(dataGeolocation.time);
      if (dateUtils(time).diffMinuteFromNow() < GEOLOC.MINUTE_HISTORY) {
        const { latitude, longitude } = dataGeolocation;
        searchMapStore.setGeoLocation({ latitude, longitude });
      } else {
        storageUtils.remove(OKSDK_GEOLOCATION_HISTORY);
      }
    }

    this.findCurrentPosition();
  }

  render() {
    const { screenSize, orientation } = uiStore.state.breakpoint;
    if (screenSize === 'unknown' || this.loading) {
      return null;
    }

    return (
      <Host>
        <div class={`wrapper size-${screenSize} orientation-${orientation}`}>
          <hcl-sdk-router>
            <hcl-sdk-route component="hcl-sdk-home" path={ROUTER_PATH.MAIN} />
            <hcl-sdk-route component="hcl-sdk-search-result" path={ROUTER_PATH.SEARCH_RESULT} />
            <hcl-sdk-route component="hcl-sdk-search" path={ROUTER_PATH.SEARCH} />
          </hcl-sdk-router>
          <hcl-sdk-modal modal={configStore.state.modal} />
        </div>
      </Host>
    );
  }
}
