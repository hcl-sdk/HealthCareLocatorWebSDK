import { createStore } from "@stencil/store";
export const initStateAppStore = {};
class StoreProvider {
  constructor(initState) {
    this.setState = (states) => {
      Object.keys(states).forEach((k) => {
        this.storeInstance.set(k, states[k]);
      });
    };
    this.storeInstance = createStore(initState);
  }
  get state() {
    return this.storeInstance.state;
  }
  set state(states) {
    if (typeof states !== 'object') {
      return;
    }
    this.setState(states);
  }
}
export default StoreProvider;
