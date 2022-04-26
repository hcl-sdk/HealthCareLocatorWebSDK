import { Component, Host, h, Method, Element, State, Prop } from '@stencil/core';
import merge from 'lodash.merge';
import debounce from 'lodash.debounce';
import { applyDefaultTheme, getCurrentPosition as defaultGetCurrentPosition } from '../../../utils/helper';
import ResizeObserver from 'resize-observer-polyfill';
import { configStore, uiStore, searchMapStore, routerStore, i18nStore } from '../../../core/stores';
import { HclSDKConfigData, MapProvider, ModeViewType } from '../../../core/stores/ConfigStore';
import { ROUTER_PATH } from '../../hcl-sdk-router/constants';
import { BREAKPOINT_MAX_WIDTH, COUNTRIES_LABELS, CountryCode, NEAR_ME_ITEM } from '../../../core/constants';
import { searchLocationWithParams } from '../../../core/api/hcp';
import { getI18nLabels, t } from '../../../utils/i18n';
import { HTMLStencilElement, Watch } from '@stencil/core/internal';
import { GEOLOC } from '../../../core/constants';
import { graphql } from '../../../../../hcl-sdk-core';
import { dateUtils } from '../../../utils/dateUtils';
import { OKSDK_GEOLOCATION_HISTORY, storageUtils } from '../../../utils/storageUtils';
import { getAddressFromGeo } from '../../../core/api/searchGeo';
import cls from 'classnames'
import { GeolocCoordinates, InitScreen, WidgetProps, WidgetType } from '../../../core/types';

const defaults = {
  apiKey: '',
  isShowcase: false,
  disableCollectGeo: false,
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
  @Prop() widget?: WidgetType
  @Prop() widgetProps?: WidgetProps
  @Prop() initScreen?: InitScreen
  @Prop() currentPosition: {
    lat: number;
    lng: number;
  }

  @Watch('currentPosition')
  userPositionChangeHandler(newProps) {
    if (this.widget) return;
    const { lat, lng } = newProps

    getAddressFromGeo(lat, lng).then(res => {
      if (res?.address?.country_code) {
        configStore.setState({
          countryGeo: res.address.country_code,
        });

        if (configStore && configStore.state.entry && configStore.state.entry.screenName === 'searchNearMe') {
          const { specialtyCode, specialtyLabel } = configStore.state.entry;
          if (!specialtyCode) {
            console.error('missing specialtyCode for "near me" search');
            return;
          }
          this.searchNearMe({ specialtyCode, specialtyLabel });
        }
      }
    });

    searchMapStore.setGeoLocation({ latitude: lat, longitude: lng });
  }

  parentEl;

  componentWillLoad() {
    if (this.initScreen === 'search') {
      this.loadInitScreenSearch()
    }
  }

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
    if (this.widget) return
    
    searchMapStore.setSearchFieldValue('address', t('near_me'));
    searchMapStore.setSearchFieldValue('specialtyName', specialtyLabel);

    searchMapStore.setState({
      locationFilter: NEAR_ME_ITEM,
      specialties: [],
      specialtiesRaw: [],
      loadingActivitiesStatus: 'loading',
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

    if (config && config.entry && config.entry.screenName === 'searchNearMe') {
      this.loadInitScreenSearch() // Change the route to search immediately to avoid a flash screen
    }

    const mapConfig = this.getMapConfig(config);
    const initConfig = merge({}, defaults, config, { map: mapConfig });

    const premadeGetCurrentPosition = success => {
      success({
        latitude: this.currentPosition.lat,
        longitude: this.currentPosition.lng
      });
    };

    this.loadCurrentPosition({
      isShowcase,
      getCurrentPosition: this.currentPosition ? premadeGetCurrentPosition : getCurrentPosition,
      disableCollectGeo: config.disableCollectGeo,
    });

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
      setTimeout(() => {
        this.searchNearMe({ specialtyCode, specialtyLabel });
      }, 200)
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
        provider: MapProvider.OPEN_STREETMAP,
        enableLeafletAttribution: configInput.enableLeafletAttribution
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

  tryFindGeoloc({ getCurrentPosition = undefined, disableCollectGeo = false } = {}) {
    function handler(coords: GeolocCoordinates) {
      
      getAddressFromGeo(coords.latitude, coords.longitude)
        .then(res => {
          if (res?.address?.country_code) {
            configStore.setState({
              countryGeo: res.address.country_code
            })
          }
        });

      searchMapStore.setGeoLocation(coords);
    }

    if (getCurrentPosition) {
      getCurrentPosition(handler, (err) => {
        console.error(err || '[Geolocation] getCurrentPosition was error')
      })
    } else if (!disableCollectGeo) {
      defaultGetCurrentPosition(handler, this.retryFindGeoloc)
    }
  }

  findCurrentPosition({ getCurrentPosition, disableCollectGeo }: any) {
    if (!getCurrentPosition && !navigator.geolocation) {
      console.error('[Geolocation] is not supported by your browse');
    } 
    
    if (getCurrentPosition || navigator.geolocation) {
      this.tryFindGeoloc({ getCurrentPosition, disableCollectGeo });
    }
  }

  loadCurrentPosition({ isShowcase, getCurrentPosition, disableCollectGeo }) {
    if (isShowcase) {
      // Canada - Toronto Geolocation
      searchMapStore.setGeoLocation({
        latitude: 43.6534817,
        longitude: -79.3839347
      });
      return;
    }

    const dataGeolocation = storageUtils.getObject(OKSDK_GEOLOCATION_HISTORY);
    if (dataGeolocation && !disableCollectGeo) {
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

    if (disableCollectGeo) {
      storageUtils.remove(OKSDK_GEOLOCATION_HISTORY);
    }

    this.findCurrentPosition({ getCurrentPosition, disableCollectGeo });
  }

  loadInitScreenSearch() {
    routerStore.push(ROUTER_PATH.SEARCH_RESULT)
    searchMapStore.setState({
      navigatedFromHome: true,
      loadingActivitiesStatus: searchMapStore.state.specialties.length === 0 ? 'loading' : 'idle'
    })
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
        const countries = (res.mySubscriptionKey.countries as CountryCode[])
          .filter((code, idx, array) => COUNTRIES_LABELS[code] && array.indexOf(code) === idx) 
          .sort((codeA: CountryCode, codeB: CountryCode) => {
            return COUNTRIES_LABELS[codeA].localeCompare(COUNTRIES_LABELS[codeB])
          })
          // Remove code does not exist and duplicate element
          //   and sort by country label

        configStore.setState({
          countriesSubscriptionKey: countries // ["FR", "US"]
        })
      })
      .catch(() => {}) // To avoid crash the app
  }

  renderWidgets() {
    if (this.widget === 'map') {
      return <hcl-sdk-widget-map widgetProps={this.widgetProps} />
    }

    return null
  }

  render() {
    const { screenSize, orientation, screenWidth } = uiStore.state.breakpoint;
    if (screenSize === 'unknown' || this.loading) {
      return null;
    }

    const classesDark = cls({
      'sdk-dark-mode': configStore.state.enableDarkMode,
      'sdk-map-dark-mode': configStore.state.enableMapDarkMode,
    })
    const classes = cls(`wrapper size-${screenSize} orientation-${orientation}`, classesDark, {
      'show-medical-term': configStore.state.enableMedicalTerm,
      'size-tablet-xs': screenWidth > BREAKPOINT_MAX_WIDTH.MOBILE_PORTRAIT && screenWidth < BREAKPOINT_MAX_WIDTH.TABLET_PORTRAIT,
      'size-desktop-sm': screenWidth >= BREAKPOINT_MAX_WIDTH.TABLET_PORTRAIT && screenWidth < BREAKPOINT_MAX_WIDTH.DESKTOP_SMALL
    })

    return (
      <Host>
        {configStore.state.stylesheet ? (
          <link rel="stylesheet" href={configStore.state.stylesheet} />
        ) : null}
        
        { this.widget 
          ? <div class={classesDark}>{ this.renderWidgets() }</div>
          : (
            <div class={classes}>
              <hcl-sdk-router>
                <hcl-sdk-route component="hcl-sdk-home" path={ROUTER_PATH.MAIN} />
                <hcl-sdk-route component="hcl-sdk-search-result" path={ROUTER_PATH.SEARCH_RESULT} />
                <hcl-sdk-route component="hcl-sdk-search" path={ROUTER_PATH.SEARCH} />
              </hcl-sdk-router>
              <hcl-sdk-modal modal={configStore.state.modal} />
            </div>
          )   }
      </Host>
    );
  }
}