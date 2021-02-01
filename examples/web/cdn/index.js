var sidebarEl = document.querySelector('.sidebar');
var settingPanelEl = document.querySelector('settings-panel');
var hclSdkEl = document.querySelector('hcl-sdk');
var burgerEl = document.querySelector('.burger');

var specialtyLabelByCode = {
  '1SP.7500': 'Dentistry',
  '1SP.0800': 'Cardiology',
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

function getApiKeyFromLocal() {
  const settingsStr = localStorage.getItem(`__hcl-sdk-dev-settings-fields`);
  if (settingsStr) {
    try {
      return JSON.parse(settingsStr).apiKey;
    } catch (err) { }
  }
  return '';
}

// settingPanelEl.addEventListener('ready', function() {
//   settingPanelEl.getFields().then(fields => {
    const config = {
      apiKey: getApiKeyFromLocal(),
      i18nBundlesPath: '/hcl-sdk/i18n'
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

    if (hclSdkEl) {
      hclSdkEl.config = config;
    }
//   })
// })
