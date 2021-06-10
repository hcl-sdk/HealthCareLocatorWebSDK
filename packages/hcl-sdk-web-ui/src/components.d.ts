/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { HclSDKConfigData } from "./core/stores/ConfigStore";
import { Modal, ModeViewType } from "hcl-sdk-web-ui/src/core/stores/ConfigStore";
import { Breakpoint } from "hcl-sdk-web-ui/src/core/types";
import { OptionType } from "./core/types";
export namespace Components {
    interface HclSdk {
        "init": (config?: any) => Promise<void>;
        "searchNearMe": ({ specialtyCode }: { specialtyCode: any; }) => Promise<void>;
        "updateConfig": (patch: any) => Promise<HclSDKConfigData>;
    }
    interface HclSdkButton {
        "class": string;
        "disabled": boolean;
        "icon": string;
        "iconColor": string;
        "iconHeight": number;
        "iconWidth": number;
        "isFull": boolean;
        "noBackground": boolean;
        "noBorder": boolean;
        "noTextColor": boolean;
        "primary": boolean;
        "round": boolean;
        "secondary": boolean;
        "type": string;
    }
    interface HclSdkDevSettings {
    }
    interface HclSdkDoctorCard {
        "address": string;
        "distance": string;
        "name": string;
        "professionalType": string;
        "selected": boolean;
        "showDistance": boolean;
        "viewMode": string;
    }
    interface HclSdkHcpFullCard {
    }
    interface HclSdkHome {
    }
    interface HclSdkHomeFull {
    }
    interface HclSdkHomeMin {
    }
    interface HclSdkIcon {
        "color": string;
        "height": number;
        "name": string;
        "primary": boolean;
        "width": number;
    }
    interface HclSdkIconArrow {
        "color": string;
        "height": number;
        "width": number;
    }
    interface HclSdkIconChevronArrow {
        "color": string;
        "height": number;
        "width": number;
    }
    interface HclSdkIconCircular {
        "color": string;
        "height": number;
        "width": number;
    }
    interface HclSdkIconDefaultAvatar {
        "color": string;
        "height": number;
        "width": number;
    }
    interface HclSdkIconDirection {
        "color": string;
        "height": number;
        "width": number;
    }
    interface HclSdkIconDislike {
        "color": string;
        "height": number;
        "width": number;
    }
    interface HclSdkIconEarth {
        "color": string;
        "height": number;
        "width": number;
    }
    interface HclSdkIconEdit {
        "color": string;
        "height": number;
        "width": number;
    }
    interface HclSdkIconHistory {
        "color": string;
        "height": number;
        "width": number;
    }
    interface HclSdkIconLike {
        "color": string;
        "height": number;
        "width": number;
    }
    interface HclSdkIconList {
        "color": string;
        "height": number;
        "width": number;
    }
    interface HclSdkIconLocate {
        "color": string;
        "height": number;
        "width": number;
    }
    interface HclSdkIconLocation {
        "color": string;
        "height": number;
        "width": number;
    }
    interface HclSdkIconMap {
        "color": string;
        "height": number;
        "width": number;
    }
    interface HclSdkIconNoAccounts {
        "color": string;
        "height": number;
        "width": number;
    }
    interface HclSdkIconPersonal {
        "color": string;
        "height": number;
        "width": number;
    }
    interface HclSdkIconPhone {
        "color": string;
        "height": number;
        "width": number;
    }
    interface HclSdkIconPrinter {
        "color": string;
        "height": number;
        "width": number;
    }
    interface HclSdkIconRefresh {
        "color": string;
        "height": number;
        "width": number;
    }
    interface HclSdkIconRemove {
        "color": string;
        "height": number;
        "width": number;
    }
    interface HclSdkIconSearch {
        "color": string;
        "height": number;
        "width": number;
    }
    interface HclSdkIconSearchOff {
        "color": string;
        "height": number;
        "width": number;
    }
    interface HclSdkIconShare {
        "color": string;
        "height": number;
        "width": number;
    }
    interface HclSdkIconSort {
        "color": string;
        "height": number;
        "width": number;
    }
    interface HclSdkInput {
        "autoComplete"?: string;
        "autoFocus"?: boolean;
        "checked"?: boolean;
        "class"?: string;
        "loading"?: boolean;
        "name"?: string;
        "onBlur"?: (e: any) => void;
        "onFocus"?: (e: any) => void;
        "onInput"?: (e: any) => void;
        "onPostfixClick"?: (e: any) => void;
        "placeholder"?: string;
        "postfixIcon"?: string;
        "readOnly"?: boolean;
        "type"?: string;
        "value"?: any;
    }
    interface HclSdkLoading {
    }
    interface HclSdkMap {
        "breakpoint": Breakpoint;
        "defaultZoom": number;
        "dragging": boolean;
        "interactive": boolean;
        "isForcedZoomToMe": boolean;
        "isShowMeMarker": boolean;
        "locations": any[];
        "mapHeight": string;
        "mapMinHeight": string;
        "mapWidth": string;
        "markerIcon": string;
        "modeView": ModeViewType;
        "noCurrentLocation": boolean;
        "selectedLocationIdx": number;
        "zoomControl": boolean;
    }
    interface HclSdkModal {
        "modal"?: Modal;
    }
    interface HclSdkProfileMap {
    }
    interface HclSdkRoute {
        "component": string;
        "path": string;
    }
    interface HclSdkRouter {
    }
    interface HclSdkRouterLink {
        "activeClass": string;
        "anchorClass"?: string;
        "anchorId"?: string;
        "anchorRole"?: string;
        "anchorTabIndex"?: string;
        "anchorTitle"?: string;
        "ariaHaspopup"?: string;
        "ariaLabel"?: string;
        "ariaPosinset"?: string;
        "ariaSetsize"?: number;
        "custom": string;
        "url": string;
    }
    interface HclSdkSearch {
        "noIcon": boolean;
        "searchText": string;
        "showSwitchMode"?: boolean;
    }
    interface HclSdkSearchAddressItem {
        "activated": boolean;
        "currentSearchText"?: string;
        "item": any;
    }
    interface HclSdkSearchNoDataAvailable {
    }
    interface HclSdkSearchNoResults {
    }
    interface HclSdkSearchResult {
    }
    interface HclSdkSelect {
        "loading"?: boolean;
        "onChange"?: (e: any) => void;
        "options"?: OptionType[];
        "value"?: string;
    }
    interface HclSdkSort {
    }
    interface HclSdkSwitchViewMode {
        "typeOfLabel": 'full' | 'short' | 'disabled';
    }
}
declare global {
    interface HTMLHclSdkElement extends Components.HclSdk, HTMLStencilElement {
    }
    var HTMLHclSdkElement: {
        prototype: HTMLHclSdkElement;
        new (): HTMLHclSdkElement;
    };
    interface HTMLHclSdkButtonElement extends Components.HclSdkButton, HTMLStencilElement {
    }
    var HTMLHclSdkButtonElement: {
        prototype: HTMLHclSdkButtonElement;
        new (): HTMLHclSdkButtonElement;
    };
    interface HTMLHclSdkDevSettingsElement extends Components.HclSdkDevSettings, HTMLStencilElement {
    }
    var HTMLHclSdkDevSettingsElement: {
        prototype: HTMLHclSdkDevSettingsElement;
        new (): HTMLHclSdkDevSettingsElement;
    };
    interface HTMLHclSdkDoctorCardElement extends Components.HclSdkDoctorCard, HTMLStencilElement {
    }
    var HTMLHclSdkDoctorCardElement: {
        prototype: HTMLHclSdkDoctorCardElement;
        new (): HTMLHclSdkDoctorCardElement;
    };
    interface HTMLHclSdkHcpFullCardElement extends Components.HclSdkHcpFullCard, HTMLStencilElement {
    }
    var HTMLHclSdkHcpFullCardElement: {
        prototype: HTMLHclSdkHcpFullCardElement;
        new (): HTMLHclSdkHcpFullCardElement;
    };
    interface HTMLHclSdkHomeElement extends Components.HclSdkHome, HTMLStencilElement {
    }
    var HTMLHclSdkHomeElement: {
        prototype: HTMLHclSdkHomeElement;
        new (): HTMLHclSdkHomeElement;
    };
    interface HTMLHclSdkHomeFullElement extends Components.HclSdkHomeFull, HTMLStencilElement {
    }
    var HTMLHclSdkHomeFullElement: {
        prototype: HTMLHclSdkHomeFullElement;
        new (): HTMLHclSdkHomeFullElement;
    };
    interface HTMLHclSdkHomeMinElement extends Components.HclSdkHomeMin, HTMLStencilElement {
    }
    var HTMLHclSdkHomeMinElement: {
        prototype: HTMLHclSdkHomeMinElement;
        new (): HTMLHclSdkHomeMinElement;
    };
    interface HTMLHclSdkIconElement extends Components.HclSdkIcon, HTMLStencilElement {
    }
    var HTMLHclSdkIconElement: {
        prototype: HTMLHclSdkIconElement;
        new (): HTMLHclSdkIconElement;
    };
    interface HTMLHclSdkIconArrowElement extends Components.HclSdkIconArrow, HTMLStencilElement {
    }
    var HTMLHclSdkIconArrowElement: {
        prototype: HTMLHclSdkIconArrowElement;
        new (): HTMLHclSdkIconArrowElement;
    };
    interface HTMLHclSdkIconChevronArrowElement extends Components.HclSdkIconChevronArrow, HTMLStencilElement {
    }
    var HTMLHclSdkIconChevronArrowElement: {
        prototype: HTMLHclSdkIconChevronArrowElement;
        new (): HTMLHclSdkIconChevronArrowElement;
    };
    interface HTMLHclSdkIconCircularElement extends Components.HclSdkIconCircular, HTMLStencilElement {
    }
    var HTMLHclSdkIconCircularElement: {
        prototype: HTMLHclSdkIconCircularElement;
        new (): HTMLHclSdkIconCircularElement;
    };
    interface HTMLHclSdkIconDefaultAvatarElement extends Components.HclSdkIconDefaultAvatar, HTMLStencilElement {
    }
    var HTMLHclSdkIconDefaultAvatarElement: {
        prototype: HTMLHclSdkIconDefaultAvatarElement;
        new (): HTMLHclSdkIconDefaultAvatarElement;
    };
    interface HTMLHclSdkIconDirectionElement extends Components.HclSdkIconDirection, HTMLStencilElement {
    }
    var HTMLHclSdkIconDirectionElement: {
        prototype: HTMLHclSdkIconDirectionElement;
        new (): HTMLHclSdkIconDirectionElement;
    };
    interface HTMLHclSdkIconDislikeElement extends Components.HclSdkIconDislike, HTMLStencilElement {
    }
    var HTMLHclSdkIconDislikeElement: {
        prototype: HTMLHclSdkIconDislikeElement;
        new (): HTMLHclSdkIconDislikeElement;
    };
    interface HTMLHclSdkIconEarthElement extends Components.HclSdkIconEarth, HTMLStencilElement {
    }
    var HTMLHclSdkIconEarthElement: {
        prototype: HTMLHclSdkIconEarthElement;
        new (): HTMLHclSdkIconEarthElement;
    };
    interface HTMLHclSdkIconEditElement extends Components.HclSdkIconEdit, HTMLStencilElement {
    }
    var HTMLHclSdkIconEditElement: {
        prototype: HTMLHclSdkIconEditElement;
        new (): HTMLHclSdkIconEditElement;
    };
    interface HTMLHclSdkIconHistoryElement extends Components.HclSdkIconHistory, HTMLStencilElement {
    }
    var HTMLHclSdkIconHistoryElement: {
        prototype: HTMLHclSdkIconHistoryElement;
        new (): HTMLHclSdkIconHistoryElement;
    };
    interface HTMLHclSdkIconLikeElement extends Components.HclSdkIconLike, HTMLStencilElement {
    }
    var HTMLHclSdkIconLikeElement: {
        prototype: HTMLHclSdkIconLikeElement;
        new (): HTMLHclSdkIconLikeElement;
    };
    interface HTMLHclSdkIconListElement extends Components.HclSdkIconList, HTMLStencilElement {
    }
    var HTMLHclSdkIconListElement: {
        prototype: HTMLHclSdkIconListElement;
        new (): HTMLHclSdkIconListElement;
    };
    interface HTMLHclSdkIconLocateElement extends Components.HclSdkIconLocate, HTMLStencilElement {
    }
    var HTMLHclSdkIconLocateElement: {
        prototype: HTMLHclSdkIconLocateElement;
        new (): HTMLHclSdkIconLocateElement;
    };
    interface HTMLHclSdkIconLocationElement extends Components.HclSdkIconLocation, HTMLStencilElement {
    }
    var HTMLHclSdkIconLocationElement: {
        prototype: HTMLHclSdkIconLocationElement;
        new (): HTMLHclSdkIconLocationElement;
    };
    interface HTMLHclSdkIconMapElement extends Components.HclSdkIconMap, HTMLStencilElement {
    }
    var HTMLHclSdkIconMapElement: {
        prototype: HTMLHclSdkIconMapElement;
        new (): HTMLHclSdkIconMapElement;
    };
    interface HTMLHclSdkIconNoAccountsElement extends Components.HclSdkIconNoAccounts, HTMLStencilElement {
    }
    var HTMLHclSdkIconNoAccountsElement: {
        prototype: HTMLHclSdkIconNoAccountsElement;
        new (): HTMLHclSdkIconNoAccountsElement;
    };
    interface HTMLHclSdkIconPersonalElement extends Components.HclSdkIconPersonal, HTMLStencilElement {
    }
    var HTMLHclSdkIconPersonalElement: {
        prototype: HTMLHclSdkIconPersonalElement;
        new (): HTMLHclSdkIconPersonalElement;
    };
    interface HTMLHclSdkIconPhoneElement extends Components.HclSdkIconPhone, HTMLStencilElement {
    }
    var HTMLHclSdkIconPhoneElement: {
        prototype: HTMLHclSdkIconPhoneElement;
        new (): HTMLHclSdkIconPhoneElement;
    };
    interface HTMLHclSdkIconPrinterElement extends Components.HclSdkIconPrinter, HTMLStencilElement {
    }
    var HTMLHclSdkIconPrinterElement: {
        prototype: HTMLHclSdkIconPrinterElement;
        new (): HTMLHclSdkIconPrinterElement;
    };
    interface HTMLHclSdkIconRefreshElement extends Components.HclSdkIconRefresh, HTMLStencilElement {
    }
    var HTMLHclSdkIconRefreshElement: {
        prototype: HTMLHclSdkIconRefreshElement;
        new (): HTMLHclSdkIconRefreshElement;
    };
    interface HTMLHclSdkIconRemoveElement extends Components.HclSdkIconRemove, HTMLStencilElement {
    }
    var HTMLHclSdkIconRemoveElement: {
        prototype: HTMLHclSdkIconRemoveElement;
        new (): HTMLHclSdkIconRemoveElement;
    };
    interface HTMLHclSdkIconSearchElement extends Components.HclSdkIconSearch, HTMLStencilElement {
    }
    var HTMLHclSdkIconSearchElement: {
        prototype: HTMLHclSdkIconSearchElement;
        new (): HTMLHclSdkIconSearchElement;
    };
    interface HTMLHclSdkIconSearchOffElement extends Components.HclSdkIconSearchOff, HTMLStencilElement {
    }
    var HTMLHclSdkIconSearchOffElement: {
        prototype: HTMLHclSdkIconSearchOffElement;
        new (): HTMLHclSdkIconSearchOffElement;
    };
    interface HTMLHclSdkIconShareElement extends Components.HclSdkIconShare, HTMLStencilElement {
    }
    var HTMLHclSdkIconShareElement: {
        prototype: HTMLHclSdkIconShareElement;
        new (): HTMLHclSdkIconShareElement;
    };
    interface HTMLHclSdkIconSortElement extends Components.HclSdkIconSort, HTMLStencilElement {
    }
    var HTMLHclSdkIconSortElement: {
        prototype: HTMLHclSdkIconSortElement;
        new (): HTMLHclSdkIconSortElement;
    };
    interface HTMLHclSdkInputElement extends Components.HclSdkInput, HTMLStencilElement {
    }
    var HTMLHclSdkInputElement: {
        prototype: HTMLHclSdkInputElement;
        new (): HTMLHclSdkInputElement;
    };
    interface HTMLHclSdkLoadingElement extends Components.HclSdkLoading, HTMLStencilElement {
    }
    var HTMLHclSdkLoadingElement: {
        prototype: HTMLHclSdkLoadingElement;
        new (): HTMLHclSdkLoadingElement;
    };
    interface HTMLHclSdkMapElement extends Components.HclSdkMap, HTMLStencilElement {
    }
    var HTMLHclSdkMapElement: {
        prototype: HTMLHclSdkMapElement;
        new (): HTMLHclSdkMapElement;
    };
    interface HTMLHclSdkModalElement extends Components.HclSdkModal, HTMLStencilElement {
    }
    var HTMLHclSdkModalElement: {
        prototype: HTMLHclSdkModalElement;
        new (): HTMLHclSdkModalElement;
    };
    interface HTMLHclSdkProfileMapElement extends Components.HclSdkProfileMap, HTMLStencilElement {
    }
    var HTMLHclSdkProfileMapElement: {
        prototype: HTMLHclSdkProfileMapElement;
        new (): HTMLHclSdkProfileMapElement;
    };
    interface HTMLHclSdkRouteElement extends Components.HclSdkRoute, HTMLStencilElement {
    }
    var HTMLHclSdkRouteElement: {
        prototype: HTMLHclSdkRouteElement;
        new (): HTMLHclSdkRouteElement;
    };
    interface HTMLHclSdkRouterElement extends Components.HclSdkRouter, HTMLStencilElement {
    }
    var HTMLHclSdkRouterElement: {
        prototype: HTMLHclSdkRouterElement;
        new (): HTMLHclSdkRouterElement;
    };
    interface HTMLHclSdkRouterLinkElement extends Components.HclSdkRouterLink, HTMLStencilElement {
    }
    var HTMLHclSdkRouterLinkElement: {
        prototype: HTMLHclSdkRouterLinkElement;
        new (): HTMLHclSdkRouterLinkElement;
    };
    interface HTMLHclSdkSearchElement extends Components.HclSdkSearch, HTMLStencilElement {
    }
    var HTMLHclSdkSearchElement: {
        prototype: HTMLHclSdkSearchElement;
        new (): HTMLHclSdkSearchElement;
    };
    interface HTMLHclSdkSearchAddressItemElement extends Components.HclSdkSearchAddressItem, HTMLStencilElement {
    }
    var HTMLHclSdkSearchAddressItemElement: {
        prototype: HTMLHclSdkSearchAddressItemElement;
        new (): HTMLHclSdkSearchAddressItemElement;
    };
    interface HTMLHclSdkSearchNoDataAvailableElement extends Components.HclSdkSearchNoDataAvailable, HTMLStencilElement {
    }
    var HTMLHclSdkSearchNoDataAvailableElement: {
        prototype: HTMLHclSdkSearchNoDataAvailableElement;
        new (): HTMLHclSdkSearchNoDataAvailableElement;
    };
    interface HTMLHclSdkSearchNoResultsElement extends Components.HclSdkSearchNoResults, HTMLStencilElement {
    }
    var HTMLHclSdkSearchNoResultsElement: {
        prototype: HTMLHclSdkSearchNoResultsElement;
        new (): HTMLHclSdkSearchNoResultsElement;
    };
    interface HTMLHclSdkSearchResultElement extends Components.HclSdkSearchResult, HTMLStencilElement {
    }
    var HTMLHclSdkSearchResultElement: {
        prototype: HTMLHclSdkSearchResultElement;
        new (): HTMLHclSdkSearchResultElement;
    };
    interface HTMLHclSdkSelectElement extends Components.HclSdkSelect, HTMLStencilElement {
    }
    var HTMLHclSdkSelectElement: {
        prototype: HTMLHclSdkSelectElement;
        new (): HTMLHclSdkSelectElement;
    };
    interface HTMLHclSdkSortElement extends Components.HclSdkSort, HTMLStencilElement {
    }
    var HTMLHclSdkSortElement: {
        prototype: HTMLHclSdkSortElement;
        new (): HTMLHclSdkSortElement;
    };
    interface HTMLHclSdkSwitchViewModeElement extends Components.HclSdkSwitchViewMode, HTMLStencilElement {
    }
    var HTMLHclSdkSwitchViewModeElement: {
        prototype: HTMLHclSdkSwitchViewModeElement;
        new (): HTMLHclSdkSwitchViewModeElement;
    };
    interface HTMLElementTagNameMap {
        "hcl-sdk": HTMLHclSdkElement;
        "hcl-sdk-button": HTMLHclSdkButtonElement;
        "hcl-sdk-dev-settings": HTMLHclSdkDevSettingsElement;
        "hcl-sdk-doctor-card": HTMLHclSdkDoctorCardElement;
        "hcl-sdk-hcp-full-card": HTMLHclSdkHcpFullCardElement;
        "hcl-sdk-home": HTMLHclSdkHomeElement;
        "hcl-sdk-home-full": HTMLHclSdkHomeFullElement;
        "hcl-sdk-home-min": HTMLHclSdkHomeMinElement;
        "hcl-sdk-icon": HTMLHclSdkIconElement;
        "hcl-sdk-icon-arrow": HTMLHclSdkIconArrowElement;
        "hcl-sdk-icon-chevron-arrow": HTMLHclSdkIconChevronArrowElement;
        "hcl-sdk-icon-circular": HTMLHclSdkIconCircularElement;
        "hcl-sdk-icon-default-avatar": HTMLHclSdkIconDefaultAvatarElement;
        "hcl-sdk-icon-direction": HTMLHclSdkIconDirectionElement;
        "hcl-sdk-icon-dislike": HTMLHclSdkIconDislikeElement;
        "hcl-sdk-icon-earth": HTMLHclSdkIconEarthElement;
        "hcl-sdk-icon-edit": HTMLHclSdkIconEditElement;
        "hcl-sdk-icon-history": HTMLHclSdkIconHistoryElement;
        "hcl-sdk-icon-like": HTMLHclSdkIconLikeElement;
        "hcl-sdk-icon-list": HTMLHclSdkIconListElement;
        "hcl-sdk-icon-locate": HTMLHclSdkIconLocateElement;
        "hcl-sdk-icon-location": HTMLHclSdkIconLocationElement;
        "hcl-sdk-icon-map": HTMLHclSdkIconMapElement;
        "hcl-sdk-icon-no-accounts": HTMLHclSdkIconNoAccountsElement;
        "hcl-sdk-icon-personal": HTMLHclSdkIconPersonalElement;
        "hcl-sdk-icon-phone": HTMLHclSdkIconPhoneElement;
        "hcl-sdk-icon-printer": HTMLHclSdkIconPrinterElement;
        "hcl-sdk-icon-refresh": HTMLHclSdkIconRefreshElement;
        "hcl-sdk-icon-remove": HTMLHclSdkIconRemoveElement;
        "hcl-sdk-icon-search": HTMLHclSdkIconSearchElement;
        "hcl-sdk-icon-search-off": HTMLHclSdkIconSearchOffElement;
        "hcl-sdk-icon-share": HTMLHclSdkIconShareElement;
        "hcl-sdk-icon-sort": HTMLHclSdkIconSortElement;
        "hcl-sdk-input": HTMLHclSdkInputElement;
        "hcl-sdk-loading": HTMLHclSdkLoadingElement;
        "hcl-sdk-map": HTMLHclSdkMapElement;
        "hcl-sdk-modal": HTMLHclSdkModalElement;
        "hcl-sdk-profile-map": HTMLHclSdkProfileMapElement;
        "hcl-sdk-route": HTMLHclSdkRouteElement;
        "hcl-sdk-router": HTMLHclSdkRouterElement;
        "hcl-sdk-router-link": HTMLHclSdkRouterLinkElement;
        "hcl-sdk-search": HTMLHclSdkSearchElement;
        "hcl-sdk-search-address-item": HTMLHclSdkSearchAddressItemElement;
        "hcl-sdk-search-no-data-available": HTMLHclSdkSearchNoDataAvailableElement;
        "hcl-sdk-search-no-results": HTMLHclSdkSearchNoResultsElement;
        "hcl-sdk-search-result": HTMLHclSdkSearchResultElement;
        "hcl-sdk-select": HTMLHclSdkSelectElement;
        "hcl-sdk-sort": HTMLHclSdkSortElement;
        "hcl-sdk-switch-view-mode": HTMLHclSdkSwitchViewModeElement;
    }
}
declare namespace LocalJSX {
    interface HclSdk {
    }
    interface HclSdkButton {
        "class"?: string;
        "disabled"?: boolean;
        "icon"?: string;
        "iconColor"?: string;
        "iconHeight"?: number;
        "iconWidth"?: number;
        "isFull"?: boolean;
        "noBackground"?: boolean;
        "noBorder"?: boolean;
        "noTextColor"?: boolean;
        "primary"?: boolean;
        "round"?: boolean;
        "secondary"?: boolean;
        "type"?: string;
    }
    interface HclSdkDevSettings {
    }
    interface HclSdkDoctorCard {
        "address"?: string;
        "distance"?: string;
        "name"?: string;
        "professionalType"?: string;
        "selected"?: boolean;
        "showDistance"?: boolean;
        "viewMode"?: string;
    }
    interface HclSdkHcpFullCard {
        "onBackFromHcpFullCard"?: (event: CustomEvent<MouseEvent>) => void;
    }
    interface HclSdkHome {
    }
    interface HclSdkHomeFull {
    }
    interface HclSdkHomeMin {
        "onGoSearchScreen"?: (event: CustomEvent<any>) => void;
    }
    interface HclSdkIcon {
        "color"?: string;
        "height"?: number;
        "name"?: string;
        "primary"?: boolean;
        "width"?: number;
    }
    interface HclSdkIconArrow {
        "color"?: string;
        "height"?: number;
        "width"?: number;
    }
    interface HclSdkIconChevronArrow {
        "color"?: string;
        "height"?: number;
        "width"?: number;
    }
    interface HclSdkIconCircular {
        "color"?: string;
        "height"?: number;
        "width"?: number;
    }
    interface HclSdkIconDefaultAvatar {
        "color"?: string;
        "height"?: number;
        "width"?: number;
    }
    interface HclSdkIconDirection {
        "color"?: string;
        "height"?: number;
        "width"?: number;
    }
    interface HclSdkIconDislike {
        "color"?: string;
        "height"?: number;
        "width"?: number;
    }
    interface HclSdkIconEarth {
        "color"?: string;
        "height"?: number;
        "width"?: number;
    }
    interface HclSdkIconEdit {
        "color"?: string;
        "height"?: number;
        "width"?: number;
    }
    interface HclSdkIconHistory {
        "color"?: string;
        "height"?: number;
        "width"?: number;
    }
    interface HclSdkIconLike {
        "color"?: string;
        "height"?: number;
        "width"?: number;
    }
    interface HclSdkIconList {
        "color"?: string;
        "height"?: number;
        "width"?: number;
    }
    interface HclSdkIconLocate {
        "color"?: string;
        "height"?: number;
        "width"?: number;
    }
    interface HclSdkIconLocation {
        "color"?: string;
        "height"?: number;
        "width"?: number;
    }
    interface HclSdkIconMap {
        "color"?: string;
        "height"?: number;
        "width"?: number;
    }
    interface HclSdkIconNoAccounts {
        "color"?: string;
        "height"?: number;
        "width"?: number;
    }
    interface HclSdkIconPersonal {
        "color"?: string;
        "height"?: number;
        "width"?: number;
    }
    interface HclSdkIconPhone {
        "color"?: string;
        "height"?: number;
        "width"?: number;
    }
    interface HclSdkIconPrinter {
        "color"?: string;
        "height"?: number;
        "width"?: number;
    }
    interface HclSdkIconRefresh {
        "color"?: string;
        "height"?: number;
        "width"?: number;
    }
    interface HclSdkIconRemove {
        "color"?: string;
        "height"?: number;
        "width"?: number;
    }
    interface HclSdkIconSearch {
        "color"?: string;
        "height"?: number;
        "width"?: number;
    }
    interface HclSdkIconSearchOff {
        "color"?: string;
        "height"?: number;
        "width"?: number;
    }
    interface HclSdkIconShare {
        "color"?: string;
        "height"?: number;
        "width"?: number;
    }
    interface HclSdkIconSort {
        "color"?: string;
        "height"?: number;
        "width"?: number;
    }
    interface HclSdkInput {
        "autoComplete"?: string;
        "autoFocus"?: boolean;
        "checked"?: boolean;
        "class"?: string;
        "loading"?: boolean;
        "name"?: string;
        "onBlur"?: (e: any) => void;
        "onFocus"?: (e: any) => void;
        "onInput"?: (e: any) => void;
        "onPostfixClick"?: (e: any) => void;
        "placeholder"?: string;
        "postfixIcon"?: string;
        "readOnly"?: boolean;
        "type"?: string;
        "value"?: any;
    }
    interface HclSdkLoading {
    }
    interface HclSdkMap {
        "breakpoint"?: Breakpoint;
        "defaultZoom"?: number;
        "dragging"?: boolean;
        "interactive"?: boolean;
        "isForcedZoomToMe"?: boolean;
        "isShowMeMarker"?: boolean;
        "locations"?: any[];
        "mapHeight"?: string;
        "mapMinHeight"?: string;
        "mapWidth"?: string;
        "markerIcon"?: string;
        "modeView"?: ModeViewType;
        "noCurrentLocation"?: boolean;
        "onMapClicked"?: (event: CustomEvent<any>) => void;
        "onMoveCurrentLocation"?: (event: CustomEvent<any>) => void;
        "onOnMapDrag"?: (event: CustomEvent<any>) => void;
        "onOnMarkerClick"?: (event: CustomEvent<any>) => void;
        "selectedLocationIdx"?: number;
        "zoomControl"?: boolean;
    }
    interface HclSdkModal {
        "modal"?: Modal;
    }
    interface HclSdkProfileMap {
    }
    interface HclSdkRoute {
        "component"?: string;
        "path"?: string;
    }
    interface HclSdkRouter {
    }
    interface HclSdkRouterLink {
        "activeClass"?: string;
        "anchorClass"?: string;
        "anchorId"?: string;
        "anchorRole"?: string;
        "anchorTabIndex"?: string;
        "anchorTitle"?: string;
        "ariaHaspopup"?: string;
        "ariaLabel"?: string;
        "ariaPosinset"?: string;
        "ariaSetsize"?: number;
        "custom"?: string;
        "url"?: string;
    }
    interface HclSdkSearch {
        "noIcon"?: boolean;
        "searchText"?: string;
        "showSwitchMode"?: boolean;
    }
    interface HclSdkSearchAddressItem {
        "activated"?: boolean;
        "currentSearchText"?: string;
        "item"?: any;
        "onSelectAddress"?: (event: CustomEvent<any>) => void;
    }
    interface HclSdkSearchNoDataAvailable {
    }
    interface HclSdkSearchNoResults {
    }
    interface HclSdkSearchResult {
    }
    interface HclSdkSelect {
        "loading"?: boolean;
        "onChange"?: (e: any) => void;
        "options"?: OptionType[];
        "value"?: string;
    }
    interface HclSdkSort {
    }
    interface HclSdkSwitchViewMode {
        "onSwitchViewMode"?: (event: CustomEvent<any>) => void;
        "typeOfLabel"?: 'full' | 'short' | 'disabled';
    }
    interface IntrinsicElements {
        "hcl-sdk": HclSdk;
        "hcl-sdk-button": HclSdkButton;
        "hcl-sdk-dev-settings": HclSdkDevSettings;
        "hcl-sdk-doctor-card": HclSdkDoctorCard;
        "hcl-sdk-hcp-full-card": HclSdkHcpFullCard;
        "hcl-sdk-home": HclSdkHome;
        "hcl-sdk-home-full": HclSdkHomeFull;
        "hcl-sdk-home-min": HclSdkHomeMin;
        "hcl-sdk-icon": HclSdkIcon;
        "hcl-sdk-icon-arrow": HclSdkIconArrow;
        "hcl-sdk-icon-chevron-arrow": HclSdkIconChevronArrow;
        "hcl-sdk-icon-circular": HclSdkIconCircular;
        "hcl-sdk-icon-default-avatar": HclSdkIconDefaultAvatar;
        "hcl-sdk-icon-direction": HclSdkIconDirection;
        "hcl-sdk-icon-dislike": HclSdkIconDislike;
        "hcl-sdk-icon-earth": HclSdkIconEarth;
        "hcl-sdk-icon-edit": HclSdkIconEdit;
        "hcl-sdk-icon-history": HclSdkIconHistory;
        "hcl-sdk-icon-like": HclSdkIconLike;
        "hcl-sdk-icon-list": HclSdkIconList;
        "hcl-sdk-icon-locate": HclSdkIconLocate;
        "hcl-sdk-icon-location": HclSdkIconLocation;
        "hcl-sdk-icon-map": HclSdkIconMap;
        "hcl-sdk-icon-no-accounts": HclSdkIconNoAccounts;
        "hcl-sdk-icon-personal": HclSdkIconPersonal;
        "hcl-sdk-icon-phone": HclSdkIconPhone;
        "hcl-sdk-icon-printer": HclSdkIconPrinter;
        "hcl-sdk-icon-refresh": HclSdkIconRefresh;
        "hcl-sdk-icon-remove": HclSdkIconRemove;
        "hcl-sdk-icon-search": HclSdkIconSearch;
        "hcl-sdk-icon-search-off": HclSdkIconSearchOff;
        "hcl-sdk-icon-share": HclSdkIconShare;
        "hcl-sdk-icon-sort": HclSdkIconSort;
        "hcl-sdk-input": HclSdkInput;
        "hcl-sdk-loading": HclSdkLoading;
        "hcl-sdk-map": HclSdkMap;
        "hcl-sdk-modal": HclSdkModal;
        "hcl-sdk-profile-map": HclSdkProfileMap;
        "hcl-sdk-route": HclSdkRoute;
        "hcl-sdk-router": HclSdkRouter;
        "hcl-sdk-router-link": HclSdkRouterLink;
        "hcl-sdk-search": HclSdkSearch;
        "hcl-sdk-search-address-item": HclSdkSearchAddressItem;
        "hcl-sdk-search-no-data-available": HclSdkSearchNoDataAvailable;
        "hcl-sdk-search-no-results": HclSdkSearchNoResults;
        "hcl-sdk-search-result": HclSdkSearchResult;
        "hcl-sdk-select": HclSdkSelect;
        "hcl-sdk-sort": HclSdkSort;
        "hcl-sdk-switch-view-mode": HclSdkSwitchViewMode;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "hcl-sdk": LocalJSX.HclSdk & JSXBase.HTMLAttributes<HTMLHclSdkElement>;
            "hcl-sdk-button": LocalJSX.HclSdkButton & JSXBase.HTMLAttributes<HTMLHclSdkButtonElement>;
            "hcl-sdk-dev-settings": LocalJSX.HclSdkDevSettings & JSXBase.HTMLAttributes<HTMLHclSdkDevSettingsElement>;
            "hcl-sdk-doctor-card": LocalJSX.HclSdkDoctorCard & JSXBase.HTMLAttributes<HTMLHclSdkDoctorCardElement>;
            "hcl-sdk-hcp-full-card": LocalJSX.HclSdkHcpFullCard & JSXBase.HTMLAttributes<HTMLHclSdkHcpFullCardElement>;
            "hcl-sdk-home": LocalJSX.HclSdkHome & JSXBase.HTMLAttributes<HTMLHclSdkHomeElement>;
            "hcl-sdk-home-full": LocalJSX.HclSdkHomeFull & JSXBase.HTMLAttributes<HTMLHclSdkHomeFullElement>;
            "hcl-sdk-home-min": LocalJSX.HclSdkHomeMin & JSXBase.HTMLAttributes<HTMLHclSdkHomeMinElement>;
            "hcl-sdk-icon": LocalJSX.HclSdkIcon & JSXBase.HTMLAttributes<HTMLHclSdkIconElement>;
            "hcl-sdk-icon-arrow": LocalJSX.HclSdkIconArrow & JSXBase.HTMLAttributes<HTMLHclSdkIconArrowElement>;
            "hcl-sdk-icon-chevron-arrow": LocalJSX.HclSdkIconChevronArrow & JSXBase.HTMLAttributes<HTMLHclSdkIconChevronArrowElement>;
            "hcl-sdk-icon-circular": LocalJSX.HclSdkIconCircular & JSXBase.HTMLAttributes<HTMLHclSdkIconCircularElement>;
            "hcl-sdk-icon-default-avatar": LocalJSX.HclSdkIconDefaultAvatar & JSXBase.HTMLAttributes<HTMLHclSdkIconDefaultAvatarElement>;
            "hcl-sdk-icon-direction": LocalJSX.HclSdkIconDirection & JSXBase.HTMLAttributes<HTMLHclSdkIconDirectionElement>;
            "hcl-sdk-icon-dislike": LocalJSX.HclSdkIconDislike & JSXBase.HTMLAttributes<HTMLHclSdkIconDislikeElement>;
            "hcl-sdk-icon-earth": LocalJSX.HclSdkIconEarth & JSXBase.HTMLAttributes<HTMLHclSdkIconEarthElement>;
            "hcl-sdk-icon-edit": LocalJSX.HclSdkIconEdit & JSXBase.HTMLAttributes<HTMLHclSdkIconEditElement>;
            "hcl-sdk-icon-history": LocalJSX.HclSdkIconHistory & JSXBase.HTMLAttributes<HTMLHclSdkIconHistoryElement>;
            "hcl-sdk-icon-like": LocalJSX.HclSdkIconLike & JSXBase.HTMLAttributes<HTMLHclSdkIconLikeElement>;
            "hcl-sdk-icon-list": LocalJSX.HclSdkIconList & JSXBase.HTMLAttributes<HTMLHclSdkIconListElement>;
            "hcl-sdk-icon-locate": LocalJSX.HclSdkIconLocate & JSXBase.HTMLAttributes<HTMLHclSdkIconLocateElement>;
            "hcl-sdk-icon-location": LocalJSX.HclSdkIconLocation & JSXBase.HTMLAttributes<HTMLHclSdkIconLocationElement>;
            "hcl-sdk-icon-map": LocalJSX.HclSdkIconMap & JSXBase.HTMLAttributes<HTMLHclSdkIconMapElement>;
            "hcl-sdk-icon-no-accounts": LocalJSX.HclSdkIconNoAccounts & JSXBase.HTMLAttributes<HTMLHclSdkIconNoAccountsElement>;
            "hcl-sdk-icon-personal": LocalJSX.HclSdkIconPersonal & JSXBase.HTMLAttributes<HTMLHclSdkIconPersonalElement>;
            "hcl-sdk-icon-phone": LocalJSX.HclSdkIconPhone & JSXBase.HTMLAttributes<HTMLHclSdkIconPhoneElement>;
            "hcl-sdk-icon-printer": LocalJSX.HclSdkIconPrinter & JSXBase.HTMLAttributes<HTMLHclSdkIconPrinterElement>;
            "hcl-sdk-icon-refresh": LocalJSX.HclSdkIconRefresh & JSXBase.HTMLAttributes<HTMLHclSdkIconRefreshElement>;
            "hcl-sdk-icon-remove": LocalJSX.HclSdkIconRemove & JSXBase.HTMLAttributes<HTMLHclSdkIconRemoveElement>;
            "hcl-sdk-icon-search": LocalJSX.HclSdkIconSearch & JSXBase.HTMLAttributes<HTMLHclSdkIconSearchElement>;
            "hcl-sdk-icon-search-off": LocalJSX.HclSdkIconSearchOff & JSXBase.HTMLAttributes<HTMLHclSdkIconSearchOffElement>;
            "hcl-sdk-icon-share": LocalJSX.HclSdkIconShare & JSXBase.HTMLAttributes<HTMLHclSdkIconShareElement>;
            "hcl-sdk-icon-sort": LocalJSX.HclSdkIconSort & JSXBase.HTMLAttributes<HTMLHclSdkIconSortElement>;
            "hcl-sdk-input": LocalJSX.HclSdkInput & JSXBase.HTMLAttributes<HTMLHclSdkInputElement>;
            "hcl-sdk-loading": LocalJSX.HclSdkLoading & JSXBase.HTMLAttributes<HTMLHclSdkLoadingElement>;
            "hcl-sdk-map": LocalJSX.HclSdkMap & JSXBase.HTMLAttributes<HTMLHclSdkMapElement>;
            "hcl-sdk-modal": LocalJSX.HclSdkModal & JSXBase.HTMLAttributes<HTMLHclSdkModalElement>;
            "hcl-sdk-profile-map": LocalJSX.HclSdkProfileMap & JSXBase.HTMLAttributes<HTMLHclSdkProfileMapElement>;
            "hcl-sdk-route": LocalJSX.HclSdkRoute & JSXBase.HTMLAttributes<HTMLHclSdkRouteElement>;
            "hcl-sdk-router": LocalJSX.HclSdkRouter & JSXBase.HTMLAttributes<HTMLHclSdkRouterElement>;
            "hcl-sdk-router-link": LocalJSX.HclSdkRouterLink & JSXBase.HTMLAttributes<HTMLHclSdkRouterLinkElement>;
            "hcl-sdk-search": LocalJSX.HclSdkSearch & JSXBase.HTMLAttributes<HTMLHclSdkSearchElement>;
            "hcl-sdk-search-address-item": LocalJSX.HclSdkSearchAddressItem & JSXBase.HTMLAttributes<HTMLHclSdkSearchAddressItemElement>;
            "hcl-sdk-search-no-data-available": LocalJSX.HclSdkSearchNoDataAvailable & JSXBase.HTMLAttributes<HTMLHclSdkSearchNoDataAvailableElement>;
            "hcl-sdk-search-no-results": LocalJSX.HclSdkSearchNoResults & JSXBase.HTMLAttributes<HTMLHclSdkSearchNoResultsElement>;
            "hcl-sdk-search-result": LocalJSX.HclSdkSearchResult & JSXBase.HTMLAttributes<HTMLHclSdkSearchResultElement>;
            "hcl-sdk-select": LocalJSX.HclSdkSelect & JSXBase.HTMLAttributes<HTMLHclSdkSelectElement>;
            "hcl-sdk-sort": LocalJSX.HclSdkSort & JSXBase.HTMLAttributes<HTMLHclSdkSortElement>;
            "hcl-sdk-switch-view-mode": LocalJSX.HclSdkSwitchViewMode & JSXBase.HTMLAttributes<HTMLHclSdkSwitchViewModeElement>;
        }
    }
}
