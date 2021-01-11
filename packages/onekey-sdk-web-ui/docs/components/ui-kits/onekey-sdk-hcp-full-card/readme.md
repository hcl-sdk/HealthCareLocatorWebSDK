# onekey-sdk-hcp-full-card



<!-- Auto Generated Below -->


## Events

| Event                 | Description | Type                      |
| --------------------- | ----------- | ------------------------- |
| `backFromHcpFullCard` |             | `CustomEvent<MouseEvent>` |


## Dependencies

### Used by

 - [onekey-sdk-search-result](../../screens/onekey-sdk-search-result)

### Depends on

- [onekey-sdk-button](../onekey-sdk-button)
- [onekey-sdk-icon](../onekey-sdk-icon)
- [onekey-sdk-map](../onekey-sdk-map)
- [onekey-sdk-select](../onekey-sdk-select)

### Graph
```mermaid
graph TD;
  onekey-sdk-hcp-full-card --> onekey-sdk-button
  onekey-sdk-hcp-full-card --> onekey-sdk-icon
  onekey-sdk-hcp-full-card --> onekey-sdk-map
  onekey-sdk-hcp-full-card --> onekey-sdk-select
  onekey-sdk-button --> onekey-sdk-icon
  onekey-sdk-map --> ion-icon
  onekey-sdk-select --> onekey-sdk-icon
  onekey-sdk-search-result --> onekey-sdk-hcp-full-card
  style onekey-sdk-hcp-full-card fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
