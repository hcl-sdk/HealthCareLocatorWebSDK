import { Component, Host, h, Method, Element, State } from '@stencil/core';
import merge from 'lodash.merge';
import debounce from 'lodash.debounce';
import { applyDefaultTheme } from '../../../utils/helper';
import ResizeObserver from 'resize-observer-polyfill';
import { configStore, uiStore, searchMapStore, routerStore, i18nStore } from '../../../core/stores';
import { HclSDKConfigData, MapProvider, ModeViewType } from '../../../core/stores/ConfigStore';
import { ROUTER_PATH } from '../../hcl-sdk-router/constants';
import { BREAKPOINT_MAX_WIDTH, COUNTRY_CODES, NEAR_ME_ITEM } from '../../../core/constants';
import { searchLocationWithParams } from '../../../core/api/hcp';
import { getI18nLabels, t } from '../../../utils/i18n';
import { HTMLStencilElement } from '@stencil/core/internal';
import { GEOLOC } from '../../../core/constants';
import { graphql } from '../../../../../hcl-sdk-core';
import { dateUtils } from '../../../utils/dateUtils';
import { OKSDK_GEOLOCATION_HISTORY, storageUtils } from '../../../utils/storageUtils';
import { getAddressFromGeo } from '../../../core/api/searchGeo';
import cls from 'classnames'
import { LabelsByCodeResult } from '../../../../../hcl-sdk-core/src/graphql/labelsByCode';
import { SpecialtyItem } from '../../../core/stores/SearchMapStore';

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
  @State() loading = false;

  parentEl;

  @Method()
  updateConfig(patch: any): Promise<HclSDKConfigData> {
    const mapConfig = this.getMapConfig(patch);
    configStore.setState(merge({}, configStore.state, patch, { map: mapConfig }));
    return Promise.resolve(configStore.state);
  }

  @Method()
  backToHome() {
    routerStore.push('/');
  }

  @Method()
  async searchNearMe({ specialtyCode }) {
    this.loading = true;

    let specialtyLabel: string[] = []
    let specialtyFilter: SpecialtyItem[] = []
    try {
      const arrPromise: Promise<LabelsByCodeResult>[] = specialtyCode.split(',')
        .map((spCode: string) => (
          graphql.labelsByCode({ 
            first: 1, 
            criteria: spCode.trim(), 
            codeTypes: ['SP'], 
            country: configStore.countryGraphqlQuery,
            locale: i18nStore.state.lang 
          }, configStore.configGraphql)
        ))
      const arrRes = await Promise.all(arrPromise)

      arrRes.forEach(res => {
        const code = res?.labelsByCode?.codes?.[0]
        if (code) {
          specialtyLabel = [...specialtyLabel, code.longLbl]
          specialtyFilter = [...specialtyFilter, { 
            id: code.id, name: code.longLbl
          }]
        }
      })
    } catch (err) { }

    this.loading = false;

    searchMapStore.setSearchFieldValue('address', t('near_me'));
    searchMapStore.setSearchFieldValue('name', specialtyLabel.length ? specialtyLabel.join(', ') : specialtyCode);

    searchMapStore.setState({
      locationFilter: NEAR_ME_ITEM,
      specialties: [],
      specialtiesRaw: [],
      specialtyFilter: specialtyFilter,
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
  async init(config: any = {}) {
    if (config.apiKey === undefined) {
      throw new Error('Please provide an apiKey to the configuration object.');
    }

    const mapConfig = this.getMapConfig(config);
    const initConfig = merge({}, defaults, config, { map: mapConfig });
    this.loadCurrentPosition(initConfig);

    initConfig.countries = initConfig.countries ? initConfig.countries : configStore.state.countries;
    initConfig.countries = initConfig.countries.filter(countryCode => {
      if (COUNTRY_CODES.includes((countryCode).toUpperCase())) {
        return true;
      }
      console.error(`Country code [${countryCode}] invalid!`)
      return false;
    })
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

  tryFindGeoloc() {
    navigator.geolocation.getCurrentPosition(
      data => {
        const {
          coords, //: { longitude, latitude }
        } = data;
        getAddressFromGeo(coords.latitude, coords.longitude)
          .then(res => {
            if (res?.address?.country_code) {
              configStore.setState({
                countryGeo: res.address.country_code
              })
            }
          });
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

  loadCurrentPosition({ isShowcase }) {
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
        searchMapStore.setGeoLocation({ latitude, longitude });
      } else {
        storageUtils.remove(OKSDK_GEOLOCATION_HISTORY);
      }
    }

    this.findCurrentPosition();
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
          countriesSubscriptionKey: res.mySubscriptionKey.countries.map(s => s.toLowerCase())
        })
      })
  }

  render() {
    const { screenSize, orientation, screenWidth } = uiStore.state.breakpoint;
    if (screenSize === 'unknown' || this.loading) {
      return null;
    }

    return (
      <Host>
        <div class={cls(`wrapper size-${screenSize} orientation-${orientation}`, {
          'show-medical-term': configStore.state.enableMedicalTerm,
          'size-desktop-sm': screenWidth > BREAKPOINT_MAX_WIDTH.TABLET_PORTRAIT && screenWidth < BREAKPOINT_MAX_WIDTH.DESKTOP_SMALL
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
