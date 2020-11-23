import { Component, Host, h, State, Listen } from '@stencil/core';
import 'ionicons'
import {searchGeoMap} from '../../../core/api/searchGeo';
import { searchMapStore, routerStore } from '../../../core/stores'
import debounce from 'lodash.debounce'

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
    address: ''
  };
  @State() searchResult = [];
  @State() selectedAddress: any = {};

  componentWillLoad() {
    this.formData = {
      ...this.formData,
      name: searchMapStore.state.search.name
    };
  }

  componentDidLoad() {
    this.nameInput.focus();
  }


  private onSearch = (e) => {
    e.preventDefault()

    searchMapStore.setState({
      search: {
        ...this.formData,
        selectedItem: this.selectedAddress
      }
    })
    routerStore.push('/search-result')
  }

  onChange = debounce(async () => {
    if (this.addressInput.id === 'address' && this.addressInput.value) {
      this.formData = {...this.formData, [this.addressInput.id]: this.addressInput.value }
      await searchGeoMap(this.addressInput.value)
    }

    if (this.nameInput.id === 'name' && this.nameInput.value) {
      this.formData = {...this.formData, [this.nameInput.id]: this.nameInput.value }
    }
  }, 500)

  @Listen("selectAddress")
  onSelectAddress(e) {
    this.selectedAddress = {...e.detail }
  }

  render() {
    return (
      <Host>
        <div class="main-block search-block">
          <div class="search-hpc">
            <onekey-sdk-router-link url="/" class="search-back">
              <ion-icon name="arrow-back-outline" size="large"></ion-icon>
            </onekey-sdk-router-link>
            <form onSubmit={this.onSearch} class="search-form">
              <div class="search-form-content">
                <input ref={el => this.nameInput = el} value={this.formData.name} id="name" placeholder="Name, Speciality, Establishment..." onInput={this.onChange} autoComplete="off" />
                <input ref={el => this.addressInput = el} value={this.selectedAddress.label} id="address" placeholder="Near me" onInput={this.onChange} autoComplete="off" />
              </div>
              <button disabled={!this.selectedAddress?.raw?.place_id || !this.formData.name} class="icon btn search-address-btn" type="submit"><ion-icon name="search-outline"></ion-icon></button>
            </form>
          </div>
        </div>
        <div class="main-contain search-content">
          {
            searchMapStore.state.loading && <onekey-sdk-loading></onekey-sdk-loading>
          }
          {
            searchMapStore.state?.searchGeo?.map(
              item => <onekey-sdk-search-address-item
                item={item}
                activated={this.selectedAddress?.raw?.place_id === item.raw.place_id}
              />
            )
          }
        </div>
      </Host>
    );
  }
}
