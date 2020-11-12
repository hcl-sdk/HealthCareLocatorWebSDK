'use strict';

const index = require('./index-a9a27258.js');

/*
 Stencil Client Patch Browser v2.2.0 | MIT Licensed | https://stenciljs.com
 */
const patchBrowser = () => {
    const importMeta = (typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('onekey-sdk.cjs.js', document.baseURI).href));
    const opts =  {};
    if ( importMeta !== '') {
        opts.resourcesUrl = new URL('.', importMeta).href;
    }
    return index.promiseResolve(opts);
};

patchBrowser().then(options => {
  return index.bootstrapLazy([["onekey-sdk-search-result.cjs",[[1,"onekey-sdk-search-result",{"store":[16],"setStore":[16],"hcpNearMeLocations":[32]}]]],["onekey-sdk-home.cjs",[[0,"onekey-sdk-home"]]],["onekey-sdk-search.cjs",[[0,"onekey-sdk-search",{"setStore":[8,"set-store"],"store":[8],"setActivatedRoute":[8,"set-activated-route"],"formData":[32],"searchResult":[32],"selectedAddress":[32]}]]],["onekey-sdk-about-us.cjs",[[1,"onekey-sdk-about-us"]]],["onekey-sdk-doctor-item-swipe_2.cjs",[[0,"onekey-sdk-doctor-item-swipe",{"name":[1],"gp":[1],"address":[1],"distance":[1]}],[0,"onekey-sdk-map",{"mapHeight":[1,"map-height"],"mapWidth":[1,"map-width"],"locations":[16],"defaultZoom":[2,"default-zoom"],"selectedLocationIdx":[2,"selected-location-idx"],"mapTileLayer":[1,"map-tile-layer"],"mapLink":[1,"map-link"],"markerIconCurrentLocation":[1,"marker-icon-current-location"],"markerIcon":[1,"marker-icon"]}]]],["context-consumer_6.cjs",[[1,"onekey-sdk",{"config":[16]}],[4,"onekey-sdk-router"],[0,"onekey-sdk-global-store",{"renderer":[16],"store":[16]}],[0,"onekey-sdk-route",{"component":[513],"path":[513],"activatedRoute":[1,"activated-route"],"store":[16]}],[0,"onekey-sdk-router-store",{"renderer":[16],"activatedRoute":[32]}],[0,"context-consumer",{"context":[16],"renderer":[16],"subscribe":[16],"unsubscribe":[32]}]]],["ion-icon_2.cjs",[[4,"onekey-sdk-router-link",{"activatedRoute":[1,"activated-route"],"setActivatedRoute":[16],"match":[4],"url":[1],"activeClass":[1,"active-class"],"custom":[1],"anchorClass":[1,"anchor-class"],"anchorRole":[1,"anchor-role"],"anchorTitle":[1,"anchor-title"],"anchorTabIndex":[1,"anchor-tab-index"],"anchorId":[1,"anchor-id"],"ariaHaspopup":[1,"aria-haspopup"],"ariaPosinset":[1,"aria-posinset"],"ariaSetsize":[2,"aria-setsize"],"ariaLabel":[1,"aria-label"]},[[2,"click","handleClick"]]],[1,"ion-icon",{"mode":[1025],"color":[1],"ariaLabel":[1537,"aria-label"],"ariaHidden":[513,"aria-hidden"],"ios":[1],"md":[1],"flipRtl":[4,"flip-rtl"],"name":[1],"src":[1],"icon":[8],"size":[1],"lazy":[4],"sanitize":[4],"svgContent":[32],"isVisible":[32]}]]]], options);
});
