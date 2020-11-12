# onekey-sdk-router-link



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

 - [onekey-sdk-home](../../screens/onekey-sdk-home)
 - [onekey-sdk-search](../../screens/onekey-sdk-search)
 - [onekey-sdk-search-result](../../screens/onekey-sdk-search-result)

### Depends on

- context-consumer

### Graph
```mermaid
graph TD;
  onekey-sdk-router-link --> context-consumer
  onekey-sdk-home --> onekey-sdk-router-link
  onekey-sdk-search --> onekey-sdk-router-link
  onekey-sdk-search-result --> onekey-sdk-router-link
  style onekey-sdk-router-link fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
