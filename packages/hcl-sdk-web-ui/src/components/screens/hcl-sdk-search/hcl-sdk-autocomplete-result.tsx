import { Component, h, Listen, Method, Prop, State, Watch } from '@stencil/core';
import { searchMapStore } from '../../../core/stores';
import { SearchInputName } from '../../../core/stores/SearchMapStore';

@Component({
  tag: 'hcl-sdk-autocomplete-result',
})
export class HclSdkAutocompleteResult {
  @Prop() data: any;
  @Prop() type: SearchInputName
  @Prop() currentSelectedInput: SearchInputName;

  @State() itemIndex: number = 0;

  ref;

  componentDidLoad() {
    this.itemIndex = this.getFirstItemIndex()
  }

  @Watch('data')
  watchPropHandler(newValue) {
    if (newValue && newValue.length && this.ref && this.ref.scrollTo) {
      this.ref.scrollTo(0, 0)
    }
  }

  private getFirstItemIndex() {
    const items = this.ref.getElementsByTagName('hcl-sdk-search-address-item');
    if (this.type === 'name') {
      return [...items].findIndex(ref => !ref.item.address);
    } else { // Both address and medicalTerm
      return 0
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
    const currentSearchText = this.currentSelectedInput !== 'address' 
      ? searchMapStore.state.searchFields[this.currentSelectedInput] : ''
    return (
      <ul ref={el => this.ref = el} class={`hclsdk-search__dropdown ${this.currentSelectedInput}`} tabIndex={-1}>
        {this.data &&
          this.data.map((item, idx) => (
            <hcl-sdk-search-address-item
              item={item}
              selected={idx === this.itemIndex}
              currentSearchText={currentSearchText}
            />
          ))}
      </ul>
    );
  }
}
