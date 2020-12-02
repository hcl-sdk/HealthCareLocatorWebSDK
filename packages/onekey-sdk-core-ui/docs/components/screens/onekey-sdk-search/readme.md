# onekey-sdk-search



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description | Type      | Default     |
| ------------ | ------------- | ----------- | --------- | ----------- |
| `noIcon`     | `no-icon`     |             | `boolean` | `undefined` |
| `searchText` | `search-text` |             | `string`  | `undefined` |


## Dependencies

### Used by

 - [onekey-sdk-hcp-full-card](../onekey-sdk-hcp-full-card)
 - [onekey-sdk-home](../onekey-sdk-home)
 - [onekey-sdk-search-result](../onekey-sdk-search-result)

### Depends on

- [onekey-sdk-search-address-item](../../ui-kits/onekey-sdk-search-address-item)
- [onekey-sdk-router-link](../../onekey-sdk-router/onekey-sdk-router-link)
- [onekey-sdk-icon](../../ui-kits/onekey-sdk-icon)
- [onekey-sdk-input](../../ui-kits/onekey-sdk-input)
- [onekey-sdk-button](../../ui-kits/onekey-sdk-button)

### Graph
```mermaid
graph TD;
  onekey-sdk-search --> onekey-sdk-search-address-item
  onekey-sdk-search --> onekey-sdk-router-link
  onekey-sdk-search --> onekey-sdk-icon
  onekey-sdk-search --> onekey-sdk-input
  onekey-sdk-search --> onekey-sdk-button
  onekey-sdk-search-address-item --> onekey-sdk-icon
  onekey-sdk-input --> onekey-sdk-button
  onekey-sdk-button --> onekey-sdk-icon
  onekey-sdk-hcp-full-card --> onekey-sdk-search
  onekey-sdk-home --> onekey-sdk-search
  onekey-sdk-search-result --> onekey-sdk-search
  style onekey-sdk-search fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
