import { Component, Host, h, State } from '@stencil/core';
import 'ionicons'
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { searchMapStore, routerStore } from '../../../core/stores'

@Component({
  tag: 'onekey-sdk-search',
  styleUrl: 'onekey-sdk-search.scss',
  shadow: false,
})
export class OnekeySdkSearch {
  @State() formData = {
    name: '',
    address: ''
  };
  @State() searchResult = [];
  @State() selectedAddress: any = {};
  provider = new OpenStreetMapProvider();

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
      const results = await this.provider.search({ query: e.target.value });
      this.searchResult = [...results]
    }
  }

  onSelectAddress = (addr) => {
    this.selectedAddress = {...addr }
  }

  render() {
    return (
      <Host>
        <div class="main-block-full main-block--full">
          <div class="search-hpc">
            <onekey-sdk-router-link url="/" class="btn-back">
              <ion-icon name="arrow-back-outline" size="large"></ion-icon>
            </onekey-sdk-router-link>
            <form onSubmit={this.onSearch} class="search-form">
              <div>
                <input id="name" placeholder="Name, Speciality, Establishment..." onChange={this.onChange}/>
                <input value={this.selectedAddress.label} id="address" placeholder="Near me" onChange={this.onChange} />
              </div>
              <button class="icon btn search-btn" type="submit"><ion-icon name="search-outline"></ion-icon></button>
            </form>
          </div>
        </div>
        <div class="main-contain">
          <ul>
            {
              this.searchResult.map(elm => (
              <li class={`search-address-item ${this.selectedAddress?.raw?.place_id === elm.raw.place_id ? 'active': ''}`} onClick={() => this.onSelectAddress(elm)}>{elm.label}</li>
              ))
            }
          </ul>
        </div>
      </Host>
    );
  }
}