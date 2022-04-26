# hcl-sdk-hco-full-card



<!-- Auto Generated Below -->


## Events

| Event              | Description | Type                      |
| ------------------ | ----------- | ------------------------- |
| `backFromFullCard` |             | `CustomEvent<MouseEvent>` |


## Dependencies

### Used by

 - [hcl-sdk-search-result](../../screens/hcl-sdk-search-result)

### Depends on

- [hcl-sdk-button](../hcl-sdk-button)
- [hcl-sdk-icon](../hcl-sdk-icon)
- [hcl-sdk-card-info-section](../hcl-sdk-card-info-section)
- [hcl-sdk-map](../hcl-sdk-map)
- [hcl-sdk-select](../hcl-sdk-select)

### Graph
```mermaid
graph TD;
  hcl-sdk-hco-full-card --> hcl-sdk-button
  hcl-sdk-hco-full-card --> hcl-sdk-icon
  hcl-sdk-hco-full-card --> hcl-sdk-card-info-section
  hcl-sdk-hco-full-card --> hcl-sdk-map
  hcl-sdk-hco-full-card --> hcl-sdk-select
  hcl-sdk-button --> hcl-sdk-icon
  hcl-sdk-map --> hcl-sdk-icon
  hcl-sdk-select --> hcl-sdk-icon
  hcl-sdk-search-result --> hcl-sdk-hco-full-card
  style hcl-sdk-hco-full-card fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
