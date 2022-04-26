# HclSdkWebUiAngular

This project is used to wrap the hcl-sdk custom element to use with Angular Component

## Build

Run `npm run build` to build the hcl-sdk component

## Usage

```
<hcl-sdk-component [config]="config" [widget]="widget" [widgetProps]="widgetProps"></hcl-sdk-component>
```

### Inputs

| Inputs         | Type           |
| ------------- |:-------------:|
| `config`        | [`Config`](#config-input-object) |
| `widget`        | `"map"` |
| `widgetProps`   | `WidgetProps` |
| `initScreen`   | `"home"` \| `"search"` |
| `currentPosition` | `{ lat: number; lng: number; }` | `undefined` |


<br />

#### Config Input Object

| Config Properties         | Type           |
| ------------------------- |:-------------:|
| apiKey                    | string |
| lang                      | string \| undefined |
| appName                   | string \| undefined |
| appURL                    | string \| undefined |
| showSuggestModification   | boolean \| undefined |
| enableDarkMode   | boolean \| undefined |
| enableMapDarkMode   | boolean \| undefined |
| enableLeafletAttribution   | boolean \| undefined |
| disableCollectGeo   | boolean \| undefined |
| useGoogleMap              | boolean \| undefined |
| googleMapApiKey           | string \| undefined |
| getCurrentPosition |  Function \| undefined |

#### WidgetProps Properties

| WidgetMap Properties      | Type                  | Default |
| ------------------------- |:-------------:        |:--------:|
| `specialties`             | string[]  \| undefined |  `[]`
| `criteria`                | string  \| undefined  |   `''` 
| `latitude`                | number  \| undefined  |   `geoLocation`
| `longitude`               | number  \| undefined  |   `geoLocation`
| `country`                 | string  \| undefined  |   `geoLocation`
| `mapHeight`               | string  \| undefined  |   `150px`
| `interactive`             | boolean \| undefined  |   `false`


#### API

##### `getCurrentPosition(success: Function, error?: Function)`
- By default, the method `navigator.geolocation.getCurrentPosition` is used to get the current position of the device that is provided by Web APIs
- However, this behavior can be changed by providing a getCurrentPosition function through the configuration:
```js
const config = {
  ...,
  getCurrentPosition(success, error) { 
    success({ 
      longitude : xx.xxx, 
      latitude: yy.yyy 
    })
  } 
}
```

- You can set user geolocation via `currentPosition` prop.
You don't need to use `getCurrentPosition` if already provide `currentPosition`. `currentPosition` prop will override the one pass into `success` callback.
```js
// component:
public userPosition: { lat: number; lng: number } = { lat: 40.6976701, lng: -74.259864 };

// template:
<hcl-sdk-component
  [config]="config" [currentPosition]="userPosition">
</hcl-sdk-component>
```

<br />

### Theming

To change the theme, change encapsulation mode to ViewEncapsulation.None
Then modify the css:
hcl-sdk {
  --hcl-color-primary: #001f3f;
  --hcl-color-secondary: #39cccc;
}


```
--hcl-font-default-name: inherit;
--hcl-font-default-size: 14px;
--hcl-font-default-weight: normal;
--hcl-font-title_main_large-name: var(--hcl-font-default-name);
--hcl-font-title_main_large-size: 24px;
--hcl-font-title_main_large-weight: normal;
--hcl-font-title_main-name: var(--hcl-font-default-name);
--hcl-font-title_main-size: 20px;
--hcl-font-title_main-weight: normal;
--hcl-font-title_secondary-name: var(--hcl-font-default-name);
--hcl-font-title_secondary-size: 16px;
--hcl-font-title_secondary-weight: bold;
--hcl-font-search_result_total-name: var(--hcl-font-default-name);
--hcl-font-search_result_total-size: var(--hcl-font-default-size);
--hcl-font-search_result_total-weight: bold;
--hcl-font-search_result_title-name: var(--hcl-font-default-name);
--hcl-font-search_result_title-size: 16px;
--hcl-font-search_result_title-weight: normal;
--hcl-font-result_title-name: var(--hcl-font-default-name);
--hcl-font-result_title-size: var(--hcl-font-default-size);
--hcl-font-result_title-weight: normal;
--hcl-font-result_subtitle-name: var(--hcl-font-default-name);
--hcl-font-result_subtitle-size: var(--hcl-font-default-size);
--hcl-font-result_subtitle-weight: normal;
--hcl-font-profile_title-name: var(--hcl-font-default-name);
--hcl-font-profile_title-size: 18px;
--hcl-font-profile_title-weight: normal;
--hcl-font-profile_subtitle-name: var(--hcl-font-default-name);
--hcl-font-profile_subtitle-size: 16px;
--hcl-font-profile_subtitle-weight: normal;
--hcl-font-profile_title_section-name: var(--hcl-font-default-name);
--hcl-font-profile_title_section-size: 16px;
--hcl-font-profile_title_section-weight: normal;
--hcl-font-card_title-name: var(--hcl-font-default-name);
--hcl-font-card_title-size: 16px;
--hcl-font-card_title-weight: normal;
--hcl-font-modal_title-name: var(--hcl-font-default-name);
--hcl-font-modal_title-size: 20px;
--hcl-font-modal_title-weight: bold;
--hcl-font-search_input-name: var(--hcl-font-default-name);
--hcl-font-search_input-size: 16px;
--hcl-font-search_input-weight: normal;
--hcl-font-sort_criteria-name: var(--hcl-font-default-name);
--hcl-font-sort_criteria-size: 16px;
--hcl-font-sort_criteria-desktop-size: 14px;
--hcl-font-sort_criteria-weight: normal;
--hcl-font-button-name: var(--hcl-font-default-name);
--hcl-font-button-size: var(--hcl-font-default-size);
--hcl-font-button-weight: normal;
--hcl-font-small-name: var(--hcl-font-default-name);
--hcl-font-small-size: 12px;
--hcl-font-small-weight: normal;
--hcl-color-primary: #43b02a;
--hcl-color-secondary: #00a3e0;
--hcl-color-button_bkg: #fcfcfc;
--hcl-color-button_accept_bkg: var(--hcl-color-primary);
--hcl-color-button_discard_bkg: #9aa0a7;
--hcl-color-button_border: #dedede;
--hcl-color-card_border: #dedede;
--hcl-color-marker: #fe8a12;
--hcl-color-marker_selected: #fd8670;
--hcl-color-view_bkg: #f8f9fa;
--hcl-color-list_bkg: var(--hcl-color-view_bkg);
--hcl-color-vote_up: var(--hcl-color-primary);
--hcl-color-vote_down: #ff0000;
--hcl-color-dark: #2b3c4d;
--hcl-color-grey: #a1a1a1;
--hcl-color-grey_dark: #7d7d7d;
--hcl-color-grey_darker: #666666;
--hcl-color-grey_light: #b8b8b8;
--hcl-color-grey_lighter: #ebebeb;
```