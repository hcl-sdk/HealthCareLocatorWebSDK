import { Component, h, Host, Prop, Event, EventEmitter } from '@stencil/core'
import { CountryCode } from '../../../core/constants';
import { SearchInputName } from '../../../core/stores/SearchMapStore';
import cls from 'classnames';

@Component({
  tag: 'hcl-sdk-search-countries',
  styleUrl: 'hcl-sdk-search-countries.scss',
  shadow: false,
})

export class HclSdkSearchCountries {
  @Prop() currentSelectedInput: SearchInputName;
  @Prop() data: { code: CountryCode, label: string }[]
  @Prop() selectedCountry: CountryCode;
  @Event() selectCountry: EventEmitter;

  onClick(item) {
    this.selectCountry.emit(item)
  }

  render() {
    return (
      <Host>
        <ul class={`hclsdk-search__dropdown ${this.currentSelectedInput}`} tabIndex={-1}>
          {
            this.data.map(item => {
              return item.label 
                ? (
                  <li data-code={item.code} class={cls('search-country-item', {
                    'search-country-item--active': this.selectedCountry === item.code
                  })} role="button" onClick={() => this.onClick(item)}>
                    <hcl-sdk-icon-flag countryCode={item.code} />
                    <span>{ item.label }</span>
                  </li>
                )
                : undefined
            })
          }
        </ul>
      </Host>
    )
  }
}