import { formatDistance } from 'date-fns';
import { Component, h, Host, State } from '@stencil/core';
import { historyStore } from '../../../../core/stores';
@Component({
  tag: 'onekey-sdk-home-full',
  shadow: false,
})
export class OnekeySdkHomeFull {
  @State() showMoreSearchItems: boolean = false;
  @State() showMoreHcpItems: boolean = false;

  filterHistoryItems = (showMore: boolean) => (_: any, index: number) => {
    if (showMore) {
      return index < 10;
    }
    return index < 3;
  };

  renderViewMore(items: any[], showMoreState: string) {
    if (this[showMoreState]) {
      return <button onClick={() => this[showMoreState] = false}>View less</button>;
    }
    if (!this[showMoreState] && items.length > 3) {
      return <button onClick={() => this[showMoreState] = true}>View more</button>;
    }
    return null;
  }

  renderSearchHistory() {
    return historyStore.state.searchItems.filter(this.filterHistoryItems(this.showMoreSearchItems)).map(searchItem => (
      <div class="history-item">
        <onekey-sdk-button noBorder icon="remove" iconWidth={12} iconHeight={12} iconColor="black" onClick={() => historyStore.removeItem('search', searchItem.id)} />
        <p class="history-item__criteria">{searchItem.criteria}</p>
        <p class="history-item__address">{searchItem.address}</p>
        <p class="history-item__time-from">{formatDistance(searchItem.timestamp, Date.now())}</p>
      </div>
    ));
  }

  renderHcpHistory() {
    return historyStore.state.hcpItems.filter(this.filterHistoryItems(this.showMoreHcpItems)).map(hcpItem => (
      <div class="history-item">
        <onekey-sdk-button noBorder icon="remove" iconWidth={12} iconHeight={12} iconColor="black" onClick={() => historyStore.removeItem('hcp', hcpItem.id)} />
        <p class="history-item__name">{hcpItem.hcpName}</p>
        <p class="history-item__specialty">{hcpItem.hcpSpecialty}</p>
        <p class="history-item__address">{hcpItem.address}</p>
        <p class="history-item__time-from">{formatDistance(hcpItem.timestamp, Date.now())}</p>
      </div>
    ));
  }

  render() {
    const { searchItems, hcpItems } = historyStore.state;
    return (
      <Host>
        <div class="card card--near-me">
          <div class="card__title-wrapper">
            <h3 class="card__title">HCPs near me</h3>
          </div>
          <div class="card__content-wrapper card__content-wrapper--with-padding">
            <onekey-sdk-map
              class="info-section-body__map hidden-lg hidden-xl"
              locations={[{ lat: 48.863699, lng: 2.4833 }]}
              selectedLocationIdx={0}
              defaultZoom={5}
              noCurrentLocation
              zoomControl={false}
              mapHeight="100px"
              dragging={false}
            />
          </div>
        </div>
        {!!searchItems.length && (
          <div class="card">
            <div class="card__title-wrapper">
              <h3 class="card__title">Last searches</h3>
              {this.renderViewMore(searchItems, 'showMoreSearchItems')}
            </div>
            <div class="card__content-wrapper">{this.renderSearchHistory()}</div>
          </div>
        )}
        {!!hcpItems.length && (
          <div class="card">
            <div class="card__title-wrapper">
              <h3 class="card__title">Last searches</h3>
              {this.renderViewMore(hcpItems, 'showMoreHcpItems')}
            </div>
            <div class="card__content-wrapper">{this.renderHcpHistory()}</div>
          </div>
        )}
      </Host>
    );
  }
}
