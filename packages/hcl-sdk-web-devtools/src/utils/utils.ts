import { Fields, Theme } from '../types';

const defaultSettings: Fields = {
  apiKey: '',
  theme: 'default' as Theme,
  lang: 'en',
  appName: '',
  showSuggestModification: true,
  enableDarkMode: false,
  enableMapDarkMode: false,
  enableMedicalTerm: false,
  appURL: '',
  // countries: ['ca','fr'],
  distanceUnit: 'km',
  useGoogleMap: false,
  googleMapApiKey: '',
  googleMapId: '',
  enableHcoSearch: false
}

export function format(first: string, middle: string, last: string): string {
  return (first || '') + (middle ? ` ${middle}` : '') + (last ? ` ${last}` : '');
}
export const storeSettings = (settings: Fields) => {
  if (settings.theme === 'default') {
    localStorage.removeItem(`__hclsdk-devtools-custom-icon`)
  }
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
