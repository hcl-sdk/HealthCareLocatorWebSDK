import { createStore } from "@stencil/store";

export const initStateAppStore = {}

class StoreProvider<T extends {}> {
  storeInstance;

  constructor(initState: T) {
    this.storeInstance = createStore<T>(initState);
  }

  public onChange(propName: any, listener: any) {
    this.storeInstance.onChange(propName, listener)
  }

  setState = (states: Partial<T>) => {
    if (states) {
      const statesKeys: string[] = Object.keys(states)
      statesKeys.forEach((k) => {
        this.storeInstance.set(k as any, (states as any)[k])
      })
    }
  }

  get state(): T {
    return this.storeInstance.state
  }

  set state(states) {
    if (typeof states !== 'object') {
      return
    }
    this.setState(states)
  }
}

export default StoreProvider
