import { Complete } from '../types';

export interface OnekeySDKConfigThemeInput {
  'font.name'?: string; // Font family (eg. Roboto)
  'font.size'?: number; // In px, default font size
  'font.size.title'?: number; // In px, title size
  'color.primary'?: string; // hexadecimal code for main color
  'color.secondary'?: string; // hexadecimal code for secondary color
  'color.marker'?: string; // hexadecimal code for map marker (pin) background
  'color.marker_selected'?: string; // hexadecimal code for map selected marker
}

export type OnekeySDKConfigTheme = Complete<OnekeySDKConfigThemeInput>;

export interface OnekeySDKConfigInput {
  apiKey: string;
  theme?: OnekeySDKConfigThemeInput;
}

export type OnekeySDKConfig = Complete<OnekeySDKConfigInput>;
