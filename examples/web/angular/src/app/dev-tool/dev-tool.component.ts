import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dev-tool',
  template: ` <section [ngClass]="{ 'sidebar': true, 'settings-opened': showSetting }">
    <header>
      <div class="burger" (click)="toggleMobileMenu()">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <h1>SDK Sample Angular App</h1>
    </header>
    <ul class="menu">
      <li class="menu-item">
        <a routerLink="/" class="active">Home</a>
      </li>
      <li class="menu-item">
        <a routerLink="/search" (click)="onClickGoToSearchPage()">Search for HCPs</a>
      </li>
      <li class="menu-item">
        <a routerLink="/search" [queryParams]="{ sp: 'dentistry' }">Find a dentist near me</a>
      </li>
      <li class="menu-item">
        <a routerLink="/search" [queryParams]="{ sp: 'cardiology' }">Find a cardiologist near me</a>
      </li>
      <li class="menu-item">
        <a href="/" (click)="openSettings($event)">Settings</a>
      </li>
    </ul>
    <div class="sidenav-settings">
      <settings-panel #settingsPanelRef></settings-panel>
    </div>
  </section>`,
  styles: [
    `
      :host {
        border-right: 2px solid #dddddd;
        display: flex;
      }
    `,
  ],
})
export class DevToolComponent implements OnInit, AfterViewInit {
  constructor() {}
  showSetting: boolean = false;
  @ViewChild('settingsPanelRef') settingsPanelRef: any = null;

  ngOnInit(): void {}

  ngAfterViewInit() {
    if (this?.settingsPanelRef?.nativeElement?.addEventListener) {
      this.settingsPanelRef.nativeElement.addEventListener('backPressed', () => {
        this.showSetting = false;
      });
    }
  }

  openSettings(e: any) {
    e.preventDefault();
    this.showSetting = true;
  }

  onClickGoToSearchPage() {
    requestAnimationFrame(() => {
      window.location.reload()
    })
  }

  toggleMobileMenu() {
    document.body.classList.toggle('menu-opened');
  }
}
