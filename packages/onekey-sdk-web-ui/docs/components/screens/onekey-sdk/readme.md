# onekey-sdk



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type                  | Default     |
| -------- | --------- | ----------- | --------------------- | ----------- |
| `config` | --        |             | `OneKeySDKConfigData` | `undefined` |


## Methods

### `updateConfig(patch: any) => Promise<OneKeySDKConfigData>`



#### Returns

Type: `Promise<OneKeySDKConfigData>`




## Dependencies

### Depends on

- [onekey-sdk-router](../../onekey-sdk-router)
- [onekey-sdk-route](../../onekey-sdk-router/onekey-sdk-route)
- [onekey-sdk-modal](../../ui-kits/onekey-sdk-modal)

### Graph
```mermaid
graph TD;
  onekey-sdk --> onekey-sdk-router
  onekey-sdk --> onekey-sdk-route
  onekey-sdk --> onekey-sdk-modal
  onekey-sdk-modal --> onekey-sdk-icon
  style onekey-sdk fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
