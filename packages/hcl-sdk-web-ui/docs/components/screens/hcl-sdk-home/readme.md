# hcl-sdk-home



<!-- Auto Generated Below -->


## Dependencies

### Depends on

- [hcl-sdk-search](../hcl-sdk-search)
- [hcl-sdk-button](../../ui-kits/hcl-sdk-button)
- [hcl-sdk-home-min](hcl-sdk-home-min)
- [hcl-sdk-home-full](hcl-sdk-home-full)

### Graph
```mermaid
graph TD;
  hcl-sdk-home --> hcl-sdk-search
  hcl-sdk-home --> hcl-sdk-button
  hcl-sdk-home --> hcl-sdk-home-min
  hcl-sdk-home --> hcl-sdk-home-full
  hcl-sdk-search --> hcl-sdk-search-address-item
  hcl-sdk-search --> hcl-sdk-router-link
  hcl-sdk-search --> hcl-sdk-icon
  hcl-sdk-search --> hcl-sdk-input
  hcl-sdk-search --> hcl-sdk-button
  hcl-sdk-search --> hcl-sdk-switch-view-mode
  hcl-sdk-search-address-item --> hcl-sdk-icon
  hcl-sdk-input --> hcl-sdk-button
  hcl-sdk-input --> hcl-sdk-icon
  hcl-sdk-button --> hcl-sdk-icon
  hcl-sdk-switch-view-mode --> ion-icon
  hcl-sdk-home-min --> hcl-sdk-icon
  hcl-sdk-home-min --> hcl-sdk-button
  hcl-sdk-home-full --> hcl-sdk-button
  hcl-sdk-home-full --> hcl-sdk-map
  hcl-sdk-map --> ion-icon
  style hcl-sdk-home fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
