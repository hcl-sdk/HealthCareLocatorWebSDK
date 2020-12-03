# onekey-sdk-input



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute       | Description | Type               | Default     |
| ---------------- | --------------- | ----------- | ------------------ | ----------- |
| `autoComplete`   | `auto-complete` |             | `string`           | `undefined` |
| `class`          | `class`         |             | `string`           | `undefined` |
| `loading`        | `loading`       |             | `boolean`          | `false`     |
| `name`           | `name`          |             | `string`           | `undefined` |
| `onInput`        | --              |             | `(e: any) => void` | `undefined` |
| `onPostfixClick` | --              |             | `(e: any) => void` | `undefined` |
| `placeholder`    | `placeholder`   |             | `string`           | `undefined` |
| `postfixIcon`    | `postfix-icon`  |             | `string`           | `undefined` |
| `value`          | `value`         |             | `any`              | `undefined` |


## Dependencies

### Used by

 - [onekey-sdk-search](../../screens/onekey-sdk-search)

### Depends on

- [onekey-sdk-button](../onekey-sdk-button)

### Graph
```mermaid
graph TD;
  onekey-sdk-input --> onekey-sdk-button
  onekey-sdk-button --> onekey-sdk-icon
  onekey-sdk-search --> onekey-sdk-input
  style onekey-sdk-input fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
