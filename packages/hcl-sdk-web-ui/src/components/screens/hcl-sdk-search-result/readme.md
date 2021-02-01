# hcl-sdk-search-doctor



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute | Description | Type                      | Default     |
| ---------- | --------- | ----------- | ------------------------- | ----------- |
| `setStore` | --        |             | `(a: StoreProps) => void` | `undefined` |
| `store`    | --        |             | `StoreProps`              | `undefined` |


## Dependencies

### Depends on

- [hcl-sdk-router-link](../../hcl-sdk-router/hcl-sdk-router-link)
- ion-icon
- [hcl-sdk-doctor-item-swipe](../../ui-kits/hcl-sdk-doctor-item-swipe)
- [hcl-sdk-map](../../ui-kits/hcl-sdk-map)
- context-consumer

### Graph
```mermaid
graph TD;
  hcl-sdk-search-result --> hcl-sdk-router-link
  hcl-sdk-search-result --> ion-icon
  hcl-sdk-search-result --> hcl-sdk-doctor-item-swipe
  hcl-sdk-search-result --> hcl-sdk-map
  hcl-sdk-search-result --> context-consumer
  hcl-sdk-router-link --> context-consumer
  style hcl-sdk-search-result fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
