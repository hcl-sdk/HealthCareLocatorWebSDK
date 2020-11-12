/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

import { Components } from 'onekey-sdk';


export declare interface ContextConsumer extends Components.ContextConsumer {}
@ProxyCmp({
  inputs: ['context', 'renderer', 'subscribe']
})
@Component({
  selector: 'context-consumer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['context', 'renderer', 'subscribe']
})
export class ContextConsumer {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


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


export declare interface OnekeySdkAboutUs extends Components.OnekeySdkAboutUs {}

@Component({
  selector: 'onekey-sdk-about-us',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class OnekeySdkAboutUs {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface OnekeySdkDoctorItemSwipe extends Components.OnekeySdkDoctorItemSwipe {}
@ProxyCmp({
  inputs: ['address', 'distance', 'gp', 'name']
})
@Component({
  selector: 'onekey-sdk-doctor-item-swipe',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['address', 'distance', 'gp', 'name']
})
export class OnekeySdkDoctorItemSwipe {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface OnekeySdkGlobalStore extends Components.OnekeySdkGlobalStore {}
@ProxyCmp({
  inputs: ['renderer', 'store']
})
@Component({
  selector: 'onekey-sdk-global-store',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['renderer', 'store']
})
export class OnekeySdkGlobalStore {
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
  inputs: ['activatedRoute', 'component', 'path', 'store']
})
@Component({
  selector: 'onekey-sdk-route',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['activatedRoute', 'component', 'path', 'store']
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
  inputs: ['activatedRoute', 'activeClass', 'anchorClass', 'anchorId', 'anchorRole', 'anchorTabIndex', 'anchorTitle', 'ariaHaspopup', 'ariaLabel', 'ariaPosinset', 'ariaSetsize', 'custom', 'match', 'setActivatedRoute', 'url']
})
@Component({
  selector: 'onekey-sdk-router-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['activatedRoute', 'activeClass', 'anchorClass', 'anchorId', 'anchorRole', 'anchorTabIndex', 'anchorTitle', 'ariaHaspopup', 'ariaLabel', 'ariaPosinset', 'ariaSetsize', 'custom', 'match', 'setActivatedRoute', 'url']
})
export class OnekeySdkRouterLink {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface OnekeySdkRouterStore extends Components.OnekeySdkRouterStore {}
@ProxyCmp({
  inputs: ['renderer']
})
@Component({
  selector: 'onekey-sdk-router-store',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['renderer']
})
export class OnekeySdkRouterStore {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface OnekeySdkSearch extends Components.OnekeySdkSearch {}
@ProxyCmp({
  inputs: ['setActivatedRoute', 'setStore', 'store']
})
@Component({
  selector: 'onekey-sdk-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['setActivatedRoute', 'setStore', 'store']
})
export class OnekeySdkSearch {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface OnekeySdkSearchResult extends Components.OnekeySdkSearchResult {}
@ProxyCmp({
  inputs: ['setStore', 'store']
})
@Component({
  selector: 'onekey-sdk-search-result',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['setStore', 'store']
})
export class OnekeySdkSearchResult {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}
