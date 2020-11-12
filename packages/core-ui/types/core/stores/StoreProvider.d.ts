export declare const initStateAppStore: {};
declare class StoreProvider<T extends {}> {
  storeInstance: any;
  constructor(initState: T);
  setState: (states: any) => void;
  get state(): T;
  set state(states: T);
}
export default StoreProvider;
