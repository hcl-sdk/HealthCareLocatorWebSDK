import { Component, Host, h } from '@stencil/core';
import cn from 'classnames';
import { configStore, searchMapStore, uiStore } from 'onekey-sdk-web-ui/src/core/stores';
import sortBy from 'lodash.sortby';
import { t } from '../../../utils/i18n';

@Component({
  tag: 'onekey-sdk-sort',
  styleUrl: 'onekey-sdk-sort.scss',
  shadow: false,
})
export class OnekeySdkSort {
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
        ...searchMapStore.state.sortValues,
        [name]: checked,
      },
    });
  };

  onReset = () => {
    searchMapStore.setState({
      sortValues: {
        relevance: false,
        distance: false,
        lastName: false,
      },
    });
  };

  render() {
    const onekeySDKSortClass = cn('onekey-sdk-sort', {});
    const { lastName, relevance, distance } = searchMapStore.state.sortValues;
    return (
      <Host class={`size-${uiStore.state.breakpoint.screenSize}`}>
        <div class={onekeySDKSortClass}>
          <form class="sort-body" onSubmit={this.onSubmit}>
            <div class="sort-option">
              <div class="sort-option-item">
                <label htmlFor="relevance">{t('relevance_item')}</label>
                <onekey-sdk-input type="checkbox" id="relevance" name="relevance" checked={relevance} onInput={this.onChange} />
              </div>

              <div class="sort-option-item">
                <label htmlFor="distance">{t('distance_item')}</label>
                <onekey-sdk-input type="checkbox" id="distance" name="distance" checked={distance} onInput={this.onChange} />
              </div>

              <div class="sort-option-item">
                <label htmlFor="name">{t('name_item')}</label>
                <onekey-sdk-input type="checkbox" id="lastName" name="lastName" checked={lastName} onInput={this.onChange} />
              </div>
            </div>
            <div class="sort-action">
              <onekey-sdk-button isFull type="button" onClick={this.onReset}>
                {t('reset_button')}
              </onekey-sdk-button>
              <onekey-sdk-button isFull type="submit">
                {t('apply_button')}
              </onekey-sdk-button>
            </div>
          </form>
        </div>
      </Host>
    );
  }
}
