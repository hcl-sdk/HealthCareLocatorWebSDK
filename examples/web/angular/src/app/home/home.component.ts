import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `<div class="home-content">
    <img src="/assets/logo-health-care-locator.png" alt="logo" />
    <section class="home-text">
      <p>This sample app is a demo of the integration of HealthCare Locator SDK UI inside a simple server side rendered web application, using Angular.</p>
    </section>
    <a routerLink="/search" class="ui-cta"> Search for HCPs </a>
  </div>`,
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
