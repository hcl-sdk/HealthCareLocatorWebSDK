
function getSettingsFromLocal() {
  const settingsStr = localStorage.getItem(`__hcl-sdk-dev-settings-fields`);
  if (settingsStr) {
    try {
      return JSON.parse(settingsStr);
    } catch (err) { }
  }
  return {
    apiKey: '',
    appName: 'Carenity',
    appURL: 'https://apps.apple.com/fr/app/carenity/id1404422803'
  };
}

function getSettingsCustomIconFromLocal() {
  const settingsStr = localStorage.getItem('__hclsdk-devtools-custom-icon');
  if (settingsStr) {
    try {
      return { icons: JSON.parse(settingsStr) }
    } catch (err) { }
  }
  return { icons: {} }
}

const config = {
  ...getSettingsFromLocal(),
  ...getSettingsCustomIconFromLocal()
};


export function useConfig() {
  return config
}