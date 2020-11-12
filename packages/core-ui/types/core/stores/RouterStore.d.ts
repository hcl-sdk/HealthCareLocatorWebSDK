import StoreProvider from "./StoreProvider";
interface RouteItem {
  routePath: string;
  state?: any;
}
export interface RouterState {
  currentRoutePath?: string;
  routes: RouteItem[];
}
interface RouterStoreState extends RouterState {
  push?(routeName: string): void;
  back?(): void;
}
export declare const initStateRouterStore: RouterState;
declare class RouterStore extends StoreProvider<RouterState> implements RouterStoreState {
  routes: any;
  constructor(state: RouterState);
  push: (routePath: string, state?: any) => void;
}
export default RouterStore;
