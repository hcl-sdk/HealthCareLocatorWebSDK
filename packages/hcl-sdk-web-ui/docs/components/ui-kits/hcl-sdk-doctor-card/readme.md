# hcl-sdk-doctor-card



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute            | Description | Type      | Default     |
| ------------------- | -------------------- | ----------- | --------- | ----------- |
| `address`           | `address`            |             | `string`  | `undefined` |
| `diseasesAvailable` | `diseases-available` |             | `boolean` | `undefined` |
| `distance`          | `distance`           |             | `string`  | `undefined` |
| `name`              | `name`               |             | `string`  | `undefined` |
| `reviewsAvailable`  | `reviews-available`  |             | `boolean` | `undefined` |
| `selected`          | `selected`           |             | `boolean` | `undefined` |
| `showDistance`      | `show-distance`      |             | `boolean` | `true`      |
| `specialtyPrimary`  | `specialty-primary`  |             | `string`  | `undefined` |
| `viewMode`          | `view-mode`          |             | `string`  | `undefined` |


## Dependencies

### Used by

 - [hcl-sdk-search-result](../../screens/hcl-sdk-search-result)

### Depends on

- [hcl-sdk-button](../hcl-sdk-button)
- [hcl-sdk-icon](../hcl-sdk-icon)

### Graph
```mermaid
graph TD;
  hcl-sdk-doctor-card --> hcl-sdk-button
  hcl-sdk-doctor-card --> hcl-sdk-icon
  hcl-sdk-button --> hcl-sdk-icon
  hcl-sdk-search-result --> hcl-sdk-doctor-card
  style hcl-sdk-doctor-card fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
