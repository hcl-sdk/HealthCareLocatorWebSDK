# hcl-sdk-search-address-item



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute             | Description | Type      | Default     |
| ------------------- | --------------------- | ----------- | --------- | ----------- |
| `activated`         | `activated`           |             | `boolean` | `false`     |
| `currentSearchText` | `current-search-text` |             | `string`  | `undefined` |
| `item`              | `item`                |             | `any`     | `undefined` |


## Events

| Event           | Description | Type               |
| --------------- | ----------- | ------------------ |
| `selectAddress` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [hcl-sdk-search](../../screens/hcl-sdk-search)

### Depends on

- [hcl-sdk-icon](../hcl-sdk-icon)

### Graph
```mermaid
graph TD;
  hcl-sdk-search-address-item --> hcl-sdk-icon
  hcl-sdk-search --> hcl-sdk-search-address-item
  style hcl-sdk-search-address-item fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
