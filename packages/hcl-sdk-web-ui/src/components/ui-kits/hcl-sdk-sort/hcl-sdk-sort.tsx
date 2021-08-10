import { Component, Host, h } from '@stencil/core';
import cn from 'classnames';
import { configStore, searchMapStore, uiStore } from 'hcl-sdk-web-ui/src/core/stores';
import sortBy from 'lodash.sortby';
import { t } from '../../../utils/i18n';

@Component({
  tag: 'hcl-sdk-sort',
  styleUrl: 'hcl-sdk-sort.scss',
  shadow: false,
})
export class HclSdkSort {
  onSubmit = e => {
    e.preventDefault();
    const { specialtiesRaw: specialties, sortValues } = searchMapStore.state;

    const sortByField = Object.keys(sortValues).filter(elm => sortValues[elm]);

    searchMapStore.setState({
      specialties: sortBy(specialties, sortByField),
    });

    configStore.setState({
      modal: undefined,
    });
  };

  onChange = e => {
    const { name, checked } = e.target;

    searchMapStore.setState({
      sortValues: {
        distanceNumber: false,
        lastName: false,
        [name]: checked,
      },
    });
  };

  onReset = () => {
    searchMapStore.setState({
      sortValues: {
        distanceNumber: false,
        lastName: true,
      },
    });
  };

  render() {
    const hclSDKSortClass = cn('hcl-sdk-sort', {});
    const { lastName, distanceNumber } = searchMapStore.state.sortValues;
    return (
      <Host class={`size-${uiStore.state.breakpoint.screenSize}`}>
        <div class={hclSDKSortClass}>
          <form class="sort-body" onSubmit={this.onSubmit}>
            <div class="sort-option">
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
