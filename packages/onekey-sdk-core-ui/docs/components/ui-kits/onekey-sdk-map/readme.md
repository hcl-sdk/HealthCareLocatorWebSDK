# onekey-sdk-map



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute               | Description | Type                                    | Default     |
| --------------------- | ----------------------- | ----------- | --------------------------------------- | ----------- |
| `defaultZoom`         | `default-zoom`          |             | `number`                                | `undefined` |
| `dragging`            | `dragging`              |             | `boolean`                               | `true`      |
| `locations`           | --                      |             | `any[]`                                 | `[]`        |
| `mapHeight`           | `map-height`            |             | `string`                                | `'100%'`    |
| `mapWidth`            | `map-width`             |             | `string`                                | `'100%'`    |
| `markerIcon`          | `marker-icon`           |             | `string`                                | `undefined` |
| `modeView`            | `mode-view`             |             | `ModeViewType.LIST \| ModeViewType.MAP` | `undefined` |
| `noCurrentLocation`   | `no-current-location`   |             | `boolean`                               | `false`     |
| `selectedLocationIdx` | `selected-location-idx` |             | `number`                                | `undefined` |
| `viewPortSize`        | `view-port-size`        |             | `string`                                | `undefined` |
| `zoomControl`         | `zoom-control`          |             | `boolean`                               | `false`     |


## Events

| Event                | Description | Type               |
| -------------------- | ----------- | ------------------ |
| `markerClick`        |             | `CustomEvent<any>` |
| `setCurrentLocation` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [onekey-sdk-hcp-full-card](../onekey-sdk-hcp-full-card)
 - [onekey-sdk-search-result](../../screens/onekey-sdk-search-result)

### Depends on

- ion-icon

### Graph
```mermaid
graph TD;
  onekey-sdk-map --> ion-icon
  onekey-sdk-hcp-full-card --> onekey-sdk-map
  onekey-sdk-search-result --> onekey-sdk-map
  style onekey-sdk-map fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
