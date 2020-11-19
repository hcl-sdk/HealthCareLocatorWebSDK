# onekey-sdk-map



<!-- Auto Generated Below -->


## Properties

| Property                    | Attribute                      | Description           | Type     | Default     |
| --------------------------- | ------------------------------ | --------------------- | -------- | ----------- |
| `defaultZoom`               | `default-zoom`                 |                       | `number` | `undefined` |
| `locations`                 | --                             |                       | `any[]`  | `[]`        |
| `mapHeight`                 | `map-height`                   | An array of locations | `string` | `'100%'`    |
| `mapLink`                   | `map-link`                     |                       | `string` | `undefined` |
| `mapTileLayer`              | `map-tile-layer`               |                       | `string` | `undefined` |
| `mapWidth`                  | `map-width`                    |                       | `string` | `'100%'`    |
| `markerIcon`                | `marker-icon`                  |                       | `string` | `undefined` |
| `markerIconCurrentLocation` | `marker-icon-current-location` |                       | `string` | `undefined` |
| `selectedLocationIdx`       | `selected-location-idx`        |                       | `number` | `undefined` |


## Events

| Event         | Description | Type               |
| ------------- | ----------- | ------------------ |
| `markerClick` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [onekey-sdk-search-result](../../screens/onekey-sdk-search-result)

### Depends on

- ion-icon

### Graph
```mermaid
graph TD;
  onekey-sdk-map --> ion-icon
  onekey-sdk-search-result --> onekey-sdk-map
  style onekey-sdk-map fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
