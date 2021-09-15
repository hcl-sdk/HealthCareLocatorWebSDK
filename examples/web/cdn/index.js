var sidebarEl = document.querySelector('.sidebar');
var settingPanelEl = document.querySelector('settings-panel');
var hclSdkEl = document.querySelector('hcl-sdk');
var burgerEl = document.querySelector('.burger');

var specialtyLabelByCode = {
  'SP.WBE.72|SP.WBE.75|SP.WIT.75|SP.WDE.75': 'Dentistry',
  // 'SP.WFR.PZ|SP.WFR.PZ|SP.WFR.PZ,SP.WFR.ZG|SP.WFR.ZG|SP.WFR.ZG': 'Pharmacie des mines, General council',
  'SP.WBE.08|SP.WFR.AR|SP.WIT.08|SP.WCA.08|SP.WCA.08': 'Cardiology',
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

function searchNearMe(specialtyCode) {
  document.body.classList.remove('menu-opened');
  var specialtyLabel = specialtyLabelByCode[specialtyCode];
  if (specialtyLabel) {
    hclSdkEl.searchNearMe({
      specialtyCode,
      specialtyLabel
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

const config = {
  ...getSettingsFromLocal()
};

var matches = window.location.hash.match(/sp=([A-Z0-9.]+)/);
if (matches) {
  var specialtyCode = matches[1];
  var specialtyLabel = specialtyLabelByCode[specialtyCode];
  if (specialtyLabel) {
    config.entry = {
      screenName: 'searchNearMe',
      specialtyCode
    }
  }
}

console.log(config)

customElements.whenDefined('hcl-sdk').then(function() {
  hclSdkEl.init(config);
})
