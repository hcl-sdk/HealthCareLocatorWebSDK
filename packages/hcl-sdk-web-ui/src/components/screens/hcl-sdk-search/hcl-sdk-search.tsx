import { Component, Host, h, State, Listen, Prop, Element } from '@stencil/core';
import { getFullCardDetail, searchDoctor, searchLocationWithParams, handleSearchMedicalTerms } from '../../../core/api/hcp';
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
import { SearchInputName } from '../../../core/stores/SearchMapStore';
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
  @Prop() noIcon: boolean;
  @Prop() searchText: string;
  @Prop() showSwitchMode?: boolean = false;
  wrapperEl: HTMLElement;
  fields = {
    name: null,
    address: null,
    medicalTerm: null
  };
  @State()
  fieldsValid = {
    name: true,
    address: true,
    medicalTerm: true
  }

  addressResultsRef;
  formRef;

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

  get isTouched() {
    const { searchFields, locationFilter, specialtyFilter, medicalTermsFilter } = searchMapStore.state
    const { name, address, medicalTerm } = searchFields
    if (
      (address && locationFilter) ||
      (name || specialtyFilter?.length) || // Can search with name in case criteria. Don't need to select any item in list
      (medicalTerm || medicalTermsFilter) // Can search with name in case criteria. Don't need to select any item in list
    ) {
      return true
    }
    return false
  }

  clickOutsideHandler = (evt) => {
    if (uiStore.state.breakpoint.screenSize === 'mobile') {
      return;
    }

    if (
      this.fields.name?.contains(evt.target) || 
      this.fields.address?.contains(evt.target) || 
      this.fields.medicalTerm?.contains(evt.target)
    ) {  
      return;
    }

    if (!this.addressResultsRef) {
      return;
    }

    this.autoFillField();
  }

  private onSearch = async e => {
    e.preventDefault();
    const { name, address, medicalTerm } = e.target;
    await this.search(name, address, medicalTerm)
  }

  private search = async (
    _: HTMLHclSdkInputElement, 
    addressRef: HTMLHclSdkInputElement, 
    __: HTMLHclSdkInputElement
  ) => {
    const isBasicNearMe = this.checkIsBasicNearMe();

    if (isBasicNearMe) {
      this.resetErrorElmUI('all');
      configStore.setState({
        modeView: ModeViewType.MAP
      });
    } else {
      if (searchMapStore.state.locationFilter && searchMapStore.state.locationFilter.id === NEAR_ME) {
        configStore.setState({
          modeView: ModeViewType.MAP
        });
      }
      this.checkValidElm(addressRef);
    }

    if (!this.isTouched) {
      return;
    }

    searchMapStore.setState({
      specialties: [],
      specialtiesRaw: [],
      loadingActivitiesStatus: 'loading'
    })

    if(routerStore.state.currentRoutePath !== ROUTER_PATH.SEARCH_RESULT) {
      if (!searchMapStore.state.locationFilter) {
        searchLocationWithParams()
      }
      routerStore.push(ROUTER_PATH.SEARCH_RESULT);
    } else {
      searchLocationWithParams()
    }

    // store search to history
    const historySearchItem: HistorySearchItem = {
      id: String(Date.now()),
      type: 'search',
      locationFilter: searchMapStore.state.locationFilter,
      specialtyFilter: searchMapStore.state.specialtyFilter,
      medicalTermsFilter: searchMapStore.state.medicalTermsFilter,
      searchFields: searchMapStore.state.searchFields,
      timestamp: Date.now()
    }
    historyStore.addItem('search', historySearchItem);
  };

  checkValidElm = elm => {
    if (!elm) {
      return;
    }
    if (!this.isTouched && elm.name === 'address') {
      this.fieldsValid = {
        ...this.fieldsValid,
        address: false
      }
      return
    }
    let isValid = this.fieldsValid[elm.name];

    // 2 use cases
    //  - At lease search by Name or Terms
    //  - Can be searched by both Name and Terms
    switch (elm.name) {
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

  resetErrorElmUI = (type: SearchInputName | 'all') => {
    if (type === 'all') {
      this.fieldsValid = {
        name: true,
        address: true,
        medicalTerm: true
      }
    } else {
      this.fieldsValid = {
        ...this.fieldsValid,
        [type]: true
      }
    }
  }

  private autoFillField() {
    if (!this.addressResultsRef) {
      return;
    }

    const items = this.addressResultsRef.getElementsByTagName('hcl-sdk-search-address-item');

    if (!items.length) {
      return;
    }

    if (this.currentSelectedInput === 'name') {
      const specialtiesFiltered = searchMapStore.state.searchDoctor.filter(o => !('address' in o))
      const currentSearch = searchMapStore.state.searchFields.name
      const findItem = specialtiesFiltered.find(spec => spec.name.toLowerCase() === currentSearch.toLowerCase())
      
      if (findItem) {
        this.selectAddress(findItem);
      }
    } else if (this.currentSelectedInput === 'address') {
      this.selectAddress(items[0].item);
    } else if (this.currentSelectedInput === 'medicalTerm') {
      const searchTerms = searchMapStore.state.searchMedicalTerms
      const currentSearch = searchMapStore.state.searchFields.medicalTerm
      const findItem = searchTerms.find(term => term.name.toLowerCase() === currentSearch.toLowerCase())

      if (findItem) {
        this.selectAddress(findItem)
      }
    }

    this.currentSelectedInput = null
  }

  checkIsBasicNearMe() {
    if (
      !searchMapStore.state.specialtyFilter?.length &&
      searchMapStore.state.locationFilter &&
      searchMapStore.state.locationFilter.id === NEAR_ME
    ) {
      return true;
    }
    return false;
  }

  onChange = debounce(async (name: SearchInputName, value: string) => {
    const inputName = name;
    const inputValue = value;
    if (!inputValue) {
      return
    }
    if (inputName === 'name') {
      await searchDoctor({
        criteria: inputValue,
        criteriaScope: CodeCriteriaScope.LongLblAutocomplete,
      })
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
      })
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
    this.selectAddress(item);
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
    } else if (this.currentSelectedInput === 'name') {
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
          specialtyFilter: [item],
        });
      }
    } else if (this.currentSelectedInput === 'medicalTerm') {
      searchMapStore.setSearchFieldValue('medicalTerm', item.name);
      searchMapStore.setState({
        medicalTermsFilter: item,
      });
    }

    this.resetDataResult();
    this.currentSelectedInput = null;
  }

  resetDataResult = () => {
    searchMapStore.setState({
      searchDoctor: [],
      searchMedicalTerms: []
    });
  };

  renderContent = (data, type: SearchInputName) => {
    return <hcl-sdk-autocomplete-result type={type} ref={el => (this.addressResultsRef = el)} data={data} currentSelectedInput={this.currentSelectedInput} />;
  };

  clearFilter = (key: SearchInputName) => {
    const mapKey: Record<SearchInputName, string> = {
      name: 'specialtyFilter',
      address: 'locationFilter',
      medicalTerm: 'medicalTermsFilter'
    }
    const mapValue = {
      specialtyFilter: []
    }
    searchMapStore.setState({
      [mapKey[key]]: mapValue[mapKey[key]] || null
    })
  }

  resetValue = (key: SearchInputName, focusField = false) => {
    searchMapStore.setSearchFieldValue(key, '');
    this.clearFilter(key);
    if (focusField) {
      this.fields[key].querySelector('input').focus();
    }
  };

  resetInputValue = () => {
    this.resetValue('name');
    this.resetValue('address');
    this.resetValue('medicalTerm');
  };

  onFocusInputSearch = e => {
    this.autoFillField();

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

  onInputSearchArrowDown = () => {
    if (!this.addressResultsRef) {
      return;
    }

    this.addressResultsRef.focusOnArrowKeyDown()
  }

  onInputSearchEnter = () => {
    if (!this.addressResultsRef) {
      return;
    }

    const items = this.addressResultsRef.getElementsByTagName('hcl-sdk-search-address-item');
    if (this.currentSelectedInput === 'name') {
      const firstItem = [...items].find(itemRef => !itemRef.item.address);
      if (firstItem) {
        this.selectAddress(firstItem.item)
      }

      this.fields.address.focusHclSdkInput()
    } else {
      this.selectAddress(items[0].item)

      setTimeout(() => {
        this.search(this.formRef.name, this.formRef.address, this.formRef.medicalTerm)
      }, 250)
    }
  }

  getViewSize = () => {
    const isTabletView = uiStore.state.breakpoint.screenSize === 'tablet';
    const isSmallView = uiStore.state.breakpoint.screenSize === 'mobile';
    return {
      isSmallView,
      isTabletView
    };
  };

  renderAutocompleteMobile = (searchDoctorData, addressAutocompletionData, searchMedicalTermData) => {
    if (this.currentSelectedInput === 'name' && searchMapStore.state.searchFields.name.length > 0) {
      return <div class="body-block">{searchDoctorData.length > 0 && this.renderContent(searchDoctorData, 'name')}</div>;
    }
    if (this.currentSelectedInput === 'address') {
      const addressResults = this.insertDefaultAddressNearMe([...addressAutocompletionData]);
      return <div class="body-block">{this.renderContent(addressResults, 'address')}</div>;
    }
    if (this.currentSelectedInput === 'medicalTerm') {
      return <div class="body-block">{this.renderContent(searchMedicalTermData, 'medicalTerm')}</div>
    }
    return null;
  };

  renderAutocompleteField = (fieldName: SearchInputName, data) => {
    if (fieldName !== this.currentSelectedInput) {
      return null;
    }

    if (this.currentSelectedInput === 'name') {
      return <div>{data.length > 0 && this.renderContent(data, 'name')}</div>;
    }
    if (this.currentSelectedInput === 'address') {
      const addressResults = this.insertDefaultAddressNearMe([...data]);
      return <div>{addressResults.length > 0 && this.renderContent(addressResults, 'address')}</div>;
    }
    if (this.currentSelectedInput === 'medicalTerm') {
      return <div>{ this.renderContent(data, 'medicalTerm') }</div>
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
    const searchMedicalTermData = searchMapStore.state.searchMedicalTerms
    const addressAutocompletionData = searchMapStore.state.searchGeo;

    const { isSmallView, isTabletView } = this.getViewSize();
    const nameInputLoading = this.currentSelectedInput === 'name' && searchMapStore.state.loading;
    const addressInputLoading = this.currentSelectedInput === 'address' && searchMapStore.state.loading;
    const medicalTermInputLoading = this.currentSelectedInput === 'medicalTerm' && searchMapStore.state.loading;

    return (
      <Host>
        <div class="main-contain">
          <div class="hclsdk-search">
            <div class="hclsdk-search__container">
              <hcl-sdk-router-link url="/" class="hclsdk-btn-search-back">
                <hcl-sdk-icon name="arrow" width={25} height={25} color="black" />
              </hcl-sdk-router-link>
              <form ref={ref => this.formRef = ref} class="hclsdk-search__form" onSubmit={this.onSearch}>
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
                      onPostfixClick={() => this.resetValue('name', !searchMapStore.state.specialtyFilter?.length)}
                      autoFocus={routerStore.state.currentRoutePath !== ROUTER_PATH.SEARCH_RESULT}
                      onFocus={this.onFocusInputSearch}
                      onBlur={this.onBlurInputSearch}
                      onEnterKeyDown={this.onInputSearchEnter}
                      onArrowKeyDown={this.onInputSearchArrowDown}
                      readOnly={!!searchMapStore.state.specialtyFilter?.length}
                      class={cls({
                        'hclsdk-error': !this.fieldsValid.name
                      })}
                    >
                      {!isSmallView && this.renderAutocompleteField('name', searchDoctorData)}
                    </hcl-sdk-input>
                  </div>
                  {
                    configStore.state.enableMedicalTerm && (
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
                          onBlur={this.onBlurInputSearch}
                          onEnterKeyDown={this.onInputSearchEnter}
                          onArrowKeyDown={this.onInputSearchArrowDown}
                          class={cls({
                            'hclsdk-error': !this.fieldsValid.medicalTerm
                          })}
                        >
                          {!isSmallView && this.renderAutocompleteField('medicalTerm', searchMedicalTermData)}
                        </hcl-sdk-input>
                      </div>
                    )
                  }
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
                      onEnterKeyDown={this.onInputSearchEnter}
                      onArrowKeyDown={this.onInputSearchArrowDown}
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
          {isSmallView && this.renderAutocompleteMobile(searchDoctorData, addressAutocompletionData, searchMedicalTermData)}
        </div>
      </Host>
    );
  }
}
