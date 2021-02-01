import { Fields, Theme } from '../types';

const defaultSettings = {
  apiKey: '300002938e8ed9e6', // temporarly. TODO unset this value
  theme: 'default' as Theme,
  lang: 'en',
  appName: 'Caretiny',
  appDownloadLink: 'https://apps.apple.com/fr/app/carenity/id1404422803'
}

export function format(first: string, middle: string, last: string): string {
  return (first || '') + (middle ? ` ${middle}` : '') + (last ? ` ${last}` : '');
}
export const storeSettings = (settings: Fields) => {
  localStorage.setItem(`__hcl-sdk-dev-settings-fields`, JSON.stringify(settings));
};

export const loadSettings = (): Fields => {
  const settingsStr = localStorage.getItem(`__hcl-sdk-dev-settings-fields`);
  if (settingsStr) {
    return JSON.parse(settingsStr);
  }
  return defaultSettings;
};