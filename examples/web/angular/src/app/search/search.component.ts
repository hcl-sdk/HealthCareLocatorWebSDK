import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

const config = {
  ...getSettingsFromLocal(),
  ...getSettingsCustomIconFromLocal(),
};

// config change user location demo:
const demoUpdateUserGeolocation = true;
const SPECIALTY_CODE = 'SP.WUS.PHR'
const SPECIALTY_LABEL = 'PHARMACIST'
// end config change user location demo

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
    <div class="change-user-location-bar">
      <select *ngIf="demoUpdateUserGeolocation" class="select" (change)="onPositionChange($event)">
        <option *ngFor="let item of locations" [value]="item | json">{{ item.label }} - Lat: {{ item.lat }} - Lng: {{ item.lng }}</option>
      </select>
      <div class="specialty">
        <span> {{ specialtyLabel }}, NEAR ME </span>
      </div>
    </div>
    <div class="wrapper">
      <hcl-sdk-component id="main-instance" [config]="config" [position]="userPosition"></hcl-sdk-component>
    </div>
    <!-- <div>
      <hcl-sdk-component [widget]="'map'"></hcl-sdk-component>
    </div> -->
  `,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  public config: any;
  // changing user location feature
  public locations = [
    { lat: 40.6976701, lng: -74.259864, label: 'New York' },
    { lat: 37.774929, lng: -122.419416, label: 'San Francisco' },
    { lat: 50.9519359, lng: 1.8339621, label: 'Paris' },
    { lat: 48.864716, lng: 2.349014, label: 'Calais, France' },
  ];
  public userPosition: { lat: number; lng: number } = this.locations[0];
  public demoUpdateUserGeolocation = demoUpdateUserGeolocation;
  public specialtyCode = SPECIALTY_CODE
  public specialtyLabel = SPECIALTY_LABEL
  // end changing user location feature

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.config = config;

    if (demoUpdateUserGeolocation) {
      this.config.entry = {
        screenName: 'searchNearMe',
        specialtyCode: [SPECIALTY_CODE],
        specialtyLabel: SPECIALTY_LABEL,
      }
      const hclSdkEl = document.querySelector('hcl-sdk') as any;
      const styleSheet = document.createElement('style');
      styleSheet.textContent = 'hcl-sdk-search { display: none; }';
      hclSdkEl.shadowRoot.appendChild(styleSheet);
    }

    console.log('config', config);

    this.route.queryParams.subscribe(params => {
      if (params['sp']) {
        const lang = this.config.lang || 'en';
        const key = params['sp'];
        const hclSdkEl = document.querySelector('#main-instance hcl-sdk') as any;

        if (hclSdkEl && mapSpecialtyByKey[key] && mapSpecialtyByKey[key][lang] && mapSpecialtyByKey[key][lang].specialtyCode) {
          hclSdkEl.searchNearMe({
            specialtyCode: mapSpecialtyByKey[key][lang].specialtyCode,
            specialtyLabel: mapSpecialtyByKey[key][lang].specialtyLabel || '',
          });
        }
      }
    });
  }

  onPositionChange(event: any) {
    this.userPosition = JSON.parse(event.target.value);
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
