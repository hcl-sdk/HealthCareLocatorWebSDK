import StoreProvider from "./StoreProvider";
export const initStateRouterStore = {
  currentRoutePath: '/',
  routes: [{
      routePath: '/'
    }]
};
class RouterStore extends StoreProvider {
  constructor(state) {
    super(state);
    this.push = (routePath, state) => {
      this.setState({
        currentRoutePath: routePath,
        routes: [...this.state.routes, {
            name: routePath,
            state
          }]
      });
    };
    this.state = state;
  }
}
export default RouterStore;
