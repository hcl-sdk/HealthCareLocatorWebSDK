# onekey-sdk-search-doctor



<!-- Auto Generated Below -->


## Dependencies

### Depends on

- [onekey-sdk-button](../../ui-kits/onekey-sdk-button)
- [onekey-sdk-switch-view-mode](../../ui-kits/onekey-sdk-switch-view-mode)
- [onekey-sdk-icon](../../ui-kits/onekey-sdk-icon)
- [onekey-sdk-search](../onekey-sdk-search)
- [onekey-sdk-hcp-full-card](../../ui-kits/onekey-sdk-hcp-full-card)
- [onekey-sdk-doctor-card](../../ui-kits/onekey-sdk-doctor-card)
- [onekey-sdk-map](../../ui-kits/onekey-sdk-map)

### Graph
```mermaid
graph TD;
  onekey-sdk-search-result --> onekey-sdk-button
  onekey-sdk-search-result --> onekey-sdk-switch-view-mode
  onekey-sdk-search-result --> onekey-sdk-icon
  onekey-sdk-search-result --> onekey-sdk-search
  onekey-sdk-search-result --> onekey-sdk-hcp-full-card
  onekey-sdk-search-result --> onekey-sdk-doctor-card
  onekey-sdk-search-result --> onekey-sdk-map
  onekey-sdk-button --> onekey-sdk-icon
  onekey-sdk-switch-view-mode --> ion-icon
  onekey-sdk-search --> onekey-sdk-search-address-item
  onekey-sdk-search --> onekey-sdk-router-link
  onekey-sdk-search --> onekey-sdk-icon
  onekey-sdk-search --> onekey-sdk-input
  onekey-sdk-search --> onekey-sdk-button
  onekey-sdk-search --> onekey-sdk-switch-view-mode
  onekey-sdk-search-address-item --> onekey-sdk-icon
  onekey-sdk-input --> onekey-sdk-button
  onekey-sdk-hcp-full-card --> onekey-sdk-button
  onekey-sdk-hcp-full-card --> onekey-sdk-icon
  onekey-sdk-hcp-full-card --> onekey-sdk-map
  onekey-sdk-map --> ion-icon
  onekey-sdk-doctor-card --> onekey-sdk-icon
  style onekey-sdk-search-result fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
