import { Fields, Theme } from '../types';

const defaultSettings = {
  apiKey: '',
  theme: 'default' as Theme,
  lang: 'en',
  appName: '',
  showSuggestModification: true,
  enableMedicalTerm: false,
  appURL: '',
  countries: ['ca','fr'],
  useGoogleMap: false,
  googleMapApiKey: '',
  googleMapId: ''
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
    return {
      ...defaultSettings,
      ...JSON.parse(settingsStr)
    };
  }
  return defaultSettings;
};
