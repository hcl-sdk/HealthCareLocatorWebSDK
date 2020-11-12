import { Component, Host, h } from '@stencil/core';
import 'ionicons';
import { routerStore } from '../../../core/stores';
export class OnekeySdkHome {
  constructor() {
    this.onGoSearchScreen = () => {
      routerStore.push("/search");
    };
  }
  render() {
    return (h(Host, null,
      h("div", { class: "main-contain" },
        h("div", { class: "main-block" },
          h("div", { class: "search-hpc" },
            h("input", { placeholder: "Find Healthcare Professional" }),
            h("button", { class: "btn" },
              h("ion-icon", { name: "search-outline" })))),
        h("div", { class: "main-block" },
          h("div", { class: "home" },
            h("div", { class: "header" },
              h("span", { class: "title" }, "Find and Locate"),
              h("span", { class: "title" }, "Healthcare Professional")),
            h("div", { class: "content" },
              h("div", { class: "item" },
                h("div", { class: "item__icon" },
                  h("ion-icon", { name: "search-outline" })),
                h("div", null,
                  h("strong", null, "Find and Locate other HCP"),
                  h("span", { class: "sub-text" }, "Lorem ipsum dolor sit amet, consect adipiscing elit"))),
              h("div", { class: "item" },
                h("div", { class: "item__icon" },
                  h("ion-icon", { name: "person-outline" })),
                h("div", null,
                  h("strong", null, "Consult Profile"),
                  h("span", { class: "sub-text" }, "Lorem ipsum dolor sit amet, consect adipiscing elit"))),
              h("div", { class: "item" },
                h("div", { class: "item__icon" },
                  h("ion-icon", { name: "pencil-outline" })),
                h("div", null,
                  h("strong", null, "Request my Information update"),
                  h("span", { class: "sub-text" }, "Lorem ipsum dolor sit amet, consect adipiscing elit")))),
            h("div", null,
              h("button", { class: "btn", onClick: this.onGoSearchScreen }, "Start a New Search")))))));
  }
  static get is() { return "onekey-sdk-home"; }
  static get originalStyleUrls() { return {
    "$": ["onekey-sdk-home.scss"]
  }; }
  static get styleUrls() { return {
    "$": ["onekey-sdk-home.css"]
  }; }
}
