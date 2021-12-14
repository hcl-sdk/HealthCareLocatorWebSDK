import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import {HclSdk} from '../directives/proxies'

export interface GeolocCoordinates {
  latitude: number;
  longitude: number;
}

export interface WidgetMap {
  specialties?: string[]
  medTerms?: string[]
  criteria?: string
  latitude?: number
  longitude?: number
  country?: string

  mapHeight?: string
  interactive?: boolean  // zoom + dragging
}

export type WidgetType = 'map'

export type WidgetProps = WidgetMap

export type InitScreen = 'home' | 'search'

export type ConfigType = {
  apiKey: string;
  lang?: string;
  appName?: string;
  appURL?: string;
  showSuggestModification?: boolean;
  useGoogleMap?: boolean;
  googleMapApiKey?: string;
  enableDarkMode?: boolean;
  enableMapDarkMode?: boolean;
  enableMedicalTerm?: boolean;
  disableCollectGeo?: boolean;
  getCurrentPosition?: (
    success: (coords: GeolocCoordinates) => void, 
    error: (err: any) => void
  ) => void
}

@Component({
  selector: 'hcl-sdk-component',
  template: `
    <hcl-sdk #hclSdk [widget]="widget" [widgetProps]="widgetProps" [initScreen]="initScreen"></hcl-sdk>
  `,
  styles: [
  ]
})
export class HclSdkComponent implements OnChanges, AfterViewInit {
  @ViewChild('hclSdk') hclSdkEl?: HclSdk
  @Input() config?: ConfigType
  @Input() widget?: WidgetType
  @Input() widgetProps?: WidgetProps
  @Input() initScreen?: InitScreen

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.config?.previousValue) {
      this.hclSdkEl?.updateConfig(changes.config.currentValue)
    }
  }

  ngAfterViewInit(): void {
    if (this.config) {
      this.hclSdkEl?.init(this.config)
    }
  }
}
