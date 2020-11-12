'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-7beb5087.js');
const index$1 = require('./index-5625a1c6.js');

const onekeySdkHomeCss = ":host .home{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center;width:100%}:host .title{color:#00a3e0;display:block;font-size:1.5rem}:host .item{margin-bottom:1rem;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center}:host .item__icon{margin-right:1rem;padding:10px 12px;background-color:#e3f3df;border-radius:50%;color:#43B029}:host .header{text-align:center;margin-bottom:1rem}:host .content{margin-bottom:1rem}:host .sub-text{display:block}:host .search-hpc{display:-ms-flexbox;display:flex;width:100%}";

const OnekeySdkHome = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.onGoSearchScreen = () => {
      index$1.routerStore.push("/search");
    };
  }
  render() {
    return (index.h(index.Host, null, index.h("div", { class: "main-contain" }, index.h("div", { class: "main-block" }, index.h("div", { class: "search-hpc" }, index.h("input", { placeholder: "Find Healthcare Professional" }), index.h("button", { class: "btn" }, index.h("ion-icon", { name: "search-outline" })))), index.h("div", { class: "main-block" }, index.h("div", { class: "home" }, index.h("div", { class: "header" }, index.h("span", { class: "title" }, "Find and Locate"), index.h("span", { class: "title" }, "Healthcare Professional")), index.h("div", { class: "content" }, index.h("div", { class: "item" }, index.h("div", { class: "item__icon" }, index.h("ion-icon", { name: "search-outline" })), index.h("div", null, index.h("strong", null, "Find and Locate other HCP"), index.h("span", { class: "sub-text" }, "Lorem ipsum dolor sit amet, consect adipiscing elit"))), index.h("div", { class: "item" }, index.h("div", { class: "item__icon" }, index.h("ion-icon", { name: "person-outline" })), index.h("div", null, index.h("strong", null, "Consult Profile"), index.h("span", { class: "sub-text" }, "Lorem ipsum dolor sit amet, consect adipiscing elit"))), index.h("div", { class: "item" }, index.h("div", { class: "item__icon" }, index.h("ion-icon", { name: "pencil-outline" })), index.h("div", null, index.h("strong", null, "Request my Information update"), index.h("span", { class: "sub-text" }, "Lorem ipsum dolor sit amet, consect adipiscing elit")))), index.h("div", null, index.h("button", { class: "btn", onClick: this.onGoSearchScreen }, "Start a New Search")))))));
  }
};
OnekeySdkHome.style = onekeySdkHomeCss;

exports.onekey_sdk_home = OnekeySdkHome;
