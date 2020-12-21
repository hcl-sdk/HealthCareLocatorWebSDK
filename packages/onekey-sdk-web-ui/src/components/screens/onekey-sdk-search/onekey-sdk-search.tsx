import { Component, Host, h, State, Listen, Prop } from '@stencil/core';
import { searchDoctor, searchLocation } from '../../../core/api/hcp';
import { searchMapStore, routerStore, uiStore } from '../../../core/stores';
import debounce from 'lodash.debounce';
import cls from 'classnames';
import { searchGeoMap } from '../../../core/api/searchGeo';

@Component({
  tag: 'onekey-sdk-search',
  styleUrl: 'onekey-sdk-search.scss',
  shadow: false,
})
export class OnekeySdkSearch {
  nameInput!: HTMLInputElement;
  addressInput!: HTMLInputElement;

  @State() formData = {
    name: '',
    address: '',
  };
  @State() searchResult = [];
  @State() selectedAddress: any = {};
  @State() selectedDoctor: any = {};
  @State() currentSelectedInput: string;
  @Prop() noIcon: boolean;
  @Prop() searchText: string;
  @Prop() showSwitchMode?: boolean = false;

  fields = {
    name: null,
    address: null
  }

  componentWillLoad() {
    this.formData = {
      ...this.formData,
      name: searchMapStore.state.search.name,
    };
  }

  private onSearch = async e => {
    e.preventDefault();

    const { name } = e.target;
    this.checkValidElm(name);

    const { isSmallView } = this.getViewSize();

    if (name.value) {
      if (isSmallView) {
        searchMapStore.setState({
          search: {
            name: this.selectedDoctor.label,
            selectedItem: this.selectedAddress,
          },
        });
      } else {
        const { lat, lng } = this.selectedAddress
        await searchLocation({
          specialties: searchMapStore.state.selectedValues?.name?.specialties,
          location: searchMapStore.state.selectedValues?.address?.lat ? { lat, lon: lng } : {},
        });
      }
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
    this.currentSelectedInput = inputName;

    if (inputValue) {
      this.formData = { ...this.formData, [inputName]: inputValue };
      inputName === 'name'
        ? await searchDoctor({
            criteria: inputValue,
          })
        : await searchGeoMap({
            id: inputValue,
          });
    }
  }, 500);

  @Listen('selectAddress')
  onSelectAddress(e) {
    console.log(e)
    if (this.currentSelectedInput === 'address') {
      this.selectedAddress = { ...e.detail };
      searchMapStore.setState({
        selectedValues: {
          ...searchMapStore.state.selectedValues,
          address: { ...e.detail },
        },
      });
    } else {
      searchMapStore.setState({
        selectedValues: {
          ...searchMapStore.state.selectedValues,
          name: { ...e.detail },
        },
      });
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
        {data && data.map(item => <onekey-sdk-search-address-item item={item} currentSearchText={this.formData[this.currentSelectedInput]} />)}
      </div>
    );
  };

  resetValue = (key, focusField = false) => {
    searchMapStore.setState({
      selectedValues: {
        ...searchMapStore.state.selectedValues,
        [key]: null,
      },
    });
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
    const searchSpecialtiesData = searchMapStore.state?.searchGeo.length > 0 ? [{ name: 'Near me' }, ...searchMapStore.state?.searchGeo] : [{ name: 'Near me' }];

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
                      ref={(el) => this.fields.name = el}
                      postfixIcon={selectedDoctorName ? 'remove' : ''}
                      name="name"
                      value={selectedDoctorName}
                      placeholder="Name, Specialty"
                      onInput={this.onChange}
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
                      ref={(el) => this.fields.address = el}
                      postfixIcon={selectedAddressName ? 'remove' : ''}
                      name="address"
                      value={selectedAddressName}
                      placeholder="Where? (address, city...)"
                      onInput={this.onChange}
                      autoComplete="off"
                      loading={addressInputLoading}
                      onPostfixClick={() => this.resetValue('address', true)}
                      onFocus={this.onFocusInputSearch}
                      onBlur={this.onBlurInputSearch}
                    >
                      {!isSmallView && searchSpecialtiesData.length && this.currentSelectedInput === 'address' && this.renderContent(searchSpecialtiesData)}
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
          {isSmallView && <div class="body-block">{searchDoctorData.length && this.currentSelectedInput === 'name' && this.renderContent(searchDoctorData)}</div>}
        </div>
      </Host>
    );
  }
}
