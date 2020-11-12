import { r as registerInstance, h, H as Host } from './index-20b60922.js';
import { r as routerStore } from './index-d55f2b69.js';

const onekeySdkHomeCss = ":host .home{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center;width:100%}:host .title{color:#00a3e0;display:block;font-size:1.5rem}:host .item{margin-bottom:1rem;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center}:host .item__icon{margin-right:1rem;padding:10px 12px;background-color:#e3f3df;border-radius:50%;color:#43B029}:host .header{text-align:center;margin-bottom:1rem}:host .content{margin-bottom:1rem}:host .sub-text{display:block}:host .search-hpc{display:-ms-flexbox;display:flex;width:100%}";

const OnekeySdkHome = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.onGoSearchScreen = () => {
      routerStore.push("/search");
    };
  }
  render() {
    return (h(Host, null, h("div", { class: "main-contain" }, h("div", { class: "main-block" }, h("div", { class: "search-hpc" }, h("input", { placeholder: "Find Healthcare Professional" }), h("button", { class: "btn" }, h("ion-icon", { name: "search-outline" })))), h("div", { class: "main-block" }, h("div", { class: "home" }, h("div", { class: "header" }, h("span", { class: "title" }, "Find and Locate"), h("span", { class: "title" }, "Healthcare Professional")), h("div", { class: "content" }, h("div", { class: "item" }, h("div", { class: "item__icon" }, h("ion-icon", { name: "search-outline" })), h("div", null, h("strong", null, "Find and Locate other HCP"), h("span", { class: "sub-text" }, "Lorem ipsum dolor sit amet, consect adipiscing elit"))), h("div", { class: "item" }, h("div", { class: "item__icon" }, h("ion-icon", { name: "person-outline" })), h("div", null, h("strong", null, "Consult Profile"), h("span", { class: "sub-text" }, "Lorem ipsum dolor sit amet, consect adipiscing elit"))), h("div", { class: "item" }, h("div", { class: "item__icon" }, h("ion-icon", { name: "pencil-outline" })), h("div", null, h("strong", null, "Request my Information update"), h("span", { class: "sub-text" }, "Lorem ipsum dolor sit amet, consect adipiscing elit")))), h("div", null, h("button", { class: "btn", onClick: this.onGoSearchScreen }, "Start a New Search")))))));
  }
};
OnekeySdkHome.style = onekeySdkHomeCss;

export { OnekeySdkHome as onekey_sdk_home };
