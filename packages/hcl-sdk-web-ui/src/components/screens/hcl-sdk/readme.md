# hcl-sdk



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type                  | Default     |
| -------- | --------- | ----------- | --------------------- | ----------- |
| `config` | --        |             | `HclSDKConfigData` | `undefined` |


## Dependencies

### Depends on

- [hcl-sdk-global-store](../../hcl-sdk-store)
- [hcl-sdk-router](../../hcl-sdk-router)
- [hcl-sdk-route](../../hcl-sdk-router/hcl-sdk-route)

### Graph
```mermaid
graph TD;
  hcl-sdk --> hcl-sdk-global-store
  hcl-sdk --> hcl-sdk-router
  hcl-sdk --> hcl-sdk-route
  hcl-sdk-global-store --> context-consumer
  hcl-sdk-router --> hcl-sdk-router-store
  hcl-sdk-router-store --> context-consumer
  hcl-sdk-route --> context-consumer
  style hcl-sdk fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
