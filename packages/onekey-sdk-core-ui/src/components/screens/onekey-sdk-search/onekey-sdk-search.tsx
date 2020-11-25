import { Component, Host, h, State, Listen } from '@stencil/core';
import 'ionicons'
import {searchGeoMap} from '../../../core/api/searchGeo';
import { searchDoctor } from '../../../core/api/hcp';
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
  @State() selectedDoctor: any = {}
  @State() currentSelectedInput: string;

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

    console.dir(e.target)

    const { name, address } = e.target

    console.log({ name, address })

    if (name.value && address.value) {
      searchMapStore.setState({
        search: {
          name: this.selectedDoctor.label,
          selectedItem: this.selectedAddress
        }
      })
      routerStore.push('/search-result')
    } else {
      this.checkValidElm(name)
      this.checkValidElm(address)
    }

   
  }

  checkValidElm = (elm) => {
    if(!elm.value) {
      elm.classList.add('error');
    } else {
      elm.classList.remove('error');
    }
  }

  onChange = debounce(async (e) => {
    const inputName = e.path[0].name
    this.checkValidElm(e.path[0])
    if (inputName === 'address' && this.addressInput.value) {
      this.formData = {...this.formData, [inputName]: this.addressInput.value }
      await searchGeoMap(this.addressInput.value)
    }

    if (inputName === 'name' && this.nameInput.value) {
      this.formData = {...this.formData, [inputName]: this.nameInput.value }
      await searchDoctor()
    }

    this.currentSelectedInput = e.path[0].name
  }, 1000)

  @Listen("selectAddress")
  onSelectAddress(e) {
    if(this.currentSelectedInput === "address") {
      this.selectedAddress = {...e.detail }
    } else {
      this.selectedDoctor = {...e.detail }
    }
  }

  getActivation = (item: any): boolean => {
    if(this.currentSelectedInput === "address") {
      return this.selectedAddress?.raw?.place_id === item?.raw?.place_id
    } else {
      return this.selectedDoctor.id === item.id
    }
  }

  render() {
    console.log(searchMapStore.state.searchGeo)
    return (
      <Host>
        <div class="main-block search-block">
          <div class="search-hpc">
            <onekey-sdk-router-link url="/" class="search-back">
              <ion-icon name="arrow-back-outline" size="large"></ion-icon>
            </onekey-sdk-router-link>
            <form onSubmit={this.onSearch} class="search-form">
              <div class="search-form-content">
                <input name="name" ref={el => this.nameInput = el} value={this.selectedDoctor.label} id="name" placeholder="Name, Speciality, Establishment..." onInput={this.onChange} autoComplete="off" />
                <input name="address" ref={el => this.addressInput = el} value={this.selectedAddress.label} id="address" placeholder="Near me" onInput={this.onChange} autoComplete="off" />
              </div>
              <button disabled={!this.selectedAddress?.raw?.place_id || !this.selectedDoctor.label} class="icon btn search-address-btn" type="submit"><ion-icon name="search-outline"></ion-icon></button>
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
                activated={this.getActivation(item)}
              />
            )
          }
        </div>
      </Host>
    );
  }
}
