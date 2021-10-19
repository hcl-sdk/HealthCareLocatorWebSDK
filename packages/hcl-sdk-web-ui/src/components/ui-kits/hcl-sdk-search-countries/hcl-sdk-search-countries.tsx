import { Component, h, Host, Prop, Event, EventEmitter } from '@stencil/core'
import { CountryCode } from '../../../core/constants';
import { SearchInputName } from '../../../core/stores/SearchMapStore';

@Component({
  tag: 'hcl-sdk-search-countries',
  styleUrl: 'hcl-sdk-search-countries.scss',
  shadow: false,
})

export class HclSdkSearchCountries {
  @Prop() currentSelectedInput: SearchInputName;
  @Prop() data: { code: CountryCode, label: string }[]
  @Event() selectCountry: EventEmitter;

  onClick(item) {
    this.selectCountry.emit(item)
  }

  render() {
    return (
      <Host>
        <ul class={`hclsdk-search__dropdown ${this.currentSelectedInput}`} tabIndex={-1}>
          {
            this.data.map(item => (
              <li class="search-country-item" role="button" onClick={() => this.onClick(item)}>
                <hcl-sdk-icon-flag countryCode={item.code} />
                <span>{ item.label }</span>
              </li>
            ))
          }
        </ul>
      </Host>
    )
  }
}