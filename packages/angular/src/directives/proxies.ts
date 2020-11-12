/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

import { Components } from 'onekey-sdk';


export declare interface IonIcon extends Components.IonIcon {}
@ProxyCmp({
  inputs: ['ariaHidden', 'ariaLabel', 'color', 'flipRtl', 'icon', 'ios', 'lazy', 'md', 'mode', 'name', 'sanitize', 'size', 'src']
})
@Component({
  selector: 'ion-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['ariaHidden', 'ariaLabel', 'color', 'flipRtl', 'icon', 'ios', 'lazy', 'md', 'mode', 'name', 'sanitize', 'size', 'src']
})
export class IonIcon {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface OnekeySdk extends Components.OnekeySdk {}
@ProxyCmp({
  inputs: ['config']
})
@Component({
  selector: 'onekey-sdk',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['config']
})
export class OnekeySdk {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface OnekeySdkDoctorCard extends Components.OnekeySdkDoctorCard {}
@ProxyCmp({
  inputs: ['address', 'distance', 'gp', 'name']
})
@Component({
  selector: 'onekey-sdk-doctor-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['address', 'distance', 'gp', 'name']
})
export class OnekeySdkDoctorCard {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface OnekeySdkHome extends Components.OnekeySdkHome {}

@Component({
  selector: 'onekey-sdk-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class OnekeySdkHome {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface OnekeySdkMap extends Components.OnekeySdkMap {}
@ProxyCmp({
  inputs: ['defaultZoom', 'locations', 'mapHeight', 'mapLink', 'mapTileLayer', 'mapWidth', 'markerIcon', 'markerIconCurrentLocation', 'selectedLocationIdx']
})
@Component({
  selector: 'onekey-sdk-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['defaultZoom', 'locations', 'mapHeight', 'mapLink', 'mapTileLayer', 'mapWidth', 'markerIcon', 'markerIconCurrentLocation', 'selectedLocationIdx']
})
export class OnekeySdkMap {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface OnekeySdkRoute extends Components.OnekeySdkRoute {}
@ProxyCmp({
  inputs: ['component', 'path']
})
@Component({
  selector: 'onekey-sdk-route',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['component', 'path']
})
export class OnekeySdkRoute {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface OnekeySdkRouter extends Components.OnekeySdkRouter {}

@Component({
  selector: 'onekey-sdk-router',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class OnekeySdkRouter {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface OnekeySdkRouterLink extends Components.OnekeySdkRouterLink {}
@ProxyCmp({
  inputs: ['activeClass', 'anchorClass', 'anchorId', 'anchorRole', 'anchorTabIndex', 'anchorTitle', 'ariaHaspopup', 'ariaLabel', 'ariaPosinset', 'ariaSetsize', 'custom', 'url']
})
@Component({
  selector: 'onekey-sdk-router-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['activeClass', 'anchorClass', 'anchorId', 'anchorRole', 'anchorTabIndex', 'anchorTitle', 'ariaHaspopup', 'ariaLabel', 'ariaPosinset', 'ariaSetsize', 'custom', 'url']
})
export class OnekeySdkRouterLink {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface OnekeySdkSearch extends Components.OnekeySdkSearch {}

@Component({
  selector: 'onekey-sdk-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class OnekeySdkSearch {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface OnekeySdkSearchResult extends Components.OnekeySdkSearchResult {}

@Component({
  selector: 'onekey-sdk-search-result',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class OnekeySdkSearchResult {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}
