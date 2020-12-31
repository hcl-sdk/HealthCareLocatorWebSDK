# onekey-sdk-search



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute          | Description | Type      | Default     |
| ---------------- | ------------------ | ----------- | --------- | ----------- |
| `noIcon`         | `no-icon`          |             | `boolean` | `undefined` |
| `searchText`     | `search-text`      |             | `string`  | `undefined` |
| `showSwitchMode` | `show-switch-mode` |             | `boolean` | `false`     |


## Dependencies

### Used by

 - [onekey-sdk-home](../onekey-sdk-home)
 - [onekey-sdk-search-result](../onekey-sdk-search-result)

### Depends on

- [onekey-sdk-search-address-item](../../ui-kits/onekey-sdk-search-address-item)
- [onekey-sdk-router-link](../../onekey-sdk-router/onekey-sdk-router-link)
- [onekey-sdk-icon](../../ui-kits/onekey-sdk-icon)
- [onekey-sdk-input](../../ui-kits/onekey-sdk-input)
- [onekey-sdk-button](../../ui-kits/onekey-sdk-button)
- [onekey-sdk-switch-view-mode](../../ui-kits/onekey-sdk-switch-view-mode)

### Graph
```mermaid
graph TD;
  onekey-sdk-search --> onekey-sdk-search-address-item
  onekey-sdk-search --> onekey-sdk-router-link
  onekey-sdk-search --> onekey-sdk-icon
  onekey-sdk-search --> onekey-sdk-input
  onekey-sdk-search --> onekey-sdk-button
  onekey-sdk-search --> onekey-sdk-switch-view-mode
  onekey-sdk-search-address-item --> onekey-sdk-icon
  onekey-sdk-input --> onekey-sdk-button
  onekey-sdk-input --> onekey-sdk-icon
  onekey-sdk-button --> onekey-sdk-icon
  onekey-sdk-switch-view-mode --> ion-icon
  onekey-sdk-home --> onekey-sdk-search
  onekey-sdk-search-result --> onekey-sdk-search
  style onekey-sdk-search fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
