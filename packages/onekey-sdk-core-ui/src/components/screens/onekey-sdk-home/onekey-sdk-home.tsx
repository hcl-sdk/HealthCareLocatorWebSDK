import { Component, Host, h } from '@stencil/core';
import 'ionicons'
import { test } from '../../../core/api/hcp';
import { routerStore, searchMapStore } from '../../../core/stores';

@Component({
  tag: 'onekey-sdk-home',
  styleUrl: 'onekey-sdk-home.scss',
  shadow: false,
})
export class OnekeySdkHome {

  onGoSearchScreen = () => {
    routerStore.push("/search")
  }

  componentDidLoad() {
    test()
  }

  inputOnChange = (e: any) => {
    searchMapStore.setState({
      search: {
        name: e.target.value
      }
    })
  }

  onSearch = () => {
    routerStore.push("/search")
  }

  render() {
    return (
      <Host>
        <div class="main-contain">
          <div class="main-block">
            <div class="search-hpc">
              <input class="onekey-sdk-input" placeholder="Find Healthcare Professional" onChange={this.inputOnChange} />
              <button class="btn" onClick={this.onSearch}><ion-icon name="search-outline"></ion-icon></button>
            </div>
          </div>
          <div class="main-block">
            <div class="home">
              <div class="header">
                <span class="title">Find and Locate</span>
                <span class="title">Healthcare Professional</span>
              </div>

              <div class="content">
                <div class="item">
                  <div class="item__icon"><ion-icon name="search-outline"></ion-icon></div>
                  <div>
                    <strong>Find and Locate other HCP</strong>
                    <span class="sub-text">Lorem ipsum dolor sit amet, consect adipiscing elit</span>
                  </div>
                </div>

                <div class="item">
                  <div class="item__icon"><ion-icon name="person-outline"></ion-icon></div>
                  <div>
                    <strong>Consult Profile</strong>
                    <span class="sub-text">Lorem ipsum dolor sit amet, consect adipiscing elit</span>
                  </div>
                  
                </div>

                <div class="item">
                  <div class="item__icon"><ion-icon name="pencil-outline"></ion-icon></div>
                  <div>
                    <strong>Request my Information update</strong>
                    <span class="sub-text">Lorem ipsum dolor sit amet, consect adipiscing elit</span>
                  </div>
                </div>
              </div>

              <div>
                <button class="btn block" onClick={this.onGoSearchScreen}>Start a New Search</button>
              </div>
            </div>
          </div>
        </div>

        
      </Host>
    );
  }
}
