import { Component, Host, h, State, Listen } from '@stencil/core';
import 'ionicons'
import {searchGeoMap} from '../../../core/api/searchGeo';
import { searchMapStore, routerStore } from '../../../core/stores'

@Component({
  tag: 'onekey-sdk-search',
  styleUrl: 'onekey-sdk-search.scss',
  shadow: false,
})
export class OnekeySdkSearch {

  nameInput!: HTMLInputElement;

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

  private onChange = async (e) => {
    this.formData = {...this.formData, [e.target.id]: e.target.value }
    if(e.target.id === 'address') {
      await searchGeoMap(e.target.value)
    }
  }

  @Listen("selectAddress")
  onSelectAddress(e) {
    this.selectedAddress = {...e.detail }
  }

  render() {
    return (
      <Host>
        {
          searchMapStore.state.loading && <onekey-sdk-loading></onekey-sdk-loading>
        }
        <div class="main-block search-block">
          <div class="search-hpc">
            <onekey-sdk-router-link url="/" class="search-back">
              <ion-icon name="arrow-back-outline" size="large"></ion-icon>
            </onekey-sdk-router-link>
            <form onSubmit={this.onSearch} class="search-form">
              <div class="search-form-content">
                <input ref={el => this.nameInput = el} value={this.formData.name} id="name" placeholder="Name, Speciality, Establishment..." onChange={this.onChange} autoComplete="off" />
                <input value={this.selectedAddress.label} id="address" placeholder="Near me" onChange={this.onChange} autoComplete="off" />
              </div>
              <button class="icon btn search-address-btn" type="submit"><ion-icon name="search-outline"></ion-icon></button>
            </form>
          </div>
        </div>
        <div class="main-contain search-content">
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
