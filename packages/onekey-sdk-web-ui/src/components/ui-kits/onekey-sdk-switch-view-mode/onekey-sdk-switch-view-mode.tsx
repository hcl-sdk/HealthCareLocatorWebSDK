import { Component, Host, h, EventEmitter, Event, Prop } from '@stencil/core';
import cls from 'classnames'
import { configStore } from 'onekey-sdk-web-ui/src/core/stores';
import { ModeViewType } from 'onekey-sdk-web-ui/src/core/stores/ConfigStore';
import { t } from '../../../utils/i18n';
@Component({
  tag: 'onekey-sdk-switch-view-mode',
  styleUrl: 'onekey-sdk-switch-view-mode.scss',
  shadow: true,
})
export class OnekeySdkSwitchViewMode {
  @Event() switchViewMode: EventEmitter;
  @Prop() typeOfLabel: 'full' | 'short' | 'disabled' = 'full'

  labels = {
    full: {
      list: "list_label",
      map: "map_label"
    },
    short: {
      list: "list_label",
      map: "map_label"
    },
    disabled: {
      list: '',
      map: ''
    }
  }

  onSwitch = (mode) => {
    configStore.setState({
      modeView: mode
    })
  }

  render() {
    const listViewClass = cls("mode-item", {
      'active': configStore.state.modeView === ModeViewType.LIST
    })

    const mapViewClass = cls("mode-item", {
      'active': configStore.state.modeView === ModeViewType.MAP
    })

    return (
      <Host>
        <div class={listViewClass} onClick={() => this.onSwitch(ModeViewType.LIST)}>
          <ion-icon name="list"></ion-icon>
          <span>{!!this.labels[this.typeOfLabel].list && t(this.labels[this.typeOfLabel].list)}</span>
        </div>
        <div class={mapViewClass} onClick={() => this.onSwitch(ModeViewType.MAP)}>
          <ion-icon name="map-sharp"></ion-icon>
          <span>{!!this.labels[this.typeOfLabel].map && t(this.labels[this.typeOfLabel].map)}</span>
        </div>
      </Host>
    );
  }

}
