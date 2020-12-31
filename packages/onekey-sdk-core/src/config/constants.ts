import { OnekeySDKConfig } from './types';

const DEFAULT_THEME_FONT_NAME = 'inherit';
const DEFAULT_THEME_FONT_SIZE = '14px';
const DEFAULT_THEME_COLOR_PRIMARY = '#43b02a';
const DEFAULT_THEME_COLOR_SECONDARY = '#00a3e0';
const DEFAULT_THEME_COLOR_VIEW_BACKGROUND = '#f8f9fa';

export const DEFAULT_THEME_PROPERTIES = {
  // Fonts
  '--onekeysdk-font-default-name': DEFAULT_THEME_FONT_NAME,
  '--onekeysdk-font-default-size': DEFAULT_THEME_FONT_SIZE,
  '--onekeysdk-font-default-weight': 'normal',
  '--onekeysdk-font-title_main-name': 'var(--onekeysdk-font-default-name)',
  '--onekeysdk-font-title_main-size': '20px',
  '--onekeysdk-font-title_main-weight': 'normal',
  '--onekeysdk-font-title_secondary-name': 'var(--onekeysdk-font-default-name)',
  '--onekeysdk-font-title_secondary-size': '16px',
  '--onekeysdk-font-title_secondary-weight': 'bold',
  '--onekeysdk-font-search_result_total-name': 'var(--onekeysdk-font-default-name)',
  '--onekeysdk-font-search_result_total-size': 'var(--onekeysdk-font-default-size)',
  '--onekeysdk-font-search_result_total-weight': 'bold',
  '--onekeysdk-font-search_result_title-name': 'var(--onekeysdk-font-default-name)',
  '--onekeysdk-font-search_result_title-size': '16px',
  '--onekeysdk-font-search_result_title-weight': 'normal',
  '--onekeysdk-font-result_title-name': 'var(--onekeysdk-font-default-name)',
  '--onekeysdk-font-result_title-size': 'var(--onekeysdk-font-default-size)',
  '--onekeysdk-font-result_title-weight': 'normal',
  '--onekeysdk-font-result_subtitle-name': 'var(--onekeysdk-font-default-name)',
  '--onekeysdk-font-result_subtitle-size': 'var(--onekeysdk-font-default-size)',
  '--onekeysdk-font-result_subtitle-weight': 'normal',
  '--onekeysdk-font-profile_title-name': 'var(--onekeysdk-font-default-name)',
  '--onekeysdk-font-profile_title-size': '18px',
  '--onekeysdk-font-profile_title-weight': 'normal',
  '--onekeysdk-font-profile_subtitle-name': 'var(--onekeysdk-font-default-name)',
  '--onekeysdk-font-profile_subtitle-size': '16px',
  '--onekeysdk-font-profile_subtitle-weight': 'normal',
  '--onekeysdk-font-profile_title_section-name': 'var(--onekeysdk-font-default-name)',
  '--onekeysdk-font-profile_title_section-size': '16px',
  '--onekeysdk-font-profile_title_section-weight': 'normal',
  '--onekeysdk-font-card_title-name': 'var(--onekeysdk-font-default-name)',
  '--onekeysdk-font-card_title-size': '16px',
  '--onekeysdk-font-card_title-weight': 'normal',
  '--onekeysdk-font-modal_title-name': 'var(--onekeysdk-font-default-name)',
  '--onekeysdk-font-modal_title-size': '18px',
  '--onekeysdk-font-modal_title-weight': 'normal',
  '--onekeysdk-font-search_input-name': 'var(--onekeysdk-font-default-name)',
  '--onekeysdk-font-search_input-size': '16px',
  '--onekeysdk-font-search_input-weight': 'normal',
  '--onekeysdk-font-sort_criteria-name': 'var(--onekeysdk-font-default-name)',
  '--onekeysdk-font-sort_criteria-size': '16px',
  '--onekeysdk-font-sort_criteria-desktop-size': '14px',
  '--onekeysdk-font-sort_criteria-weight': 'normal',
  '--onekeysdk-font-button-name': 'var(--onekeysdk-font-default-name)',
  '--onekeysdk-font-button-size': 'var(--onekeysdk-font-default-size)',
  '--onekeysdk-font-button-weight': 'normal',
  '--onekeysdk-font-small-name': 'var(--onekeysdk-font-default-name)',
  '--onekeysdk-font-small-size': '12px',
  '--onekeysdk-font-small-weight': 'normal',
  // Colors
  '--onekeysdk-color-primary': DEFAULT_THEME_COLOR_PRIMARY,
  '--onekeysdk-color-secondary': DEFAULT_THEME_COLOR_SECONDARY,
  '--onekeysdk-color-button_bkg': '#fcfcfc',
  '--onekeysdk-color-button_accept_bkg': 'var(--onekeysdk-color-primary)',
  '--onekeysdk-color-button_discard_bkg': '#9aa0a7',
  '--onekeysdk-color-button_border': '#dedede',
  '--onekeysdk-color-card_border': '#dedede',
  '--onekeysdk-color-marker': '#fe8a12',
  '--onekeysdk-color-marker_selected': '#fd8670',
  '--onekeysdk-color-view_bkg': DEFAULT_THEME_COLOR_VIEW_BACKGROUND,
  '--onekeysdk-color-list_bkg': 'var(--onekeysdk-color-view_bkg)',
  '--onekeysdk-color-vote_up': 'var(--onekeysdk-color-primary)',
  '--onekeysdk-color-vote_down': '#ff0000',
  '--onekeysdk-color-dark': '#2b3c4d',
  '--onekeysdk-color-grey': '#a1a1a1',
  '--onekeysdk-color-grey_dark': '#7d7d7d',
  '--onekeysdk-color-grey_darker': '#666666',
  '--onekeysdk-color-grey_light': '#b8b8b8',
  '--onekeysdk-color-grey_lighter': '#ebebeb',
};

export const DEFAULT_CONFIGURATION: OnekeySDKConfig = {
  apiKey: ''
}
