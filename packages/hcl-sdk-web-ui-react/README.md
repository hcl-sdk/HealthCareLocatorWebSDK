## Usage

```jsx
<HclSdk config={config} className={className} style={style} />
```

### Props

| Props         | Type           |
| ------------- |:-------------:|
| config        | [Config](#config-properties) |
| className     | string |
| style         | CSSProperties |

<br />

#### Config Properties

| Config Properties         | Type           |
| ------------------------- |:-------------:|
| apiKey                    | string |
| lang                      | string \| undefined |
| appName                   | string \| undefined |
| appURL                    | string \| undefined |
| showSuggestModification   | boolean \| undefined |
| countries                 | string \| undefined |
| useGoogleMap              | boolean \| undefined |
| googleMapApiKey           | string \| undefined |

<br />

### Theming

Provide a `className` so you can use any CSS tooling you want. You can use many predefined CSS variables to control SDK component styles. e.g


```
--hcl-font-default-name: inherit;
--hcl-font-default-size: 14px;
--hcl-font-default-weight: normal;
--hcl-font-title_main_large-name: var(--hcl-font-default-name);
--hcl-font-title_main_large-size: 24px;
--hcl-font-title_main_large-weight: normal;
--hcl-font-title_main-name: var(--hcl-font-default-name);
--hcl-font-title_main-size: 20px;
--hcl-font-title_main-weight: normal;
--hcl-font-title_secondary-name: var(--hcl-font-default-name);
--hcl-font-title_secondary-size: 16px;
--hcl-font-title_secondary-weight: bold;
--hcl-font-search_result_total-name: var(--hcl-font-default-name);
--hcl-font-search_result_total-size: var(--hcl-font-default-size);
--hcl-font-search_result_total-weight: bold;
--hcl-font-search_result_title-name: var(--hcl-font-default-name);
--hcl-font-search_result_title-size: 16px;
--hcl-font-search_result_title-weight: normal;
--hcl-font-result_title-name: var(--hcl-font-default-name);
--hcl-font-result_title-size: var(--hcl-font-default-size);
--hcl-font-result_title-weight: normal;
--hcl-font-result_subtitle-name: var(--hcl-font-default-name);
--hcl-font-result_subtitle-size: var(--hcl-font-default-size);
--hcl-font-result_subtitle-weight: normal;
--hcl-font-profile_title-name: var(--hcl-font-default-name);
--hcl-font-profile_title-size: 18px;
--hcl-font-profile_title-weight: normal;
--hcl-font-profile_subtitle-name: var(--hcl-font-default-name);
--hcl-font-profile_subtitle-size: 16px;
--hcl-font-profile_subtitle-weight: normal;
--hcl-font-profile_title_section-name: var(--hcl-font-default-name);
--hcl-font-profile_title_section-size: 16px;
--hcl-font-profile_title_section-weight: normal;
--hcl-font-card_title-name: var(--hcl-font-default-name);
--hcl-font-card_title-size: 16px;
--hcl-font-card_title-weight: normal;
--hcl-font-modal_title-name: var(--hcl-font-default-name);
--hcl-font-modal_title-size: 20px;
--hcl-font-modal_title-weight: bold;
--hcl-font-search_input-name: var(--hcl-font-default-name);
--hcl-font-search_input-size: 16px;
--hcl-font-search_input-weight: normal;
--hcl-font-sort_criteria-name: var(--hcl-font-default-name);
--hcl-font-sort_criteria-size: 16px;
--hcl-font-sort_criteria-desktop-size: 14px;
--hcl-font-sort_criteria-weight: normal;
--hcl-font-button-name: var(--hcl-font-default-name);
--hcl-font-button-size: var(--hcl-font-default-size);
--hcl-font-button-weight: normal;
--hcl-font-small-name: var(--hcl-font-default-name);
--hcl-font-small-size: 12px;
--hcl-font-small-weight: normal;
--hcl-color-primary: #43b02a;
--hcl-color-secondary: #00a3e0;
--hcl-color-button_bkg: #fcfcfc;
--hcl-color-button_accept_bkg: var(--hcl-color-primary);
--hcl-color-button_discard_bkg: #9aa0a7;
--hcl-color-button_border: #dedede;
--hcl-color-card_border: #dedede;
--hcl-color-marker: #fe8a12;
--hcl-color-marker_selected: #fd8670;
--hcl-color-view_bkg: #f8f9fa;
--hcl-color-list_bkg: var(--hcl-color-view_bkg);
--hcl-color-vote_up: var(--hcl-color-primary);
--hcl-color-vote_down: #ff0000;
--hcl-color-dark: #2b3c4d;
--hcl-color-grey: #a1a1a1;
--hcl-color-grey_dark: #7d7d7d;
--hcl-color-grey_darker: #666666;
--hcl-color-grey_light: #b8b8b8;
--hcl-color-grey_lighter: #ebebeb;
```