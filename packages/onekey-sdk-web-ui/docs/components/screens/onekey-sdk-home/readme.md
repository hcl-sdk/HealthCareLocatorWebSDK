# onekey-sdk-home



<!-- Auto Generated Below -->


## Dependencies

### Depends on

- [onekey-sdk-search](../onekey-sdk-search)
- [onekey-sdk-button](../../ui-kits/onekey-sdk-button)
- [onekey-sdk-home-min](onekey-sdk-home-min)
- [onekey-sdk-home-full](onekey-sdk-home-full)

### Graph
```mermaid
graph TD;
  onekey-sdk-home --> onekey-sdk-search
  onekey-sdk-home --> onekey-sdk-button
  onekey-sdk-home --> onekey-sdk-home-min
  onekey-sdk-home --> onekey-sdk-home-full
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
  onekey-sdk-home-min --> onekey-sdk-icon
  onekey-sdk-home-min --> onekey-sdk-button
  onekey-sdk-home-full --> onekey-sdk-button
  onekey-sdk-home-full --> onekey-sdk-map
  onekey-sdk-map --> ion-icon
  style onekey-sdk-home fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
