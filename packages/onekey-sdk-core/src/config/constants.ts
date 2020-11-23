import { OnekeySDKConfig } from './types';

const DEFAULT_THEME_FONT_NAME = 'Roboto';
const DEFAULT_THEME_FONT_SIZE = 14;
const DEFAULT_THEME_FONT_SIZE_TITLE = 18;
const DEFAULT_THEME_COLOR_PRIMARY = '#';
const DEFAULT_THEME_COLOR_SECONDARY = '#';
const DEFAULT_THEME_COLOR_MARKER = '#';
const DEFAULT_THEME_COLOR_MARKER_SELECTED = '#';

export const DEFAULT_CONFIGURATION: OnekeySDKConfig = {
  apiKey: '',
  theme: {
    'font.name': DEFAULT_THEME_FONT_NAME,
    'font.size': DEFAULT_THEME_FONT_SIZE,
    'font.size.title': DEFAULT_THEME_FONT_SIZE_TITLE,
    'color.primary': DEFAULT_THEME_COLOR_PRIMARY,
    'color.secondary': DEFAULT_THEME_COLOR_SECONDARY,
    'color.marker': DEFAULT_THEME_COLOR_MARKER,
    'color.marker_selected': DEFAULT_THEME_COLOR_MARKER_SELECTED
  }
}
