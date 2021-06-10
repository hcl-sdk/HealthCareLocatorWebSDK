# hcl-sdk-switch-view-mode



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute       | Description | Type                              | Default  |
| ------------- | --------------- | ----------- | --------------------------------- | -------- |
| `typeOfLabel` | `type-of-label` |             | `"disabled" \| "full" \| "short"` | `'full'` |


## Events

| Event            | Description | Type               |
| ---------------- | ----------- | ------------------ |
| `switchViewMode` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [hcl-sdk-search](../../screens/hcl-sdk-search)
 - [hcl-sdk-search-result](../../screens/hcl-sdk-search-result)

### Depends on

- [hcl-sdk-icon](../hcl-sdk-icon)

### Graph
```mermaid
graph TD;
  hcl-sdk-switch-view-mode --> hcl-sdk-icon
  hcl-sdk-search --> hcl-sdk-switch-view-mode
  hcl-sdk-search-result --> hcl-sdk-switch-view-mode
  style hcl-sdk-switch-view-mode fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
