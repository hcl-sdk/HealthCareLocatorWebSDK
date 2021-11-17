/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

import { Components } from '@healthcarelocator/sdk-web';


export declare interface HclSdk extends Components.HclSdk {}
@ProxyCmp({
  inputs: ['initScreen', 'widget', 'widgetProps'],
  methods: ['updateConfig', 'backToHome', 'searchNearMe', 'init']
})
@Component({
  selector: 'hcl-sdk',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['initScreen', 'widget', 'widgetProps']
})
export class HclSdk {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkAutocompleteResult extends Components.HclSdkAutocompleteResult {}
@ProxyCmp({
  inputs: ['currentSelectedInput', 'data', 'type'],
  methods: ['focusOnArrowKeyDown']
})
@Component({
  selector: 'hcl-sdk-autocomplete-result',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['currentSelectedInput', 'data', 'type']
})
export class HclSdkAutocompleteResult {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkButton extends Components.HclSdkButton {}
@ProxyCmp({
  inputs: ['class', 'disabled', 'icon', 'iconColor', 'iconHeight', 'iconWidth', 'isFull', 'isLink', 'noBackground', 'noBorder', 'noPadding', 'noTextColor', 'primary', 'round', 'secondary', 'tabIndex', 'type']
})
@Component({
  selector: 'hcl-sdk-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['class', 'disabled', 'icon', 'iconColor', 'iconHeight', 'iconWidth', 'isFull', 'isLink', 'noBackground', 'noBorder', 'noPadding', 'noTextColor', 'primary', 'round', 'secondary', 'tabIndex', 'type']
})
export class HclSdkButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkDevSettings extends Components.HclSdkDevSettings {}

@Component({
  selector: 'hcl-sdk-dev-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class HclSdkDevSettings {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkDoctorCard extends Components.HclSdkDoctorCard {}
@ProxyCmp({
  inputs: ['address', 'distance', 'name', 'selected', 'showDistance', 'specialtyPrimary', 'viewMode']
})
@Component({
  selector: 'hcl-sdk-doctor-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['address', 'distance', 'name', 'selected', 'showDistance', 'specialtyPrimary', 'viewMode']
})
export class HclSdkDoctorCard {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import { HclSdkHCPFullCard as IHclSdkHCPFullCard } from '@healthcarelocator/sdk-web/dist/types/components/ui-kits/hcl-sdk-hcp-full-card/hcl-sdk-hcp-full-card';
export declare interface HclSdkHcpFullCard extends Components.HclSdkHcpFullCard {}

@Component({
  selector: 'hcl-sdk-hcp-full-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  outputs: ['backFromHcpFullCard']
})
export class HclSdkHcpFullCard {
  /**  */
  backFromHcpFullCard!: IHclSdkHCPFullCard['backFromHcpFullCard'];
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['backFromHcpFullCard']);
  }
}


export declare interface HclSdkHome extends Components.HclSdkHome {}

@Component({
  selector: 'hcl-sdk-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class HclSdkHome {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkHomeFull extends Components.HclSdkHomeFull {}

@Component({
  selector: 'hcl-sdk-home-full',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class HclSdkHomeFull {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import { HclSdkHomeMin as IHclSdkHomeMin } from '@healthcarelocator/sdk-web/dist/types/components/screens/hcl-sdk-home/hcl-sdk-home-min/hcl-sdk-home-min';
export declare interface HclSdkHomeMin extends Components.HclSdkHomeMin {}

@Component({
  selector: 'hcl-sdk-home-min',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  outputs: ['goSearchScreen']
})
export class HclSdkHomeMin {
  /**  */
  goSearchScreen!: IHclSdkHomeMin['goSearchScreen'];
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['goSearchScreen']);
  }
}


export declare interface HclSdkIcon extends Components.HclSdkIcon {}
@ProxyCmp({
  inputs: ['color', 'height', 'name', 'primary', 'width']
})
@Component({
  selector: 'hcl-sdk-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'name', 'primary', 'width']
})
export class HclSdkIcon {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconArrow_down extends Components.HclSdkIconArrow_down {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-arrow_down',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconArrow_down {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconArrow_right extends Components.HclSdkIconArrow_right {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-arrow_right',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconArrow_right {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconBack extends Components.HclSdkIconBack {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-back',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconBack {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconCircular extends Components.HclSdkIconCircular {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-circular',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconCircular {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconDefaultAvatar extends Components.HclSdkIconDefaultAvatar {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-default-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconDefaultAvatar {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconDirection extends Components.HclSdkIconDirection {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-direction',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconDirection {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconDislike extends Components.HclSdkIconDislike {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-dislike',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconDislike {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconEdit extends Components.HclSdkIconEdit {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconEdit {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconFacebook extends Components.HclSdkIconFacebook {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-facebook',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconFacebook {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconFax extends Components.HclSdkIconFax {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-fax',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconFax {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconFlag extends Components.HclSdkIconFlag {}
@ProxyCmp({
  inputs: ['countryCode']
})
@Component({
  selector: 'hcl-sdk-icon-flag',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['countryCode']
})
export class HclSdkIconFlag {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconGeoloc extends Components.HclSdkIconGeoloc {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-geoloc',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconGeoloc {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconGmail extends Components.HclSdkIconGmail {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-gmail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconGmail {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconHistory extends Components.HclSdkIconHistory {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-history',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconHistory {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconLike extends Components.HclSdkIconLike {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-like',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconLike {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconLinkedin extends Components.HclSdkIconLinkedin {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-linkedin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconLinkedin {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconList extends Components.HclSdkIconList {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconList {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconMap extends Components.HclSdkIconMap {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconMap {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconMap_geoloc extends Components.HclSdkIconMap_geoloc {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-map_geoloc',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconMap_geoloc {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconNoAccounts extends Components.HclSdkIconNoAccounts {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-no-accounts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconNoAccounts {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconPhone extends Components.HclSdkIconPhone {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-phone',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconPhone {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconProfile extends Components.HclSdkIconProfile {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconProfile {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconRefresh extends Components.HclSdkIconRefresh {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-refresh',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconRefresh {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconRemove extends Components.HclSdkIconRemove {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-remove',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconRemove {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconSearch extends Components.HclSdkIconSearch {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconSearch {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconSearchOff extends Components.HclSdkIconSearchOff {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-search-off',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconSearchOff {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconShare extends Components.HclSdkIconShare {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-share',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconShare {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconSort extends Components.HclSdkIconSort {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-sort',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconSort {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconTwitter extends Components.HclSdkIconTwitter {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-twitter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconTwitter {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkIconWebsite extends Components.HclSdkIconWebsite {}
@ProxyCmp({
  inputs: ['color', 'height', 'width']
})
@Component({
  selector: 'hcl-sdk-icon-website',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'height', 'width']
})
export class HclSdkIconWebsite {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkInput extends Components.HclSdkInput {}
@ProxyCmp({
  inputs: ['autoComplete', 'autoFocus', 'checked', 'class', 'loading', 'name', 'onArrowKeyDown', 'onBlur', 'onEnterKeyDown', 'onFocus', 'onInput', 'onPostfixClick', 'placeholder', 'postfixIcon', 'prefixIcon', 'readOnly', 'type', 'value'],
  methods: ['focusHclSdkInput']
})
@Component({
  selector: 'hcl-sdk-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['autoComplete', 'autoFocus', 'checked', 'class', 'loading', 'name', 'onArrowKeyDown', 'onBlur', 'onEnterKeyDown', 'onFocus', 'onInput', 'onPostfixClick', 'placeholder', 'postfixIcon', 'prefixIcon', 'readOnly', 'type', 'value']
})
export class HclSdkInput {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkLoading extends Components.HclSdkLoading {}

@Component({
  selector: 'hcl-sdk-loading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class HclSdkLoading {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import { HclSdkMap as IHclSdkMap } from '@healthcarelocator/sdk-web/dist/types/components/ui-kits/hcl-sdk-map/hcl-sdk-map';
export declare interface HclSdkMap extends Components.HclSdkMap {}
@ProxyCmp({
  inputs: ['breakpoint', 'defaultZoom', 'dragging', 'interactive', 'isForcedZoomToMe', 'isShowMeMarker', 'isZoomChanged', 'locations', 'mapHeight', 'mapMinHeight', 'mapWidth', 'markerIcon', 'modeView', 'noCurrentLocation', 'selectedLocationIdx', 'zoomControl']
})
@Component({
  selector: 'hcl-sdk-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['breakpoint', 'defaultZoom', 'dragging', 'interactive', 'isForcedZoomToMe', 'isShowMeMarker', 'isZoomChanged', 'locations', 'mapHeight', 'mapMinHeight', 'mapWidth', 'markerIcon', 'modeView', 'noCurrentLocation', 'selectedLocationIdx', 'zoomControl'],
  outputs: ['onMarkerClick', 'moveCurrentLocation', 'mapClicked', 'onMapDrag']
})
export class HclSdkMap {
  /**  */
  onMarkerClick!: IHclSdkMap['onMarkerClick'];
  /**  */
  moveCurrentLocation!: IHclSdkMap['moveCurrentLocation'];
  /**  */
  mapClicked!: IHclSdkMap['mapClicked'];
  /**  */
  onMapDrag!: IHclSdkMap['onMapDrag'];
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['onMarkerClick', 'moveCurrentLocation', 'mapClicked', 'onMapDrag']);
  }
}


export declare interface HclSdkModal extends Components.HclSdkModal {}
@ProxyCmp({
  inputs: ['modal']
})
@Component({
  selector: 'hcl-sdk-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['modal']
})
export class HclSdkModal {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkProfileMap extends Components.HclSdkProfileMap {}

@Component({
  selector: 'hcl-sdk-profile-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class HclSdkProfileMap {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkRoute extends Components.HclSdkRoute {}
@ProxyCmp({
  inputs: ['component', 'path']
})
@Component({
  selector: 'hcl-sdk-route',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['component', 'path']
})
export class HclSdkRoute {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkRouter extends Components.HclSdkRouter {}

@Component({
  selector: 'hcl-sdk-router',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class HclSdkRouter {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkRouterLink extends Components.HclSdkRouterLink {}
@ProxyCmp({
  inputs: ['activeClass', 'anchorClass', 'anchorId', 'anchorRole', 'anchorTabIndex', 'anchorTitle', 'ariaHaspopup', 'ariaLabel', 'ariaPosinset', 'ariaSetsize', 'custom', 'url']
})
@Component({
  selector: 'hcl-sdk-router-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['activeClass', 'anchorClass', 'anchorId', 'anchorRole', 'anchorTabIndex', 'anchorTitle', 'ariaHaspopup', 'ariaLabel', 'ariaPosinset', 'ariaSetsize', 'custom', 'url']
})
export class HclSdkRouterLink {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkSearch extends Components.HclSdkSearch {}
@ProxyCmp({
  inputs: ['isSearchResult', 'noIcon']
})
@Component({
  selector: 'hcl-sdk-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['isSearchResult', 'noIcon']
})
export class HclSdkSearch {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import { HclSdkSearchItem as IHclSdkSearchItem } from '@healthcarelocator/sdk-web/dist/types/components/ui-kits/hcl-sdk-search-address-item/hcl-sdk-search-address-item';
export declare interface HclSdkSearchAddressItem extends Components.HclSdkSearchAddressItem {}
@ProxyCmp({
  inputs: ['currentSearchText', 'item', 'selected']
})
@Component({
  selector: 'hcl-sdk-search-address-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['currentSearchText', 'item', 'selected'],
  outputs: ['selectAddress']
})
export class HclSdkSearchAddressItem {
  /**  */
  selectAddress!: IHclSdkSearchItem['selectAddress'];
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['selectAddress']);
  }
}

import { HclSdkSearchCountries as IHclSdkSearchCountries } from '@healthcarelocator/sdk-web/dist/types/components/ui-kits/hcl-sdk-search-countries/hcl-sdk-search-countries';
export declare interface HclSdkSearchCountries extends Components.HclSdkSearchCountries {}
@ProxyCmp({
  inputs: ['currentSelectedInput', 'data']
})
@Component({
  selector: 'hcl-sdk-search-countries',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['currentSelectedInput', 'data'],
  outputs: ['selectCountry']
})
export class HclSdkSearchCountries {
  /**  */
  selectCountry!: IHclSdkSearchCountries['selectCountry'];
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['selectCountry']);
  }
}


export declare interface HclSdkSearchNoDataAvailable extends Components.HclSdkSearchNoDataAvailable {}

@Component({
  selector: 'hcl-sdk-search-no-data-available',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class HclSdkSearchNoDataAvailable {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkSearchNoResults extends Components.HclSdkSearchNoResults {}

@Component({
  selector: 'hcl-sdk-search-no-results',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class HclSdkSearchNoResults {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkSearchResult extends Components.HclSdkSearchResult {}

@Component({
  selector: 'hcl-sdk-search-result',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class HclSdkSearchResult {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkSelect extends Components.HclSdkSelect {}
@ProxyCmp({
  inputs: ['loading', 'onChange', 'options', 'value']
})
@Component({
  selector: 'hcl-sdk-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['loading', 'onChange', 'options', 'value']
})
export class HclSdkSelect {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkShareHcp extends Components.HclSdkShareHcp {}

@Component({
  selector: 'hcl-sdk-share-hcp',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class HclSdkShareHcp {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface HclSdkSort extends Components.HclSdkSort {}

@Component({
  selector: 'hcl-sdk-sort',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class HclSdkSort {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import { HclSdkSwitchViewMode as IHclSdkSwitchViewMode } from '@healthcarelocator/sdk-web/dist/types/components/ui-kits/hcl-sdk-switch-view-mode/hcl-sdk-switch-view-mode';
export declare interface HclSdkSwitchViewMode extends Components.HclSdkSwitchViewMode {}
@ProxyCmp({
  inputs: ['typeOfLabel']
})
@Component({
  selector: 'hcl-sdk-switch-view-mode',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['typeOfLabel'],
  outputs: ['switchViewMode']
})
export class HclSdkSwitchViewMode {
  /**  */
  switchViewMode!: IHclSdkSwitchViewMode['switchViewMode'];
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['switchViewMode']);
  }
}


export declare interface HclSdkWidgetMap extends Components.HclSdkWidgetMap {}
@ProxyCmp({
  inputs: ['widgetProps']
})
@Component({
  selector: 'hcl-sdk-widget-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['widgetProps']
})
export class HclSdkWidgetMap {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}
