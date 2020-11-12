# onekey-sdk



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type                  | Default     |
| -------- | --------- | ----------- | --------------------- | ----------- |
| `config` | --        |             | `OneKeySDKConfigData` | `undefined` |


## Dependencies

### Depends on

- [onekey-sdk-global-store](../../onekey-sdk-store)
- [onekey-sdk-router](../../onekey-sdk-router)
- [onekey-sdk-route](../../onekey-sdk-router/onekey-sdk-route)

### Graph
```mermaid
graph TD;
  onekey-sdk --> onekey-sdk-global-store
  onekey-sdk --> onekey-sdk-router
  onekey-sdk --> onekey-sdk-route
  onekey-sdk-global-store --> context-consumer
  onekey-sdk-router --> onekey-sdk-router-store
  onekey-sdk-router-store --> context-consumer
  onekey-sdk-route --> context-consumer
  style onekey-sdk fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
