import { Component, Host, h, State, Listen, Prop, Element } from '@stencil/core';
import { getFullCardDetail, searchDoctor, searchLocationWithParams } from '../../../core/api/hcp';
import { searchMapStore, routerStore, uiStore, historyStore, configStore } from '../../../core/stores';
import debounce from 'lodash.debounce';
import { searchGeoMap } from '../../../core/api/searchGeo';
import { NEAR_ME, NEAR_ME_ITEM } from '../../../core/constants';
import { ROUTER_PATH } from '../../hcl-sdk-router/constants';
import { HistorySearchItem } from '../../../core/stores/HistoryStore';
import { HTMLStencilElement } from '@stencil/core/internal';
import { t } from '../../../utils/i18n';
import { ModeViewType } from '../../../core/stores/ConfigStore';
import cls from 'classnames';

@Component({
  tag: 'hcl-sdk-search',
  styleUrl: 'hcl-sdk-search.scss',
  shadow: false,
})
export class HclSdkSearch {
  nameInput!: HTMLInputElement;
  addressInput!: HTMLInputElement;
  @Element() el: HTMLStencilElement;
  @State() searchResult = [];
  @State() selectedAddress: any = {};
  @State() selectedDoctor: any = {};
  @State() currentSelectedInput: string;
  @Prop() noIcon: boolean;
  @Prop() searchText: string;
  @Prop() showSwitchMode?: boolean = false;
  wrapperEl: HTMLElement;
  fields = {
    name: null,
    address: null,
  };
  @State()
  fieldsValid = {
    name: true,
    address: true,
  }

  componentWillLoad() {
    this.wrapperEl = this.el.closest('.wrapper');

    if (this.wrapperEl) {
      this.wrapperEl.addEventListener('click', this.clickOutsideHandler)
    }
  }

  disconnectedCallback() {
    if (this.wrapperEl) {
      this.wrapperEl.removeEventListener('click', this.clickOutsideHandler)
    }
  }

  clickOutsideHandler = (evt) => {
    if (uiStore.state.breakpoint.screenSize === 'mobile') {
      return;
    }

    const target = evt.target;
    const findFormItem = target.closest('.hclsdk-search__form--content-item')
    if (!findFormItem && this.currentSelectedInput) {
      this.currentSelectedInput = null;
    }
  }

  private onSearch = async e => {
    e.preventDefault();

    let checkValidName: boolean;
    let checkValidAddress: boolean;
    const { name, address } = e.target;
    const isBasicNearMe = this.checkIsBasicNearMe();

    if (isBasicNearMe) {
      checkValidName = true;
      checkValidAddress = true;
      this.resetErrorElmUI('both');
      configStore.setState({
        modeView: ModeViewType.MAP
      });
    } else {
      if (searchMapStore.state.locationFilter && searchMapStore.state.locationFilter.id === NEAR_ME) {
        configStore.setState({
          modeView: ModeViewType.MAP
        });
      }
      checkValidName = this.checkValidElm(name)
      checkValidAddress = this.checkValidElm(address);
    }

    if (!checkValidName || !checkValidAddress) {
      return;
    }

    if(routerStore.state.currentRoutePath !== ROUTER_PATH.SEARCH_RESULT) {
      routerStore.push(ROUTER_PATH.SEARCH_RESULT);
      if (!searchMapStore.state.locationFilter) {
        searchLocationWithParams()
      }
    } else {
      searchLocationWithParams()
    }
    // store search to history
    const historySearchItem: HistorySearchItem = {
      id: String(Date.now()),
      type: 'search',
      locationFilter: searchMapStore.state.locationFilter,
      specialtyFilter: searchMapStore.state.specialtyFilter,
      searchFields: searchMapStore.state.searchFields,
      timestamp: Date.now()
    }
    historyStore.addItem('search', historySearchItem);
  };

  checkValidElm = elm => {
    if (!elm) {
      return;
    }
    let isValid = this.fieldsValid[elm.name];

    switch (elm.name) {
      case 'name':
        isValid = Boolean(elm.value);
        break;
      case 'address':
        isValid = !elm.value || Boolean(elm.value && searchMapStore.state.locationFilter);
        break;
    }

    this.fieldsValid = {
      ...this.fieldsValid,
      [elm.name]: isValid
    }
    return isValid;
  };

  resetErrorElmUI = (type: 'name' | 'address' | 'both') => {
    if (type === 'both') {
      this.fieldsValid = {
        name: true,
        address: true
      }
    } else {
      this.fieldsValid = {
        ...this.fieldsValid,
        [type]: true
      }
    }
  }

  checkIsBasicNearMe() {
    if (
      !searchMapStore.state.specialtyFilter &&
      searchMapStore.state.locationFilter &&
      searchMapStore.state.locationFilter.id === NEAR_ME
    ) {
      return true;
    }
    return false;
  }

  onChange = debounce(async (name: string, value: string) => {
    const inputName = name;
    const inputValue = value;
    if (inputValue) {
      inputName === 'name'
        ? await searchDoctor({
            criteria: inputValue,
          })
        : await searchGeoMap({
            id: inputValue,
          });
    }
  }, 500)

  handleFieldInput = e => {
    const el = e.target;
    searchMapStore.setSearchFieldValue(el.name, el.value);
    this.checkValidElm(el);
    this.clearFilter(el.name);
    this.onChange(el.name, el.value);
  };

  @Listen('selectAddress')
  onSelectAddress(e) {
    const item = e.detail;
    // "Near Me" special Case
    if (item.id === NEAR_ME) {
      this.resetErrorElmUI('address');
      searchMapStore.setSearchFieldValue('address', t('near_me'));
      searchMapStore.setState({
        locationFilter: item,
      });
      this.currentSelectedInput = null;
      return;
    }
    if (this.currentSelectedInput === 'address') {
      this.resetErrorElmUI('address');
      searchMapStore.setSearchFieldValue('address', item.name);
      searchMapStore.setState({
        locationFilter: item,
      });
    } else {
      if (item.professionalType) {
        searchMapStore.setState({
          selectedActivity: {
            ...item.activity,
            name: item.name,
            lat: item.activity.workplace.address.location.lat,
            lng: item.activity.workplace.address.location.lon
          }
        });
        if (routerStore.state.currentRoutePath !== ROUTER_PATH.SEARCH_RESULT) {
          routerStore.push('/search-result');
        } else {
          getFullCardDetail({
            activityId: item.activity.id,
            activityName: item.name,
          });
        }
      } else {
        // on click Specialty item
        this.resetErrorElmUI('name');
        searchMapStore.setSearchFieldValue('name', item.name);
        searchMapStore.setState({
          specialtyFilter: item,
        });
      }
    }

    this.resetDataResult();
    this.currentSelectedInput = null;
  }

  resetDataResult = () => {
    searchMapStore.setState({
      searchDoctor: []
    });
  };

  renderContent = data => {
    return (
      <div class={`hclsdk-search__dropdown ${this.currentSelectedInput}`}>
        {data && data.map(item => <hcl-sdk-search-address-item item={item} currentSearchText={searchMapStore.state.searchFields.name} />)}
      </div>
    );
  };

  clearFilter = (key: string) => {
    if (key === 'name') {
      searchMapStore.setState({
        specialtyFilter: null
      });
    } else if (key === 'address') {
      searchMapStore.setState({
        locationFilter: null
      });
    }
  }

  resetValue = (key, focusField = false) => {
    searchMapStore.setSearchFieldValue(key, '');
    this.clearFilter(key);
    if (focusField) {
      this.fields[key].querySelector('input').focus();
    }
  };

  resetInputValue = () => {
    this.resetValue('name');
    this.resetValue('address');
  };

  onFocusInputSearch = e => {
    const name = (e.target as any).name;
    if (name) {
      this.currentSelectedInput = name;
    }
  };

  onBlurInputSearch = () => {
    if (uiStore.state.breakpoint.screenSize === 'mobile') {
      return;
    }
    // this.currentSelectedInput = null;
  };

  getViewSize = () => {
    const isTabletView = uiStore.state.breakpoint.screenSize === 'tablet';
    const isSmallView = uiStore.state.breakpoint.screenSize === 'mobile';
    return {
      isSmallView,
      isTabletView
    };
  };

  renderAutocompleteMobile = (searchDoctorData, addressAutocompletionData) => {
    if (this.currentSelectedInput === 'name' && searchMapStore.state.searchFields.name.length > 0) {
      return <div class="body-block">{searchDoctorData.length > 0 && this.renderContent(searchDoctorData)}</div>;
    }
    if (this.currentSelectedInput === 'address') {
      const addressResults = this.insertDefaultAddressNearMe([...addressAutocompletionData]);
      return <div class="body-block">{this.renderContent(addressResults)}</div>;
    }
    return null;
  };

  renderAutocompleteField = (fieldName, data) => {
    if (fieldName !== this.currentSelectedInput) {
      return null;
    }

    if (this.currentSelectedInput === 'name') {
      return <div>{data.length > 0 && this.renderContent(data)}</div>;
    }
    if (this.currentSelectedInput === 'address') {
      const addressResults = this.insertDefaultAddressNearMe([...data]);
      return <div>{addressResults.length > 0 && this.renderContent(addressResults)}</div>;
    }
    return null;
  };

  insertDefaultAddressNearMe(addressResults: any[]) {
    const searchMapState = searchMapStore.state;

    const nearMeFound = searchMapState.locationFilter?.id === NEAR_ME;
    if (
      !nearMeFound &&
      !searchMapState.searchFields.address.length &&
      searchMapStore.isGrantedGeoloc
    ) {
      return [NEAR_ME_ITEM, ...addressResults];
    }
    return addressResults;
  }

  render() {
    const searchDoctorData = searchMapStore.state?.searchDoctor.length > 0 && searchMapStore.state?.searchDoctor;
    const addressAutocompletionData = searchMapStore.state.searchGeo;

    const { isSmallView, isTabletView } = this.getViewSize();
    const nameInputLoading = this.currentSelectedInput === 'name' && searchMapStore.state.loading;
    const addressInputLoading = this.currentSelectedInput === 'address' && searchMapStore.state.loading;

    return (
      <Host>
        <div class="main-contain">
          <div class="hclsdk-search">
            <div class="hclsdk-search__container">
              <hcl-sdk-router-link url="/" class="hclsdk-btn-search-back">
                <hcl-sdk-icon name="arrow" width={25} height={25} color="black" />
              </hcl-sdk-router-link>
              <form class="hclsdk-search__form" onSubmit={this.onSearch}>
                <div class="hclsdk-search__form--content">
                  <div class="hclsdk-search__form--content-item">
                    <hcl-sdk-input
                      ref={el => (this.fields.name = el)}
                      postfixIcon={searchMapStore.state.searchFields.name ? 'remove' : ''}
                      name="name"
                      value={searchMapStore.state.searchFields.name}
                      placeholder={t('search_first_field_label')}
                      onInput={this.handleFieldInput}
                      autoComplete="off"
                      loading={nameInputLoading}
                      onPostfixClick={() => this.resetValue('name', !searchMapStore.state.specialtyFilter)}
                      autoFocus={routerStore.state.currentRoutePath !== ROUTER_PATH.SEARCH_RESULT}
                      onFocus={this.onFocusInputSearch}
                      onBlur={this.onBlurInputSearch}
                      readOnly={!!searchMapStore.state.specialtyFilter}
                      class={cls({
                        'hclsdk-error': !this.fieldsValid.name
                      })}
                    >
                      {!isSmallView && this.renderAutocompleteField('name', searchDoctorData)}
                    </hcl-sdk-input>
                  </div>
                  <div class="hclsdk-search__form--content-item">
                    <hcl-sdk-input
                      ref={el => (this.fields.address = el)}
                      postfixIcon={searchMapStore.state.searchFields.address ? 'remove' : ''}
                      name="address"
                      value={searchMapStore.state.searchFields.address}
                      placeholder={t('search_second_field_label')}
                      onInput={this.handleFieldInput}
                      autoComplete="off"
                      loading={addressInputLoading}
                      onPostfixClick={() => this.resetValue('address', true)}
                      onFocus={this.onFocusInputSearch}
                      onBlur={this.onBlurInputSearch}
                      class={cls({
                        'hclsdk-error': !this.fieldsValid.address,
                        'hclsdk-open-address': this.currentSelectedInput === 'address'
                      })}
                    >
                      {!isSmallView && this.renderAutocompleteField('address', addressAutocompletionData)}
                    </hcl-sdk-input>
                  </div>
                </div>
                <hcl-sdk-button
                  primary
                  type="submit"
                  icon={(!this.searchText || isTabletView) ? 'search' : undefined}
                  class="hclsdk-btn-search-address"
                  iconWidth={18}
                  iconHeight={18}
                >{!isTabletView && this.searchText}</hcl-sdk-button>
              </form>

              {this.showSwitchMode && !isSmallView && (
                <div class="hclsdk-btn-reset-search" onClick={this.resetInputValue}>
                  <span>{t('search_reset')}</span>
                </div>
              )}

              {this.showSwitchMode && (
                <div class="switch-mode">
                  <hcl-sdk-switch-view-mode typeOfLabel="short" />
                </div>
              )}
            </div>
          </div>
          {isSmallView && this.renderAutocompleteMobile(searchDoctorData, addressAutocompletionData)}
        </div>
      </Host>
    );
  }
}
