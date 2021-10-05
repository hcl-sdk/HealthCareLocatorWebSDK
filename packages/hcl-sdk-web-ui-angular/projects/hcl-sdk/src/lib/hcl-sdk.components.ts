import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import {HclSdk} from '../directives/proxies'

@Component({
  selector: 'hcl-sdk-component',
  template: `
    <hcl-sdk #hclSdk></hcl-sdk>
  `,
  styles: [
  ]
})
export class HclSdkComponent implements OnChanges, AfterViewInit {
  @ViewChild('hclSdk') hclSdkEl?: HclSdk
  @Input() config: any = {}
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.config.previousValue) {
      this.hclSdkEl?.updateConfig(changes.config.currentValue)
    }
  }

  ngAfterViewInit(): void {
    this.hclSdkEl?.init(this.config)
  }
}
