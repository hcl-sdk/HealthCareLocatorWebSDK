import { Component, Host, h, State, Listen, Prop } from '@stencil/core';
import { searchGeoMap } from '../../../core/api/searchGeo';
import { searchDoctor } from '../../../core/api/hcp';
import { searchMapStore, routerStore, configStore } from '../../../core/stores';
import debounce from 'lodash.debounce';

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

  componentWillLoad() {
    this.formData = {
      ...this.formData,
      name: searchMapStore.state.search.name,
    };
  }

  private onSearch = e => {
    e.preventDefault();

    const { name } = e.target;
    this.checkValidElm(name)
    if (name.value) {
      searchMapStore.setState({
        search: {
          name: this.selectedDoctor.label,
          selectedItem: this.selectedAddress,
        },
      });
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
    const inputValue = e.path[0].value
    this.checkValidElm(e.path[0])
    this.currentSelectedInput = inputName;

    if(inputValue) {
      this.formData = { ...this.formData, [inputName]: inputValue };
      inputName === 'name' ? await searchDoctor() : await searchGeoMap(inputValue);
    }
  }, 500);

  @Listen('selectAddress')
  onSelectAddress(e) {
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

    searchMapStore.setState({
      searchDoctor: [],
      searchGeo: [],
    });
    this.currentSelectedInput = null;
  }

  getActivation = (item: any): boolean => {
    if (this.currentSelectedInput === 'address') {
      return this.selectedAddress?.raw?.place_id === item?.raw?.place_id;
    } else {
      return this.selectedDoctor.id === item.id;
    }
  };

  renderContent = data => {
    return (
      <div class={`main-contain search-content ${this.currentSelectedInput}`}>
        {data && data.map(item => <onekey-sdk-search-address-item item={item} activated={this.getActivation(item)} />)}
      </div>
    );
  };

  resetValue = (key) => {
    searchMapStore.setState({
      selectedValues: {
        ...searchMapStore.state.selectedValues,
        [key]: null,
      },
    });
  }

  render() {
    const searchGeoData = searchMapStore.state?.searchGeo.length > 0 && searchMapStore.state?.searchGeo;
    const searchDoctorData = searchMapStore.state?.searchDoctor.length > 0 && searchMapStore.state?.searchDoctor;
    const selectedDoctorName = searchMapStore.state.selectedValues?.name?.label;
    const selectedAddressName = searchMapStore.state.selectedValues?.address?.label;
    const searchData = searchGeoData || searchDoctorData;
    const isSmallView = ['xs', 'sm', 'md'].includes(configStore.state.viewPortSize);
    const nameInputLoading = this.currentSelectedInput === 'name' && searchMapStore.state.loading
    const addressInputLoading = this.currentSelectedInput === 'address' && searchMapStore.state.loading

    return (
      <Host class={`size-${configStore.state.viewPortSize}`}>
        <div class="main-block search-block">
          <div class="search-hpc">
            <onekey-sdk-router-link url="/" class="search-back">
              <onekey-sdk-icon name="arrow" width={25} height={25} color="black" />
            </onekey-sdk-router-link>
            <form class="search-form" onSubmit={this.onSearch}>
              <div class="search-form-content">
                <div class="search-form-content-item">
                  <onekey-sdk-input
                    postfixIcon={selectedDoctorName ? 'remove' : ''}
                    name="name"
                    value={selectedDoctorName}
                    placeholder="Name, Specialty"
                    onInput={this.onChange}
                    autoComplete="off"
                    loading={nameInputLoading}
                    onPostfixClick={()=> this.resetValue("name")}
                    autoFocus
                  >
                    {!isSmallView && searchDoctorData.length && this.currentSelectedInput === 'name' && this.renderContent(searchDoctorData)}
                  </onekey-sdk-input>
                </div>
                <div class="search-form-content-item">
                  <onekey-sdk-input
                    postfixIcon={selectedAddressName ? 'remove' : ''}
                    name="address"
                    value={selectedAddressName}
                    placeholder="Near me"
                    onInput={this.onChange}
                    autoComplete="off"
                    loading={addressInputLoading}
                    onPostfixClick={()=> this.resetValue("address")}
                  >
                    {!isSmallView && searchGeoData.length && this.currentSelectedInput === 'address' && this.renderContent(searchGeoData)}
                  </onekey-sdk-input>
                </div>
              </div>
              {this.searchText ? (
                <onekey-sdk-button primary type="submit"  class="search-address-btn">
                  {this.searchText}
                </onekey-sdk-button>
              ) : (
                <onekey-sdk-button primary type="submit" icon="search" class="search-address-btn" />
              )}
            </form>
            <div>
              <slot></slot>
              {
                this.showSwitchMode &&
                <div class="switch-mode">
                  <onekey-sdk-switch-view-mode typeOfLabel="short" />
                </div>
              }

            </div>
          </div>
        </div>

        {isSmallView && this.renderContent(searchData)}
      </Host>
    );
  }
}
