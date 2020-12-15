import { Component, Host, h, State, Listen, Prop } from '@stencil/core';
import { searchDoctor, searchLocation } from '../../../core/api/hcp';
import { searchMapStore, routerStore, configStore } from '../../../core/stores';
import debounce from 'lodash.debounce';
import cls from 'classnames';

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

  private onSearch = async e => {
    e.preventDefault();

    const { name } = e.target;
    this.checkValidElm(name);

    const { isSmallView } = this.getViewSize()

    if (name.value) {
      if(isSmallView) {
        searchMapStore.setState({
          search: {
            name: this.selectedDoctor.label,
            selectedItem: this.selectedAddress,
          },
        });
      } else {
        await searchLocation({
          specialties: searchMapStore.state.selectedValues.name.specialties,
        })
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
        : await searchLocation({
          id: inputValue,
        });
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

    this.resetDataResult();
    this.currentSelectedInput = null;
  }

  resetDataResult = () => {
    searchMapStore.setState({
      searchDoctor: [],
      specialties: [],
    });
  }

  renderContent = data => {
    return (
      <div class={`main-contain search-content ${this.currentSelectedInput}`}>
        {data && data.map(item => <onekey-sdk-search-address-item item={item} currentSearchText={this.formData[this.currentSelectedInput]} />)}
      </div>
    );
  };

  resetValue = key => {
    searchMapStore.setState({
      selectedValues: {
        ...searchMapStore.state.selectedValues,
        [key]: null,
      },
    });
  };

  resetInputValue = () => {
    this.resetValue("name")
    this.resetValue("address")
  }

  onFocusInputSearch = () => {
    searchMapStore.setState({ searchDoctor: [] });
  }

  getViewSize = () => {
    const isSmallView = ['xs', 'sm', 'md'].includes(configStore.state.viewPortSize);
    return {
      isSmallView
    }
  }

  render() {
    const selectedDoctorName = searchMapStore.state.selectedValues?.name?.name;
    const searchDoctorData = searchMapStore.state?.searchDoctor.length > 0 && searchMapStore.state?.searchDoctor;
  
    const selectedAddressName = searchMapStore.state.selectedValues?.address?.address;
    const searchSpecialtiesData = searchMapStore.state?.specialties.length > 0 && [{ name: "Near me" }, ...searchMapStore.state?.specialties];

    const searchData = searchSpecialtiesData || searchDoctorData;
    const isSmallView = this.getViewSize().isSmallView;
    const nameInputLoading = this.currentSelectedInput === 'name' && searchMapStore.state.loading;
    const addressInputLoading = this.currentSelectedInput === 'address' && searchMapStore.state.loading;
    const resetSearchClass = cls("reset-search", {
      hide: !selectedDoctorName && !selectedAddressName
    })

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
                    onPostfixClick={() => this.resetValue('name')}
                    autoFocus
                    onFocus={this.onFocusInputSearch}
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
                    onPostfixClick={() => this.resetValue('address')}
                    onFocus={this.onFocusInputSearch}
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

        {isSmallView && this.renderContent(searchData)}
      </Host>
    );
  }
}
