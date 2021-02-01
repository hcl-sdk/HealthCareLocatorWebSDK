# hcl-sdk-router-link



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute          | Description | Type       | Default         |
| ------------------- | ------------------ | ----------- | ---------- | --------------- |
| `activatedRoute`    | `activated-route`  |             | `string`   | `'/'`           |
| `activeClass`       | `active-class`     |             | `string`   | `'link-active'` |
| `anchorClass`       | `anchor-class`     |             | `string`   | `undefined`     |
| `anchorId`          | `anchor-id`        |             | `string`   | `undefined`     |
| `anchorRole`        | `anchor-role`      |             | `string`   | `undefined`     |
| `anchorTabIndex`    | `anchor-tab-index` |             | `string`   | `undefined`     |
| `anchorTitle`       | `anchor-title`     |             | `string`   | `undefined`     |
| `ariaHaspopup`      | `aria-haspopup`    |             | `string`   | `undefined`     |
| `ariaLabel`         | `aria-label`       |             | `string`   | `undefined`     |
| `ariaPosinset`      | `aria-posinset`    |             | `string`   | `undefined`     |
| `ariaSetsize`       | `aria-setsize`     |             | `number`   | `undefined`     |
| `custom`            | `custom`           |             | `string`   | `'a'`           |
| `match`             | `match`            |             | `boolean`  | `undefined`     |
| `setActivatedRoute` | --                 |             | `Function` | `undefined`     |
| `url`               | `url`              |             | `string`   | `undefined`     |


## Dependencies

### Used by

 - [hcl-sdk-home](../../screens/hcl-sdk-home)
 - [hcl-sdk-search](../../screens/hcl-sdk-search)
 - [hcl-sdk-search-result](../../screens/hcl-sdk-search-result)

### Depends on

- context-consumer

### Graph
```mermaid
graph TD;
  hcl-sdk-router-link --> context-consumer
  hcl-sdk-home --> hcl-sdk-router-link
  hcl-sdk-search --> hcl-sdk-router-link
  hcl-sdk-search-result --> hcl-sdk-router-link
  style hcl-sdk-router-link fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
