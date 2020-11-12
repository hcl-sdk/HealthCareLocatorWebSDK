import { h } from '@stencil/core'
import { Component, Prop } from '@stencil/core';
import { StoreProps, Store } from './provider'

@Component({
  tag: 'onekey-sdk-global-store'
})
export class GlobalStore {
  @Prop() renderer: Function = () => null;
  @Prop() store: StoreProps = {}


  setStore = (data) => {
    this.store = { ...this.store, ...data }
  }

  render() {
    return (
      <Store.Provider state={{ store: this.store, setStore: this.setStore }}>
        {this.renderer()}
      </Store.Provider>
    )
  }
}

