import { Component, Host, h, State } from '@stencil/core';
import cn from 'classnames';
import { searchMapStore, uiStore } from '../../../core/stores';
import { t } from '../../../utils/i18n';
import { SortValue } from '../../../core/stores/SearchMapStore';

@Component({
  tag: 'hcl-sdk-sort',
  styleUrl: 'hcl-sdk-sort.scss',
  shadow: false,
})
export class HclSdkSort {
  @State() sortValues: SortValue

  componentWillLoad() {
    this.sortValues = searchMapStore.state.sortValues

    searchMapStore.storeInstance
      .onChange('sortValues', (newSortValues: SortValue) => {
        if (newSortValues !== this.sortValues) {
          this.sortValues = newSortValues
        }
      })
  }

  onSubmit = e => {
    e.preventDefault();
    searchMapStore.setState({
      sortValues: this.sortValues
    })
  };

  onChange = e => {
    const { name, checked } = e.target;

    this.sortValues = {
      distanceNumber: false,
      lastName: false,
      relevance: false,
      [name]: checked,
    }
  };

  onReset = () => {
    this.sortValues = searchMapStore.state.sortValues
  };

  render() {
    const hclSDKSortClass = cn('hcl-sdk-sort', {});
    const { lastName, distanceNumber, relevance } = this.sortValues;
    return (
      <Host class={`size-${uiStore.state.breakpoint.screenSize}`}>
        <div class={hclSDKSortClass}>
          <form class="sort-body" onSubmit={this.onSubmit}>
            <div class="sort-option">
              <div class="sort-option-item">
                <label htmlFor="relevance">{t('relevance_item')}</label>
                <hcl-sdk-input type="checkbox" id="relevance" name="relevance" checked={relevance} onInput={this.onChange} />
              </div>

              <div class="sort-option-item">
                <label htmlFor="distance">{t('distance_item')}</label>
                <hcl-sdk-input type="checkbox" id="distanceNumber" name="distanceNumber" checked={distanceNumber} onInput={this.onChange} />
              </div>

              <div class="sort-option-item">
                <label htmlFor="name">{t('name_item')}</label>
                <hcl-sdk-input type="checkbox" id="lastName" name="lastName" checked={lastName} onInput={this.onChange} />
              </div>
            </div>
            <div class="sort-action">
              <hcl-sdk-button isFull type="button" onClick={this.onReset}>
                {t('reset_button')}
              </hcl-sdk-button>
              <hcl-sdk-button isFull type="submit">
                {t('apply_button')}
              </hcl-sdk-button>
            </div>
          </form>
        </div>
      </Host>
    );
  }
}
