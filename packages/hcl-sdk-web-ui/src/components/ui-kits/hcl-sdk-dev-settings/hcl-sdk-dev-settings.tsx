import { Component, Host, h, State } from '@stencil/core';
import cls from 'classnames';
import { storageUtils, OKSDK_DEV_SETTINGS } from '../../../utils/storageUtils';
import { getI18nLabels } from '../../../utils/i18n';
import { configStore } from '../../../core/stores';

interface DevSettings {
  [k: string]: any;
}

const defaultSettings = {
  lang: 'en',
  screenLayout: 'desktop',
};

const storeSettings = (settings: DevSettings) => {
  storageUtils.setObject(OKSDK_DEV_SETTINGS, settings);
};

const loadSettings = (): DevSettings => {
  return storageUtils.getObject(OKSDK_DEV_SETTINGS, defaultSettings);
};

const optionSets = [
  {
    key: 'lang',
    label: 'Language',
    type: 'select',
    options: [
      { label: 'English', value: 'en' },
      { label: 'French', value: 'fr_CA' },
    ],
  },
  {
    key: 'screenLayout',
    label: 'Screen Layout',
    type: 'select',
    options: [
      { label: 'Desktop', value: 'desktop' },
      { label: 'Mobile', value: 'mobile' },
      { label: 'Tablet', value: 'tablet' },
    ],
  },
  {
    key: 'apiKey',
    label: 'API Key',
    type: 'text'
  }
];

@Component({
  tag: 'hcl-sdk-dev-settings',
  styleUrl: 'hcl-sdk-dev-settings.scss',
})
export class HclSDKViewport {
  @State() settings = loadSettings() || defaultSettings;
  @State() isCollapsed = false;

  componentWillLoad() {
    this.applySettings();
  }

  applySettings() {
    const wrapper = document.querySelector('.hcl-sdk-wrapper');
    wrapper.classList.remove(...optionSets.find(o => o.key === 'screenLayout').options.map(o => o.value));
    wrapper.classList.add(this.settings.screenLayout);

    if (this.settings.lang && document.documentElement.lang !== this.settings.lang) {
      document.documentElement.lang = this.settings.lang;
      if (configStore.state.locale) {
        getI18nLabels(this.settings.lang);
      }
    }
  }

  changeSetting(k, v) {
    this.settings = {
      ...this.settings,
      [k]: v,
    };
    storeSettings(this.settings);
    this.applySettings();
  }

  handleCollapseBtnClick = () => {
    this.isCollapsed = !this.isCollapsed;
  };

  renderSetting(setting) {
    return (
      <div class="setting">
        <label>{setting.label}</label>
        {
          setting.type === 'select' && (
            <select onChange={e => this.changeSetting(setting.key, (e.target as any).value)}>
              {setting.options.map(option => (
                <option value={option.value} selected={this.settings[setting.key] === option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )
        }
        {
          setting.type === 'text' && (
            <input
              value={this.settings[setting.key]}
              onChange={e => this.changeSetting(setting.key, (e.target as any).value)}
            />
          )
        }
      </div>
    );
  }

  render() {
    const className = cls('dev-settings', {
      collapsed: this.isCollapsed,
    });
    return (
      <Host>
        <slot></slot>
        <div class={className}>
          <div class="dev-settings-collapse-btn" onClick={this.handleCollapseBtnClick}>
            {this.isCollapsed ? '<' : '>'}
          </div>
          {optionSets.map(optionSet => this.renderSetting(optionSet))}
        </div>
      </Host>
    );
  }
}
