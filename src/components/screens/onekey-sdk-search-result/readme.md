# onekey-sdk-search-doctor



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute | Description | Type                      | Default     |
| ---------- | --------- | ----------- | ------------------------- | ----------- |
| `setStore` | --        |             | `(a: StoreProps) => void` | `undefined` |
| `store`    | --        |             | `StoreProps`              | `undefined` |


## Dependencies

### Depends on

- [onekey-sdk-router-link](../../onekey-sdk-router/onekey-sdk-router-link)
- ion-icon
- [onekey-sdk-doctor-item-swipe](../../ui-kits/onekey-sdk-doctor-item-swipe)
- [onekey-sdk-map](../../ui-kits/onekey-sdk-map)
- context-consumer

### Graph
```mermaid
graph TD;
  onekey-sdk-search-result --> onekey-sdk-router-link
  onekey-sdk-search-result --> ion-icon
  onekey-sdk-search-result --> onekey-sdk-doctor-item-swipe
  onekey-sdk-search-result --> onekey-sdk-map
  onekey-sdk-search-result --> context-consumer
  onekey-sdk-router-link --> context-consumer
  style onekey-sdk-search-result fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
