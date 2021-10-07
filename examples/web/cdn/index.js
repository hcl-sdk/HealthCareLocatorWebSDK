var sidebarEl = document.querySelector('.sidebar');
var settingPanelEl = document.querySelector('settings-panel');
var hclSdkEl = document.querySelector('hcl-sdk');
var burgerEl = document.querySelector('.burger');

const mapSpecialtyByKey = {
  dentistry: {
    fr_FR: {
      specialtyCode: ['SP.WBE.72', 'SP.WBE.75', 'SP.WIT.75', 'SP.WDE.75'],
      specialtyLabel: 'Dentiste'
    },
    en: {
      specialtyCode: ['SP.WBE.72', 'SP.WBE.75', 'SP.WIT.75', 'SP.WDE.75'],
      specialtyLabel: 'Dentistry'
    }
  },
  cardiology: {
    fr_FR: {
      specialtyCode: ['SP.WBE.08', 'SP.WFR.AR', 'SP.WIT.08', 'SP.WCA.08', 'SP.WCA.08'],
      specialtyLabel: 'Cardiologie'
    },
    en: {
      specialtyCode: ['SP.WBE.08', 'SP.WFR.AR', 'SP.WIT.08', 'SP.WCA.08', 'SP.WCA.08'],
      specialtyLabel: 'Cardiology'
    }
  }
}

for (let i = 0; i < 3; i++) {
  burgerEl.innerHTML += '<div></div>';
}

burgerEl.addEventListener('click', function() {
  document.body.classList.toggle('menu-opened')
});

function openSettings() {
  sidebarEl.classList.add('settings-opened');
}

settingPanelEl.addEventListener('backPressed', function() {
  sidebarEl.classList.remove('settings-opened');
});

function searchNearMe(key) {
  document.body.classList.remove('menu-opened');

  const lang = config.lang || 'en'
  if (mapSpecialtyByKey[key] && mapSpecialtyByKey[key][lang] && mapSpecialtyByKey[key][lang].specialtyCode) {
    hclSdkEl.searchNearMe({
      specialtyCode: mapSpecialtyByKey[key][lang].specialtyCode,
      specialtyLabel: mapSpecialtyByKey[key][lang].specialtyLabel || ''
    });
  }
}

// Initialize Hcl SDK

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

var config = {
  ...getSettingsFromLocal(),
  ...getSettingsCustomIconFromLocal()
};

var matches = window.location.hash.match(/sp=([a-zA-Z]+)/);
if (matches) {
  var lang = config.lang || 'en'
  var key = matches[1]

  if (mapSpecialtyByKey[key] && mapSpecialtyByKey[key][lang] && mapSpecialtyByKey[key][lang].specialtyCode) {
    config.entry = {
      screenName: 'searchNearMe',
      specialtyCode: mapSpecialtyByKey[key][lang].specialtyCode,
      specialtyLabel: mapSpecialtyByKey[key][lang].specialtyLabel || ''
    }
  }
}

console.log(config)

customElements.whenDefined('hcl-sdk').then(function() {
  // config.i18nBundlesPath = '/hcl-sdk-web-ui/i18n'
  hclSdkEl.init(config);
})
