import { r as registerInstance, h, e as Host } from './index-b6524040.js';

const onekeySdkDoctorCardCss = ":host{display:block}:host .doctor-card{border:1px solid #ddd;border-radius:5px;padding:1rem;margin-left:1rem;background-color:white;display:flex;flex-direction:column;height:8rem;width:16rem}:host .doctor-card .name{color:#00a3e0}:host .doctor-card .address{color:#666}";

const OnekeySdkDoctorCard = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("div", { class: "doctor-card" }, h("span", { class: "text name" }, this.name), h("span", { class: "text gp" }, this.gp), h("span", { class: "text address" }, this.address), h("span", { class: "text distance" }, this.distance))));
  }
};
OnekeySdkDoctorCard.style = onekeySdkDoctorCardCss;

export { OnekeySdkDoctorCard as onekey_sdk_doctor_card };
