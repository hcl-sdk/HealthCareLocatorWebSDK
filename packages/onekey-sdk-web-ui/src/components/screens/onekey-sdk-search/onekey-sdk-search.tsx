import { Component, Host, h, State, Listen, Prop } from '@stencil/core';
import { searchDoctor } from '../../../core/api/hcp';
import { searchMapStore, routerStore, uiStore } from '../../../core/stores';
import debounce from 'lodash.debounce';
import cls from 'classnames';
import { searchGeoMap } from '../../../core/api/searchGeo';
import { NEAR_ME } from '../../../core/constants';

const nearMeItem = {
  name: 'Near me',
  id: NEAR_ME,
};

@Component({
  tag: 'onekey-sdk-search',
  styleUrl: 'onekey-sdk-search.scss',
  shadow: false,
})
export class OnekeySdkSearch {
  nameInput!: HTMLInputElement;
  addressInput!: HTMLInputElement;

  @State() searchResult = [];
  @State() selectedAddress: any = {};
  @State() selectedDoctor: any = {};
  @State() currentSelectedInput: string;
  @Prop() noIcon: boolean;
  @Prop() searchText: string;
  @Prop() showSwitchMode?: boolean = false;

  fields = {
    name: null,
    address: null,
  };

  private onSearch = async e => {
    e.preventDefault();

    const { name } = e.target;
    this.checkValidElm(name);

    if (name.value) {
      routerStore.push('/search-result');
    }
  };

  checkValidElm = elm => {
    if (!elm.value) {
      elm.classList.add('error');
    } else {
      elm.classList.remove('error');
    }
  };

  onChange = debounce(async e => {
    const inputName = e.path[0].name;
    const inputValue = e.path[0].value;
    this.checkValidElm(e.path[0]);

    if (inputValue) {
      inputName === 'name'
        ? await searchDoctor({
            criteria: inputValue,
          })
        : await searchGeoMap({
            id: inputValue,
          });
    }
  }, 500);

  handleFieldInput = e => {
    const el = e.target;
    searchMapStore.setSearchFieldValue(el.name, el.value);
    this.onChange(e);
  };

  @Listen('selectAddress')
  onSelectAddress(e) {
    const item = e.detail;
    // "Near Me" special Case
    if (item.id === NEAR_ME) {
      searchMapStore.setSearchFieldValue('address', item.name);
      searchMapStore.setState({
        locationFilter: item,
      });
      return;
    }
    if (this.currentSelectedInput === 'address') {
      searchMapStore.setSearchFieldValue('address', item.name);
      searchMapStore.setState({
        locationFilter: item,
      });
    } else {
      if (item.professionalType) {
        // on click HCP item
        alert('TODO');
      } else {
        // on click Specialty item
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
      searchDoctor: [],
      specialties: [],
    });
  };

  renderContent = data => {
    return (
      <div class={`search-content ${this.currentSelectedInput}`}>
        {data && data.map(item => <onekey-sdk-search-address-item item={item} currentSearchText={searchMapStore.state.searchFields.name} />)}
      </div>
    );
  };

  resetValue = (key, focusField = false) => {
    searchMapStore.setSearchFieldValue(key, '');
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
    const isSmallView = uiStore.state.breakpoint.screenSize === 'mobile';
    return {
      isSmallView,
    };
  };

  render() {
    const selectedDoctorName = searchMapStore.state.selectedValues?.name?.name;
    const searchDoctorData = searchMapStore.state?.searchDoctor.length > 0 && searchMapStore.state?.searchDoctor;

    const selectedAddressName = searchMapStore.state.selectedValues?.address?.name;
    const addressAutocompletionData = searchMapStore.state?.searchGeo.length > 0 ? [nearMeItem, ...searchMapStore.state?.searchGeo] : [nearMeItem];

    const isSmallView = this.getViewSize().isSmallView;
    const nameInputLoading = this.currentSelectedInput === 'name' && searchMapStore.state.loading;
    const addressInputLoading = this.currentSelectedInput === 'address' && searchMapStore.state.loading;
    const resetSearchClass = cls('reset-search', {
      hide: !selectedDoctorName && !selectedAddressName,
    });

    return (
      <Host>
        <div class="main-contain">
          <div class="header-block search-block">
            <div class="search-hcp">
              <onekey-sdk-router-link url="/" class="search-back">
                <onekey-sdk-icon name="arrow" width={25} height={25} color="black" />
              </onekey-sdk-router-link>
              <form class="search-form" onSubmit={this.onSearch}>
                <div class="search-form-content">
                  <div class="search-form-content-item">
                    <onekey-sdk-input
                      ref={el => (this.fields.name = el)}
                      postfixIcon={searchMapStore.state.searchFields.name ? 'remove' : ''}
                      name="name"
                      value={searchMapStore.state.searchFields.name}
                      placeholder="Name, Specialty"
                      onInput={this.handleFieldInput}
                      autoComplete="off"
                      loading={nameInputLoading}
                      onPostfixClick={() => this.resetValue('name', true)}
                      autoFocus
                      onFocus={this.onFocusInputSearch}
                      onBlur={this.onBlurInputSearch}
                    >
                      {!isSmallView && searchDoctorData.length && this.currentSelectedInput === 'name' && this.renderContent(searchDoctorData)}
                    </onekey-sdk-input>
                  </div>
                  <div class="search-form-content-item">
                    <onekey-sdk-input
                      ref={el => (this.fields.address = el)}
                      postfixIcon={searchMapStore.state.searchFields.address ? 'remove' : ''}
                      name="address"
                      value={searchMapStore.state.searchFields.address}
                      placeholder="Where? (address, city...)"
                      onInput={this.handleFieldInput}
                      autoComplete="off"
                      loading={addressInputLoading}
                      onPostfixClick={() => this.resetValue('address', true)}
                      onFocus={this.onFocusInputSearch}
                      onBlur={this.onBlurInputSearch}
                    >
                      {!isSmallView && addressAutocompletionData.length && this.currentSelectedInput === 'address' && this.renderContent(addressAutocompletionData)}
                    </onekey-sdk-input>
                  </div>
                </div>
                {this.searchText ? (
                  <onekey-sdk-button primary type="submit" class="search-address-btn">
                    {this.searchText}
                  </onekey-sdk-button>
                ) : (
                  <onekey-sdk-button primary type="submit" icon="search" class="search-address-btn" />
                )}
              </form>
              <div class={resetSearchClass} onClick={this.resetInputValue}>
                <span>Reset search</span>
              </div>
              <div>
                <slot></slot>
                {this.showSwitchMode && (
                  <div class="switch-mode">
                    <onekey-sdk-switch-view-mode typeOfLabel="short" />
                  </div>
                )}
              </div>
            </div>
          </div>
          {isSmallView && this.currentSelectedInput === 'name' && searchMapStore.state.searchFields.name.length > 0 && (
            <div class="body-block">{searchDoctorData.length && this.renderContent(searchDoctorData)}</div>
          )}
          {isSmallView && this.currentSelectedInput === 'address' && <div class="body-block">{this.renderContent(addressAutocompletionData)}</div>}
          {isSmallView && (!this.currentSelectedInput || (!searchMapStore.state.searchFields.name.length && searchMapStore.state.locationFilter?.id !== NEAR_ME)) && (
            <div class="body-block">{this.renderContent([nearMeItem])}</div>
          )}
        </div>
      </Host>
    );
  }
}
