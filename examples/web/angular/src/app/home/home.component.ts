import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// import { WidgetProps } from '@healthcarelocator/sdk-angular'

@Component({
  selector: 'app-home',
  template: `<div class="home-content">
    <img src="/sample/angular/assets/logo-health-care-locator.png" alt="logo" />
    <section class="home-text">
      <p>This sample app is a demo of the integration of HealthCare Locator SDK UI inside a simple server side rendered web application, using Angular.</p>
    </section>
    <a routerLink="/search" class="ui-cta"> Search for HCPs </a>
    <!-- <div>
      <hcl-sdk-component [config]="config" [widget]="'map'" [widgetProps]="widgetProps"></hcl-sdk-component>
    </div> -->
  </div>`,
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  /*
    To demo hcl sdk widget (map)
    public config = {
      apiKey: "300585f2a6a5912a",
      appName: "",
      appURL: "",
      enableMedicalTerm: true,
      googleMapApiKey: "",
      googleMapId: "",
      icons: {},
      lang: "en",
      showSuggestModification: true,
      theme: "default",
      useGoogleMap: false
    }
    public widgetProps: WidgetProps = {}
  */

  constructor() {}

  ngOnInit(): void {
    /*
      To demo hcl sdk widget (map)
      this.widgetProps = {
        mapHeight: "200px",
        latitude: 48.864716,
        longitude: 2.349014,
        country: 'fr'
      }
    */
  }
}
