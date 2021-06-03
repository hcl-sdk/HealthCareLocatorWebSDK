import { Component, h, Listen, Method, Prop, State } from '@stencil/core';
import { searchMapStore } from '../../../core/stores';

@Component({
  tag: 'hcl-sdk-autocomplete-result',
})
export class HclSdkAutocompleteResult {
  @Prop() data: any;
  @Prop() type: 'name' | 'address'
  @Prop() currentSelectedInput: any;

  @State() itemIndex: number = 0;

  ref;

  componentDidLoad() {
    this.itemIndex = this.getFirstItemIndex()
  }

  private getFirstItemIndex() {
    const items = this.ref.getElementsByTagName('hcl-sdk-search-address-item');
    if (this.type === 'address') {
      return 0;
    } else {
      return [...items].findIndex(ref => !ref.item.address);
    }
  }

  @Method()
  focusOnArrowKeyDown() {
    const items = this.ref.getElementsByTagName('hcl-sdk-search-address-item');

    if (items.length === 0) {
      return;
    }

    this.itemIndex = Math.min(items.length - 1, this.itemIndex + 1);
    items[this.itemIndex]?.focus({ preventScroll: true })
  }

  @Listen('keydown')
  handleKeyDown(ev: KeyboardEvent) {
    ev.preventDefault()
    const items = this.ref.getElementsByTagName('hcl-sdk-search-address-item');

    if (items.length === 0) {
      return;
    }

    if (ev.key === 'ArrowDown') {
      this.itemIndex = Math.min(items.length - 1, this.itemIndex + 1);
    } else if (ev.key === 'ArrowUp') {
      this.itemIndex = Math.max(0, this.itemIndex - 1);
    }

    items[this.itemIndex]?.focus()
  }

  render() {
    return (
      <ul ref={el => this.ref = el} class={`hclsdk-search__dropdown ${this.currentSelectedInput}`} tabIndex={-1}>
        {this.data &&
          this.data.map((item, idx) => (
            <hcl-sdk-search-address-item
              item={item}
              selected={idx === this.itemIndex}
              currentSearchText={searchMapStore.state.searchFields.name}
            />
          ))}
      </ul>
    );
  }
}
