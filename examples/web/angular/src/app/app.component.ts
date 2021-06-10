import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="wrapper">
      <hcl-sdk-component [config]="config"></hcl-sdk-component>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .wrapper {
        width: 100%;
        height: 100vh;
      }

      hcl-sdk {
        --hcl-color-primary: #001f3f;
        --hcl-color-secondary: #39cccc;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  public config: any
  ngOnInit(): void {
    this.config = {
      apiKey: '2210cf8387f14995bfdd553628812be3',
      showSuggestModification: false
    }
  }
}
