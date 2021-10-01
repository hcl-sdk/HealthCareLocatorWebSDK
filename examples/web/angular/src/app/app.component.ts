import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-dev-tool></app-dev-tool>

    <section class="content-wrapper">
      <router-outlet></router-outlet>
    </section>
  `,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  ngOnInit(): void {}
}
