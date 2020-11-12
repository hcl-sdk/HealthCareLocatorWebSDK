/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "index.html",
    "revision": "865fbdbec2af657226c173e3ca5fe2d8"
  },
  {
    "url": "build/context-consumer_6.entry.js",
    "revision": "51a4c4a0a25c865198a8d5890888ed23"
  },
  {
    "url": "build/index-675d59a8.js",
    "revision": "a8c4a5fd082c69f2e452f1628abb156c"
  },
  {
    "url": "build/index.esm.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "build/ion-icon_2.entry.js",
    "revision": "444928af7bee44782f609440306a7821"
  },
  {
    "url": "build/leaflet-src-b68b6fd5.js",
    "revision": "95d8fd1e14eb0eb364176de74b768f37"
  },
  {
    "url": "build/onekey-sdk-about-us.entry.js",
    "revision": "3a85eeaf956a63e4791308a32f9243ec"
  },
  {
    "url": "build/onekey-sdk-doctor-item-swipe_2.entry.js",
    "revision": "801fa04a9aca00f56452b3b70d967b14"
  },
  {
    "url": "build/onekey-sdk-home.entry.js",
    "revision": "de5db9a8c554a42640f0bf3f8c540ca7"
  },
  {
    "url": "build/onekey-sdk-search-result.entry.js",
    "revision": "1a6cd320a53f9e910c0addcc5979bd07"
  },
  {
    "url": "build/onekey-sdk-search.entry.js",
    "revision": "ca6477b8d29a0a09fd0b5ab17f3d03a8"
  },
  {
    "url": "build/p-a2667786.js"
  },
  {
    "url": "build/p-d5acc9f5.css"
  },
  {
    "url": "build/provider-0033d08e.js",
    "revision": "4290404037c5ae830ae277dcddc634d3"
  },
  {
    "url": "build/provider-3b635d5f.js",
    "revision": "361a439024433c26eec2e2a93a372ea2"
  },
  {
    "url": "build/shadow-css-a637b891.js",
    "revision": "22fd2d41a1f9a63a0cba63bb9b9b535e"
  },
  {
    "url": "build/state-tunnel-04c0b67a.js",
    "revision": "d0f8bd77eee6f87252db3a995360b479"
  },
  {
    "url": "manifest.json",
    "revision": "0c129721ede7cd25304ebdd238d774ad"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
