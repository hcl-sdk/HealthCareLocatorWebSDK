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
  enableDarkMode: false,
  enableMapDarkMode: false,
  enableMedicalTerm: false,
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
      { label: 'Deutsch', value: 'de_DE' },
      { label: 'English', value: 'en' },
      { label: 'Español', value: 'es_ES' },
      { label: 'Español (CO)', value: 'es_CO' },
      { label: 'Français', value: 'fr_FR' },
      { label: 'Français (CA)', value: 'fr_CA' },
      { label: 'Italiano', value: 'it_IT' },
      { label: 'Nederlands', value: 'nl_NL' },
      { label: 'Polski', value: 'pl_PL' },
      { label: 'Português (PT)', value: 'pt_PT' },
      { label: 'Türkçe', value: 'tr_TR' },
      { label: 'Pусский', value: 'ru_RU' },
      { label: 'العربیة', value: 'ar_SA' },
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
    type: 'text',
  },
  {
    key: 'enableMedicalTerm',
    label: 'Search Medical Terms',
    type: 'checkbox',
  },
  {
    key: 'enableDarkMode',
    label: 'Dark Mode',
    type: 'checkbox',
  },
  {
    key: 'enableMapDarkMode',
    label: 'Night Mode for Map',
    type: 'checkbox',
  },
  {
    key: 'searchNearMeScreen',
    label: 'Enable Search Near Screen example',
    type: 'checkbox',
  },
  {
    key: 'useGetCurrentPosition',
    label: 'Use getCurrentPosition',
    type: 'checkbox',
  },
  {
    key: 'currentPosition',
    label: 'Current Position',
    type: 'select',
    options: [
      { label: 'San Francisco', value: JSON.stringify({ lat: 37.774929, lng: -122.419416 }) },
      { label: 'New York', value: JSON.stringify({ lat: 40.6976701, lng: -74.259864 }) },
    ],
  },
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
    const hclSdkEl = document.querySelector('hcl-sdk');
    const wrapper = document.querySelector('.hcl-sdk-wrapper');
    wrapper.classList.remove(...optionSets.find(o => o.key === 'screenLayout').options.map(o => o.value));
    wrapper.classList.add(this.settings.screenLayout);

    if (this.settings.lang && document.documentElement.lang !== this.settings.lang) {
      document.documentElement.lang = this.settings.lang;
      if (configStore.state.locale) {
        getI18nLabels(this.settings.lang);
      }
    }
    if (hclSdkEl) {
      hclSdkEl.updateConfig({
        enableMedicalTerm: this.settings.enableMedicalTerm
      })
    }
  }

  changeSetting(k, v) {
    this.settings = {
      ...this.settings,
      [k]: v,
    };
    if (k === 'searchNearMeScreen' && v === true) {
      this.settings.currentPosition = JSON.stringify({ lat: 37.774929, lng: -122.419416 })
    }

    storeSettings(this.settings);

    if (k === 'currentPosition' && this.settings.searchNearMeScreen) {
      const hclSdkEl = document.querySelector('hcl-sdk');

      if (hclSdkEl) {
        hclSdkEl.currentPosition = JSON.parse(this.settings.currentPosition);
      }
    } else {
      this.applySettings();
    }
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
        {
          setting.type === 'checkbox' && (
            <input 
              type="checkbox" 
              checked={this.settings[setting.key]} 
              onChange={e => this.changeSetting(setting.key, (e.target as any).checked)} />
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
