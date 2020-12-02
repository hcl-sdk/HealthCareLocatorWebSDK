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

  componentWillLoad() {
    this.formData = {
      ...this.formData,
      name: searchMapStore.state.search.name,
    };
  }

  componentDidLoad() {
    this.nameInput.focus();
  }

  private onSearch = e => {
    e.preventDefault();

    console.dir(e.target);

    const { name, address } = e.target;

    console.log({ name, address });

    if (name.value && address.value) {
      searchMapStore.setState({
        search: {
          name: this.selectedDoctor.label,
          selectedItem: this.selectedAddress,
        },
      });
      routerStore.push('/search-result');
    } else {
      this.checkValidElm(name);
      this.checkValidElm(address);
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
    console.log(e.path[0].value, "e.path[0]")
    this.checkValidElm(e.path[0]);

    if(inputValue) {
      this.formData = { ...this.formData, [inputName]: inputValue };
      inputName === 'name' ? await searchDoctor() : await searchGeoMap(inputValue);
    }
    this.currentSelectedInput = inputName;
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

  render() {
    const searchGeoData = searchMapStore.state?.searchGeo.length > 0 && searchMapStore.state?.searchGeo;
    const searchDoctorData = searchMapStore.state?.searchDoctor.length > 0 && searchMapStore.state?.searchDoctor;
    const selectedDoctorName = searchMapStore.state.selectedValues?.name?.label;
    const selectedAddressName = searchMapStore.state.selectedValues?.address?.label;
    const searchData = searchGeoData || searchDoctorData;
    const isSmallView = ['xs', 'sm', 'md'].includes(configStore.state.viewPortSize);
    console.log(this.currentSelectedInput)

    return (
      <Host>
        <div class="main-block search-block">
          <div class="search-hpc">
            <onekey-sdk-router-link url="/" class="search-back">
              <onekey-sdk-icon name="arrow" width={25} height={25} color="black" />
            </onekey-sdk-router-link>
            <form onSubmit={this.onSearch} class="search-form">
              <div class="search-form-content">
                <div class="search-form-content-item">
                  <onekey-sdk-input
                    postfixIcon={selectedDoctorName ? 'remove' : ''}
                    name="name"
                    value={selectedDoctorName}
                    placeholder="Name, Speciality, Establishment..."
                    onInput={this.onChange}
                    autoComplete="off"
                    loading={this.currentSelectedInput === 'name' && searchMapStore.state.loading}
                  >
                    {!isSmallView && this.currentSelectedInput === 'name' && this.renderContent(searchDoctorData)}
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
                    loading={this.currentSelectedInput === 'address' && searchMapStore.state.loading}
                  >
                    {!isSmallView && this.currentSelectedInput === 'address' && this.renderContent(searchGeoData)}
                  </onekey-sdk-input>
                </div>
              </div>
              {this.searchText ? (
                <onekey-sdk-button primary class="search-address-btn">
                  {this.searchText}
                </onekey-sdk-button>
              ) : (
                <onekey-sdk-button primary icon="search" onSubmit={this.onSearch} class="search-address-btn" />
              )}
            </form>
          </div>
        </div>

        {isSmallView && this.renderContent(searchData)}
      </Host>
    );
  }
}
