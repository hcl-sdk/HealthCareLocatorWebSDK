import { Component, Host, h, Method, Element, State } from '@stencil/core';
import merge from 'lodash.merge';
import debounce from 'lodash.debounce';
import { applyDefaultTheme, getCurrentPosition as defaultGetCurrentPosition } from '../../../utils/helper';
import ResizeObserver from 'resize-observer-polyfill';
import { configStore, uiStore, searchMapStore, routerStore, i18nStore } from '../../../core/stores';
import { HclSDKConfigData, MapProvider, ModeViewType } from '../../../core/stores/ConfigStore';
import { ROUTER_PATH } from '../../hcl-sdk-router/constants';
import { BREAKPOINT_MAX_WIDTH, CountryCode, NEAR_ME_ITEM } from '../../../core/constants';
import { searchLocationWithParams } from '../../../core/api/hcp';
import { getI18nLabels, t } from '../../../utils/i18n';
import { HTMLStencilElement } from '@stencil/core/internal';
import { GEOLOC } from '../../../core/constants';
import { graphql } from '../../../../../hcl-sdk-core';
import { dateUtils } from '../../../utils/dateUtils';
import { OKSDK_GEOLOCATION_HISTORY, storageUtils } from '../../../utils/storageUtils';
import { getAddressFromGeo } from '../../../core/api/searchGeo';
import cls from 'classnames'
import { GeolocCoordinates } from '../../../core/types';

const defaults = {
  apiKey: '',
  isShowcase: false,
  i18nBundlesPath: process.env.DEFAULT_I18N_BUNDLE_PATH,
};
@Component({
  tag: 'hcl-sdk',
  styleUrl: 'hcl-sdk.scss',
  shadow: true,
})
export class HclSDK {
  @Element() el: HTMLStencilElement;
  @State() retriesCounter: number = 0;
  @State() loading = true;

  parentEl;

  @Method()
  updateConfig(patch: any): Promise<HclSDKConfigData> {
    const mapConfig = this.getMapConfig({ ...configStore.state, ...patch});
    configStore.setState(merge({}, configStore.state, patch, { map: mapConfig }));
    return Promise.resolve(configStore.state);
  }

  @Method()
  backToHome() {
    routerStore.push('/');
  }

  @Method()
  async searchNearMe({ specialtyCode, specialtyLabel }: { specialtyCode: string[], specialtyLabel: string }) {
    searchMapStore.setSearchFieldValue('address', t('near_me'));
    searchMapStore.setSearchFieldValue('specialtyName', specialtyLabel);

    searchMapStore.setState({
      locationFilter: NEAR_ME_ITEM,
      specialties: [],
      specialtiesRaw: [],
      specialtyFilter: specialtyCode.map(code => ({ id: code, name: specialtyLabel })),
    });
    configStore.setState({
      modeView: ModeViewType.MAP,
      modal: undefined
    });
    if (routerStore.state.currentRoutePath !== ROUTER_PATH.SEARCH_RESULT) {
      routerStore.push('/search-result');
    } else {
      searchLocationWithParams();
    }
  }

  @Method()
  async init({ isShowcase, getCurrentPosition, ...config }: any = {}) {
    if (config.apiKey === undefined) {
      throw new Error('Please provide an apiKey to the configuration object.');
    }

    const mapConfig = this.getMapConfig(config);
    const initConfig = merge({}, defaults, config, { map: mapConfig });
    this.loadCurrentPosition({ isShowcase, getCurrentPosition });

    configStore.setState(initConfig);

    const lang = (() => {
      if (config.locale) {
        return config.locale;
      }

      const closestElement = this.el.closest('[lang]') as HTMLElement;
      const _lang = closestElement ? closestElement.lang : i18nStore.state.lang
      if (closestElement) {
        this.observeChangeLang(closestElement);
      }
      return _lang;
    })();

    await Promise.all([
      getI18nLabels(lang),
      this.loadCountriesFromMyKey(initConfig)
    ])

    applyDefaultTheme(configStore.state.enableDarkMode);

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
      const { specialtyCode, specialtyLabel } = config.entry;
      if (!specialtyCode) {
        console.error('missing specialtyCode for "near me" search');
        return;
      }
      this.searchNearMe({ specialtyCode, specialtyLabel });
    }

    this.loading = false
  }

  private getMapConfig(configInput) {
    if (configInput.useGoogleMap) {
      if (!configInput.googleMapApiKey) {
        throw new Error('Please provide Google Map API key')
      }

      return {
        provider : MapProvider.GOOGLE_MAP,
        googleMapApiKey: configInput.googleMapApiKey,
      }
    } else {
      return {
        provider: MapProvider.OPEN_STREETMAP
      }
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

  tryFindGeoloc({ getCurrentPosition = undefined } = {}) {
    function handler(coords: GeolocCoordinates) {
      const prevCoords = {
        latitude: searchMapStore.state.geoLocation.latitude,
        longitude: searchMapStore.state.geoLocation.longitude
      }
      
      getAddressFromGeo(coords.latitude, coords.longitude)
        .then(res => {
          if (res?.address?.country_code) {
            configStore.setState({
              countryGeo: res.address.country_code
            })
          }

          if (
            getCurrentPosition && 
            coords.latitude !== prevCoords.latitude &&
            coords.longitude !== prevCoords.longitude &&
            routerStore.state.currentRoutePath === ROUTER_PATH.MAIN
          ) {
            searchLocationWithParams(true)
          }
        });

      searchMapStore.setGeoLocation(coords);
    }

    if (getCurrentPosition) {
      getCurrentPosition(handler, (err) => {
        console.error(err || '[Geolocation] getCurrentPosition was error')
      })
    } else {
      defaultGetCurrentPosition(handler, this.retryFindGeoloc)
    }
  }

  findCurrentPosition({ getCurrentPosition }: any) {
    if (!getCurrentPosition && !navigator.geolocation) {
      console.error('[Geolocation] is not supported by your browse');
    } 
    
    if (getCurrentPosition || navigator.geolocation) {
      this.tryFindGeoloc({ getCurrentPosition });
    }
  }

  loadCurrentPosition({ isShowcase, getCurrentPosition }) {
    if (isShowcase) {
      // Canada - Toronto Geolocation
      searchMapStore.setGeoLocation({
        latitude: 43.6534817,
        longitude: -79.3839347
      });
      return;
    }

    const dataGeolocation = storageUtils.getObject(OKSDK_GEOLOCATION_HISTORY);
    if (dataGeolocation) {
      const time = Number(dataGeolocation.time);
      if (dateUtils(time).diffMinuteFromNow() < GEOLOC.MINUTE_HISTORY) {
        const { latitude, longitude } = dataGeolocation;
        getAddressFromGeo(latitude, longitude)
          .then(res => {
            if (res?.address?.country_code) {
              configStore.setState({
                countryGeo: res.address.country_code
              })
            }
          });
        searchMapStore.setGeoLocation({ latitude, longitude });
      } else {
        storageUtils.remove(OKSDK_GEOLOCATION_HISTORY);
      }
    }

    this.findCurrentPosition({ getCurrentPosition });
  }

  async loadCountriesFromMyKey({ apiKey }) {
    return graphql.mySubscriptionKey({
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey
      }
    })
      .then(res => {
        if (!res.mySubscriptionKey?.countries) {
          return;
        }
        configStore.setState({
          countriesSubscriptionKey: res.mySubscriptionKey.countries as CountryCode[] // ["FR", "US"]
        })
      })
      .catch(() => {}) // To avoid crash the app
  }

  render() {
    const { screenSize, orientation, screenWidth } = uiStore.state.breakpoint;
    if (screenSize === 'unknown' || this.loading) {
      return null;
    }

    return (
      <Host>
        {configStore.state.stylesheet ? (
          <link rel="stylesheet" href={configStore.state.stylesheet} />
        ) : null}
        <div class={cls(`wrapper size-${screenSize} orientation-${orientation}`, {
          'sdk-dark-mode': configStore.state.enableDarkMode,
          'sdk-map-dark-mode': configStore.state.enableMapDarkMode,
          'show-medical-term': configStore.state.enableMedicalTerm,
          'size-tablet-xs': screenWidth > BREAKPOINT_MAX_WIDTH.MOBILE_PORTRAIT && screenWidth < BREAKPOINT_MAX_WIDTH.TABLET_PORTRAIT,
          'size-desktop-sm': screenWidth >= BREAKPOINT_MAX_WIDTH.TABLET_PORTRAIT && screenWidth < BREAKPOINT_MAX_WIDTH.DESKTOP_SMALL
        })}>
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
