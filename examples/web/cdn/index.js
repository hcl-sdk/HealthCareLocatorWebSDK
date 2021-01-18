var sidebarEl = document.querySelector('.sidebar');
var settingPanelEl = document.querySelector('settings-panel');
var onekeySdkEl = document.querySelector('onekey-sdk');
var burgerEl = document.querySelector('.burger');

var specialtyLabelByCode = {
  'SP.WCA.08': 'Cardiologist',
  'SP.WCA.75': 'Dentist',
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
    onekeySdkEl.searchNearMe({
      specialtyCode,
      specialtyLabel
    });
  }
}

// Initialize Onekey SDK

// settingPanelEl.addEventListener('ready', function() {
//   settingPanelEl.getFields().then(fields => {
    const config = {
      apiKey: '',
      i18nBundlesPath: '/onekey-sdk/i18n'
    };

    var matches = window.location.hash.match(/sp=([A-Z0-9.]+)/);
    if (matches) {
      var specialtyCode = matches[1];
      var specialtyLabel = specialtyLabelByCode[specialtyCode];
      if (specialtyLabel) {
        config.entry = {
          screenName: 'nearMe',
          specialtyCode,
          specialtyLabel
        }
      }
    }

    if (onekeySdkEl) {
      onekeySdkEl.config = config;
    }
//   })
// })
