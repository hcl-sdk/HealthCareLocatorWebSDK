import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

const config = {
  ...getSettingsFromLocal(),
  ...getSettingsCustomIconFromLocal(),
};

const mapSpecialtyByKey: any = {
  dentistry: {
    fr_FR: {
      specialtyCode: ['SP.WBE.72', 'SP.WBE.75', 'SP.WIT.75', 'SP.WDE.75'],
      specialtyLabel: 'Dentiste',
    },
    en: {
      specialtyCode: ['SP.WBE.72', 'SP.WBE.75', 'SP.WIT.75', 'SP.WDE.75'],
      specialtyLabel: 'Dentistry',
    },
  },
  cardiology: {
    fr_FR: {
      specialtyCode: ['SP.WBE.08', 'SP.WFR.AR', 'SP.WIT.08', 'SP.WCA.08', 'SP.WCA.08'],
      specialtyLabel: 'Cardiologie',
    },
    en: {
      specialtyCode: ['SP.WBE.08', 'SP.WFR.AR', 'SP.WIT.08', 'SP.WCA.08', 'SP.WCA.08'],
      specialtyLabel: 'Cardiology',
    },
  },
};

@Component({
  selector: 'app-search',
  template: `
    <div class="wrapper">
      <hcl-sdk-component [config]="config"></hcl-sdk-component>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  public config: any;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.config = config;
    console.log('config', config);

    this.route.queryParams.subscribe(params => {
      if (params['sp']) {
        const lang = this.config.lang || 'en';
        const key = params['sp'];
        const hclSdkEl = document.querySelector('hcl-sdk') as any;

        if (hclSdkEl && mapSpecialtyByKey[key] && mapSpecialtyByKey[key][lang] && mapSpecialtyByKey[key][lang].specialtyCode) {
          hclSdkEl.searchNearMe({
            specialtyCode: mapSpecialtyByKey[key][lang].specialtyCode,
            specialtyLabel: mapSpecialtyByKey[key][lang].specialtyLabel || '',
          });
        }
      }
    });
  }
}

function getSettingsFromLocal() {
  const settingsStr = localStorage.getItem(`__hcl-sdk-dev-settings-fields`);
  if (settingsStr) {
    try {
      return JSON.parse(settingsStr);
    } catch (err) {}
  }
  return {
    apiKey: '',
    appName: 'Carenity',
    appURL: 'https://apps.apple.com/fr/app/carenity/id1404422803',
  };
}

function getSettingsCustomIconFromLocal() {
  const settingsStr = localStorage.getItem('__hclsdk-devtools-custom-icon');
  if (settingsStr) {
    try {
      return { icons: JSON.parse(settingsStr) };
    } catch (err) {}
  }
  return { icons: {} };
}
