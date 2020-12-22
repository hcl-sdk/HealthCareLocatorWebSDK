import StoreProvider from './StoreProvider';
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

export const initStateRouterStore: RouterState = {
  currentRoutePath: '/',
  routes: [
    {
      routePath: '/',
    },
  ],
};

class RouterStore extends StoreProvider<RouterState> implements RouterStoreState {
  routes;

  constructor(state: RouterState) {
    super(state);
    this.state = state;
  }

  push = (routePath: string, state?: any) => {
    this.setState({
      currentRoutePath: routePath,
      routes: [
        ...this.state.routes,
        {
          routePath,
          state,
        },
      ],
    });
  };

  back = () => {
    const routes = [...this.state.routes];
    if (routes.length < 2) {
      return;
    }
    routes.pop();
    const nextRoute = routes[routes.length - 1];
    this.setState({ currentRoutePath: nextRoute.routePath, routes });
  };
}

export default RouterStore;
