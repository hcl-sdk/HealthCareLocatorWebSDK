import { Component, Host, h, State, Listen, Prop, Element, Watch } from '@stencil/core';
import { getFullCardDetail, searchDoctor, searchLocationWithParams, handleSearchMedicalTerms, handleSearchSpecialty } from '../../../core/api/hcp';
import * as HCOApis from '../../../core/api/hco';
import { searchMapStore, routerStore, uiStore, historyStore, configStore, featureStore } from '../../../core/stores';
import debounce from 'lodash.debounce';
import { searchGeoMap } from '../../../core/api/searchGeo';
import { COUNTRIES_LABELS, NEAR_ME, NEAR_ME_ITEM } from '../../../core/constants';
import { ROUTER_PATH } from '../../hcl-sdk-router/constants';
import { HistorySearchItem } from '../../../core/stores/HistoryStore';
import { HTMLStencilElement } from '@stencil/core/internal';
import { t } from '../../../utils/i18n';
import { ModeViewType } from '../../../core/stores/ConfigStore';
import cls from 'classnames';
import { SearchInputName, SEARCH_TARGET } from '../../../core/stores/SearchMapStore';
import { CodeCriteriaScope } from '../../../../../hcl-sdk-core/src/graphql/types';

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
  @State() currentSelectedInput: SearchInputName;
  @State() isShowModifying: boolean = false;
  @Prop() noIcon: boolean;
  @Prop() isSearchResult?: boolean = false;
  wrapperEl: HTMLElement;
  fields = {
    name: null,
    address: null,
    medicalTerm: null,
    specialtyName: null,
    country: null,
  };
  @State()
  fieldsValid = {
    name: true,
    address: true,
    medicalTerm: true,
    specialtyName: true,
    country: true,
  };

  addressResultsRef;
  formRef;

  componentWillLoad() {
    this.wrapperEl = this.el.closest('.wrapper');

    if (this.wrapperEl) {
      this.wrapperEl.addEventListener('click', this.clickOutsideHandler);
    }

    this.searchTarget = searchMapStore.searchTarget;
  }

  disconnectedCallback() {
    if (this.wrapperEl) {
      this.wrapperEl.classList.remove('show-search-form-popup');
      this.wrapperEl.removeEventListener('click', this.clickOutsideHandler);
    }
  }

  get isTouched() {
    const { searchFields, locationFilter, specialtyFilter, medicalTermsFilter } = searchMapStore.state;
    const { address, specialtyName, medicalTerm, name } = searchFields;
    if (
      name ||
      (address && locationFilter) ||
      specialtyName ||
      specialtyFilter?.length || // Can search with name in case criteria. Don't need to select any item in list
      medicalTerm ||
      medicalTermsFilter // Can search with name in case criteria. Don't need to select any item in list
    ) {
      return true;
    }
    return false;
  }

  @Watch('isShowModifying')
  watchIsShowModifying(newValue) {
    if (!this.wrapperEl) return;

    if (newValue) {
      this.wrapperEl.classList.add('show-search-form-popup');
    } else {
      this.wrapperEl.classList.remove('show-search-form-popup');
    }
  }

  clickOutsideHandler = evt => {
    if (this.currentSelectedInput === 'country' && !this.fields.country?.contains(evt.target)) {
      this.currentSelectedInput = null;
      return;
    }

    if (uiStore.state.breakpoint.screenSize === 'mobile') {
      return;
    }

    if (
      this.fields.name?.contains(evt.target) ||
      this.fields.address?.contains(evt.target) ||
      this.fields.medicalTerm?.contains(evt.target) ||
      this.fields.specialtyName?.contains(evt.target)
    ) {
      return;
    }

    if (!this.addressResultsRef) {
      return;
    }

    this.autoFillField();
  };

  private onSearch = async e => {
    e.preventDefault();
    const { name, address, specialtyName, medicalTerm } = e.target;
    await this.search(name, specialtyName, address, medicalTerm);
  };

  private search = async (_: HTMLHclSdkInputElement, __: HTMLHclSdkInputElement, addressRef: HTMLHclSdkInputElement, ___: HTMLHclSdkInputElement) => {
    searchMapStore.setSearchTarget(this.searchTarget);

    if (searchMapStore.isSearchNearMe) {
      this.resetErrorElmUI('all');
      configStore.setState({
        modeView: ModeViewType.MAP,
      });
    } else {
      if (searchMapStore.state.locationFilter && searchMapStore.state.locationFilter.id === NEAR_ME) {
        configStore.setState({
          modeView: ModeViewType.MAP,
        });
      }

      this.checkValidElm(addressRef);
    }

    if (searchMapStore.state.locationFilter && searchMapStore.state.locationFilter.id === NEAR_ME) {
      searchMapStore.setSortValues({
        relevance: false,
        distanceNumber: true,
        name: false,
        lastName: false
      });
    } else {
      searchMapStore.setSortValues({
        relevance: true,
        distanceNumber: false,
        name: false,
        lastName: false
      });
    }

    if (!this.isTouched) {
      return;
    }

    searchMapStore.setState({
      specialties: [],
      specialtiesRaw: [],
      navigatedFromHome: false,
      loadingActivitiesStatus: 'loading',

      // reset hco state when start new search
      hcos: [],
      loadingHcosStatus: 'loading',
      hcoDetail: null,
      selectedHco: null,
      navigateFromHcoFullCard: false,
      searchTarget: this.searchTarget
    });

    if (routerStore.state.currentRoutePath !== ROUTER_PATH.SEARCH_RESULT) {
      routerStore.push(ROUTER_PATH.SEARCH_RESULT);
    } else {
      if (this.searchTarget === SEARCH_TARGET.HCO) {
        HCOApis.searchLocationWithParams();
      } else {
        searchLocationWithParams();
      }
    }

    // store search to history
    const historySearchItem: HistorySearchItem = {
      id: String(Date.now()),
      type: 'search',
      locationFilter: searchMapStore.state.locationFilter,
      specialtyFilter: searchMapStore.state.specialtyFilter,
      medicalTermsFilter: searchMapStore.state.medicalTermsFilter,
      searchFields: searchMapStore.state.searchFields,
      countryFilter: configStore.countryGraphqlQuery,
      timestamp: Date.now(),
    };
    this.isShowModifying = false;
    historyStore.addItem('search', historySearchItem);
  };

  checkValidElm = elm => {
    if (!elm) {
      return;
    }
    if (!this.isTouched && elm.name === 'address') {
      this.fieldsValid = {
        ...this.fieldsValid,
        address: false,
      };
      return;
    }

    let isValid = this.fieldsValid[elm.name];

    // 2 use cases
    //  - At lease search by SpecialtyName or Terms
    //  - Can be searched by both SpecialtyName and Terms
    switch (elm.name) {
      case 'address':
        isValid = !elm.value || Boolean(elm.value && searchMapStore.state.locationFilter);
        break;
    }

    this.fieldsValid = {
      ...this.fieldsValid,
      [elm.name]: isValid,
    };
    return isValid;
  };

  resetErrorElmUI = (type: SearchInputName | 'all') => {
    if (type === 'all') {
      this.fieldsValid = {
        name: true,
        address: true,
        medicalTerm: true,
        specialtyName: true,
        country: true,
      };
    } else {
      this.fieldsValid = {
        ...this.fieldsValid,
        [type]: true,
      };
    }
  };

  private autoFillField() {
    if (!this.addressResultsRef) {
      return;
    }

    const items = this.addressResultsRef.getElementsByTagName('hcl-sdk-search-address-item');

    if (!items.length) {
      return;
    }

    if (this.currentSelectedInput === 'specialtyName') {
      const searchSpecialty = searchMapStore.state.searchSpecialty;
      const currentSearch = searchMapStore.state.searchFields.specialtyName;
      const findItem = searchSpecialty.find(spec => spec.name.toLowerCase() === currentSearch.toLowerCase());

      if (findItem) {
        this.selectAddress(findItem);
      }
    } else if (this.currentSelectedInput === 'address' && items[0].item?.id !== NEAR_ME) {
      this.selectAddress(items[0].item);
    } else if (this.currentSelectedInput === 'medicalTerm') {
      const searchTerms = searchMapStore.state.searchMedicalTerms;
      const currentSearch = searchMapStore.state.searchFields.medicalTerm;
      const findItem = searchTerms.find(term => term.name.toLowerCase() === currentSearch.toLowerCase());

      if (findItem) {
        this.selectAddress(findItem);
      }
    }

    this.currentSelectedInput = null;
  }

  onChange = debounce(async (name: SearchInputName, value: string) => {
    const searchTarget = featureStore.isHcoSearchEnabled ? this.searchTarget : undefined;

    // TODO: suggest for HCO
    if (name !== 'address' && searchTarget === SEARCH_TARGET.HCO) {
      return await HCOApis.searchHcos({ criteria: value })
    }

    const inputName = name;
    const inputValue = value;
    if (!inputValue) {
      return;
    }
    if (inputName === 'name') {
      await searchDoctor({
        criteria: inputValue,
      });
    }
    if (inputName === 'specialtyName') {
      await handleSearchSpecialty({
        criteria: inputValue,
        criteriaScope: CodeCriteriaScope.LongLblAutocomplete,
      });
    }
    if (inputName === 'address') {
      await searchGeoMap({
        id: inputValue,
      });
    }
    if (inputName === 'medicalTerm') {
      await handleSearchMedicalTerms({
        criteria: inputValue,
        criteriaScope: CodeCriteriaScope.LongLblAutocomplete,
      });
    }
  }, 500);

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
    this.selectAddress(item);
  }

  @Listen('selectCountry')
  onSelectCountry(e) {
    const item = e.detail;

    if (item?.code) {
      configStore.setState({
        countryFilterSelected: item.code,
      });
      searchMapStore.resetDataSearch({ isResetSearchFields: true });
      this.currentSelectedInput = null;
    }
  }

  selectAddress(item) {
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
    }
    if (this.currentSelectedInput === 'name') {
      searchMapStore.resetDataSearch({
        isResetHCPDetail: true,
        isResetSearchFields: false,
        isResetHCODetail: true
      });
      if (item.__type === SEARCH_TARGET.HCO) {
        searchMapStore.setState({
          searchTarget: SEARCH_TARGET.HCO,
          searchFields: {
            ...searchMapStore.state.searchFields,
            name: item.name,
          },
          selectedHco: {
            ...item,
          },
        });
      } else {
        searchMapStore.setState({
          searchTarget: SEARCH_TARGET.HCP,
          searchFields: {
            ...searchMapStore.state.searchFields,
            name: item.name,
          },
          selectedActivity: {
            ...item.activity,
            name: item.name,
            lat: item.activity.workplace.address.location.lat,
            lng: item.activity.workplace.address.location.lon,
          },
        });
      }

      if (routerStore.state.currentRoutePath !== ROUTER_PATH.SEARCH_RESULT) {
        routerStore.push('/search-result');
      } else {
        if (item.__type === SEARCH_TARGET.HCO) {
          HCOApis.getFullCardDetail({ hcoId: item.id}) // getFullCardDetail receive option object with hcoId prop
        } else {
          getFullCardDetail({
            activityId: item.activity.id,
            activityName: item.name,
          });
        }
      }
    }
    if (this.currentSelectedInput === 'specialtyName') {
      // on click Specialty item
      this.resetErrorElmUI('specialtyName');
      searchMapStore.setSearchFieldValue('specialtyName', item.name);
      searchMapStore.setState({
        specialtyFilter: [item],
      });
    }
    if (this.currentSelectedInput === 'medicalTerm') {
      searchMapStore.setSearchFieldValue('medicalTerm', item.name);
      searchMapStore.setState({
        medicalTermsFilter: item,
      });
    }

    this.resetDataResult();
    this.currentSelectedInput = null;
  }

  resetDataResult = () => {
    searchMapStore.resetDataSearch();
  };

  renderContent = (data, type: SearchInputName) => {
    return <hcl-sdk-autocomplete-result type={type} ref={el => (this.addressResultsRef = el)} data={data} currentSelectedInput={this.currentSelectedInput} />;
  };

  renderContentCountries = () => {
    const data = configStore.state.countriesSubscriptionKey.map(countryCode => ({
      code: countryCode,
      label: COUNTRIES_LABELS[countryCode],
    }));

    return <hcl-sdk-search-countries data={data} currentSelectedInput={this.currentSelectedInput} selectedCountry={configStore.countryGraphqlQuery} />;
  };

  clearFilter = (key: SearchInputName) => {
    if (key === 'country') return;

    const mapKey: Record<string, string> = {
      name: 'selectedActivity',
      address: 'locationFilter',
      medicalTerm: 'medicalTermsFilter',
      specialtyName: 'specialtyFilter',
    };
    const mapValue = {
      specialtyFilter: [],
    };
    searchMapStore.setState({
      [mapKey[key]]: mapValue[mapKey[key]] || null,
    });
  };

  resetValue = (key: SearchInputName, focusField = false) => {
    searchMapStore.setSearchFieldValue(key, '');
    this.clearFilter(key);
    if (focusField) {
      this.fields[key].querySelector('input').focus();
    }
  };

  onFocusInputSearch = e => {
    this.autoFillField();

    const name = (e.target as any).name;
    if (name) {
      this.currentSelectedInput = name;
    }
  };

  onBlurInputSearch = () => {};

  onInputSearchArrowDown = () => {
    if (!this.addressResultsRef) {
      return;
    }

    this.addressResultsRef.focusOnArrowKeyDown();
  };

  onInputSearchEnter = () => {
    if (!this.addressResultsRef) {
      return;
    }

    const items = this.addressResultsRef.getElementsByTagName('hcl-sdk-search-address-item');
    if (this.currentSelectedInput === 'name') {
      const firstItem = [...items].find(itemRef => !itemRef.item.address);
      if (firstItem) {
        this.selectAddress(firstItem.item);
      }

      this.fields.address.focusHclSdkInput();
    } else {
      this.selectAddress(items[0].item);

      setTimeout(() => {
        this.search(this.formRef.name, this.formRef.specialtyName, this.formRef.address, this.formRef.medicalTerm);
      }, 250);
    }
  };

  getViewSize = () => {
    const isTabletView = uiStore.state.breakpoint.screenSize === 'tablet';
    const isSmallView = uiStore.state.breakpoint.screenSize === 'mobile';
    return {
      isSmallView,
      isTabletView,
    };
  };

  renderAutocompleteMobile = (searchDoctorData, searchSpecialty, addressAutocompletionData, searchMedicalTermData) => {
    if (this.currentSelectedInput === 'name' && searchMapStore.state.searchFields.name.length > 0) {
      return <div class="body-block">{searchDoctorData.length > 0 && this.renderContent(searchDoctorData, 'name')}</div>;
    }
    if (this.currentSelectedInput === 'specialtyName' && searchMapStore.state.searchFields.specialtyName.length > 0) {
      return <div class="body-block">{searchSpecialty.length > 0 && this.renderContent(searchSpecialty, 'specialtyName')}</div>;
    }
    if (this.currentSelectedInput === 'address') {
      const addressResults = this.insertDefaultAddressNearMe([...addressAutocompletionData]);
      return <div class="body-block">{this.renderContent(addressResults, 'address')}</div>;
    }
    if (this.currentSelectedInput === 'medicalTerm') {
      return <div class="body-block">{this.renderContent(searchMedicalTermData, 'medicalTerm')}</div>;
    }
    return null;
  };

  renderAutocompleteField = (fieldName: SearchInputName, data) => {
    if (!data || fieldName !== this.currentSelectedInput) {
      return null;
    }

    if (this.currentSelectedInput === 'name') {
      return <div>{data.length > 0 && this.renderContent(data, 'name')}</div>;
    }
    if (this.currentSelectedInput === 'specialtyName') {
      return <div>{data.length > 0 && this.renderContent(data, 'specialtyName')}</div>;
    }
    if (this.currentSelectedInput === 'address') {
      const addressResults = this.insertDefaultAddressNearMe([...data]);
      return <div>{addressResults.length > 0 && this.renderContent(addressResults, 'address')}</div>;
    }
    if (this.currentSelectedInput === 'medicalTerm') {
      return <div>{data.length > 0 && this.renderContent(data, 'medicalTerm')}</div>;
    }
    return null;
  };

  renderAutocompleteCountries = () => {
    if (this.currentSelectedInput !== 'country') {
      return;
    }

    return <div>{this.renderContentCountries()}</div>;
  };

  insertDefaultAddressNearMe(addressResults: any[]) {
    const searchMapState = searchMapStore.state;

    const nearMeFound = searchMapState.locationFilter?.id === NEAR_ME;
    if (!nearMeFound && !searchMapState.searchFields.address.length && searchMapStore.isGrantedGeoloc) {
      return [NEAR_ME_ITEM, ...addressResults];
    }
    return addressResults;
  }

  toggleShowModify = () => {
    this.isShowModifying = !this.isShowModifying;
  };

  @State()
  searchTarget: SEARCH_TARGET = SEARCH_TARGET.HCP;

  setSearchTarget(target: SEARCH_TARGET) {
    this.searchTarget = target;
    this.currentSelectedInput = null;

    // reset all fields
    searchMapStore.resetDataSearch({ isResetSearchFields: true });
    this.currentSelectedInput = null;
  }

  renderSearchTargetTabs() {
    const isShowFakeInput = this.isSearchResult && !this.isShowModifying;

    return (!featureStore.isHcoSearchEnabled || !configStore.state.enableHcoSearch) ? null : (
      <div class={cls('hclsdk-tabs', isShowFakeInput && 'hidden')}>
        <hcl-sdk-router-link url="/" class="hclsdk-btn-search-back">
          <hcl-sdk-icon name="back" width={25} height={25} />
        </hcl-sdk-router-link>
        <hcl-sdk-button
          noBackground
          class={cls('hclsdk-tabs__tab', {
            'hclsdk-tabs__tab--active': this.searchTarget === SEARCH_TARGET.HCP,
          })}
          onClick={() => this.setSearchTarget(SEARCH_TARGET.HCP)}
        >
          <hcl-sdk-icon width={24} height={24} name="account-outline" />
        </hcl-sdk-button>
        <hcl-sdk-button
          noBackground
          class={cls('hclsdk-tabs__tab', {
            'hclsdk-tabs__tab--active': this.searchTarget === SEARCH_TARGET.HCO,
          })}
          onClick={() => this.setSearchTarget(SEARCH_TARGET.HCO)}
        >
          <hcl-sdk-icon width={24} height={24} name="domain" />
        </hcl-sdk-button>
      </div>
    );
  }

  render() {
    const searchHcosData = searchMapStore.state?.searchHcos.length > 0 && searchMapStore.state?.searchHcos;
    const searchDoctorData = searchMapStore.state?.searchDoctor.length > 0 && searchMapStore.state?.searchDoctor;
    const searchSpecialty = searchMapStore.state.searchSpecialty;
    const searchMedicalTermData = searchMapStore.state.searchMedicalTerms;
    const addressAutocompletionData = searchMapStore.state.searchGeo;

    const { isSmallView } = this.getViewSize();
    const nameInputLoading = this.currentSelectedInput === 'name' && searchMapStore.state.loading;
    const specialtyNameInputLoading = this.currentSelectedInput === 'specialtyName' && searchMapStore.state.loading;
    const addressInputLoading = this.currentSelectedInput === 'address' && searchMapStore.state.loading;
    const medicalTermInputLoading = this.currentSelectedInput === 'medicalTerm' && searchMapStore.state.loading;

    const isShowFakeInput = this.isSearchResult && !this.isShowModifying;
    const classesForm = cls('hclsdk-search__form', {
      'hclsdk-search__form--hide': isShowFakeInput,
    });
    const classesSdkSearch = cls('main-contain', {
      'hclsdk-search__form--show-popup': this.isSearchResult && this.isShowModifying,
    });

    return (
      <Host>
        <div class={classesSdkSearch}>
          <div
            class={cls('hclsdk-search px-1 py-5', !isShowFakeInput && 'justify-center', {
              'hco-search': featureStore.isHcoSearchEnabled && configStore.state.enableHcoSearch,
            })}
          >
            <div class={cls('hclsdk-search__container', isShowFakeInput && 'w-full', !isShowFakeInput && 'hclsdk-search__container--not-modifying')}>
              {this.renderSearchTargetTabs()}
              <div class={'flex items-center w-full'}>
                {featureStore.isHcoSearchEnabled && configStore.state.enableHcoSearch ? null : (
                  <hcl-sdk-router-link url="/" class="hclsdk-btn-search-back">
                    <hcl-sdk-icon name="back" width={25} height={25} />
                  </hcl-sdk-router-link>
                )}
                <form ref={ref => (this.formRef = ref)} class={classesForm} onSubmit={this.onSearch} autocomplete="off">
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
                        onPostfixClick={() => this.resetValue('name', !searchMapStore.state.selectedActivity)}
                        autoFocus={routerStore.state.currentRoutePath !== ROUTER_PATH.SEARCH_RESULT}
                        onFocus={this.onFocusInputSearch}
                        onEnterKeyDown={this.onInputSearchEnter}
                        onArrowKeyDown={this.onInputSearchArrowDown}
                      >
                        {!isSmallView && this.renderAutocompleteField('name', this.searchTarget === SEARCH_TARGET.HCO ? searchHcosData : searchDoctorData)}
                      </hcl-sdk-input>
                    </div>
                    {this.searchTarget !== SEARCH_TARGET.HCO && (
                      <div class="hclsdk-search__form--content-item">
                        <hcl-sdk-input
                          ref={el => (this.fields.specialtyName = el)}
                          postfixIcon={searchMapStore.state.searchFields.specialtyName ? 'remove' : ''}
                          name="specialtyName"
                          value={searchMapStore.state.searchFields.specialtyName}
                          placeholder={t('search_specialty_field_label')}
                          onInput={this.handleFieldInput}
                          autoComplete="off"
                          loading={specialtyNameInputLoading}
                          onPostfixClick={() => this.resetValue('specialtyName', !searchMapStore.state.specialtyFilter?.length)}
                          onFocus={this.onFocusInputSearch}
                          onEnterKeyDown={this.onInputSearchEnter}
                          onArrowKeyDown={this.onInputSearchArrowDown}
                          readOnly={!!searchMapStore.state.specialtyFilter?.length}
                          class={cls({
                            'hclsdk-error': !this.fieldsValid.specialtyName,
                          })}
                        >
                          {!isSmallView && this.renderAutocompleteField('specialtyName', searchSpecialty)}
                        </hcl-sdk-input>
                      </div>
                    )}
                    {configStore.state.enableMedicalTerm && this.searchTarget !== SEARCH_TARGET.HCO && (
                      <div class="hclsdk-search__form--content-item">
                        <hcl-sdk-input
                          ref={el => (this.fields.medicalTerm = el)}
                          postfixIcon={searchMapStore.state.searchFields.medicalTerm ? 'remove' : ''}
                          name="medicalTerm"
                          value={searchMapStore.state.searchFields.medicalTerm}
                          placeholder={t('search_medical_term_label')}
                          onInput={this.handleFieldInput}
                          autoComplete="off"
                          loading={medicalTermInputLoading}
                          onPostfixClick={() => this.resetValue('medicalTerm', !searchMapStore.state.medicalTermsFilter)}
                          onFocus={this.onFocusInputSearch}
                          onEnterKeyDown={this.onInputSearchEnter}
                          onArrowKeyDown={this.onInputSearchArrowDown}
                          class={cls({
                            'hclsdk-error': !this.fieldsValid.medicalTerm,
                          })}
                        >
                          {!isSmallView && this.renderAutocompleteField('medicalTerm', searchMedicalTermData)}
                        </hcl-sdk-input>
                      </div>
                    )}
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
                        onPostfixClick={() => this.resetValue('address', false)}
                        onFocus={this.onFocusInputSearch}
                        onEnterKeyDown={this.onInputSearchEnter}
                        onArrowKeyDown={this.onInputSearchArrowDown}
                        class={cls({
                          'hclsdk-error': !this.fieldsValid.address,
                          'hclsdk-open-address': this.currentSelectedInput === 'address',
                        })}
                      >
                        {!isSmallView && this.renderAutocompleteField('address', addressAutocompletionData)}
                      </hcl-sdk-input>
                    </div>
                    <div class="hclsdk-search__form--content-item hclsdk-search__form--content-item--country">
                      <hcl-sdk-input
                        ref={el => (this.fields.country = el)}
                        name="country"
                        postfixIcon="arrow_down"
                        autoComplete="off"
                        value={COUNTRIES_LABELS[configStore.countryGraphqlQuery]}
                        readOnly={true}
                        onFocus={this.onFocusInputSearch}
                        prefixIcon={<hcl-sdk-icon-flag countryCode={configStore.countryGraphqlQuery} />}
                      >
                        {this.renderAutocompleteCountries()}
                      </hcl-sdk-input>
                    </div>
                  </div>
                  <hcl-sdk-button primary type="submit" class="hclsdk-btn-search-address">
                    {t('search')}
                  </hcl-sdk-button>
                </form>

                {isShowFakeInput && (
                  <div class="hclsdk-search__modify">
                    <div class="hclsdk-search__modify__input" innerHTML={searchMapStore.getSearchLabel()} />
                    <div class="hclsdk-search__modify__action" onClick={this.toggleShowModify}>
                      <hcl-sdk-icon tabIndex={-1} name="edit" width={20} height={20} />
                      <span>{t('modify')}</span>
                    </div>
                  </div>
                )}

                {isShowFakeInput && (
                  <div class="switch-mode">
                    <hcl-sdk-switch-view-mode typeOfLabel="short" />
                  </div>
                )}
              </div>
            </div>
            {this.isSearchResult && this.isShowModifying && (
              <div class="hclsdk-search__modify__close" onClick={this.toggleShowModify}>
                <hcl-sdk-icon tabIndex={-1} name="remove" width={20} height={20} />
              </div>
            )}
          </div>
          {isSmallView && this.renderAutocompleteMobile(searchDoctorData, searchSpecialty, addressAutocompletionData, searchMedicalTermData)}
        </div>
      </Host>
    );
  }
}
