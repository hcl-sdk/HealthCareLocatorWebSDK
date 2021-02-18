# hcl-sdk-map



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute               | Description | Type                                    | Default     |
| --------------------- | ----------------------- | ----------- | --------------------------------------- | ----------- |
| `breakpoint`          | --                      |             | `Breakpoint`                            | `undefined` |
| `defaultZoom`         | `default-zoom`          |             | `number`                                | `undefined` |
| `dragging`            | `dragging`              |             | `boolean`                               | `true`      |
| `interactive`         | `interactive`           |             | `boolean`                               | `true`      |
| `isForcedZoomToMe`    | `is-forced-zoom-to-me`  |             | `boolean`                               | `false`     |
| `isShowMeMarker`      | `is-show-me-marker`     |             | `boolean`                               | `false`     |
| `locations`           | --                      |             | `any[]`                                 | `[]`        |
| `mapHeight`           | `map-height`            |             | `string`                                | `'100%'`    |
| `mapMinHeight`        | `map-min-height`        |             | `string`                                | `'0px'`     |
| `mapWidth`            | `map-width`             |             | `string`                                | `'100%'`    |
| `markerIcon`          | `marker-icon`           |             | `string`                                | `undefined` |
| `modeView`            | `mode-view`             |             | `ModeViewType.LIST \| ModeViewType.MAP` | `undefined` |
| `noCurrentLocation`   | `no-current-location`   |             | `boolean`                               | `false`     |
| `selectedLocationIdx` | `selected-location-idx` |             | `number`                                | `undefined` |
| `zoomControl`         | `zoom-control`          |             | `boolean`                               | `false`     |


## Events

| Event                 | Description | Type               |
| --------------------- | ----------- | ------------------ |
| `mapClicked`          |             | `CustomEvent<any>` |
| `moveCurrentLocation` |             | `CustomEvent<any>` |
| `onMapDrag`           |             | `CustomEvent<any>` |
| `onMarkerClick`       |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [hcl-sdk-hcp-full-card](../hcl-sdk-hcp-full-card)
 - [hcl-sdk-home-full](../../screens/hcl-sdk-home/hcl-sdk-home-full)
 - [hcl-sdk-profile-map](../hcl-sdk-profile-map)
 - [hcl-sdk-search-result](../../screens/hcl-sdk-search-result)

### Depends on

- ion-icon

### Graph
```mermaid
graph TD;
  hcl-sdk-map --> ion-icon
  hcl-sdk-hcp-full-card --> hcl-sdk-map
  hcl-sdk-home-full --> hcl-sdk-map
  hcl-sdk-profile-map --> hcl-sdk-map
  hcl-sdk-search-result --> hcl-sdk-map
  style hcl-sdk-map fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
