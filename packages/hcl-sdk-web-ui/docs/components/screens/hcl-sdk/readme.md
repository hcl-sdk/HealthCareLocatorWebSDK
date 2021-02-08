# hcl-sdk



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type               | Default     |
| -------- | --------- | ----------- | ------------------ | ----------- |
| `config` | --        |             | `HclSDKConfigData` | `undefined` |


## Methods

### `searchNearMe({ specialtyCode }: { specialtyCode: any; }) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `updateConfig(patch: any) => Promise<HclSDKConfigData>`



#### Returns

Type: `Promise<HclSDKConfigData>`




## Dependencies

### Depends on

- [hcl-sdk-router](../../hcl-sdk-router)
- [hcl-sdk-route](../../hcl-sdk-router/hcl-sdk-route)
- [hcl-sdk-modal](../../ui-kits/hcl-sdk-modal)

### Graph
```mermaid
graph TD;
  hcl-sdk --> hcl-sdk-router
  hcl-sdk --> hcl-sdk-route
  hcl-sdk --> hcl-sdk-modal
  hcl-sdk-modal --> hcl-sdk-icon
  style hcl-sdk fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
